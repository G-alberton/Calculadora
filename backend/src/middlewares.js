
async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply
    return reply.status(401).send({
    message: "token inválido ou expirado" 
    });
}
}

module.exports = {
    authenticate,
};
