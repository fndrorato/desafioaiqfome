# Desafio AiqFome - API

Essa API foi feita utilizando o NodeJS e expondo 4 rotas.

## Stack utilizada

**Back-end:** Node, Express

**Banco de Dados:** MySQL

## Instalação

Faça o git clone do projeto

```bash
  git clone https://github.com/fndrorato/desafioaiqfome.git
  cd desafioaiqfome
  npm install
```

## Configuração
Dentro da pasta **/db** está o arquivo database.sql, execute o mesmo para a criação do banco dados e criação da tabela.

Após isso, configure as variáveis que estão dentro da pasta /**config/db.config.js** necessárias para conexão com o banco de dados.

## Execução
Se estiver executando localmente e não for alterada a porta de execução, a rota para a api será:

      http://localhost:5000/

## Testes Automatizados

Os testes automatizados são essenciais para garantir a robustez e confiabilidade da sua API. A suite de testes para este projeto utiliza as bibliotecas Mocha e Chai. Após a configuração do ambiente, caso queira executar os testes basta executar:
      
      npm test


    






## Endpoints

### 1. Criar Pessoa

Endpoint para criar um recurso pessoa.

- **Método:** `POST`
- **Rota:** `/pessoas`

| Atributo   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `apelido` | `string` | **Obrigatório**, único, string de até 32 caracteres |
| `nome` | `string` | **Obrigatório**, string de até 100 caracteres |
| `nascimento` | `string` | **Obrigatório**, string para data no formato AAAA-MM-DD
(ano, mês, dia) |
| `stack` | `vetor` | **Opcional**, vetor de string com cada elemento sendo obrigatório e
de até 32 caracteres |
- **Exemplo:**
  ```bash
    {
      "apelido" : "josé",
      "nome" : "José Roberto",
      "nascimento" : "2000-10-01",
      "stack" : ["C#", "Node", "Oracle"]
    }
- **Resposta:**
  - Status: 201
  - Header: location /pessoas/uuid_da_pessoa
  - Corpo da resposta
  ```bash
    {
      "success" : true,
      "message" : "The registraion was succefull"
    }    
  
### 2. Consultar Pessoa por ID

Endpoint para consultar um recurso pessoa por ID.

- **Método:** `GET`
- **Rota:** `/pessoas/:id`
- **Resposta:**
  - Status: 200
  - Corpo da resposta
  ```bash
    {
      "id" : "f7379ae8-8f9b-4cd5-8221-51efe19e721b",
      "apelido" : "josé",
      "nome" : "José Roberto",
      "nascimento" : "2000-10-01",
      "stack" : ["C#", "Node", "Oracle"]
    } 

### 3. Buscar pessoas por termo de busca

Endpoint para fazer uma busca por pessoas usando um termo.

- **Método:** `GET`
- **Rota:** `/pessoas?t=[:termo da busca]`
- **Resposta:**
  - Status: 200
  - Corpo da resposta
  ```bash
    [
      {
        "id" : "f7379ae8-8f9b-4cd5-8221-51efe19e721b",
        "apelido" : "josé",
        "nome" : "José Roberto",
        "nascimento" : "2000-10-01",
        "stack" : ["C#", "Node", "Oracle"]
      },
      {
        "id" : "5ce4668c-4710-4cfb-ae5f-38988d6d49cb",
        "apelido" : "ana",
        "nome" : "Ana Barbosa",
        "nascimento" : "1985-09-23",
        "stack" : ["Node", "Postgres"]
      }
    ]

### 4. Contagem de Pessoas Cadastradas

Endpoint especial para obter a contagem de pessoas cadastradas.

- **Método:** `GET`
- **Rota:** `/contagem-pessoas`
- **Resposta:**
  - Status: 200
  - Corpo da resposta
  ```bash
    {
      "contagemPessoas" : 37
    } 
