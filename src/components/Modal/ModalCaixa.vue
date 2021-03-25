<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="hHh Lpr lff" container style="height: 500px; width: width: 750px" class="shadow-2 bg-white rounded-borders">
            <q-header elevated class="bg-green">
                <q-toolbar>
                    <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
                    <q-toolbar-title>Caixa</q-toolbar-title>
                    <q-btn @click="fechaModal" flat dense icon="close" align="right" />
                </q-toolbar>
            </q-header>

            <q-drawer
                v-model="drawer"
                show-if-above

                :mini="miniState"
                @mouseover="miniState = false"
                @mouseout="miniState = true"

                :width="220"
                :breakpoint="500"
                bordered
                content-class="bg-grey-3"
            >
                <q-scroll-area class="fit">
                    <q-list padding>
                        <q-item @click="clicavel('cadastrocaixa')" :active="nameRouter === 'cadastrocaixa'" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="paid" />
                            </q-item-section>

                            <q-item-section>Caixa</q-item-section>
                        </q-item>

                        <q-item @click="clicavel('aberturafechamento')" :active="nameRouter === 'aberturafechamento'" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="local_atm" />
                            </q-item-section>

                            <q-item-section>Abertura/Fechamento</q-item-section>
                        </q-item>

                        <q-item @click="abreDadosCaixa" :active="nameRouter === 'movimento'" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="price_check" />
                            </q-item-section>

                            <q-item-section>Movimento</q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item @click="fechaModal" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="exit_to_app" />
                            </q-item-section>

                            <q-item-section>
                                Fechar
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>
            </q-drawer>

            <q-page-container>
                <q-page>
                    <div class="col-md-6 row justify-end items-center q-pa-sm">
                        <hr class="bg-primary linhaInclusao">
                        <q-btn @click="abreModalCadastro" flat round dense icon="add" color="white" class="bg-primary justify-start" />
                    </div>
                    <CadastroCaixa v-if="nameRouter === 'cadastrocaixa'" />
                </q-page>
            </q-page-container>
        </q-layout>
        <q-dialog v-model="statusModalCadastro">
            <q-card>
                <q-toolbar>
                    <q-toolbar-title>Cadastrar novo caixa</q-toolbar-title>
                    <q-btn @click="fechaModalCadastro" flat round dense icon="close" v-close-popup />
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
        <ModalDadosCaixa ref="modalDadosCaixa" />
    </q-dialog>
</template>

<script>
import CadastroCaixa from './FluxoCaixa/CadastroCaixa.vue'
import ModalDadosCaixa from './ModalDadosCaixa.vue'
import {Post} from 'src/utils/Conexao.js'

export default {
  components: { CadastroCaixa, ModalDadosCaixa },
  data () {
    return {
        drawer: false,
        exibeModal: false,
        miniState: true,
        statusModalCadastro: false,
        erroNomeCaixa: false,
        erroObsCaixa: false,
        erroMsgNomeCaixa: '',
        erroMsgObsCaixa: '',
        nomeCaixa: '',
        observacaoCaixa: '',
        nameRouter: 'cadastrocaixa'
    }
  },
  methods : {
    abreModalCadastro() {
        this.statusModalCadastro = !this.statusModal
    },
    exibirModal() {
        this.exibeModal = !this.exibeModal
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
    fechaModal() {
        this.exibeModal = !this.exibeModal
        this.nameRouter = null
    },
    fechaModalCadastro() {
        this.statusModalCadastro = !this.statusModalCadastro
        this.nomeCaixa = null
        this.observacaoCaixa = null
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
                            this.fechaModalCadastro()
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
    clicavel(router) {
        this.nameRouter = router
    },
    abreDadosCaixa() {
        this.$refs.modalDadosCaixa.exibirModal()
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
  }
}
</script>