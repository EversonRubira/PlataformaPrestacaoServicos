const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const connection = require('./db'); // Importando a conexão com o MySQL

let services = [];
let idCounter = 1;

const opt = {
    'default': { 'folder': 'www', 'document': 'cadastro.html', 'port': 8081, 'favicon': '' },
    'extensions': {
        'htm': 'text/html; charset=utf-8',
        'html': 'text/html; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'json': 'application/json; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'gif': 'image/gif',
        'jpg': 'image/jpg',
        'png': 'image/png',
        'ico': 'image/x-icon'
    }
};

function mimeType(fileName) {
    let extension = path.extname(fileName);
    extension = (extension[0] == '.') ? extension.slice(1) : extension;
    return opt.extensions[extension];
}

function router(request) {
    let pathname = url.parse(request.url).pathname;
    switch (pathname) {
        case '/': pathname += opt.default.document; break;
        case '/favicon.ico': pathname = opt.default.favicon; break;
    }
    return path.join(__dirname, opt.default.folder, pathname);
}

const handlers = {
    getRequestHandler: (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname === '/listar-servicos') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(services));
            response.end();
        } else if (pathname.startsWith('/editar-servico/')) {
            const id = parseInt(pathname.split('/')[2], 10);
            const service = services.find(service => service.id === id);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(service));
            response.end();
        } else {
            const filename = router(request);
            fs.readFile(filename, (err, data) => {
                if (err) {
                    console.log(err);
                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    response.write('HTTP Status: 404 : NOT FOUND');
                } else {
                    response.writeHead(200, { 'Content-Type': mimeType(filename) });
                    response.write(data);
                }
                response.end();
            });
        }
    },

    postRequestHandler: (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname === '/cadastro') {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const formData = querystring.parse(body);
                response.writeHead(302, { 'Location': '/solicitacao-servico' });
                response.end();
            });
        } else if (pathname === '/solicitacao-servico') {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const formData = querystring.parse(body);
                const newService = {
                    id: idCounter++,
                    servico: formData.servico,
                    profissao: formData.profissao,
                    descricao: formData.descricao,
                    valorProposta: parseFloat(formData.valorProposta)
                };
                // Inserir no banco de dados
                connection.query('INSERT INTO servicos (servico, profissao, descricao, valorProposta) VALUES (?, ?, ?, ?)', 
                    [newService.servico, newService.profissao, newService.descricao, newService.valorProposta], 
                    (error, results, fields) => {
                        if (error) {
                            console.error('Erro ao inserir serviço no banco de dados:', error);
                        } else {
                            console.log('Serviço inserido com sucesso no banco de dados.');
                        }
                    }
                );
                services.push(newService);
                response.writeHead(302, { 'Location': '/agradecimento.html' });
                response.end();
            });
        } else if (pathname.startsWith('/editar-servico/')) {
            const id = parseInt(pathname.split('/')[2], 10);
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const formData = querystring.parse(body);
                const index = services.findIndex(service => service.id === id);
                if (index !== -1) {
                    services[index] = { id, servico: formData.servico, profissao: formData.profissao, descricao: formData.descricao, valorProposta: parseFloat(formData.valorProposta) };
                    // Atualizar no banco de dados
                    connection.query('UPDATE servicos SET servico = ?, profissao = ?, descricao = ?, valorProposta = ? WHERE id = ?', 
                        [formData.servico, formData.profissao, formData.descricao, parseFloat(formData.valorProposta), id], 
                        (error, results, fields) => {
                            if (error) {
                                console.error('Erro ao atualizar serviço no banco de dados:', error);
                                return;
                            }
                            console.log('Serviço atualizado com sucesso no banco de dados.');
                        }
                    );
                }
                response.writeHead(302, { 'Location': '/listar-servicos' });
                response.end();
            });
        } else if (pathname.startsWith('/deletar-servico/')) {
            const id = parseInt(pathname.split('/')[2], 10);
            services = services.filter(service => service.id !== id);
            // Remover do banco de dados
            connection.query('DELETE FROM servicos WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    console.error('Erro ao deletar serviço do banco de dados:', error);
                    return;
                }
                console.log('Serviço deletado com sucesso do banco de dados.');
            });
            response.writeHead(302, { 'Location': '/listar-servicos' });
            response.end();
        }
    }
};

module.exports = handlers;
