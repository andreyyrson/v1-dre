
Public
ENVIRONMENT
No Environment
LAYOUT
Single Column
LANGUAGE
cURL - cURL
APIs Integração BomControle
Introduction
Autenticação
AtividadeCRM
GET
AtividadeCRM - Pesquisar
GET
AtividadeCRM - Obter
POST
AtividadeCRM - Criar
CategoriaFinanceira
GET
CategoriaFinanceira - Pesquisar Categorias Filhas
Cliente
ContaFinanceira
GET
ContaFinanceira - Pesquisar
Departamento
GET
Departamento - Pesquisar
Empresa
GET
Empresa - Pesquisar
Fatura
GET
Fatura - Obter
PUT
Fatura - Alterar Vencimento
PUT
Fatura - Alterar Valor
PUT
Fatura - Efetuar Pagamento
PUT
Fatura - Cancelar
PUT
Fatura - Gerar Boleto
PUT
Fatura - Upload Anexo
GET
Fatura - Verificar Situação Cliente
Financeiro
Fornecedor
Funcionario
Lead
Oportunidade
Orcamento
Servico
Produto / Servico
Venda
VendaContrato
APIs Integração BomControle
Segue abaixo a documentação das APIs utilizadas para a integração com o sistema BomControle.

Informações:

Todas as nossas APIs são padrão RESTful e utilizam JSON para a comunicação.
Para utilizar elas é necessário sempre enviar o Token de Autenticação.
Mantemos as informações da documentação atualizada, por isso qualquer divergencia da documentação na utilização das APIs deve ser desconsiderada.
Em caso de dúvidas ou sugestões entre em contato com nossa equipe através do chat em nosso site BomControle.

LEGAL
Ao acessar essa documentação você esta concordando com os seguintes termos:

A empresa BomControle possui os direitos totais sobre a documentação.
A documentação não pode ser utilizada por terceiros sem a autorização da empresa BomControle, seja copia das informações ou qualquer outra forma indevida de utilização das informações aqui contidas.
A empresa BomControle se reserva o direito de remover ou alterar a documentação sem aviso prévio.
GET
AtividadeCRM - Obter
https://apinewintegracao.bomcontrole.com.br/integracao/AtividadeCrm/Obter/{id}
Obtem informações da Atividade pesquisada.

Request
O request para essa API é feito informando a identificação da Atividade a ser pesquisado diretamente na URL.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no sistema BomControle.
Paramêtros
{id}: Id da Atividade no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Response
Retorna um objeto com os dados da Atividade:

View More
Plain Text
{
  "Id": {param1},
  "Descricao": {param2},
  "IdLead": {param3},
  "IdOportunidade": {param4},
  "Observacao": {param5},
  "Realizada": {param6},
  "IdResponsavel": {param7},
  "LoginResponsavel": {param8},
  "Data": {param9},
  "DataInicio": {param10},
  "DataFim": {param11},
  "HoraInicio": {param12},
  "HoraFim": {param13},
  "NomeOportunidade": {param14},
  "NomeLead": {param15},
  "NomeResponsavel": {param16},
  "IdTipoAtividadeOportunidade": {param17},
  "NomeTipoAtividadeOportunidade": {param18},
  "IconeTipoAtividadeOportunidade": {param19},
  "Contatos": {param20}[
        {
            "Id": {param21},
            "Nome": {param22},
            "InformacoesContato": {param23}[
                {
                    "Tipo": {param24},
                    "Valor": {param25}
                }
            ]
        }
    ]
}
Paramêtros
{param1}: Id BomControle da Atividade da Oportunidade. (Tipo do Dado: Inteiro.)
{param2}: Descrição da Atividade. (Tipo do Dado: Texto.)
{param3}: Id BomControle do Lead. (Tipo do Dado: Inteiro.)
{param4}: Id BomControle da Oportunidade. (Tipo do Dado: Inteiro.)
{param5}: Observação da Atividade. (Tipo do Dado: Texto.)
{param6}: Indica se a Atividade foi realizada. (Tipo do Dado: Booleano.)
{param7}: Id do usuário do BomControle responsável pela Atividade. (Tipo do Dado: Inteiro.)
{param8}: Login do usuário do BomControle responsável pela Atividade. (Tipo do Dado: Texto.)
{param9}: Data de inicio da atividade caso informada senão retorna a Data "0001-01-01 00:00:00". (Tipo do Dado: Texto.)
{param10}: Data de inicio da atividade. (Tipo do Dado: Texto.)
{param11}: Data do fim da atividade. (Tipo do Dado: Texto.)
{param12}: Hora de inicio da atividade. (Tipo do Dado: Texto.)
{param13}: Hora do fim da atividade. (Tipo do Dado: Texto.)
{param14}: Nome da Oportunidade. (Tipo do Dado: Texto.)
{param15}: Nome do Lead. (Tipo do Dado: Texto.)
{param16}: Nome do usuário do BomControle responsável pela Atividade. (Tipo do Dado: Texto.)
{param17}: Id BomControle do Tipo da Atividade. (Tipo do Dado: Inteiro.)
{param18}: Nome do Tipo da Atividade. (Tipo do Dado: Texto.)
{param19}: Ícone do Tipo da Atividade. (Tipo do Dado: Texto.)
{param20}: Array de Objetos com os dados dos contatos da Atividade. (Tipo do Dado: Array Objetos.)
{param21}: Id do contato comercial no BomControle pertencente a Atividade. (Tipo do Dado: Inteiro.)
{param22}: Nome do contato comercial pertencente a Atividade. (Tipo do Dado: Texto.)
{param23}: Array de Objetos com as informações pertencentes ao contato comercial. (Tipo do Dado: Array Objetos.)
{param24}: Tipo da informação do contato comercial. (Opções: Email, Telefone, Celular, Fax. Tipo do Dado: Texto.)
{param25}: Valor referente ao tipo da informação do contato comercial. (Tipo do Dado: Texto.)
Example Request
Obter
View More
curl
curl --location 'https://apinewintegracao.bomcontrole.com.br/integracao/AtividadeCrm/Obter/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA=='
200 OK
Example Response
Body
Headers (10)
View More
html
{
  "Id": 1,
  "Descricao": "Reunião com Fornecedor Teste dia 01/01/2020 09:00",
  "IdLead": 4,
  "IdOportunidade": 1,
  "Observacao": null,
  "Realizada": true,
  "IdResponsavel": 1,
  "LoginResponsavel": "teste@teste.com.br",
  "Data": "2020-01-01T09:00:00",
  "DataInicio": "2020-01-01T09:00:00",
  "DataFim": "2020-01-01T11:15:00",
  "HoraInicio": "09:00",
  "HoraFim": "11:15",
  "NomeOportunidade": "Venda Teste",
  "NomeLead": "Lead Teste",
  "NomeResponsavel": "Teste",
  "IdTipoAtividadeOportunidade": 1,
  "NomeTipoAtividadeOportunidade": "Tipo Teste",
  "IconeTipoAtividadeOportunidade": null,
  "Contatos": [
    {
      "Id": 1,
      "Nome": "Teste1",
      "InformacoesContato": [
        {
          "Tipo": "Telefone",
          "Valor": "1111111111"
        }
      ]
    },
    {
      "Id": 2,
      "Nome": "Teste2",
      "InformacoesContato": [
        {
          "Tipo": "Telefone",
          "Valor": "1122222222"
        }
      ]
    }
  ]
}
PUT
Cliente - Alterar Contatos
https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarContatos/{id}
Adiciona novos Contatos ao cadastro do Cliente no BomControle.

