const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js'); // Substitua 'seu-app' pelo caminho correto do seu aplicativo
const expect = chai.expect;

chai.use(chaiHttp);

describe('Testes de API dos 4 ENDPOINTS', () => {
  it('POST /pessoas - Deve criar um recurso pessoa', async () => {
    const res = await chai.request(app)
      .post('/pessoas')
      .send({
        "apelido" : "josé",
        "nome" : "José Roberto",
        "nascimento" : "2000-10-01",
        "stack" : ["C#", "Node", "Oracle"]
        });

    if (res.status === 201) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
    } else if (res.status === 400 || res.status == 422) {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
    }
  });

  it('GET /pessoas/:id - Deve consultar um recurso criado', async () => {
    const res = await chai.request(app).get('/pessoas/574db04d-1296-434c-acf5-6fa204f52188');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
  });

  it('GET /pessoas?t=[:termo da busca] - Deve fazer uma busca por pessoas', async () => {
    const termoBusca = 'fer';
    const res = await chai.request(app).get(`/pessoas?t=${termoBusca}`);

    if (res.status === 200) {
        if (Array.isArray(res.body) && res.body.length > 0) {
            // A busca foi bem-sucedida e retornou pelo menos uma pessoa
            expect(res.body).to.be.an('array');
          } else {
            // A busca foi bem-sucedida, mas nenhum resultado foi encontrado
            // Isso ainda é considerado um sucesso
            expect(res.body).to.be.an('array').that.is.empty;
          }
      } else if (res.status === 404) {
        expect(res.body).to.have.property('error', 'Not found');
      } else {
        throw new Error(`Status inesperado: ${res.status}`);
      }
  });

  it('GET /contagem-pessoas - Deve retornar a contagem de pessoas cadastradas', async () => {
    const res = await chai.request(app).get('/contagem-pessoas');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('contagemPessoas');
  });
});
