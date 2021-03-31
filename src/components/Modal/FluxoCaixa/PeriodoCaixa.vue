<template>
    <div>
        <q-dialog v-model="statusModal" persistent>
            <q-layout view="hHh Lpr lff" container :style="styleModal" class="shadow-2 bg-white rounded-borders">
                <q-header elevated class="bg-green-9">
                    <q-toolbar>
                        <q-toolbar-title>{{tituloModal}}</q-toolbar-title>
                        <q-btn @click="fechaModal" flat dense icon="close" align="right" />
                    </q-toolbar>
                </q-header>

                <q-page-container>
                    <q-page style="padding: 10px">
                        <q-input v-show="fechamentoCaixa === false" readonly outlined color="dark" filled label="Data de Abertura" label-color="primary" v-model="dataAbertura" class="q-mb-md text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly outlined color="dark" filled label="Data de Fechamento" label-color="primary" v-model="dataFechamento" class="q-mb-md text-green" />
                        <q-input v-show="fechamentoCaixa === false" readonly outlined color="dark" filled label="Usuário de Abertura" label-color="primary" v-model="usuario.Usuario" class="q-mb-md text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly outlined color="dark" filled label="Usuário de Fechamento" label-color="primary" v-model="usuario.Usuario" class="q-mb-md text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly v-model="valorSaldo" mask="#.##" reverse-fill-mask color="primary" label-color="primary" filled label="Saldo" prefix="R$" class="q-mb-md" />
                        <q-input :error="erroValorTroco" :error-message="msgValorTroco" v-show="fechamentoCaixa === false" v-model="valorTroco" mask="#.##" fill-mask="0" reverse-fill-mask color="green" filled label="Valor de Troco" prefix="R$">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="valorTroco = NaN" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <q-input v-show="fechamentoCaixa === true" v-model="valorSangria" mask="#.##" fill-mask="0" reverse-fill-mask color="green" filled label="Valor Sangria" prefix="R$" class="q-mb-md">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="valorSangria = null" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <q-input v-model="observacao" color="green" filled label="Observação" :rules="[ val => val.length <= 300 || 'O número máximo de caracteres é: 50']" style="margin-top: 5px">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="observacao = ''" class="cursor-pointer" />
                            </template>
                        </q-input>

                        <div class="column items-center q-mt-xs">
                            <div class="row">
                                <q-btn @click="inserePeriodoCaixa" v-show="fechamentoCaixa === false" rounded align="center" label="Abrir Caixa" size="12px" color="green-9" icon="fas fa-box-open" />
                                <q-btn v-show="fechamentoCaixa === true" rounded align="center" label="Fechar Caixa" size="12px" color="blue-9" icon="fas fa-archive" />
                                <q-btn @click="fechaModal" class="q-ml-sm" rounded align="center" label="Cancelar" size="12px" color="red" icon="close" />
                            </div>
                        </div>
                    </q-page>
                </q-page-container>
            </q-layout>
        </q-dialog>
    </div>
</template>

<script>
import { Post, PutSemObjecto } from 'src/utils/Conexao.js'

export default {
    name: 'Periodo-Caixa',
    data () {
        return {
            statusModal: false,
            fechamentoCaixa: false,
            usuario: [],
            
            erroValorTroco: false,
            msgValorTroco: null,
            valorTroco: '',


            valorSaldo: null,
            valorSangria: null,
            dataAbertura: null,
            dataFechamento: null,
            tituloModal: null,
            caixaNome: null,
            styleModal: null,
            observacao: '',
            caixaId: 0
        }
    },
    methods: {
        async aberturaCaixaOperador(dados, titulo) {
            this.dadosIniciais()
            this.styleModal = 'height: 425px; width: 475px'
            this.dataAbertura = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.statusModal = !this.statusModal
            this.tituloModal = titulo
            this.caixaNome = dados.nome
            this.caixaId = dados.id
        },
        async fechamentoCaixaOperador(dados, titulo) {
            this.dadosIniciais()
            var dataAtual = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.fechamentoCaixa = true
            this.styleModal = 'height: 470px; width: 475px'
            this.dataAbertura = dataAtual
            this.dataFechamento = dataAtual
            this.statusModal = !this.statusModal
            this.tituloModal = titulo
            this.caixaNome = dados.nome
            this.caixaId = dados.id
        },
        fechaModal() {
            this.fechamentoCaixa = false
            this.statusModal = !this.statusModal
            this.limparCampos()
        },
        limparCampos() {
            this.usuario = []
            this.tituloModal = null
            this.caixaId = null
            this.valorSaldo = null
            this.valorSangria = null
            this.styleModal = null
            this.dataAbertura = null
            this.dataFechamento = null
            this.valorTroco = ''
            this.observacao = ''
        },
        dadosIniciais() {
            var obj = JSON.parse(localStorage.getItem('tokenContent'))
            this.usuario = obj
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
        validaCampos(tipoMovimento) {
            return new Promise(resolve => {
                if (tipoMovimento === 'A') {
                    var campoVazio = false

                    if (this.dataAbertura === '' || this.dataAbertura === null) {
                        campoVazio = true
                    }

                    if (this.usuario === '' || this.usuario === null) {
                        campoVazio = true
                    }

                    if (this.valorTroco == NaN || this.valorTroco === '' || this.valorTroco === null || this.valorTroco < 0.01) {
                        campoVazio = true
                        this.erroValorTroco = true
                        this.msgValorTroco = 'Este Campo não pode estar zerado ou vazio'
                    } else {
                        campoVazio = false
                        this.erroValorTroco = false
                    }

                    if (campoVazio === false) {
                        resolve(true)
                    }
                }
            })
        },
        inserePeriodoCaixa() {
            this.validaCampos('A').then(() => {
                this.confirmacao('Deseja realmente abrir o Caixa ?').then(() => {
                    let aberturaCaixa = Object()
                    aberturaCaixa.ValorTroco = parseFloat(this.valorTroco)
                    aberturaCaixa.CaixaId = parseInt(this.caixaId)
                    if (this.observacao !== null | this.observacao !== '') {
                        aberturaCaixa.Observacao = this.observacao
                    } else {
                        aberturaCaixa.Observacao = null
                    }

                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'blue',
                        timeout: 1500
                    })

                    setTimeout(() => {
                        Post('v1/caixaoperador/periodo', aberturaCaixa).then(res => {
                            if (res.data.status == true) {                    
                                var rota = 'v1/caixaoperador/aberturafechamento/' + aberturaCaixa.CaixaId + '/A'
                                PutSemObjecto(rota).then(res => {
                                    if (res.data.status == true) {
                                        this.$q.notify({
                                            message: 'O Caixa está aberto...',//res.data.msg,
                                            color: 'green',
                                            timeout: 2000
                                        })
                                        this.fechaModal()
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
                                        caption: 'Não foi possível abrir Caixa',
                                        color: 'red'
                                    })
                                    console.log(err)
                                })
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
                                caption: 'Não foi possível abrir o Período do Caixa',
                                color: 'red'
                            })
                            console.log(err)
                        })
                    }, 1500)
                })
            })
        }
    }
}
</script>

<style>

</style>