//aqui é o server

require("dotenv").config();

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const jwt = require("@fastify/jwt");
const cookie = require("@fastify/cookie");
const rateLimit = require("@fastify/rate-limit");
const authRoutes = require("./routes/authRoutes");
const calculationRoutes = require("./routes/calculationRoutes");

//aqui eu coloquei vai quais as variaveis obrigatorias, que estão na env, tem que ter se não não funciona
if (!process.env.JWT_SECRET) {
  console.error("ERRO: JWT_SECRET NÃO DEFINIDO NO .ENV ENCERRADO!!");
  process.exit(1);
}

const app = Fastify({ logger: true });

//aqui vai os plugins
//cokie (o httponly precisa dele)
app.register(cookie, {
  secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
});

//CORS - só permite origens listadas no .env
const origensPermitidas = (process.env.ALLOWED_ORIGINS || "")
.split(",")
.map((o) => o.trim())
.filter(Boolean);
//tem que arrumar aqui ja que a gente fez essa alteração aqui em cima
app.register(cors, {
  origin: origensPermitidas.length ? origensPermitidas : false,
  methods: ["GET", "POST", "DELETE"],
  credentials: true, //isso aqui serve para enviar e receber cookies do cross-origins
});

//aqui eu fiz para o JWT ter uma expiração de 2h
app.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: { expiresIn: "2h"}
});

app.register(rateLimit, {
  global:true,
  max: 100,
  timeWindow: "1 minute",
  errorResponseBuilder: () => ({
    message: "Muitas requisições. Tente novamente em instantes.",
  }),
});


app.get("/", async () => ({ status: "0k" }));
app.get("/api/health", async () => ({ status: "0k" }));

app.register(authRoutes, { prefix: "/api/auth" });
app.register(calculationRoutes, { prefix: "/api/calculations" });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: "0.0.0.0"});
    console.log(`Servidor rodando em http://localhost:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();