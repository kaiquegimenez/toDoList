var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var TarefaSchema = new Schema({
    tarefa: String,
    descricao: String,
    responsavel: String
});
 
module.exports = mongoose.model('Tarefa', TarefaSchema);
