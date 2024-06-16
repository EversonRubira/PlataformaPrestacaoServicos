
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// Configurações do servidor
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

let services = [];
let idCounter = 1;

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

const server = http.createServer((request, response) => {
    console.log(`Request for ${request.url} received.`);
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    if (request.method === 'GET') {
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
    } else if (request.method === 'POST') {
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
                    nome: formData.nome,
                    servico: formData.servico
                };
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
                    services[index] = { id, nome: formData.nome, servico: formData.servico };
                }
                response.writeHead(302, { 'Location': '/listar-servicos' });
                response.end();
            });
        } else if (pathname.startsWith('/deletar-servico/')) {
            const id = parseInt(pathname.split('/')[2], 10);
            services = services.filter(service => service.id !== id);
            response.writeHead(302, { 'Location': '/listar-servicos' });
            response.end();
        }
    }
});

server.listen(opt.default.port, () => {
    console.log(`Rodando na porta ${opt.default.port}`);
});
