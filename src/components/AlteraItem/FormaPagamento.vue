<template>
  <q-dialog v-model="exibeModal" persistent>
    <q-layout view="Lhh lpR fff" container class="bg-brown" style="height: 230px">
        <q-header class="row bg-dark" style="padding: 5px">
            <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
            <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
            <q-btn flat v-close-popup dense icon="close" align="right" />
        </q-header>

        <q-page-container class="row col-12">
            <q-page padding class="row">
                <div class="col-md-2 col-xs-12" style="padding: 5px">
                    <q-input readonly color="brown" bg-color="white" filled v-model="formaPagamentoID" label="ID">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-6 col-xs-12" style="padding: 5px">
                    <q-input :error="erroDescricao" :error-message="erroMSGDescricao" color="brown" bg-color="white" filled v-model="descricaoFormaPagamento" label="Descrição">
                        <template v-slot:prepend>
                            <q-icon name="credit_card" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="descricaoFormaPagamento = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-4 col-xs-12" style="padding: 5px">
                    <q-input :error="erroTituloFormaPagamento" :error-message="erroMSGTituloFormaPagamento" color="black" bg-color="white" filled v-model="tituloFormaPagamento" label="Título">
                        <template v-slot:prepend>
                            <q-icon name="request_quote" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="tituloFormaPagamento = ''" />
                        </template>
                    </q-input>
                </div>
            </q-page>
        </q-page-container>

        <q-footer class="transparent q-mb-sm">
            <div class="row justify-center">
                <q-btn @click="alterarFormaPagamento" icon="save" label="Alterar" color="green" />
                <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fecharModal" /> 
            </div>
        </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { Put } from 'src/utils/Conexao.js'
import { FormaPagamentoAlterar } from 'src/models/FormasPagamento/FormaPagamento.js'

export default {
    name: 'Forma_Pagamento',
    data () {
        return {
            exibeModal: false,
            somenteLeitura: false,
            erroDescricao: false,
            erroTituloFormaPagamento: false,
            erroMSGDescricao: '',
            erroMSGTituloFormaPagamento: '',
            formaPagamentoID: '',
            descricaoFormaPagamento: '',
            tituloFormaPagamento: '',
            tituloModal: ''
        }
    },
    methods: {
        exibeModalFormaPagamento(tituloModal, dados) {
            this.exibeModal = !this.exibeModal
            this.tituloModal = tituloModal
            this.formaPagamentoID = dados.id
            this.descricaoFormaPagamento = dados.descricao
            this.tituloFormaPagamento = dados.titulo
        },
        confirmacao(mensagem) {
            return new Promise((resolve) => {
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

                if (this.descricaoFormaPagamento === '' || this.descricaoFormaPagamento === null) {
                    this.erroDescricao = true
                    this.erroMSGDescricao = 'O Campo "Descrição" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroDescricao = false
                    campoVazio = false
                }

                if (this.tituloFormaPagamento === '' || this.tituloFormaPagamento === null) {
                    this.erroTituloFormaPagamento = true
                    this.erroMSGTituloFormaPagamento = 'O Campo "Valor" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroTituloFormaPagamento = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        fecharModal() {
            this.exibeModal = !this.exibeModal
        },
        limparCampos() {
            this.descricaoFormaPagamento = null
            this.tituloFormaPagamento = null
            this.formaPagamentoID = null
        },
        alterarFormaPagamento() {
            this.confirmacao('Deseja fazer a alteração da Forma de Pagamento ?').then(() => {
                this.validaCampos().then(() => {
                    this.$q.notify({
                        message: 'Alterando...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        var formaPagamento = new FormaPagamentoAlterar()
                        var id = this.formaPagamentoID
                        var titulo = this.tituloFormaPagamento
                        formaPagamento.Id = parseInt(id)
                        formaPagamento.Descricao = this.descricaoFormaPagamento
                        formaPagamento.Titulo = titulo.toUpperCase()
                        Put('v1/formapagamento/' + this.formaPagamentoID, formaPagamento).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.limparCampos()
                                this.fecharModal()
                                this.$emit('atualizaTabela')
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                        }).catch(err => {
                            console.log(err.message)
                            this.$q.notify({
                                message: 'Erro ao fazer alteração, tente novamente mais tarde',
                                color: 'red',
                                timeout: 2000
                            })
                        })
                    }, 1000)
                })
            })
        }
    }
}
</script>