<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="bg-dark" style="height: 200px">
            <q-header class="row bg-dark" style="padding: 5px">
                <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
                <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
                <q-btn flat v-close-popup dense icon="close" align="right" />
            </q-header>

            <q-page-container class="row col-12">
                <div class="col-md-2 col-xs-12" style="padding: 5px">
                    <q-input readonly color="brown" bg-color="white" filled v-model="idServico" label="ID">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-6 col-xs-12" style="padding: 5px">
                    <q-input @click="focusDescricaoServico" :error="erroDescricao" :error-message="erroMSGDescricao" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="descricaoServico" label="Descrição">
                        <template v-slot:prepend>
                            <q-icon name="construction" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="descricaoServico = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-md-4 col-xs-12" style="padding: 5px">
                    <q-input @click="focusValorServico" :error="erroValor" :error-message="erroMSGValor" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="valorServico" label="Valor">
                        <template v-slot:prepend>
                            <q-icon name="attach_money" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="valorServico = ''" />
                        </template>
                    </q-input>
                </div>
            </q-page-container>

            <q-footer class="transparent q-mb-sm">
                <div class="row justify-center">
                    <q-btn v-show="modalAlteracao == true" icon="save" label="Alterar" color="green" @click="alterarServico" />
                    <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fechaModal" /> 
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { AlteraServico } from 'src/models/Servicos/Servico.js'
import { Put } from 'src/utils/Conexao.js'

export default {
    name: 'DadosServico',
    data () {
        return {
            exibeModal: false,
            somenteLeitura: false,
            modalAlteracao: false,
            erroDescricao: false,
            erroValor: false,
            erroMSGDescricao: '',
            erroMSGValor: '',
            tituloModal: '',
            idServico: '',
            descricaoServico: '',
            valorServico: ''
        }
    },
    methods: {
        abreModalVisualizacao(titulo, dados) {
            this.exibeModal = !this.exibeModal
            this.somenteLeitura = true
            this.modalAlteracao = false
            this.idServico = dados.id
            this.descricaoServico = dados.descricao
            this.valorServico = 'R$ ' + dados.valor.toFixed(2)
            this.tituloModal = titulo
        },
        abreModalAlteracao(titulo, dados) {
            this.exibeModal = !this.exibeModal
            this.somenteLeitura = false
            this.modalAlteracao = true
            this.idServico = dados.id
            this.descricaoServico = dados.descricao
            this.valorServico = 'R$ ' + dados.valor.toFixed(2)
            this.tituloModal = titulo
        },
        confirmacao(acao) {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: `Tem certeza que deseja ${acao} o Serviço ?`,
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        alterarServico() {
            this.validaCampos().then(() => {
                this.confirmacao('alterar').then(() => {
                    var servico = new AlteraServico()
                    servico.Id = Number(this.idServico)
                    servico.Descricao = this.descricaoServico
                    servico.Valor = parseFloat(this.valorServico)
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'primary',
                        timeout: 2000
                    })
                    setTimeout(() => {
                        Put('v1/servico/' + this.idServico, servico).then(res => {
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
                            console.log(err.message)
                        })
                    }, 1000);
                })
            })
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
        },
        focusDescricaoServico() {
            if (this.modalAlteracao === false) {
                this.descricaoServico = this.descricaoServico
            } else {
                this.descricaoServico = null
            }
        },
        focusValorServico() {
            if (this.modalAlteracao === false) {
                this.valorServico = this.valorServico
            } else {
                this.valorServico = null
            }
        },
        limparCampos() {
            this.idServico = null
            this.descricaoServico = null
            this.valorServico = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.descricaoServico === '' || this.descricaoServico === null) {
                    this.erroDescricaoServico = true
                    this.erroMSGDescricao = 'Este campo é obrigatório'
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.valorServico === '' || this.valorServico === null) {
                    this.erroValorServico = true
                    this.erroMSGValor = 'Este campo é obrigatório'
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
    }
}
</script>