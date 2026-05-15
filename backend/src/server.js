require("dotenv").config();

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const jwt = require("@fastify/jwt");

const authRoutes = require("./routes/authRoutes");
const calculationRoutes = require("./routes/calculationRoutes");

const app = Fastify({
  logger: true
});

// são rotas, muitas rotas puxando da api, 
// e cada rota tem um prefixo, tipo:
// /api/auth, /api/calculations
// E cada rota tem um arquivo separado, tipo authRoutes.js, calculationRoutes.js
// Arquivos de rota tem as rotas relacionadas a ele, tipo authRoutes.js tem as rotas de login e cadastro, calculationRoutes.js tem as rotas de cálculo e histórico
// Cada rota tem um handler que é a função que vai ser executada quando a rota for chamada. 
// O handler tem acesso ao request e reply do Fastify, e pode usar o db para acessar o banco de dados, e pode usar o app.jwt para gerar ou verificar tokens JWT
app.register(cors, {
  origin: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || "chave_padrao_dev"
});

app.register(authRoutes, {
  prefix: "/api/auth"
});

app.register(calculationRoutes, {
  prefix: "/api/calculations"
});

app.get("/api/health", async () => {
  return {
    status: "ok",
    message: "Backend da calculadora funcionando."
  };
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000;

    await app.listen({
      port,
      host: "0.0.0.0"
    });

    console.log(`Servidor rodando em http://localhost:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();