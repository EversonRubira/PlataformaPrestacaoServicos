// Importando os módulos necessários
const mysql = require('mysql');
const fs = require('fs');

// Lendo as opções de conexão do arquivo JSON
const rawdata = fs.readFileSync('connection-options.json'); // Leitura síncrona do arquivo de configuração
const connectionOptions = JSON.parse(rawdata); // Parse do conteúdo JSON para um objeto JavaScript

// Criando a conexão com o MySQL
const connection = mysql.createConnection({
    host: connectionOptions.host,
    user: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database
});

// Conectando ao MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conexão bem sucedida ao banco de dados MySQL.');
});

// Exportando a conexão para ser utilizada em outros módulos
module.exports = connection;
