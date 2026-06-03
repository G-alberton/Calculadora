/*Conexão com o Banco de Dados*/
//arrumar aqui depois para arrumar o ssl sem verificação de certificado, lembra de ver se eu ja arrumei a env exemplo
const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env')
});

if (!process.env.DATABASE_URL) {
  console.error('ERRO: DATABASE_URL não encontrada no .env');
  process.exit(1);
}

const isSupabase = process.env.DATABASE_URL.includes('supabase.com');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase
    ? {
        // rejectUnauthorized: true valida o certificado SSL do servidor.
        // Se necessário, forneça o CA do Supabase via DATABASE_CA_CERT no .env.
        rejectUnauthorized: true,
        ...(process.env.DATABASE_CA_CERT
          ? { ca: process.env.DATABASE_CA_CERT }
          : {}),
      }
    : false,
});

module.exports = pool;