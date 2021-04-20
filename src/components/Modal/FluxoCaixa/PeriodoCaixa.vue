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
                        <div v-show="fechamentoCaixa === false" class="col-12 q-mb-xs">
                            <div class="col-12 row padrao">
                                <q-input readonly outlined color="dark" filled label="Data de Abertura" 
                                    label-color="primary" v-model="dataAbertura" class="text-green col-6 padrao" />
                            
                                <q-input readonly outlined color="dark" filled label="Usuário de Abertura"
                                        label-color="primary" v-model="usuario.Usuario" class="text-green col-6 padrao" />
                            </div>

                            <div class="col-12 row padrao">
                                <q-input readonly v-model="valorSaldo" fill-mask="0" reverse-fill-mask color="primary"
                                        label-color="primary" filled label="Saldo" prefix="R$" v-money="moneyformat" class="col-6 padrao" />

                                <q-input :error="erroValorTroco" :error-message="msgValorTroco" v-model="valorTroco" fill-mask="0"
                                        reverse-fill-mask color="green" filled label="Valor de Troco" 
                                        class="col-6 padrao" prefix="R$" v-money="moneyformat" />     
                            </div>
                        </div>

                        <div v-show="fechamentoCaixa === true" class="col-12">
                            <div class="col-12 row padrao">
                                <q-input readonly outlined color="dark" filled label="Data de Abertura" 
                                    label-color="primary" v-model="dataAbertura" class="text-green col-6 padrao" />
                            
                                <q-input readonly outlined color="dark" filled label="Usuário de Abertura"
                                        label-color="primary" v-model="usuario.Usuario" class="text-green col-6 padrao" />
                            </div>

                            <div class="col-12 row padrao">
                                <q-input readonly outlined color="dark" filled label="Data de Fechamento" label-color="primary" v-model="dataFechamento"
                                    class="text-green col-6 padrao" />

                                <q-input readonly outlined color="dark" filled label="Usuário de Fechamento" label-color="primary" v-model="usuario.Usuario"
                                    class="text-green col-6 padrao" />
                            </div>

                            <div class="row col-12">
                                <q-input readonly v-model="valorSaldo" fill-mask="0" reverse-fill-mask color="primary"
                                    label-color="primary" filled label="Saldo" prefix="R$" v-money="moneyformat" class="col-6 padrao" />
                            
                                <q-input readonly v-model="valorPeriodo" mask="#.##" fill-mask="0" reverse-fill-mask color="green" label-color="primary"
                                    filled label="Valor do Período" prefix="R$" class="col-6 padrao">
                                </q-input>
                            </div>

                            <div class="row col-12" style="margin-top: 2px">
                                <q-input :error-message="msgValorSangria" v-model="valorSangria" mask="#.##" fill-mask="0" reverse-fill-mask color="green"
                                    filled label="Valor Sangria" prefix="R$" class="col-6 padrao">
                                    <template v-slot:append>
                                        <q-icon name="cancel" @click.stop="valorSangria = null" class="cursor-pointer" />
                                    </template>
                                </q-input>

                                <q-input readonly v-model="valorTotal" mask="#.##" fill-mask="0" label-color="primary" reverse-fill-mask color="primary"
                                    filled label="Valor Total" prefix="R$" class="col-6 padrao" />
                            </div>

                        </div>

                        <q-input class="padrao q-mt-sm" v-model="observacao" color="green" filled label="Observação" :rules="[ val => val.length <= 300 || 'O número máximo de caracteres é: 50']">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="observacao = ''" class="cursor-pointer" />
                            </template>
                        </q-input>

                        <div class="column items-center q-mt-md">
                            <div class="row">
                                <q-btn @click="inserePeriodoCaixa" v-show="fechamentoCaixa === false" rounded align="center" label="Abrir Caixa" size="12px" color="green-9" icon="fas fa-box-open" />
                                <q-btn @click="fechaPeriodoCaixa" v-show="fechamentoCaixa === true" rounded align="center" label="Fechar Caixa" size="12px" color="blue-9" icon="fas fa-archive" />
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
import { Get, Post, Put, PutSemObjecto } from 'src/utils/Conexao.js'

