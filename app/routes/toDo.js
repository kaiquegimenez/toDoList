var express = require('express')
var Tarefa = require('../models/tarefas')
var router  = express.Router()
var app = express()
var cors = require('cors')

app.use(cors())

// TODO - Definir futuras rotas aqui!
router.route('/tarefas')
   
// Método criar Tarefa (acessar em: POST http://localhost:8080/api/tarefas
.post((req, res) => {
  var tarefa = new Tarefa()
  var io = req.app.get('io')
  //aqui seta os campos da tarefa (que virá do request)
  tarefa.tarefa = req.body.tarefa
  tarefa.descricao = req.body.descricao
  tarefa.responsavel = req.body.responsavel
  tarefa.save()
  .then(() => {
    io.emit('novaTarefa')
    res.json({ message: 'Tarefa criada!' })
  }).catch((e) =>{
    res.send(e)
  })
})
.get((req, res) => {
// Função para Selecionar Todas as 'tarefas' e verificar se há algum erro:
  Tarefa.find((err, tarefas) => {
    if(err)
      res.send(err)
    res.json(tarefas)
  })
})

router.route('/tarefas/:tarefa_id')
 
// Método selecionar por Id (acessar em: GET http://localhost:8080/api/tarefas/:tarefa_id)
.get((req, res) => {
  // Função para Selecionar por Id e verificar se há algum erro:
  Tarefa.findById(req.params.tarefa_id, (error, tarefa) => {
    if(error)
      res.send(error)
    res.json(tarefa)
  })
})

// Método alterar uma tarefa
.put(function(req, res) {
  // Primeiro: Para atualizar, precisa primeiro achar a tarefa selecionando pelo id:
  Tarefa.findById(req.params.tarefa_id, (error, tarefa) => {
    if(error)
      res.send(error)
    // Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
    tarefa.tarefa = req.headers.tarefa
    tarefa.descricao = req.headers.descricao
    tarefa.responsavel = req.headers.responsavel

    // Terceiro: Agora que os campos já foram atualizados, precisamos salvar essa alteração....
    tarefa.save((error) => {
      if(error)
        res.send(error)
      res.json({ message: 'Tarefa Atualizada!' })
    })
  })
})
// Método excluir (acessar em: http://localhost:8080/api/tarefas/:tarefa_id)
.delete((req, res) => {
  var io = req.app.get('io')
  // Função para excluir os dados e também verificar se há algum erro no momento da exclusão:
  Tarefa.remove({
  _id: req.params.tarefa_id
  }, (error) => {
      if(error)
        res.send(error)
      io.emit('excluiTarefa')
      res.json({ message: 'Tarefa excluída com Sucesso! '})
  })
})
module.exports = router