Request
O request para essa API é feito informando o Id do Cliente no BomControle na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id do cliente no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "Contatos": {param1} [
    {
      "Nome": {param2},
      "Email": {param3},
      "Telefone": {param4},
      "Padrao": {param5},
      "Cobranca": {param6}
    }
  ]
}
Paramêtros
{param1}: Array de Objetos com os dados dos Contatos a serem adicionados ao Cliente. (Obrigatorio. Tipo do Dado: Array de Objetos.)
{param2}: Nome do Contato do Cliente. (Obrigatório. Tipo do Dado: Texto.)
{param3}: E-mail do Contato do Cliente. (Obrigatório. Tipo do Dado: Texto.)
{param4}: Telefone do Contato do Cliente. (Obrigatório. Tipo do Dado: Texto.)
{param5}: Indica se é o Contato principal do Cliente. (Opcional. Tipo do Dado: Booleano.)
{param6}: Indica se o Contato esta cadastrado para recebimento de cobranças do BomControle. (Opcional. Tipo do Dado: Booleano.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Cliente - Alterar Contatos
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarContatos/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data-raw '{
  "Contatos": [
    {
      "Nome": "Teste3",
      "Email": "teste3@teste.com.br",
      "Telefone": "1133333333",
      "Padrao": false,
      "Cobranca": false
    }
  ]
}'
204 No Content
Example Response
Body
Headers (7)
No response body
This request doesn't return any response body
PUT
Cliente - Alterar Endereco
https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarEndereco/{id}
Atualiza os dados de Endereço do cadastro do Cliente no BomControle.

Request
O request para essa API é feito informando o Id do Cliente no BomControle na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id do cliente no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
    "TipoLogradouro": {param1},
    "Logradouro": {param2},
    "Numero": {param3},
    "Complemento": {param4},
    "Bairro": {param5},
    "Cep": {param6},
    "Cidade": {param7},
    "Uf": {param8}
}
Paramêtros
{param1}: Tipo de logradouro do Cliente. Caso não informado o sistema utiliza o tipo padrão "Rua". (Opcional. Opções: Rua, Avenida, Travessa, Alameda, Estrada, Rodovia, PSG, Quadra. Tipo do Dado: Texto.)
{param2}: Logradouro do Cliente. (Opcional. Tipo do Dado: Texto.)
{param3}: Número do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
{param4}: Complemento do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
{param5}: Bairro do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
{param6}: Cep do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
{param7}: Cidade do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
{param8}: Sigla do Estado do logradouro do Cliente. (Opcional.Tipo do Dado: Texto.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Cliente - Alterar Endereco
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarEndereco/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
	"TipoLogradouro": "Rua",
	"Logradouro": "Niteroi",
	"Numero": "265",
	"Complemento": "3 Andar",
	"Bairro": "Centro",
	"Cep": "09510-210",
	"Cidade": "São Caetano do Sul",
	"Uf": "SP"
}'
204 No Content
Example Response
Body
Headers (7)
No response body
This request doesn't return any response body
PUT
Cliente - Alterar Bloqueio
https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarBloqueio/{id}
Efetua o Bloqueio/Desbloqueio do cadastro do Cliente no BomControle.

Request
O request para essa API é feito informando o Id do Cliente no BomControle na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id do cliente no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "Bloquear": {param1}
}
Paramêtros
{param1}: Indica se deve ser feito o Bloqueio/Desbloqueio do Cliente. (Obrigatório. Tipo do Dado: Booleano.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Cliente - Bloqueio
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Cliente/AlterarBloqueio/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
  "Bloquear": false
}'
204 No Content
Example Response
Body
Headers (7)
No response body
This request doesn't return any response body
ContaFinanceira
API para obter os dados das contas financeiras do BomControle.

GET
ContaFinanceira - Pesquisar
https://apinewintegracao.bomcontrole.com.br/integracao/ContaFinanceira/Pesquisar
Pesquisa as Contas Financeiras conforme os filtros utilizados.

