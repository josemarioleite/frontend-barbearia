<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="modal bg-brown">
            <q-header class="row bg-dark" style="padding: 5px">
                <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
                <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
                <q-btn flat v-close-popup dense icon="close" align="right" />
            </q-header>

            <q-page-container class="row col-12" style="margin: 15px">

                <div class="col-md-2 col-xs-12 inputID">
                    <q-input readonly color="brown" bg-color="white" filled v-model="idProduto" label="ID">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                    </q-input>
                </div>

                <q-space />

                <div class="col-md-6 col-xs-12 inputNome">
                    <q-input @click="focusNomeProduto" :error="erroNomeProduto" :error-message="erroMsgNomeProduto" :readonly="somenteLeitura" color="brown" bg-color="white" filled v-model="nomeProduto" label="Nome do Produto">
                        <template v-slot:prepend>
                            <q-icon name="inventory" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="nomeProduto = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-4 col-xs-12 inputValor">
                    <q-input prefix="R$" reverse-fill-mask mask="#.##" @click="focusValorProduto" :error="erroValorProduto" :error-message="erroMsgValorProduto" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="valorProduto" label="Valor R$">
                        <template v-slot:prepend>
                            <q-icon name="attach_money" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="valorProduto = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-6 col-xs-12 inputComissaoPorcentagem">
                    <q-select :error="erroCampoComissaoPorcentagem" :error-message="erroMsgComissaoPorcentagem" class="" color="dark" label-color="dark" bg-color="white" v-model="opcaoSelecionado" option-label="label" option-value="value" :options="opcoes" filled label="Comissão / Porcentagem">
                        <template v-slot:prepend>
                            <q-icon name="price_check" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="opcaoSelecionado = null" />
                        </template>
                    </q-select>
                </div>

                <q-space />

                <div class="col-md-6 col-xs-12 inputValorComissaoPorcentagem">
                    <q-input @click="valorComissaoPorcentagem = ''" mask="#.##" prefix="R$" suffix="%" reverse-fill-mask :error="erroCampoValorComissaoPorcentagem" :error-message="erroMsgValorComissaoPorcentagem" v-model="valorComissaoPorcentagem" class="col-md-3 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Valor Comis./Porc.">
                        <template v-slot:prepend>
                            <q-icon name="attach_money" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="valorComissaoPorcentagem = ''" />
                        </template>
                    </q-input>
                </div>
            </q-page-container>

            <div class="row justify-center">
                <q-btn v-show="modalAlteracao == true" icon="save" label="Alterar" color="green" @click="alteraItemSelecionado" />
                <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fechaModal" /> 
            </div>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Delete, Put } from 'src/utils/Conexao.js'

