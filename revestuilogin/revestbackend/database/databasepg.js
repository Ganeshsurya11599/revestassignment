const { Client } = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'postgres',
    port: '5432',
    password: '123456',
    database: 'postgres'
})

client.connect();

module.exports = client;