const esbuild = require('esbuild');
const http = require('http');
const path = require('path');
const fs = require('fs');

const isWatchMode = process.argv.includes('--watch');

// Configuração do esbuild
const esbuildOptions = {
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  define: {
    // A chave API será injetada no build.
    // Para o GitHub Pages, você a definirá como um "Secret" no repositório.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts'
  },
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
};

// Garante que o diretório 'dist' exista
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copia o index.html para o diretório 'dist'
fs.copyFileSync('index.html', 'dist/index.html');

// Função para servir localmente
function serve() {
  http.createServer((req, res) => {
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(__dirname, 'dist', filePath);
    
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      const mimeType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.map': 'application/json'
      }[path.extname(fullPath)] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    });
  }).listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
}

// Executa o build ou inicia o modo de observação
esbuild.build(esbuildOptions).then(() => {
  console.log('Build completo!');
  if (isWatchMode) {
    console.log('Observando mudanças...');
    esbuild.context(esbuildOptions).then(ctx => {
      ctx.watch();
      serve();
    }).catch(() => process.exit(1));
  }
}).catch(() => process.exit(1));
