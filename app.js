const express = require('express');
const session = require('express-session');
const passport = require('./passport-mysql');
const bodyParser = require('body-parser');
const authRoutes = require('./routes'); // Certifique-se de que o caminho para 'routes' esteja correto
const http = require('http');
const handler = require('./handler'); // Importando o handler
const opt = {
    'default': { 'folder': 'www', 'document': 'cadastro.html', 'port': 8081, 'favicon': '' }
};

const app = express();

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Inicialização do Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Rotas de autenticação
app.use('/authentication', authRoutes);

// Página inicial
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Página de dashboard protegida
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Bem-vindo ao seu dashboard');
    } else {
        res.redirect('/login');
    }
});

// Criação do servidor HTTP
const server = http.createServer((request, response) => {
    console.log(`Request for ${request.url} received.`);

    if (request.method === 'GET') {
        handler.getRequestHandler(request, response);
    } else if (request.method === 'POST') {
        handler.postRequestHandler(request, response);
    }
});

server.listen(opt.default.port, () => {
    console.log(`Rodando na porta ${opt.default.port}`);
});