Request
O request para essa API é feito através de Querystring usando os paramêtros informados abaixo.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no sistema BomControle.
Paramêtros
idEmpresa: Id BomControle da Empresa relacionada as contas a serem pesquisadas. (Obrigatório. Tipo do Dado: Inteiro.)
textoPesquisa: Pesquisa as contas contendo o nome informado. (Opcional. Tipo do Dado: Texto.)
permiteRecebimento: Pesquisa apenas contas que permitem o recebimento. (Opcional. Tipo do Dado: Booleano.)
permitePagamento: Pesquisa apenas contas que permitem o pagamento. (Opcional. Tipo do Dado: Booleano.)
emiteBoleto: Pesquisa contas que podem emitir boletos. (Opcional. Tipo do Dado: Booleano.)
tipoConta: Pesquisa contas pelo tipo. (Opcional. Opções: Dinheiro, Bancaria, Credito, MeiosPagamento. Tipo do Dado: Texto.)
Response
Retorna um array de objetos com os dados das Contas Financeiras:

View More
Plain Text
[
  {
    "Id": {param1},
    "Nome": {param2},
    "Tipo": {param3},
    "NomeTipo": {param4},
    "Agencia": {param5},
    "Conta": {param6},
    "DigitoAgencia": {param7},
    "DigitoConta": {param8},
    "NomeBanco": {param9},
    "NumeroBanco": {param10},
    "PermiteRecebimento": {param11},
    "PermitePagamento": {param12},
    "EmiteBoleto": {param13}
  }
]
Paramêtros
{param1}: Id BomControle da Conta Financeira. (Tipo do Dado: Inteiro.)
{param2}: Nome da Conta Financeira. (Tipo do Dado: Texto.)
{param3}: Tipo da Conta Financeira. (Opções: 1 - Dinheiro, 2 - Bancaria, 3 - Credito, 4 - MeiosPagamento. Tipo do Dado: Inteiro.)
{param4}: Nome do Tipo da Conta Financeira. (Tipo do Dado: Texto.)
{param5}: Agência da Conta Financeira. (Tipo do Dado: Texto.)
{param6}: Número da Conta da Conta Financeira. (Tipo do Dado: Texto.)
{param7}: Dígito da Agência da Conta Financeira. (Tipo do Dado: Texto.)
{param8}: Dígito do Número da Conta da Conta Financeira. (Tipo do Dado: Texto.)
{param9}: Nome do Banco na Febraban. (Tipo do Dado: Texto.)
{param10}: Número do Banco na Febraban. (Tipo do Dado: Texto.)
{param11}: Indica se a Conta Financeira permite recebimentos. (Tipo do Dado: Booleano.)
{param12}: Indica se a Conta Financeira permite pagamentos. (Tipo do Dado: Booleano.)
{param13}: Indica se a Conta Financeira permite emissão de boletos. (Tipo do Dado: Booleano.)
Example Request
ContaFinanceira - Pesquisar
View More
curl
curl --location 'https://apinewintegracao.bomcontrole.com.br/integracao/ContaFinanceira/Pesquisar?idEmpresa=1&textoPesquisa=teste&permiteRecebimento=true&permitePagamento=true&emiteBoleto=true&tipoConta=Bancaria' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA=='
200 OK
Example Response
Body
Headers (10)
View More
html
[
  {
    "Id": 1,
    "Nome": "TESTE",
    "Tipo": 2,
    "NomeTipo": "Bancária",
    "Agencia": "1111",
    "Conta": "111111",
    "DigitoAgencia": "0",
    "DigitoConta": "1",
    "NomeBanco": "Banco Santander (Brasil) S.A.",
    "NumeroBanco": "033",
    "PermiteRecebimento": true,
    "PermitePagamento": true,
    "EmiteBoleto": true
  }
]
Departamento
API para pesquisa de Departamentos no BomControle.

PUT
Fatura - Alterar Valor
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/AlterarValor/{id}
Altera o valor da Fatura no BomControle.

Request
O request para essa API é feito informando a identificação da Fatura diretamente na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id da Fatura no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "Valor": {param1}
}
Paramêtros
{param1}: Valor da Fatura. (Obrigatório. Tipo do Dado: Decimal.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Fatura - Alterar Valor
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/AlterarValor/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
  "Valor": 11.55
}'
204 No Content
Example Response
Body
Headers (7)
No response body
This request doesn't return any response body
PUT
Fatura - Efetuar Pagamento
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/EfeturarPagamento/{id}
Realiza a quitação da Parcela referente a Fatura no BomControle.

Request
O request para essa API é feito informando a identificação da Fatura diretamente na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id da Fatura dentro do BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "ValorLiquido": 11.55,
  "DataQuitacao": "2020-01-01 16:20:08",
  "DataConciliacao": "2020-01-01 16:20:08",
  "GerarResiduo": false
}
Paramêtros
{param1}: Valor da Quitação. (Obrigatório. Tipo do Dado: Decimal.)
{param2}: Data da Quitação. (Obrigatório. Formato: "aaaa-mm-dd hh24:mi:ss". Tipo do Dado: Texto.)
{param3}: Data da Conciliação. (Opcional. Formato: "aaaa-mm-dd hh24:mi:ss". Tipo do Dado: Texto.)
{param4}: Indica se a diferença entre o valor da quitação e o valor da fatura deve gerar uma nova parcela. (Opcional. Tipo do Dado: Booleano.)
Response
Essa API não retorna nenhum dado no Response.

Body
raw
{
  "ValorLiquido": 11.55,
  "DataQuitacao": "2020-01-01 16:20:08",
  "DataConciliacao": "2020-01-01 16:20:08",
  "GerarResiduo": false
}
Example Request
Fatura - Efetuar Pagamento
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/EfeturarPagamento/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
  "ValorLiquido": 11.55,
  "DataQuitacao": "2020-01-01 16:20:08",
  "GerarResiduo": false
}'
204 No Content
Example Response
Body
Headers (7)
No response body
This request doesn't return any response body
PUT
Fatura - Cancelar
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/Cancelar/{id}
Realiza o cancelamento da Fatura no BomControle.