export default {
    name: 'Periodo-Caixa',
    data () {
        return {
            moneyformat: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false
            },
            statusModal: false,
            fechamentoCaixa: false,
            usuario: [],            
            erroValorTroco: false,
            msgValorTroco: null,
            valorTroco: 0,
            
            erroValorSangria: false,
            msgValorSangria: null,
            valorSangria: 0,


            valorSaldo: 0,
            valorPeriodo: 0,
            valorTotal: 0,
            dataAbertura: null,
            dataFechamento: null,
            tituloModal: null,
            caixaNome: null,
            styleModal: null,
            observacao: '',
            caixaId: 0,
            periodoCaixaId: ''
        }
    },
    methods: {
        async aberturaCaixaOperador(dados, titulo) {
            this.dadosIniciais()
            this.styleModal = 'height: 330px; width: 475px'
            this.dataAbertura = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.statusModal = !this.statusModal
            this.tituloModal = titulo
            this.caixaNome = dados.nome
            this.caixaId = dados.id
        },
        async fechamentoCaixaOperador(dados, titulo) {
            this.dadosIniciais()
            this.obtemDadosPeriodoCaixaAberto(dados.id)
            var dataAtual = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.fechamentoCaixa = true
            this.styleModal = 'height: 435px; width: 475px'
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
            this.erroValorTroco = false
            this.erroValorSangria = false
            this.msgValorTroco = null
            this.msgValorSangria = null
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

                    if (parseFloat(this.valorTroco) == NaN || parseFloat(this.valorTroco) === '' || parseFloat(this.valorTroco) === null || parseFloat(this.valorTroco) < 0.01) {
                        campoVazio = true
                        this.erroValorTroco = true
                        this.msgValorTroco = 'Não pode estar zerado ou vazio'
                    } else {
                        campoVazio = false
                        this.erroValorTroco = false
                    }

                    if (campoVazio === false) {
                        resolve(true)
                    }
                } else if (tipoMovimento === 'F') {
                    var campoVazio = false

                    if (this.dataFechamento === '' || this.dataFechamento === null) {
                        campoVazio = true
                    }

                    if (this.usuario === '' | this.usuario === null) {
                        campoVazio = true
                    }

                    if (this.valorSangria == NaN || this.valorSangria === '' || this.valorSangria === null || this.valorSangria < 0) {
                        campoVazio = true
                        this.erroValorSangria = true
                        this.msgValorSangria
                    } else {
                        campoVazio = false
                        this.erroValorSangria = false
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
                            localStorage.removeItem('PeriodoCaixa')
                            let periodoCaixa = Object()
                            periodoCaixa.Id = res.data.periodoCaixaId
                            periodoCaixa.CaixaId = res.data.caixaId
                            localStorage.setItem('PeriodoCaixa', JSON.stringify(periodoCaixa))
                            if (res.data.status == true) {                    
                                var rota = 'v1/caixaoperador/aberturafechamento/' + aberturaCaixa.CaixaId + '/A'
                                PutSemObjecto(rota).then(res => {
                                    if (res.data.status == true) {
                                        this.$q.notify({
                                            message: 'O Caixa está aberto...',
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
        },
        obtemDadosPeriodoCaixaAberto(id) {
            Get('v1/caixaoperador/periodo/' + id).then(res => {
                this.periodoCaixaId = res.data[0].id
            }).catch(err => console.log(err))
        },
        fechaPeriodoCaixa() {
            this.validaCampos('F').then(() => {
                this.confirmacao('Deseja realmente fazer o fechamento do caixa ?').then(() => {
                    this.$q.notify({
                        message: 'Fechando caixa...',
                        color: 'primary',
                        timeout: 2500
                    })

                    setTimeout(() => {
                        if (this.periodoCaixaId > 0) {
                            let caixa = Object()
                            caixa.Id = parseInt(this.periodoCaixaId)
                            caixa.Observacao = this.observacao
                            caixa.ValorSangria = parseFloat(this.valorSangria)
                            caixa.ValorTotal = parseFloat(this.valorTotal)
                            caixa.ValorSaldo = parseFloat(this.valorSaldo)
                            caixa.ValorPeriodo = parseFloat(this.valorPeriodo)
                            caixa.CaixaId = parseInt(this.caixaId)
                            caixa.Status = 'F'

                            var rota = 'v1/caixaoperador/periodo/fechamento/' + this.caixaId + '/' + this.periodoCaixaId
                            Put(rota, caixa).then(res => {
                                if (res.data.status === true) {                                    
                                    Put('v1/caixaoperador/aberturafechamento/' + this.caixaId + '/' + 'F').then(resposta => {
                                        this.$q.notify({
                                            message: res.data.msg,
                                            caption: resposta.data.msg,
                                            color: 'green',
                                            timeout: 1500
                                        })
                                    })
                                    this.fechaModal()
                                    this.$emit('atualizaGrade')
                                } else {
                                    this.$q.notify({
                                        message: res.data.msg,
                                        color: 'red',
                                        timeout: 1500
                                    })
                                }
                            }).catch(err => {
                                this.$q.notify({
                                    message: 'Não foi possível fazer o fechamento, tente novamente mais tarde...',
                                    color: 'red',
                                    timeout: 1500
                                })
                                console.log(err)
                            })
                        } else {
                            this.$q.notify({
                                message: 'Não foi possível verificar a qual Caixa Aberto o período está vinculado',
                                type: 'negative',
                                timeout: 2000
                            })
                        }
                    }, 2500);
                })
            })
        }
    }
}
</script>

<style>

.padrao {
    padding: 2px;
}

.padraoMobileLeft {
    padding-left: 4px;
}

.padraoMobileRight {
    padding-right: 4px;
}

@media only screen and (max-width: 599px) {
}
</style>