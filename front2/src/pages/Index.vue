<template>
  <div class="q-pa-md align-center" style="margin:0 auto;">
    <div class="q-gutter-y-md">
      <div class="row">
        <div style="padding:10px;" class="col-6">
          <q-input filled label="Tarefa" v-model="tarefa" />
        </div>
        <div style="padding:10px;" class="col-6">
          <q-input filled label="Responsável" v-model="responsavel" />
        </div>
      </div>
      <div class="row">
        <div style="padding:10px;" class="col-12">
          <q-input type="textarea" filled label="Descrição" v-model="descricao" />
        </div>
      </div>
      <div class="row text-right">
        <div class="col-12 ">
          <q-btn style="margin:10px;" label="Adicionar Tarefa" @click="adicionarTarefa()" color="primary" icon="done" />
        </div>
      </div>
      <div class="row">
        <q-card style="margin:10px;" v-for="(tarefa,index) in tarefas" :key="index" class="my-card">
          <q-card-section>
            <div class="text-h6">{{tarefa.tarefa}}</div>
            <div class="text-subtitle2">{{tarefa.responsavel}}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <p>{{tarefa.descricao}}</p>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-btn size="sm" color="red" round dense icon="delete_forever" @click="excluirTarefa(tarefa._id)"></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'
var socket = io('http://localhost:8000')
export default {
  components: {
  },

  data () {
    return {
      tarefa: '',
      responsavel: '',
      descricao: '',
      url: 'http://localhost:8000/api/tarefas',
      tarefas: []
    }
  },
  mounted () {
    this.buscarTarefas()
    socket.on('novaTarefa', () => {
      console.log('entrou')
      this.buscarTarefas()
    })
    socket.on('excluiTarefa', () => {
      this.buscarTarefas()
    })
  },
  methods: {
    adicionarTarefa () {
      var tarefas = {
        tarefa: this.tarefa,
        responsavel: this.responsavel,
        descricao: this.descricao
      }
      console.log(tarefas)
      axios.post(this.url, tarefas, { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer 3b093c6480e1f9123a4145cbdd58fbbf' } })
        .then((r) => {
          console.log(r)
        }).catch((e) => {
          console.log(e)
        })
    },
    buscarTarefas () {
      axios.get(this.url, { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer 3b093c6480e1f9123a4145cbdd58fbbf' } })
        .then((r) => {
          this.tarefas = r.data
        }).catch((e) => {
          console.log(e)
        })
    },
    excluirTarefa (id) {
      axios.delete(`${this.url}/${id}`, { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer 3b093c6480e1f9123a4145cbdd58fbbf' } })
        .then((r) => {
          console.log(r)
        }).catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
<style scoped>
  .my-card {
    width: 100%;
    max-width: 250px;
  }
</style>