export default {
    name: 'ItemProduto',
    data () {
        return {
            exibeModal: false,
            somenteLeitura: false,
            modalAlteracao: false,
            erroNomeProduto: false,
            erroValorProduto: false,
            erroCampoComissaoPorcentagem: false,
            erroCampoValorComissaoPorcentagem: false,
            valorComissaoPorcentagem: '',
            erroMsgValorComissaoPorcentagem: '',
            erroMsgComissaoPorcentagem: '',
            erroMsgNomeProduto: '',
            erroMsgValorProduto: '',
            idProduto: '',
            nomeProduto: '',
            valorProduto: '',
            tituloModal: '',
            opcaoSelecionado: '',
            opcoes: [
                {value: 'P', label: 'Porcentagem'},
                {value: 'C', label: 'Comissão'},
            ],
        }
    },
    methods: {
        fechaModal() {
            this.exibeModal = !this.exibeModal
        },
        abreModalAlteracao(tituloModal, dados) {
            this.somenteLeitura = false
            this.modalAlteracao = true
            this.exibeModal = !this.exibeModal
            this.tituloModal = tituloModal
            this.idProduto = dados.id
            this.nomeProduto = dados.nome
            this.valorProduto = dados.valor.toFixed(2)
            this.valorComissaoPorcentagem = dados.valorPorcentagemComissao.toFixed(2)
            this.opcaoSelecionado = dados.porcentagemComissao === 'C' ? 'Comissão' : 'Porcentagem'
        },
        confirmacao(msg) {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: `Tem certeza que deseja ${msg} este Produto ?`,
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        focusNomeProduto() {
            if (this.modalAlteracao === false) {
                this.nomeProduto = this.nomeProduto
            } else {
                this.nomeProduto = null
            }
        },
        focusValorProduto() {
            if (this.modalAlteracao === false) {
                this.valorProduto = this.valorProduto
            } else {
                this.valorProduto = null
            }
        },
        limparCampos() {
            this.idProduto = null
            this.nomeProduto = null
            this.valorProduto = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.nomeProduto === '' || this.nomeProduto === null) {
                    this.erroNomeProduto = true
                    this.erroMsgNomeProduto = 'O campo "Nome" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroNomeProduto = false
                    campoVazio = false
                }

                if (this.valorProduto === '' || this.valorProduto === null) {
                    this.erroValorProduto = true
                    this.erroMsgValorProduto = 'O campo "Valor" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroValorProduto = false
                    campoVazio = false
                }

                if (this.opcaoSelecionado === '' || this.opcaoSelecionado === null) {
                    this.erroCampoComissaoPorcentagem = true
                    this.erroMsgComissaoPorcentagem = 'O Campo "Comissão/Porcentagem" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoComissaoPorcentagem = false
                    campoVazio = false
                }

                if (this.valorComissaoPorcentagem === '' || this.valorComissaoPorcentagem === null) {
                    this.erroCampoValorComissaoPorcentagem = true
                    this.erroMsgValorComissaoPorcentagem = 'O Campo "Valor Comissão/Porcentagem" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoValorComissaoPorcentagem = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        deletaItemSelecionado() {
            this.confirmacao('excluir').then(() => {
                this.$q.notify({
                    message: 'Deletando...',
                    color: 'primary',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/produto/' + parseInt(this.idProduto)).then(res => {
                        if (res.data.status == true) {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'green',
                                timeout: 2000
                            })
                        } else {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'red',
                                timeout: 2000
                            })
                        }
                        this.limparCampos()
                        this.fechaModal()
                        this.$emit('atualizaTabela')
                    }).catch(err => {
                        this.$q.notify({
                            message: 'Erro ao deletar produto, tente novamente mais tarde',
                            color: 'red',
                            timeout: 2000
                        })
                    })
                }, 1000)
            })
        },
        alteraItemSelecionado() {
            this.validaCampos().then(() => {
                this.confirmacao('alterar').then(() => {
                    var alteraProduto = Object()
                    alteraProduto.Id = parseInt(this.idProduto)
                    alteraProduto.Nome = this.nomeProduto
                    alteraProduto.Valor = parseFloat(this.valorProduto)
                    alteraProduto.PorcentagemComissao = this.opcaoSelecionado.value.toUpperCase()
                    alteraProduto.ValorPorcentagemComissao = parseFloat(this.valorComissaoPorcentagem)
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        Put('v1/produto/' + parseInt(this.idProduto), alteraProduto).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                            this.limparCampos()
                            this.fechaModal()
                            this.$emit('atualizaTabela')
                        }).catch(err => {
                            console.log(err)
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

<style scoped>
    .modal {
        border: 1px solid #000;
        border-radius: 10px;
        height: 300px;
    }

    .inputID, .inputNome, .inputValor, .inputComissaoPorcentagem, .inputValorComissaoPorcentagem {
        padding: 5px;
    }

    @media only screen and (max-width: 450px) {
        .inputID {
            margin-bottom: 20px;
        }

        .inputID, .inputNome, .inputValor, .inputComissaoPorcentagem, .inputValorComissaoPorcentagem {
            padding: 0px;
        }

        .modal {
            border: 1px solid #000;
            border-radius: 10px;
            height: 510px;
        }
    }
</style>