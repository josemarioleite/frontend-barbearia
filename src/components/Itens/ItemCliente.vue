<template>
  <q-dialog v-model="exibeModal" persistent>
      <q-layout view="Lhh lpR fff" container class="bg-dark" style="height: 250px">
          <q-header class="row bg-primary col-12" style="padding: 5px">
              <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
              <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
              <q-btn flat v-close-popup dense icon="close" align="right" />
          </q-header>

          <q-page-container>
              <q-page padding>

                <div class="col-12 row q-mb-sm" style="padding: 0px">
                    <div class="componentsMobile col-md-6 col-xs-12" style="padding-right: 5px">
                        <q-input :error="erroCampoNome" v-model="nomeCliente" class="inputSelect" outlined label="Nome do Cliente" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="person" color="brown"/>
                            </template>
                        </q-input>
                    </div>

                    <div class="componentsMobile col-md-6 col-xs-12" style="padding-right: 5px">
                        <q-input mask="(##)# ####-####" :error="erroCampoTelefone" v-model="telefoneCliente" class="inputSelect"  outlined label="Telefone / Celular" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="tty" color="brown"/>
                            </template>
                        </q-input>
                    </div>
                </div>

              </q-page>
          </q-page-container>

          <q-footer class="transparent">
            <div class="row justify-center q-mb-md">
                <q-btn @click="inserirNovoCliente" icon="save" label="Salvar" color="green" style="border-radius: 5px" />              
                <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fecharModal" style="border-radius: 5px" />
            </div>
          </q-footer>
      </q-layout>
  </q-dialog>
</template>

<script>
import { Post } from 'src/utils/Conexao.js'
import { Cliente } from 'src/models/Clientes/Cliente.js'
export default {
    name: 'ItemCliente',
    data () {
        return {
            exibeModal: false,
            erroCampoNome: false,
            erroCampoTelefone: false,
            tituloModal: '',
            nomeCliente: '',
            telefoneCliente: ''
        }
    },
    methods: {
        confirmacao(mensagem) {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: mensagem,
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        exibeModalCliente(titulo) {
            this.exibeModal = !this.exibeModal
            this.tituloModal = titulo
        },
        fecharModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        limparCampos() {
            this.nomeCliente = null
            this.telefoneCliente = null
        },
        validaCampos() {
            return new Promise((resolve, reject) => {
                var campoVazio = false

                if (this.nomeCliente == '' || this.nomeCliente == null) {
                    this.erroCampoNome = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.telefoneCliente == '' || this.telefoneCliente == null) {
                    this.erroCampoTelefone = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (campoVazio == false) {
                    resolve(true)
                }
            })
        },
        inserirNovoCliente() {
            this.validaCampos().then(() => {
                this.confirmacao('Desejar cadastrar o novo cliente ?').then(() => {
                    this.$q.notify({
                        message: 'Incluindo...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        var cliente = new Cliente()
                        cliente.Nome = this.nomeCliente
                        cliente.TelefoneCelular = this.telefoneCliente
                        Post('v1/cliente', cliente).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 1000
                                })
                                this.fecharModal()
                                this.$emit('atualizaCampo')
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                        }).catch(err => {
                            console.log(err)
                            this.$q.notify({
                                message: 'Não foi possível fazer a inclusão, tente novamente mais tarde',
                                color: 'primary',
                                timeout: 3000
                            })
                        })
                    }, 1000);
                })
            })
        }
    }
}
</script>

<style>
  .inputSelect {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>