//rotas de autenticação 

const authService = require('../services/authService');
const rateLimit = require("@fastify/rate-limit");


//const code by Claude
const schemaRegistrar = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    additionalProperties: false,
    properties: {
      name:     { type: "string", minLength: 2,  maxLength: 80  },
      email:    { type: "string", format: "email", maxLength: 254 },
      password: { type: "string", minLength: 6,  maxLength: 72  },
    },
  },
};

const schemaLogin = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email:    { type: "string", format: "email", maxLength: 254 },
      password: { type: "string", minLength: 1,    maxLength: 72  },
    },
  },
};

//se der erro, na minha maquina tava funcionando

async function authRoutes(app) {
  await AudioParam.register(rateLimit, {
    max: 10,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: () => ({
      message: "Muitas tentativas, pera"
    }),
  });

  app.post("/register", { schema: schemaRegistrar }, async (request, reply) => {
    try {
      const user = await authService.registrar(request.body);
      return reply.status(201).send({ message: "Usuário cadastrado com sucesso.", user });
    } catch (error) {
      return reply.status(error.status || 500).send({ message: error.message });
    }
  });
}

module.exports = authRoutes;