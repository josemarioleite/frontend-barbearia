<template>
    <q-dialog v-model="statusModalCadastro">
        <q-card>
            <q-toolbar>
                <q-toolbar-title>Cadastrar novo caixa</q-toolbar-title>
                <q-btn @click="fechaModalCadastro" flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
                <q-input :error="erroNomeCaixa" :error-message="erroMsgNomeCaixa" outlined v-model="nomeCaixa" label="Nome do caixa" stack-label dense class="q-mb-xs" />
                <q-input outlined v-model="observacaoCaixa" label="Observação" stack-label dense class="q-mb-sm" />
                <div class="column items-center">
                    <q-btn v-show="abreModalAlteracao === false" @click="salvaNovoCaixa" align="center" color="green" icon="add" label="Salvar" size="12px" />
                    <q-btn v-show="abreModalAlteracao === true" @click="alteraCaixa" align="center" color="green" icon="add" label="Alterar" size="12px" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { Post, Put } from 'src/utils/Conexao.js'

export default {
    name: 'Caixa',
    data () {
        return {
            abreModalAlteracao: false,
            statusModalCadastro: false,            
            erroNomeCaixa: false,
            caixaId: 0,
            erroMsgNomeCaixa: '',
            nomeCaixa: null,
            observacaoCaixa: 'S/ Observação'
        }
    },
    methods: {
        abreModalCadastro() {
            this.statusModalCadastro = !this.statusModalCadastro
        },
        abreModalAtualizaCaixa(dados) {
            this.statusModalCadastro = !this.statusModalCadastro
            this.abreModalAlteracao = true
            this.caixaId = dados.id
            this.nomeCaixa = dados.nome
            this.observacaoCaixa = dados.observacao
        },
        fechaModalCadastro() {
            this.abreModalAlteracao = false
            this.statusModalCadastro = !this.statusModalCadastro
            this.limpaCampos()            
        },
        limpaCampos() {
            this.CaixaId = 0
            this.nomeCaixa = null
            this.observacaoCaixa = null
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

                if (campoVazio === false) {
                    resolve(true)
                }
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
        salvaNovoCaixa() {
            this.validaCampos().then(() => {
                this.confirmacao('Deseja incluir este novo caixa ?').then(() => {
                    let caixa = Object()
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
                                this.fechaModalCadastro()
                                this.$emit('atualizaGrade')
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
        },
        alteraCaixa() {
            this.validaCampos().then(() => {
                this.confirmacao('Deseja alterar esse caixa ?').then(() => {
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'blue',
                        timeout: 2000
                    })

                    let alteraCaixa = Object()
                    alteraCaixa.Id = this.caixaId
                    alteraCaixa.Nome = this.nomeCaixa
                    alteraCaixa.Observacao = this.observacaoCaixa

                    setTimeout(() => {
                        Put('v1/caixaoperador/alteracao/' + this.caixaId, alteraCaixa).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.fechaModalCadastro()
                                this.$emit('atualizaGrade')
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
                    }, 1500);
                })
            })
        }
    }
}
</script>

<style>

</style>