"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calcularDRE, getEmpresas } from "@/api/dre"
import { useAuthStore } from "@/store/auth-store"

interface DREData {
  periodo: string
  receita_operacional: number
  despesa_operacional: number
  resultado_operacional: number
  outras_receitas: number
  outras_despesas: number
  lucro_liquido: number
  margem_lucro: number
  itens: Array<{
    nome: string
    valor: number
    tipo: string
    categoria?: string
    subcategoria?: string
  }>
  receitas_por_categoria: Record<string, number>
  despesas_por_categoria: Record<string, number>
}

export default function DREPage() {
  const tokens = useAuthStore((state) => state.tokens)
  const [dataInicio, setDataInicio] = useState("")
  const [dataTermino, setDataTermino] = useState("")
  const [loading, setLoading] = useState(false)
  const [dre, setDre] = useState<DREData | null>(null)
  const [error, setError] = useState("")

  // Set default dates (current month)
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setDataInicio(firstDay.toISOString().split('T')[0])
    setDataTermino(lastDay.toISOString().split('T')[0])
  }, [])

  const handleCalcular = async () => {
    if (!tokens) return
    
    setLoading(true)
    setError("")
    
    try {
      const data = await calcularDRE(
        dataInicio,
        dataTermino,
        "DataCompetencia",
        undefined,
        undefined,
        undefined,
        tokens.access_token
      )
      setDre(data)
    } catch (err) {
      setError("Erro ao calcular DRE")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard DRE</h1>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataTermino">Data Término</Label>
              <Input
                id="dataTermino"
                type="date"
                value={dataTermino}
                onChange={(e) => setDataTermino(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCalcular} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Calculando..." : "Calcular DRE"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 text-sm text-destructive">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* KPIs */}
      {dre && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Receita Operacional</div>
              <div className="text-2xl font-bold">{formatCurrency(dre.receita_operacional)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Despesa Operacional</div>
              <div className="text-2xl font-bold">{formatCurrency(dre.despesa_operacional)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Lucro Líquido</div>
              <div className={`text-2xl font-bold ${dre.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(dre.lucro_liquido)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Margem de Lucro</div>
              <div className="text-2xl font-bold">{formatPercent(dre.margem_lucro)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela DRE */}
      {dre && (
        <Card>
          <CardHeader>
            <CardTitle>Demonstrativo do Resultado - {dre.periodo}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dre.itens.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between p-2 rounded ${
                    item.categoria === 'Total' ? 'font-bold bg-muted' :
                    item.categoria === 'Resultado' ? 'font-bold bg-accent' :
                    ''
                  }`}
                >
                  <span>{item.nome}</span>
                  <span className={item.tipo === 'despesa' ? 'text-red-600' : ''}>
                    {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receitas por Categoria */}
      {dre && Object.keys(dre.receitas_por_categoria).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(dre.receitas_por_categoria).map(([categoria, valor]) => (
                <div key={categoria} className="flex justify-between p-2 border-b">
                  <span>{categoria}</span>
                  <span>{formatCurrency(valor)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Despesas por Categoria */}
      {dre && Object.keys(dre.despesas_por_categoria).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(dre.despesas_por_categoria).map(([categoria, valor]) => (
                <div key={categoria} className="flex justify-between p-2 border-b">
                  <span>{categoria}</span>
                  <span className="text-red-600">{formatCurrency(valor)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
