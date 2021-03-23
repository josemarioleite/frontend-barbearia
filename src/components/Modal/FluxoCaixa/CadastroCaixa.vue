<template>
    <div class="col-12" style="padding: 5px">
        <div class="col-md-6 row justify-end items-center q-pr-sm q-mb-sm">
            <hr class="bg-primary linhaInclusao">
            <q-btn @click="abreModalCadastro" flat round dense icon="add" color="white" class="bg-primary justify-start" />
        </div>
        <q-list v-for="item in dados" :key="item.id" bordered class="q-mb-xs rounded-borders col-12">
            <q-item clickable v-ripple class="col-12">
                <q-item-section avatar class="col-md-1 col-xs-2">
                    <q-avatar v-if="item.caixaAberto === 'S'" icon="price_check" size="40px" color="green" text-color="white" />
                    <q-avatar v-else icon="payments" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section avatar class="col-md-10 col-xs-8 espacoEntre">
                    <div class="row">
                        <q-item-label lines="1">{{item.nome}}</q-item-label>
                        <div class="row col-12">
                            <!-- <div class="col-9 text-grey-7 espacoTexto">{{item.observacao}}</div> -->
                            <div class="col-9 text-grey-7 espacoTexto" caption v-if="item.updatedAt !== null">Última Abertura: {{new Date(item.updatedAt).toLocaleDateString('pt-BR')}}</div>
                            <div class="col-9 text-grey-7 espacoTexto" caption v-else>Ainda não foi aberto</div>
                        </div>
                    </div>
                </q-item-section>

                <q-item-section side class="col-md-1 col-xs-1">
                    <q-icon v-if="item.caixaAberto === 'S'" name="brightness_1" color="green" right />
                    <q-icon v-else name="brightness_1" color="red" right />
                </q-item-section>
            </q-item>
        </q-list>

        <q-dialog v-model="statusModal">
            <q-card>
                <q-toolbar>
                    <q-toolbar-title>Cadastrar novo caixa</q-toolbar-title>
                    <q-btn @click="fechaModal" flat round dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section>
                    <q-input :error="erroNomeCaixa" :error-message="erroMsgNomeCaixa" outlined v-model="nomeCaixa" label="Nome do caixa" stack-label dense class="q-mb-xs" />
                    <q-input :error="erroObsCaixa" :error-message="erroMsgObsCaixa" outlined v-model="observacaoCaixa" label="Observação" stack-label dense class="q-mb-sm" />
                    <div class="column items-center">
                        <q-btn @click="salvaNovoCaixa" align="center" color="green" icon="add" label="Salvar" size="12px" />
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { Get, Post } from 'src/utils/Conexao.js'

export default {
    name: 'Cadastro-Caixa',
    data () {
        return {
            statusModal: false,
            erroNomeCaixa: false,
            erroObsCaixa: false,
            erroMsgNomeCaixa: '',
            erroMsgObsCaixa: '',
            nomeCaixa: '',
            observacaoCaixa: '',
            dados: []
        }
    },
    methods: {
        abreModalCadastro() {
            this.statusModal = !this.statusModal
        },
        fechaModal() {
            this.statusModal = !this.statusModal
            this.nomeCaixa = null
            this.observacaoCaixa = null
        },
        obterCaixas() {
            Get('v1/caixaoperador').then(res => {
                if (parseInt(res.status) === 200) {
                    this.dados = res.data
                } else {
                    this.$q.notify({
                        message: 'Não foi possível obter dados dos caixas',
                        type: 'negative',
                        timeout: 2000
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$q.notify({
                    message: 'Erro ao obter dados do Caixa',
                    type: 'negative',
                    timeout: 2000
                })
            })
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
                var texto = 'Este campo é obrigatório preencher'

                if (this.nomeCaixa === '' || this.nomeCaixa === null) {
                    this.erroNomeCaixa = true
                    this.erroMsgNomeCaixa = texto
                    campoVazio = true
                } else {
                    this.erroNomeCaixa = false
                }

                if (this.observacaoCaixa === '' || this.observacaoCaixa === null) {
                    this.erroObsCaixa = true
                    this.erroMsgObsCaixa = texto
                    campoVazio = true
                } else {
                    this.erroObsCaixa = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        salvaNovoCaixa() {
            this.validaCampos().then(() => {
                this.confirmacao('Deseja incluir este novo caixa ?').then(() => {
                    var caixa = Object()
                    caixa.Nome = this.nomeCaixa
                    caixa.Observacao = this.observacaoCaixa

                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'blue',
                        timeout: 1000
                    })

                    setTimeout(() => {
                        Post('v1/caixaoperador/cadastro', caixa).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.fechaModal()
                                this.obterCaixas()
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                        }).catch(err => {
                            this.$q.notify({
                                message: 'Erro',
                                caption: 'Não foi possível fazer inclusão, tente novamente mais tarde',
                                color: 'red'
                            })
                            console.log(err)
                        })
                    }, 1000);
                })
            })
        }
    },
    created() {
        this.obterCaixas()
    }
}
</script>

<style>
.espacoEntre {
    padding-left: 20px;
}

.espacoTexto {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-size: 12px;
}

.linhaInclusao {
    width: 85%;
}

@media only screen and (max-width: 599px) {
    .espacoEntre {
        padding: 1px;
    }

    .linhaInclusao {
        display: none;
    }
}
</style>