Request
O request para essa API é feito informando a identificação da Fatura diretamente na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id da Fatura no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "Motivo": {param1}
}
Paramêtros
{param1}: Motivo para o cancelamento da Fatura. (Obrigatório. Tipo do Dado: Texto.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Fatura - Cancelar
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/Cancelar/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
  "Motivo": "Cancelamento Teste."
}'
204 No Content
Example Response
Body
Headers (8)
No response body
This request doesn't return any response body
PUT
Fatura - Gerar Boleto
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/GerarBoleto/{id}
Realiza a geração do Boleto da Fatura no BomControle.

Request
O request para essa API é feito informando a identificação da Fatura diretamente na URL e os dados no Body do Request.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Content-Type: application/json
Paramêtros
{id}: Id da Fatura no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Body
Plain Text
{
  "DataVencimento": {param1}
}
Paramêtros
{param1}: Caso a data de vencimento da Fatura seja superior ou igual a data atual e não exista um boleto emitido é feito o faturamento da Fatura. Caso a data de vencimento da Fatura seja inferior a data atual é feito a reemissão do boleto com a nova data de vencimento informada e marcada a Fatura como renegociação. (Obrigatório. Formato: "aaaa-mm-dd hh24:mm:ss". Tipo do Dado: Texto.)
Response
Retorna um objeto com os dados do boleto da Fatura:

Plain Text
{
"Id": {param1},
"DataVencimento": {param2},
"Valor": {param3},
"LinkArquivo": {param4}
}
Paramêtros
{param1}: Id BomControle do boleto da Fatura. (Tipo do Dado: Inteiro.)
{param2}: Data de vencimento do boleto da Fatura. (Tipo do Dado: Texto.)
{param3}: Valor do boleto da Fatura. (Tipo do Dado: Decimal.)
{param4}: Link para o arquivo PDF do boleto da Fatura. (Tipo do Dado: Texto.)
Example Request
Fatura - Gerar Boleto
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/GerarBoleto/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--header 'Content-Type: application/json' \
--data '{
  "DataVencimento": "2020-01-01 00:00:00"
}'
200 OK
Example Response
Body
Headers (10)
View More
html
{
  "Id": 1,
  "DataVencimento": "2020-01-01T00:00:00",
  "Valor": 50,
  "LinkArquivo": "https://bom-controle-arquivos.s3-sa-east-1.amazonaws.com/1/financeiro/boletos/boleto_3105ceff-3f65-4df9-8bd2-6acc17473afe.pdf"
}
PUT
Fatura - Upload Anexo
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/UploadAnexo
Realiza o upload de arquivo como anexo a Movimentação da Fatura no BomControle.

Request
O request para essa API é feito através de Querystring usando o paramêtro informado abaixo, o arquivo deve ser enviado no form-data da comunicação.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Paramêtros
idFatura: Id da Fatura no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Response
Essa API não retorna nenhum dado no Response.

Example Request
Fatura - Upload Anexo
View More
curl
curl --location --request PUT 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/UploadAnexo?idFatura=1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA==' \
--form '=@"/C:/TEMP/teste.png"'
204 No Content
Example Response
Body
Headers (8)
No response body
This request doesn't return any response body
GET
Fatura - Verificar Situação Cliente
https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/VerificarSituacaoCliente/{id}
Obtem a Fatura pendente do Cliente no BomControle.

Request
O request para essa API é feito informando a identificação da Fatura diretamente na URL.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no BomControle.
Paramêtros
{id}: Id do Cliente no BomControle. (Obrigatório. Tipo do Dado: Inteiro.)
Response
Retorna um objeto com os dados do boleto da Fatura:

Plain Text
{
    "IdFatura": {param1},
    "DataPrevista": {param2},
    "ValorPrevisto": {param3}
}
Paramêtros
{param1}: Id BomControle da Fatura. (Tipo do Dado: Inteiro.)
{param2}: Data de vencimento da Fatura. (Tipo do Dado: Texto.)
{param3}: Valor da Fatura. (Tipo do Dado: Decimal.)
Example Request
Fatura - Verificar Situação Cliente
View More
curl
curl --location 'https://apinewintegracao.bomcontrole.com.br/integracao/Fatura/VerificarSituacaoCliente/1' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA=='
200 OK
Example Response
Body
Headers (10)
html
{
  "IdFatura": 1,
  "DataPrevista": "2020-01-01T00:00:00",
  "ValorPrevisto": 10
}
GET
Financeiro - Pesquisa Detalhada
https://apinewintegracao.bomcontrole.com.br/integracao/Financeiro/PesquisaDetalhada
Semelhante a API integracao/Financeiro/Pesquisar, esta API pesquisa as movimentações conforme os filtros utilizados com mais opções de filtro.

Request
O request para essa API é feito através de Querystring usando os paramêtros informados abaixo.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no sistema BomControle.
Paramêtros
despesa: Filtra apenas despesas ou apenas receitas. (Opcional. Tipo do Dado: Boleano.)
renegociacoesAtivas: Filtra por renegociações ativas ou não, o sistema considera uma renegociação ativa quando a receita passou por uma renegociação e tem uma nova data prevista no futuro, quando a data prevista não se cumpre a movimentação volta a não ter uma renegociação ativa. (Opcional. Tipo do Dado: Boleano.)
status: Filtra pelo status da movimentação. (Opcional. Opções: Atrasado, Agendado, Quitado. Tipo do Dado: Texto.)
idsEmpresa: Ids BomControle das Empresas. (Opcional. Tipo do Dado: Array de Inteiros.)
idsCliente: Ids BomControle dos Clientes. (Opcional. Tipo do Dado: Array de Inteiros.)
idsFornecedor: Ids BomControle dos Fornecedores. (Opcional. Tipo do Dado: Array de Inteiros.)
textoPesquisa: Pesquisa pelo Nome da Parcela. (Opcional. Tipo do Dado: Texto.)
dataInicio: Filtra pela Data Inicial. (Obrigatório. Formato: "aaaa-mm-dd hh24:mi:ss". Tipo do Dado: Texto.)
dataTermino: Filtra pela Data Final. (Obrigatório. Formato: "aaaa-mm-dd hh24:mi:ss". Tipo do Dado: Texto.)
tipoData: Utilizado em conjunto com as datas para definir qual data a ser utilizada. (Obrigatório. Opções: DataPadrao, DataPrevista, DataPagamento, DataCompetencia, DataConciliacao, Criacao, UltimaAlteracao. Tipo do Dado: Texto. )
paginacao.itensPorPagina: Usado para definir a paginação da pesquisa, se não informado utiliza valor padrão 50. Numero máximo permitido é de 100 itens. (Opcional. Tipo do Dado: Inteiro.)
paginacao.numeroDaPagina: Usado para definir a paginação da pesquisa, se não informado utiliza valor padrão 1. (Opcional. Tipo do Dado: Inteiro.)
Response
Retorna um objeto com os dados das Movimentações:

View More
Plain Text
{
  "Itens": {param1} [
    {
      "RenegociacaoAtiva": {param2},
      "DataPrevistaRenegociada": {param3},
      "IdMovimentacaoFinanceiraParcela": {param4},
      "Debito": {param5},
      "DataVencimento": {param6},
      "DataCompetencia": {param7},
      "DataQuitacao": {param8},
      "DataConciliacao": {param9},
      "Valor": {param10},
      "FormaPagamento": {param11},
      "NomeFormaPagamento": {param12},
      "TipoMovimentacao": {param13},
      "NomeTipoMovimentacao": {param14},
      "Nome": {param15},
      "Observacao": {param16},
      "NumeroParcela": {param17},
      "QuantidadeParcela": {param18},
      "IdCategoriaFinanceira": {param19},
      "NomeCategoriaFinanceira": {param20},
      "IconeCategoriaFinanceira": {param21},
      "IdContaFinanceira": {param22},
      "NomeContaFinanceira": {param23},
      "NumeroConta": {param24},
      "DigitoConta": {param25},
      "NumeroAgencia": {param26},
      "DigitoAgencia": {param27},
      "NomeBanco": {param28},
      "NumeroBanco": {param29},
      "IdEmpresa": {param30},
      "NomeEmpresa": {param31},
      "DocumentoEmpresa": {param32},
      "IdCliente": {param33},
      "IdFornecedor": {param34},
      "IdFuncionario": {param35},
      "NomeClienteFornecedor": {param36},
      "NomeFantasiaClienteFornecedor": {param37},
      "DocumentoClienteFornecedor": {param38},
      "LinkBoletoBancario": {param39},
      "LinkNotaFiscalServico": {param40},
      "IdDepartamento": {param41},
      "NomeDepartamento": {param42},
      "TipoDepartamento": {param43},
      "NomeTipoDepartamento": {param44},
      "TemRateio": {param45},
      "ValorDefinitivo": {param46},
      "TotalItens": {param47},
      "DataCriacaoParcela": {param48},
      "ValorAcrescimo": {param49},
      "ValorDesconto": {param50},
      "ValorBruto": {param51},
      "DataUltimaAlteracao": {param52},
      "DataFaturamento": {param53},
      "EtiquetasMovimentacao": {param54},
      "IdFatura": {param55},
      "NumeroDocumento": {param56},
      "NotaFiscalServicoParcela": {param57},
      "NotaFiscalServicoVenda": {param58},
      "NotaFiscalProduto": {param59},
      "NotaFiscalConsumidor": {param60}     
    }
  ],
  "TotalItens": {param61}
}
Paramêtros
{param1}: Array de Objetos contendo os dados pesquisados. (Tipo do Dado: Array de Objetos.)
{param2}: Indica se a movimentação possui uma renegociação ativa, o sistema considera uma renegociação ativa quando a receita passou por uma renegociação e tem uma nova data prevista no futuro, quando a data prevista não se cumpre a movimentação volta a não ter uma renegociação ativa. (Tipo do Dado: Booleano.)
{param3}: Quando a movimentação possui uma renegociação ativa esse campo indica a nova data prevista para o recebimento. (Tipo do Dado: Texto.)
{param4}: Id BomControle da Parcela. (Tipo do Dado: Texto.)
{param5}: Indica se é uma Movimentação de Débito. (Tipo do Dado: Booleano.)
{param6}: Data de Vencimento da Parcela. (Tipo do Dado: Texto.)
{param7}: Data de Competência da Parcela. (Tipo do Dado: Texto.)
{param8}: Data de Quitação da Parcela. (Tipo do Dado: Texto.)
{param9}: Data de Conciliação da Parcela. (Tipo do Dado: Texto.)
{param10}: Valor da Parcela. (Tipo do Dado: Decimal.)
{param11}: Forma de Pagamento da Parcela. (Opções: 1 - Dinheiro, 2 - Deposito, 3 - Cheque, 4 - DebitoEmContaCorrente, 5 - TransferenciaBancaria, 6 - CartaoCredito, 7 - CartaoDebito, 8 - DOC, 9 - TED, 10 - TransferenciaAplicativo, 11 - TransferenciaMoedaVirtual, 12 - InternetBanking, 13 - BoletoBancario, 14 - DescontoEmFolha, 15 - Outros, 16 - DebitoConta. Tipo do Dado: Inteiro.)
{param12}: Nome da Forma de Pagamento. (Tipo do Dado: Texto.)
{param13}: Tipo da Movimentação. (Dados: 15 - AporteCapital, 16 - ReceitaProduto, 17 - ReceitaServico, 18 - OutrasReceitas, 19 - DespesaFornecedor, 20 - DespesaFuncionario, 21 - DespesaImposto, 22 - DivisaoLucro. Tipo do Dado: Texto.)
{param14}: Nome do Tipo da Movimentação. (Tipo do Dado: Texto.)
{param15}: Nome da Parcela da Movimentação. (Tipo do Dado: Texto.)
{param16}: Observação da Parcela da Movimentação. (Tipo do Dado: Texto.)
{param17}: Número da Parcela da Movimentação. (Tipo do Dado: Inteiro.)
{param18}: Quantidade de Parcelas da Movimentação. (Tipo do Dado: Inteiro.)
{param19}: Id BomControle da Categoria Financeira da Parcela. Valor zerado caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Inteiro.)
{param20}: Nome da Categoria Financeira da Parcela. Nullo caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Texto.)
{param21}: Ícone da Categoria Financeira da Parcela. Nullo caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Texto.)
{param22}: Id BomControle da Conta Financeira da Parcela. (Tipo do Dado: Inteiro.)
{param23}: Nome da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param24}: Número da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param25}: Dígito da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param26}: Número da Agencia da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param27}: Dígito da Agencia da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param28}: Nome do Banco da Conta Financeira da Parcela na Febraban. (Tipo do Dado: Texto.)
{param29}: Número do Banco da Conta Financeira da Parcela na Febraban. (Tipo do Dado: Texto.)
{param30}: Id BomControle da Empresa da Parcela. (Tipo do Dado: Inteiro.)
{param31}: Nome da Empresa da Parcela. (Tipo do Dado: Texto.)
{param32}: Cnpj da Empresa da Parcela. (Tipo do Dado: Texto.)
{param33}: Id BomControle do Cliente da Parcela para contas a Receber. (Tipo do Dado: Inteiro.)
{param34}: Id BomControle do Fornecedor da Parcela para contas a Pagar. (Tipo do Dado: Inteiro.)
{param35}: Id BomControle do Funcionário da Parcela para contas a Pagar. (Tipo do Dado: Inteiro.)
{param36}: Nome do Cliente/Fornecedor/Funcionário da Parcela. (Tipo do Dado: Texto.)
{param37}: Nome Fantasia do Cliente/Fornecedor da Parcela. (Tipo do Dado: Texto.)
{param38}: Documento do Cliente/Fornecedor/Funcionário da Parcela. (Tipo do Dado: Texto.)
{param39}: Link do Boleto Bancário da Parcela. (Tipo do Dado: Texto.)
{param40}: Link da Nota Fiscal da Parcela. (Tipo do Dado: Texto.)
{param41}: Id BomControle do Departamento da Parcela. Valor zerado caso a Parcela possua mais de um Departamento. (Tipo do Dado: Inteiro.)
{param42}: Nome do Departamento da Parcela. Nullo caso a Parcela possua mais de um Departamento. (Tipo do Dado: Texto.)
{param43}: Id BomControle do Tipo do Departamento. (Opções: 1 - Administrativo, 2 - Produtivo. Tipo do Dado: Inteiro.)
{param44}: Nome do Tipo do Departamento. (Tipo do Dado: Texto.)
{param45}: Indica se a Parcela possui rateio. (Tipo do Dado: Booleano.)
{param46}: Indica se o valor da Parcela é definitivo (Tipo do Dado: Booleano.)
{param47}: Total de Itens Pesquisados. (Tipo do Dado: Inteiro.)
{param48}: Data de Criação da Parcela. (Tipo do Dado: Texto.)
{param49}: Valor de Acréscimo da Parcela. (Tipo do Dado: Decimal.)
{param50}: Valor de Desconto da Parcela. (Tipo do Dado: Decimal.)
{param51}: Valor Bruto da Parcela. (Tipo do Dado: Decimal.)
{param52}: Data de Última Alteração da Parcela. (Tipo do Dado: Texto.)
{param53}: Data do Faturamento. (Tipo do Dado: Texto.)
{param54}: Etiquetas da Movimentação. (Tipo do Dado: Texto.)
{param55}: Id da Fatura no BomControle. (Tipo do Dado: Inteiro.)
{param56}:Número do Documento informado na Movimentação. (Tipo do Dado: Inteiro.)
{param57}: Número da Nota Fiscal de Serviço vinculada à parcela. (Tipo do Dado: Texto.)
{param58}: Número da Nota Fiscal de Serviço vinculada à venda. (Tipo do Dado: Texto.)
{param59}: Número da Nota Fiscal de Produto. (Tipo do Dado: Texto.)
{param60}: Número da Nota Fiscal de Consumidor. (Tipo do Dado: Texto.)
{param61}: Total de Itens Pesquisados. (Tipo do Dado: Inteiro.)
Example Request
Financeiro - Pesquisa Detalhada
View More
curl
curl --location 'https://apinewintegracao.bomcontrole.com.br/integracao/Financeiro/PesquisaDetalhada?filtro.despesa=false&filtro.renegociacoesAtivas=true&filtro.dataInicio=2022-09-01&filtro.dataTermino=2022-09-30&filtro.tipoData=DataPrevista' \
--header 'Authorization: ApiKey Z0EjZPzTOb_mUYW0EkCJIz9_2L6l__bI8P7PaYbnU2GTzHIR94nxh7M2jJALX7i4ynsbTrCaUm3_G4qy8Mix9UfB9RcXI73KHaUUcTkvYNwD3VPSZ9pRCgKd7MwMR1qwsW16kQFhc94.'
200 OK
Example Response
Body
Headers (10)
View More
html
{
  "Itens": [
    {
      "RenegociacaoAtiva": true,
      "DataPrevistaRenegociada": "2022-09-10T00:00:00",
      "IdMovimentacaoFinanceiraParcela": "900b7247-dfce-4cb1-96c5-4801b1e84abd",
      "Debito": false,
      "DataVencimento": "2022-09-01T00:00:00",
      "DataCompetencia": "2022-09-01T00:00:00",
      "DataQuitacao": null,
      "DataConciliacao": null,
      "Valor": 50,
      "FormaPagamento": 13,
      "NomeFormaPagamento": "Boleto Bancário",
      "TipoMovimentacao": 18,
      "NomeTipoMovimentacao": "Outros recebimentos",
      "Nome": "Recebimento DO(A) Cliente NO VALOR R$ 50.00 (PARCELA UNICA NO DIA 1)",
      "Observacao": null,
      "NumeroParcela": 1,
      "QuantidadeParcela": 0,
      "IdCategoriaFinanceira": 46,
      "NomeCategoriaFinanceira": "Serviço Bom",
      "IconeCategoriaFinanceira": "fa-dollar",
      "IdContaFinanceira": 2,
      "NomeContaFinanceira": "Banco Itau",
      "NumeroConta": "188596",
      "DigitoConta": "1",
      "NumeroAgencia": "1218",
      "DigitoAgencia": null,
      "NomeBanco": "Itaú Unibanco S.A.",
      "NumeroBanco": "341",
      "IdEmpresa": 1,
      "NomeEmpresa": "Empresa A+",
      "DocumentoEmpresa": "65961561000100",
      "IdCliente": 20634,
      "IdFornecedor": null,
      "IdFuncionario": null,
      "NomeClienteFornecedor": "Cliente",
      "NomeFantasiaClienteFornecedor": "Cliente",
      "DocumentoClienteFornecedor": "76631957000106",
      "LinkBoletoBancario": null,
      "LinkNotaFiscalServico": null,
      "IdDepartamento": null,
      "NomeDepartamento": null,
      "TipoDepartamento": null,
      "NomeTipoDepartamento": "",
      "Valores": [
        {
          "Despesa": false,
          "IconeCategoria": "fa-dollar",
          "Categoria": "Serviço Bom",
          "NomeCategoriaRoot": "Serviço Bom",
          "CategoriaDiretoRoot": false,
          "CentroCusto": null,
          "IdClienteFornecedor": 5815,
          "NomeClienteFornecedor": "Cliente",
          "NomeFantasiaClienteFornecedor": "Cliente",
          "Valor": 50
        }
      ],
      "TemRateio": true
    }
  ],
  "TotalItens": 1
}
GET
Financeiro - Obter
https://apinewintegracao.bomcontrole.com.br/integracao/Financeiro/Obter
Pesquisa a Parcela conforme o filtro utilizado.

