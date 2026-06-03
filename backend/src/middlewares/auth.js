//aqui fazemos a autenticação
//no try ele vai ler o JWT do cookie httonly e autenticar a requisição
async function authenticate(request, reply) {
  try {
    const cookieHeader = request.headers.cookie || "";
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);

    if (!match) {
      return reply.status(401).send({message: "Não utenticado."});
    }

    const token = decodeURIComponent(match[1]);

    request.user = request.server.jwt.verify(token);
  } catch (err) {
    return reply.status(401).send({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = { authenticate };