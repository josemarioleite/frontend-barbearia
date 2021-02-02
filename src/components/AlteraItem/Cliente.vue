<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="modal bg-brown">
            <q-header class="row bg-dark" style="padding: 5px">
                <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
                <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
                <q-btn flat v-close-popup dense icon="close" align="right" />
            </q-header>

            <q-page-container class="row col-12" style="margin: 15px">
                <div class="col-md-3 col-xs-12" style="padding: 5px">
                    <q-input readonly color="brown" bg-color="white" filled v-model="idCliente" label="ID">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                    </q-input>
                </div>
                <div class="col-md-9 col-xs-12" style="padding: 5px">
                    <q-input color="brown" bg-color="white" filled v-model="nomeCliente" label="Nome do Cliente">
                        <template v-slot:prepend>
                            <q-icon name="person" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="modalAlteracao == true" name="close" @click="nomeCliente = ''" />
                        </template>
                    </q-input>
                </div>
                <div class="col-12" style="padding: 5px">
                    <q-input :mask="mascaraTelefone" onkeypress="return event.charCode >= 48 && event.charCode <= 57" color="black" bg-color="white" filled v-model="telefoneCliente" label="Celular / Telefone">
                        <template v-slot:prepend>
                            <q-icon name="local_phone" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="modalAlteracao == true" name="close" @click="telefoneCliente = ''" />
                        </template>
                    </q-input>
                </div>
            </q-page-container>

            <q-footer class="transparent q-mb-sm">
                <div class="row justify-center">
                    <q-btn v-show="modalInclusao" icon="save" label="Salvar" color="green" @click="cadastraCliente" />
                    <q-btn v-show="modalAlteracao" icon="save" label="Alterar" color="green" @click="alterarCliente" />
                    <q-btn v-show="modalReativacao" icon="autorenew" label="Reativar" color="green" @click="reativarCliente"  />
                    <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fechaModal" />
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Cliente } from '../../models/Clientes/Cliente.js'
import { AlterarCliente } from '../../models/Clientes/AlterarCliente.js'
import { Post, Put, Patch } from '../../utils/Conexao.js'
export default {
  name: 'Item-Cliente',
  data () {
    return {
       exibeModal: false,
       modalInclusao: false,
       modalAlteracao: false,
       modalExclusao: false,
       modalReativacao: false,
       erroNome: false,
       erroTelefone: false,
       erroMsgNome: '',
       erroMsgTelefone: '',
       tituloModal: '',
       mascaraTelefone: '(##)#####-####',
       idCliente: '',
       nomeCliente: '',
       telefoneCliente: ''
    }
  },
  methods: {
    exibirModalAlteracao(tituloModal, dados) {
        this.idCliente = dados.id
        this.nomeCliente = dados.nome
        this.telefoneCliente = dados.telefoneCelular
        this.exibeModal = !this.exibeModal
        this.tituloModal = tituloModal
        this.modalInclusao = false
        this.modalReativacao = false
        this.modalAlteracao = true
    },
    exibirModalExclusao(tituloModal, dados) {
        this.idCliente = dados.id
        this.nomeCliente = dados.nome
        this.telefoneCliente = dados.telefoneCelular
        this.exibeModal = !this.exibeModal
        this.tituloModal = tituloModal
        this.modalInclusao = false
        this.modalAlteracao = false
        this.modalExclusao = true
        this.modalReativacao = false
    },
    exibirModalReativacao(tituloModal, dados) {
        this.idCliente = dados.id
        this.nomeCliente = dados.nome
        this.telefoneCliente = dados.telefoneCelular
        this.exibeModal = !this.exibeModal
        this.tituloModal = tituloModal
        this.modalInclusao = false
        this.modalAlteracao = false
        this.modalExclusao = false
        this.modalReativacao = true
    },
    limparCampos() {
        this.idCliente = ''
        this.nomeCliente = ''
        this.telefoneCliente = ''
    },
    fechaModal() {
        this.exibeModal = !this.exibeModal
        this.limparCampos()
    },
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
    validaCampos() {
        return new Promise(resolve => {
            var campoVazio = false

            if (this.nomeCliente === '' || this.nomeCliente === null) {
                this.erroNome = true
                this.erroMsgNome = 'O Campo "Nome" é obrigatório!'
                campoVazio = true
            } else {
                this.erroNome = false
                campoVazio = false
            }

            if (this.telefoneCliente === '' || this.telefoneCliente === null) {
                this.erroTelefone = true
                this.erroMsgTelefone = 'O Campo "Telefone/Celular" é obrigatório!'
                campoVazio = true
            } else {
                this.erroTelefone = false
                campoVazio = false
            }

            if (campoVazio === false) {
                resolve(true)
            }
        })
    },
    cadastraCliente() {
        const cliente = new Cliente()
        cliente.Nome = this.nomeCliente
        cliente.TelefoneCelular = this.telefoneCliente
        this.$q.notify({
            message: 'Carregando...',
            color: 'blue',
            timeout: 2000
        })
        setTimeout(() => {
            Post('v1/cliente', cliente).then(res => {
                this.$q.notify({
                    message: res.data.msg,
                    color: 'green'
                })
            this.fechaModal()
            this.limparCampos()
            this.$emit('atualizaGrade')
            }).catch(err => {
                console.log(err)
                this.$q.notify({
                    message: 'Erro',
                    caption: 'Não foi possível incluir novo cliente, verifique novamente',
                    color: 'red'
                })
            })
        }, 2000)
    },
    alterarCliente() {
        const cliente = new AlterarCliente()
        cliente.Id = this.idCliente
        cliente.Nome = this.nomeCliente
        cliente.TelefoneCelular = this.telefoneCliente
        this.$q.notify({
            message: 'Carregando...',
            color: 'blue',
            timeout: 2000
        })
        setTimeout(() => {
            Put('v1/cliente/' + this.idCliente, cliente).then(res => {
                console.log(cliente)
                this.$q.notify({
                    message: res.data.msg,
                    color: 'green'
                })
                this.fechaModal()
                this.limparCampos()
                this.$emit('atualizaGrade')
            }).catch(err => {
                this.$q.notify({
                    message: 'Erro',
                    caption: 'Não foi possível fazer alteração',
                    color: 'red'
                })
                console.log(err)
            })
        }, 2000)
    },
    reativarCliente() {
        const cliente = this.idCliente
        this.confirmacao('Tem certeza que deseja reativar o cliente ?').then(() => {
            this.$q.notify({
                message: 'Carregando...',
                color: 'blue',
                timeout: 2000
            })
            setTimeout(() => {
                Patch('v1/cliente/' + cliente).then(res => {
                    this.$q.notify({
                        message: 'O Cliente foi reativado com sucesso',
                        color: 'green'
                    })
                    this.fechaModal()
                    this.limparCampos()
                    this.$emit('atualizaGrade')
                }).catch(err => {
                    this.$q.notify({
                        message: 'Erro',
                        caption: 'Não foi possível fazer reativação',
                        color: 'red'
                    })
                    console.log(err)
                })
            }, 2000)
        })
    }
  }
}
</script>

<style scoped>
    .modal {
        border: 1px solid #000;
        border-radius: 10px;
        height: 450px;
    }

    @media only screen and (min-width: 500px) {
        .modal {
            height: 350px;
            width: 450px;
        }
    }

    @media only screen and (max-width: 499px) {
        .modal {
            height: 350px;
        }
    }
</style>