Request
O request para essa API é feito através de Querystring usando os paramêtros informados abaixo.

Headers
Authorization: Chave API ("ApiKey + {chave}") obtido no sistema BomControle.
Paramêtros
idMovimentacaoFinanceiraParcela: Id BomControle da Parcela. (Obrigatório. Tipo do Dado: Guid.)
Response
Retorna um objeto com os dados da Parcela:

View More
Plain Text
{
  "IdMovimentacaoFinanceiraParcela": {param1},
  "Debito": {param2},
  "DataVencimento": {param3},
  "DataCompetencia": {param4},
  "DataQuitacao": {param5},
  "DataConciliacao": {param6},
  "Valor": {param7},
  "FormaPagamento": {param8},
  "NomeFormaPagamento": {param9},
  "TipoMovimentacao": {param10},
  "NomeTipoMovimentacao": {param11},
  "Nome": {param12},
  "Observacao": {param13},
  "NumeroParcela": {param14},
  "QuantidadeParcela": {param15},
  "IdCategoriaFinanceira": {param16},
  "NomeCategoriaFinanceira": {param17},
  "IconeCategoriaFinanceira": {param18},
  "IdContaFinanceira": {param19},
  "NomeContaFinanceira": {param20},
  "NumeroConta": {param21},
  "DigitoConta": {param22},
  "NumeroAgencia": {param23},
  "DigitoAgencia": {param24},
  "NomeBanco": {param25},
  "NumeroBanco": {param26},
  "IdEmpresa": {param27},
  "NomeEmpresa": {param28},
  "DocumentoEmpresa": {param29},
  "IdCliente": {param30},
  "IdFornecedor": {param31},
  "IdFuncionario": {param32},
  "NomeClienteFornecedor": {param33},
  "NomeFantasiaClienteFornecedor": {param34},
  "DocumentoClienteFornecedor": {param35},
  "LinkBoletoBancario": {param36},
  "LinkNotaFiscalServico": {param37},
  "IdDepartamento": {param38},
  "NomeDepartamento": {param39},
  "TipoDepartamento": {param40},
  "NomeTipoDepartamento": {param41}
}
Paramêtros
{param1}: Id BomControle da Parcela. (Tipo do Dado: Texto.)
{param2}: Indica se é uma Movimentação de Débito. (Tipo do Dado: Booleano.)
{param3}: Data de Vencimento da Parcela. (Tipo do Dado: Texto.)
{param4}: Data de Competência da Parcela. (Tipo do Dado: Texto.)
{param5}: Data de Quitação da Parcela. (Tipo do Dado: Texto.)
{param6}: Data de Conciliação da Parcela. (Tipo do Dado: Texto.)
{param7}: Valor da Parcela. (Tipo do Dado: Decimal.)
{param8}: Forma de Pagamento da Parcela. (Opções: 1 - Dinheiro, 2 - Deposito, 3 - Cheque, 4 - DebitoEmContaCorrente, 5 - TransferenciaBancaria, 6 - CartaoCredito, 7 - CartaoDebito, 8 - DOC, 9 - TED, 10 - TransferenciaAplicativo, 11 - TransferenciaMoedaVirtual, 12 - InternetBanking, 13 - BoletoBancario, 14 - DescontoEmFolha, 15 - Outros, 16 - DebitoConta. Tipo do Dado: Inteiro.)
{param9}: Nome da Forma de Pagamento. (Tipo do Dado: Texto.)
{param10}: Tipo da Movimentação. (Dados: 0 - Inicial, 9 - Transferencia, 15 - AporteCapital, 16 - ReceitaProduto, 17 - ReceitaServico, 18 - OutrasReceitas, 19 - DespesaFornecedor, 20 - DespesaFuncionario, 21 - DespesaImposto, 22 - DivisaoLucro. Tipo do Dado: Texto.)
{param11}: Nome do Tipo da Movimentação. (Tipo do Dado: Texto.)
{param12}: Nome da Parcela da Movimentação. (Tipo do Dado: Texto.)
{param13}: Observação da Parcela da Movimentação. (Tipo do Dado: Texto.)
{param14}: Número da Parcela da Movimentação. (Tipo do Dado: Inteiro.)
{param15}: Quantidade de Parcelas da Movimentação. (Tipo do Dado: Inteiro.)
{param16}: Id BomControle da Categoria Financeira da Parcela. Valor zerado caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Inteiro.)
{param17}: Nome da Categoria Financeira da Parcela. Nullo caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Texto.)
{param18}: Ícone da Categoria Financeira da Parcela. Nullo caso a Parcela possua mais de uma Categoria. (Tipo do Dado: Texto.)
{param19}: Id BomControle da Conta Financeira da Parcela. (Tipo do Dado: Inteiro.)
{param20}: Nome da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param21}: Número da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param22}: Dígito da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param23}: Número da Agencia da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param24}: Dígito da Agencia da Conta Financeira da Parcela. (Tipo do Dado: Texto.)
{param25}: Nome do Banco da Conta Financeira da Parcela na Febraban. (Tipo do Dado: Texto.)
{param26}: Número do Banco da Conta Financeira da Parcela na Febraban. (Tipo do Dado: Texto.)
{param27}: Id BomControle da Empresa da Parcela. (Tipo do Dado: Inteiro.)
{param28}: Nome da Empresa da Parcela. (Tipo do Dado: Texto.)
{param29}: Cnpj da Empresa da Parcela. (Tipo do Dado: Texto.)
{param30}: Id BomControle do Cliente da Parcela para contas a Receber. (Tipo do Dado: Inteiro.)
{param31}: Id BomControle do Fornecedor da Parcela para contas a Pagar. (Tipo do Dado: Inteiro.)
{param32}: Id BomControle do Funcionário da Parcela para contas a Pagar. (Tipo do Dado: Inteiro.)
{param33}: Nome do Cliente/Fornecedor/Funcionário da Parcela. (Tipo do Dado: Texto.)
{param34}: Nome Fantasia do Cliente/Fornecedor da Parcela. (Tipo do Dado: Texto.)
{param35}: Documento do Cliente/Fornecedor/Funcionário da Parcela. (Tipo do Dado: Texto.)
{param36}: Link do Boleto Bancário da Parcela. (Tipo do Dado: Texto.)
{param37}: Link da Nota Fiscal da Parcela. (Tipo do Dado: Texto.)
{param38}: Id BomControle do Departamento da Parcela. Valor zerado caso a Parcela possua mais de um Departamento. (Tipo do Dado: Inteiro.)
{param39}: Nome do Departamento da Parcela. Nullo caso a Parcela possua mais de um Departamento. (Tipo do Dado: Texto.)
{param40}: Id BomControle do Tipo do Departamento. (Opções: 1 - Administrativo, 2 - Produtivo. Tipo do Dado: Inteiro.)
{param41}: Nome do Tipo do Departamento. (Tipo do Dado: Texto.)
Example Request
Financeiro - Obter
View More
curl
curl --location 'https://apinewintegracao.bomcontrole.com.br/integracao/Financeiro/Obter?idMovimentacaoFinanceiraParcela=D11513C0-55FE-47BC-A187-909398DFF498' \
--header 'Authorization: ApiKey Z0EjZPzTOb-NVurlZvdf-jqb2g6FUvIlKBmvUVCh7sE03jMPBaCQ9bIps9El6__SynsbTrCaUm1yI2geYNx3JSPNELf-pDy5HaUUcTkvYNw8nwlkDozDnA=='
200 OK
Example Response
Body
Headers (10)
View More
html
{
  "IdMovimentacaoFinanceiraParcela": "d11513c0-55fe-47bc-a187-909398dff498",
  "Debito": false,
  "DataVencimento": "2020-01-01T10:42:21",
  "DataCompetencia": "2020-01-01T00:00:00",
  "DataQuitacao": null,
  "DataConciliacao": null,
  "Valor": 15.5,
  "FormaPagamento": 6,
  "NomeFormaPagamento": "Cartão de Crédito",
  "TipoMovimentacao": 1,
  "NomeTipoMovimentacao": "Venda de serviço",
  "Nome": "Receita referente a Venda número 338 realizada dia 01/01/2020",
  "Observacao": null,
  "NumeroParcela": 1,
  "QuantidadeParcela": 0,
  "IdCategoriaFinanceira": 0,
  "NomeCategoriaFinanceira": null,
  "IconeCategoriaFinanceira": null,
  "IdContaFinanceira": 1,
  "NomeContaFinanceira": "Conta Teste",
  "NumeroConta": "111111",
  "DigitoConta": "1",
  "NumeroAgencia": "1111",
  "DigitoAgencia": null,
  "NomeBanco": "Itaú Unibanco S.A.",
  "NumeroBanco": "341",
  "IdEmpresa": 1,
  "NomeEmpresa": "Empresa Teste",
  "DocumentoEmpresa": "12345678000100",
  "IdCliente": 1,
  "IdFornecedor": null,
  "IdFuncionario": null,
  "NomeClienteFornecedor": "Cliente Teste",
  "NomeFantasiaClienteFornecedor": "Clientes Teste",
  "DocumentoClienteFornecedor": "12345678000100",
  "LinkBoletoBancario": null,
  "LinkNotaFiscalServico": null,
  "IdDepartamento": null,
  "NomeDepartamento": null,
  "TipoDepartamento": null,
  "NomeTipoDepartamento": ""
}
