const http = require ('http')
const app = require('./app')
const port = 3000;

app.set('port', port)
const server = http.createServer(app)

server.listen(port, () => console.log(`Notre application Node est démarée sur : http://localhost:${port}`));