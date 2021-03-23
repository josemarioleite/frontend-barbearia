<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="modal bg-brown">
            <q-header class="row bg-dark" style="padding: 5px">
                <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
                <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
                <q-btn flat v-close-popup dense icon="close" align="right" />
            </q-header>

            <q-page-container class="row col-12" style="margin: 15px">

                <div class="col-md-3 col-sm-3 col-xs-12" style="padding-right: 5px">
                    <q-input readonly color="brown" bg-color="white" filled v-model="idProfissional" label="ID">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                    </q-input>
                </div>

                <q-space />

                <div class="col-md-9 col-sm-9 col-xs-12">
                    <q-input :error="erroNomeProfissional" :readonly="somenteLeitura" color="brown" bg-color="white" filled v-model="nomeProfissional" label="Nome">
                        <template v-slot:prepend>
                            <q-icon name="inventory" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="nomeProfissional = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-xs-12">
                    <q-input :error="erroDataNascimentoProfissional" mask="##/##/####" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="dataNascimento" label="Data de Nascimento">
                        <template v-slot:prepend>
                            <q-icon name="event" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="dataNascimento = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-xs-12">
                    <q-input :error="erroCPFProfissional" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="cpfProfissional" label="CPF do Profissional">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="cpfProfissional = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-xs-12">
                    <q-input :error="erroTelefoneProfissional" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model="telefoneProfissional" label="Celular - Telefone">
                        <template v-slot:prepend>
                            <q-icon name="tty" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="telefoneProfissional = ''" />
                        </template>
                    </q-input>
                </div>

                <div class="col-xs-12">
                    <q-input reverse-fill-mask mask="#,##" @click="porcentagemProfissional = ''" :error="erroPorcentagemProfissional" :readonly="somenteLeitura" color="black" bg-color="white" filled v-model.number="porcentagemProfissional" label="Porcentagem">
                        <template v-slot:prepend>
                            <q-icon name="money" color="brown" />
                        </template>
                        <template v-slot:append>
                            <q-icon v-show="somenteLeitura == false" name="close" @click="porcentagemProfissional = ''" />
                        </template>
                    </q-input>
                </div>
            </q-page-container>

            <q-footer class="transparent q-mb-sm">
                <div class="row justify-center">
                    <q-btn @click="fechaModal" icon="close" label="Fechar" color="red" /> 
                    <q-btn @click="alteraProfissional" v-show="modalAlteracao == true" icon="save" class="q-ml-sm" label="Alterar" color="green" />
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Put } from 'src/utils/Conexao.js'
import { ConverteStringPraDatetime } from 'src/utils/Datas.js'
import { AlteraProfissional } from 'src/models/Profissional/Profissional.js'
export default {
    name: 'Profissional',
    data () {
        return {
            exibeModal: false,
            somenteLeitura: false,
            modalAlteracao: false,
            erroPorcentagemProfissional: false,
            erroTelefoneProfissional: false,
            erroNomeProfissional: false,
            erroDataNascimentoProfissional: false,
            erroCPFProfissional: false,
            idProfissional: '',
            nomeProfissional: '',
            cpfProfissional: '',
            telefoneProfissional: '',
            dataNascimento: '',
            porcentagemProfissional: '',
            tituloModal: '',
        }
    },
    methods: {
        fechaModal() {
            this.exibeModal = !this.exibeModal
        },
        abreModalAlteracao(tituloModal, dados) {
            this.modalAlteracao = true
            this.exibeModal = !this.exibeModal
            this.tituloModal = tituloModal
            this.telefoneProfissional = dados.telefoneCelular
            this.idProfissional = dados.id
            this.nomeProfissional = dados.nome
            this.cpfProfissional = dados.cpf
            this.porcentagemProfissional = dados.porcentagem + ' %'
            this.dataNascimento = new Date(dados.dataNascimento).toLocaleDateString('pt-BR')
        },
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Tem certeza que deseja alterar o Profissional ?',
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

                if (this.nomeProfissional === '' || this.nomeProfissional === null) {
                    this.erroNomeProfissional = true
                    campoVazio = true
                } else {
                    this.erroNomeProfissional = false
                    campoVazio = false
                }

                if (this.dataNascimentoProfissional === '' || this.dataNascimentoProfissional === null) {
                    this.erroDataNascimentoProfissional = true
                    campoVazio = true
                } else {
                    this.erroDataNascimentoProfissional = false
                    campoVazio = false
                }

                if (this.cpfProfissional === '' || this.cpfProfissional === null) {
                    this.erroCPFProfissional = true
                    campoVazio = true
                } else {
                    this.erroCPFProfissional = false
                    campoVazio = false
                }

                if (this.cpfProfissional.length < 14) {
                    this.erroCPFProfissional = true
                    this.$q.notify({ type: 'negative', message: 'CPF inválido', timeout: '3000'})
                    campoVazio = true
                } else {
                    this.erroCPFProfissional = false
                    campoVazio = false
                }

                if (this.telefoneProfissional === '' || this.telefoneProfissional === null) {
                    this.erroTelefoneProfissional = true
                    campoVazio = true
                } else {
                    this.erroTelefoneProfissional = false
                    campoVazio = false
                }

                if (this.porcentagemProfissional === '' || this.porcentagemProfissional === null) {
                    this.erroPorcentagemProfissional = true
                    campoVazio = true
                } else {
                    this.erroTelefoneProfissional = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        limparCampos() {
            this.idProfissional = null
            this.nomeProfissional = null
            this.cpfProfissional = null
            this.dataNascimento = null
            this.telefoneProfissional = null
        },
        alteraProfissional() {
            this.validaCampos().then(() => {
                this.confirmacao().then(async () => {
                    var profissional = new AlteraProfissional()
                    profissional.Id = parseInt(this.idProfissional)
                    profissional.Nome = this.nomeProfissional
                    profissional.DataNascimento = await ConverteStringPraDatetime(this.dataNascimento)
                    profissional.CPF = this.cpfProfissional
                    profissional.TelefoneCelular = this.telefoneProfissional
                    profissional.Porcentagem = parseFloat(this.porcentagemProfissional)                 
                    this.$q.notify({
                        color: 'primary',
                        message: 'Carregando...',
                        timeout: '1000'
                    })
                    console.log(profissional)
                    setTimeout(() => {
                        var id = parseInt(this.idProfissional)
                        Put('v1/profissional/' + id, profissional).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    color: 'green',
                                    message: res.data.msg,
                                    timeout: '2000'
                                })
                            } else {
                                this.$q.notify({
                                   type: 'negative',
                                    message: res.data.msg,
                                    timeout: '1000'
                                })
                            }
                            this.limparCampos()
                            this.fechaModal()
                            this.$emit('atualizaGradeProfissional')
                        }).catch(err => {
                            this.$q.notify({
                                type: 'negative',
                                message: 'Não foi possível alterar Profissional',
                                timeout: '2000'
                            })
                            console.log(err)
                        })
                    }, 2000)
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
    }
</style>