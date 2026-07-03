from typing import Dict, List, Any
from datetime import datetime
from app.services.bom_controle_service import bom_controle_service
from app.schemas.dre import DRE, DREItem


class DREService:
    def __init__(self):
        self.bom_controle = bom_controle_service

    async def calcular_dre(
        self,
        data_inicio: str,
        data_termino: str,
        tipo_data: str = "DataCompetencia",
        id_empresa: int = None,
        id_departamento: int = None,
        id_categoria: int = None
    ) -> DRE:
        """Calcula a DRE para o período especificado"""
        
        # Busca receitas
        receitas_data = await self.bom_controle.get_financeiro_detalhado(
            data_inicio=data_inicio,
            data_termino=data_termino,
            tipo_data=tipo_data,
            despesa=False,
            ids_empresa=[id_empresa] if id_empresa else None
        )
        
        # Busca despesas
        despesas_data = await self.bom_controle.get_financeiro_detalhado(
            data_inicio=data_inicio,
            data_termino=data_termino,
            tipo_data=tipo_data,
            despesa=True,
            ids_empresa=[id_empresa] if id_empresa else None
        )
        
        receitas = receitas_data.get("Itens", [])
        despesas = despesas_data.get("Itens", [])
        
        # Aplica filtros adicionais
        if id_departamento:
            receitas = [r for r in receitas if r.get("IdDepartamento") == id_departamento]
            despesas = [d for d in despesas if d.get("IdDepartamento") == id_departamento]
        
        if id_categoria:
            receitas = [r for r in receitas if r.get("IdCategoriaFinanceira") == id_categoria]
            despesas = [d for d in despesas if d.get("IdCategoriaFinanceira") == id_categoria]
        
        # Calcula totais por tipo
        receita_produto = sum(r.get("Valor", 0) for r in receitas if r.get("TipoMovimentacao") == 16)
        receita_servico = sum(r.get("Valor", 0) for r in receitas if r.get("TipoMovimentacao") == 17)
        outras_receitas = sum(r.get("Valor", 0) for r in receitas if r.get("TipoMovimentacao") == 18)
        
        despesa_fornecedor = sum(d.get("Valor", 0) for d in despesas if d.get("TipoMovimentacao") == 19)
        despesa_funcionario = sum(d.get("Valor", 0) for d in despesas if d.get("TipoMovimentacao") == 20)
        despesa_imposto = sum(d.get("Valor", 0) for d in despesas if d.get("TipoMovimentacao") == 21)
        
        receita_operacional = receita_produto + receita_servico
        despesa_operacional = despesa_fornecedor + despesa_funcionario + despesa_imposto
        resultado_operacional = receita_operacional - despesa_operacional
        lucro_liquido = resultado_operacional + outras_receitas
        
        margem_lucro = (lucro_liquido / receita_operacional * 100) if receita_operacional > 0 else 0
        
        # Agrupa por categoria
        receitas_por_categoria = self._agrupar_por_categoria(receitas)
        despesas_por_categoria = self._agrupar_por_categoria(despesas)
        
        # Cria itens da DRE
        itens = []
        
        if receita_produto > 0:
            itens.append(DREItem(
                nome="Receita de Produtos",
                valor=receita_produto,
                tipo="receita",
                categoria="Receita Operacional",
                subcategoria="Produtos"
            ))
        
        if receita_servico > 0:
            itens.append(DREItem(
                nome="Receita de Serviços",
                valor=receita_servico,
                tipo="receita",
                categoria="Receita Operacional",
                subcategoria="Serviços"
            ))
        
        if despesa_fornecedor > 0:
            itens.append(DREItem(
                nome="Despesas com Fornecedores",
                valor=despesa_fornecedor,
                tipo="despesa",
                categoria="Despesa Operacional",
                subcategoria="Fornecedores"
            ))
        
        if despesa_funcionario > 0:
            itens.append(DREItem(
                nome="Despesas com Funcionários",
                valor=despesa_funcionario,
                tipo="despesa",
                categoria="Despesa Operacional",
                subcategoria="Funcionários"
            ))
        
        if despesa_imposto > 0:
            itens.append(DREItem(
                nome="Despesas com Impostos",
                valor=despesa_imposto,
                tipo="despesa",
                categoria="Despesa Operacional",
                subcategoria="Impostos"
            ))
        
        if outras_receitas > 0:
            itens.append(DREItem(
                nome="Outras Receitas",
                valor=outras_receitas,
                tipo="receita",
                categoria="Outras Receitas"
            ))
        
        # Adiciona totais
        itens.append(DREItem(
            nome="Total Receita Operacional",
            valor=receita_operacional,
            tipo="receita",
            categoria="Total"
        ))
        
        itens.append(DREItem(
            nome="Total Despesa Operacional",
            valor=despesa_operacional,
            tipo="despesa",
            categoria="Total"
        ))
        
        itens.append(DREItem(
            nome="Resultado Operacional",
            valor=resultado_operacional,
            tipo="receita" if resultado_operacional >= 0 else "despesa",
            categoria="Resultado"
        ))
        
        itens.append(DREItem(
            nome="Lucro Líquido",
            valor=lucro_liquido,
            tipo="receita" if lucro_liquido >= 0 else "despesa",
            categoria="Resultado"
        ))
        
        periodo = f"{data_inicio} a {data_termino}"
        
        return DRE(
            periodo=periodo,
            receita_operacional=receita_operacional,
            despesa_operacional=despesa_operacional,
            resultado_operacional=resultado_operacional,
            outras_receitas=outras_receitas,
            outras_despesas=0,
            lucro_liquido=lucro_liquido,
            margem_lucro=margem_lucro,
            itens=itens,
            receitas_por_categoria=receitas_por_categoria,
            despesas_por_categoria=despesas_por_categoria
        )
    
    def _agrupar_por_categoria(self, movimentacoes: List[Dict[str, Any]]) -> Dict[str, float]:
        """Agrupa movimentações por categoria"""
        agrupado = {}
        for mov in movimentacoes:
            categoria = mov.get("NomeCategoriaFinanceira", "Sem Categoria")
            valor = mov.get("Valor", 0)
            if categoria in agrupado:
                agrupado[categoria] += valor
            else:
                agrupado[categoria] = valor
        return agrupado
    
    async def comparar_periodos(
        self,
        data_inicio_atual: str,
        data_termino_atual: str,
        data_inicio_anterior: str,
        data_termino_anterior: str,
        tipo_data: str = "DataCompetencia",
        id_empresa: int = None
    ) -> Dict[str, Any]:
        """Compara DRE entre dois períodos"""
        
        dre_atual = await self.calcular_dre(
            data_inicio=data_inicio_atual,
            data_termino=data_termino_atual,
            tipo_data=tipo_data,
            id_empresa=id_empresa
        )
        
        dre_anterior = await self.calcular_dre(
            data_inicio=data_inicio_anterior,
            data_termino=data_termino_anterior,
            tipo_data=tipo_data,
            id_empresa=id_empresa
        )
        
        # Calcula variações
        variacao_receita = self._calcular_variacao(dre_anterior.receita_operacional, dre_atual.receita_operacional)
        variacao_despesa = self._calcular_variacao(dre_anterior.despesa_operacional, dre_atual.despesa_operacional)
        variacao_lucro = self._calcular_variacao(dre_anterior.lucro_liquido, dre_atual.lucro_liquido)
        
        return {
            "periodo_atual": dre_atual,
            "periodo_anterior": dre_anterior,
            "variacao_receita": variacao_receita,
            "variacao_despesa": variacao_despesa,
            "variacao_lucro": variacao_lucro
        }
    
    def _calcular_variacao(self, valor_anterior: float, valor_atual: float) -> float:
        """Calcula variação percentual"""
        if valor_anterior == 0:
            return 0
        return ((valor_atual - valor_anterior) / valor_anterior) * 100


dre_service = DREService()
