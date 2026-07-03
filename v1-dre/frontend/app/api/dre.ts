const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function calcularDRE(
  dataInicio: string,
  dataTermino: string,
  tipoData: string = 'DataCompetencia',
  idEmpresa?: number,
  idDepartamento?: number,
  idCategoria?: number,
  token: string
) {
  const params = new URLSearchParams({
    data_inicio: dataInicio,
    data_termino: dataTermino,
    tipo_data: tipoData,
  })

  if (idEmpresa) params.append('id_empresa', idEmpresa.toString())
  if (idDepartamento) params.append('id_departamento', idDepartamento.toString())
  if (idCategoria) params.append('id_categoria', idCategoria.toString())

  const response = await fetch(`${API_URL}/api/dre/calcular?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to calculate DRE')
  }

  return response.json()
}

export async function compararDRE(
  dataInicioAtual: string,
  dataTerminoAtual: string,
  dataInicioAnterior: string,
  dataTerminoAnterior: string,
  tipoData: string = 'DataCompetrole',
  idEmpresa?: number,
  token: string
) {
  const params = new URLSearchParams({
    data_inicio_atual: dataInicioAtual,
    data_termino_atual: dataTerminoAtual,
    data_inicio_anterior: dataInicioAnterior,
    data_termino_anterior: dataTerminoAnterior,
    tipo_data: tipoData,
  })

  if (idEmpresa) params.append('id_empresa', idEmpresa.toString())

  const response = await fetch(`${API_URL}/api/dre/comparar?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to compare DRE')
  }

  return response.json()
}

export async function getEmpresas(token: string) {
  const response = await fetch(`${API_URL}/api/bom-controle/empresas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch empresas')
  }

  return response.json()
}

export async function getDepartamentos(token: string, idEmpresa?: number) {
  const params = idEmpresa ? `?id_empresa=${idEmpresa}` : ''
  const response = await fetch(`${API_URL}/api/bom-controle/departamentos${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch departamentos')
  }

  return response.json()
}
