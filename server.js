var express     = require('express')
var app         = express()
var http = require('http')
var bodyParser  = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var cors = require('cors')
var socketIO = require('socket.io')
toDoRoutes = require('./app/routes/toDo')
/** Configuração da variável 'app' para usar o 'bodyParser()'.
    Ao fazermos isso nos permitirá retornar os dados a partir de um POST
*/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017', { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db){
  if(err){
    throw err
  }
  console.log('Conectado ao MongoDb...')
})

var server = http.createServer(app)
var io = socketIO(server)
app.set('io', io)

// Definição da porta onde será executada a aplicação
var port = process.env.PORT || 8000

// Aqui o 'router' irá pegar as instâncias das Rotas do Express
var router  = express.Router()

// Middleware para usar em todos os requests enviados para a API- Faz a verificação do token
router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const authHeader = req.headers.authorization
  console.log(authHeader)
  if(!authHeader)
    return res.status(401).send({ error: 'No token provided' })
  const parts = authHeader.split(' ')
  if(!parts.length === 2)
    return res.status(401).send({ error: 'Token error' })
  const [ scheme, token ] = parts
  if(!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted'})
  jwt.verify(token, '3b093c6480e1f9123a4145cbdd58fbbf', (err, decoded) => {
    console.log('Algo está acontecendo aqui..')
    return next() // aqui é para sinalizar de que ira para a próxima rota. E que não irá parar por aqui.

  })
})

// Todas as nossas rotas serão prefixadas com '/api'
app.use('/api', toDoRoutes)
 
// Iniciando o Servidor (Aplicação):
server.listen(port)
console.log('Iniciando a aplicação na porta ' + port)
 