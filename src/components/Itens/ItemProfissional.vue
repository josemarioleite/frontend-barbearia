<template>
  <q-dialog v-model="exibeModal" persistent>
      <q-layout view="Lhh lpR fff" container class="bg-dark layout">
          <q-header class="row bg-primary col-12" style="padding: 5px">
              <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
              <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
              <q-btn flat v-close-popup dense icon="close" align="right" />
          </q-header>

          <q-page-container>
              <q-page style="padding: 10px">

                <div class="col-12">
                    <div class="componentsMobile col-xs-12" style="padding-right: 5px">
                        <q-input :error="erroCampoNome" v-model="nomeProfissional" class="inputSelect" outlined label="Nome do Profissional" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="person" color="brown"/>
                            </template>
                        </q-input>
                    </div>

                    <div class="componentsMobile col-xs-12" style="padding-right: 5px">
                        <q-input mask="(##)# ####-####" :error="erroCampoTelefone" v-model="telefoneProfissional" class="inputSelect"  outlined label="Telefone / Celular" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="tty" color="brown"/>
                            </template>
                        </q-input>
                    </div>

                    <q-input :error="erroCampoData" v-model="dataNascimentoProfissional" class=" col-xs-12" bg-color="white" filled label="Data de Nascimento" mask="##/##/####" style="padding-right: 5px">
                        <template v-slot:prepend>
                            <q-icon name="calendar_today" color="brown"/>
                        </template>
                        <template v-slot:append>
                            <q-icon name="event">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date subtitle="Data de" title="Nascimento" v-model="dataNascimentoProfissional" dark mask="DD-MM-YYYY">
                                        <div class="row items-center">
                                            <q-btn v-close-popup label="fechar" color="red" />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>

                    <div class="componentsMobile col-xs-12" style="padding-right: 5px">
                        <q-input mask="###.###.###-##" :error="erroCampoCPF" v-model="cpfProfissional" class="inputSelect"  outlined label="CPF" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="fingerprint" color="brown"/>
                            </template>
                        </q-input>
                    </div>

                    <div class="componentsMobile col-xs-12" style="padding-right: 5px">
                        <q-input mask="#.##" reverse-fill-mask :error="erroCampoPorcentagem" v-model="porcentagem" class="inputSelect"  outlined label="Porcentagem" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="money" color="brown"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="row col-12 items-center justify-center" style="padding-right: 5px">
                        <label class="text-white">Porcentagem por Produto ?</label>
                        <q-checkbox dark v-model="recebePorcentagemProduto" />
                        <q-input v-show="recebePorcentagemProduto == true" 
                            v-model.number="porcentagemProduto"
                            reverse-fill-mask
                            :error="erroPorcentagemProduto"
                            color="dark"
                            label-color="dark"
                            bg-color="white"
                            filled
                            mask="#.##"
                            suffix="%"
                            prefix="%"
                            class="col-md-7 col-xs-12"
                            label="Porcentagem do Produto"
                        >
                            <template v-slot:prepend>
                                <q-icon name="money" color="brown" />
                            </template>
                        </q-input>
                    </div>
                    <div class="row justify-center" style="padding: 10px">
                        <q-btn icon="close" label="Fechar" color="red" @click="fecharModal" style="border-radius: 5px" />
                        <q-btn @click="insereNovoProfissional" icon="save" class="q-ml-sm" label="Salvar" color="green" style="border-radius: 5px" />              
                    </div>
                </div>

              </q-page>
          </q-page-container>
      </q-layout>
  </q-dialog>
</template>

<script>
import { Profissional } from 'src/models/Profissional/Profissional.js'
import { Post } from 'src/utils/Conexao.js'

export default {
    name: 'ItemProfissional',
    data () {
        return {
            exibeModal: false,
            erroCampoNome: false,
            erroCampoTelefone: false,
            erroCampoData: false,
            erroCampoCPF: false,
            erroCampoPorcentagem: false,
            erroPorcentagemProduto: false,
            recebePorcentagemProduto: false,
            porcentagemProduto: '',
            porcentagem: '',
            tituloModal: '',
            nomeProfissional: '',
            telefoneProfissional: '',
            dataNascimentoProfissional: '',
            cpfProfissional: ''
        }
    },
    methods: {
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
        exibeModalProfissional(titulo) {
            this.exibeModal = !this.exibeModal
            this.tituloModal = titulo
        },
        fecharModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        limparCampos() {
            this.nomeProfissional = null
            this.telefoneProfissional = null
            this.cpfProfissional = null
            this.dataNascimentoProfissional = null
            this.porcentagem = null
        },
        validaCampos() {
            return new Promise((resolve, reject) => {
                var campoVazio = false

                if (this.nomeProfissional == '' || this.nomeProfissional == null) {
                    this.erroCampoNome = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.telefoneProfissional == '' || this.telefoneProfissional == null) {
                    this.erroCampoTelefone = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.cpfProfissional == '' || this.cpfProfissional == null) {
                    this.erroCampoCPF = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.dataNascimentoProfissional == '' || this.dataNascimentoProfissional == null) {
                    this.erroCampoData = true
                    campoVazio = true
                } else {
                    campoVazio = false
                }

                if (this.recebePorcentagemProduto == true) {
                    if (this.porcentagemProduto === '' || this.porcentagemProduto === null) {
                        this.erroPorcentagemProduto = true
                        campoVazio = true
                    } else {
                        this.erroPorcentagemProduto = false
                        campoVazio = false
                    }
                }

                if (campoVazio == false) {
                    resolve(true)
                }
            })
        },
        insereNovoProfissional() {
            this.validaCampos().then(() => {
                this.confirmacao('Tem certeza que deseja incluir este Profissional ?').then(() => {
                    this.$q.notify({
                        message: 'Incluindo...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        var profissional = new Profissional()
                        profissional.Nome = this.nomeProfissional.toUpperCase()
                        profissional.DataNascimento = this.dataNascimentoProfissional
                        profissional.CPF = this.cpfProfissional
                        profissional.TelefoneCelular = this.telefoneProfissional
                        profissional.Porcentagem = parseInt(this.porcentagem)
                        if (this.recebePorcentagemProduto == true) {
                            profissional.GeraPorcentagemProduto = 'S'
                            profissional.PorcentagemProduto = parseInt(this.porcentagemProduto)
                        } else {
                            profissional.GeraPorcentagemProduto = 'N'
                            profissional.PorcentagemProduto = 0
                        }
                        Post('v1/profissional', profissional).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.fecharModal()
                                this.$emit('atualizaCampo')
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                        }).catch(err => {
                            this.$q.notify({
                                message: 'Não foi possível fazer a inclusão, tente novamente mais tarde',
                                color: 'red',
                                timeout: 2000
                            })
                        })
                    }, 1000);
                })
            })
        }
    }
}
</script>

<style>
  .inputSelect {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .layout {
      width: 100%;
  }

  @media screen and (max-width: 499px) {
    .modeloCelular {
        padding: 10px;
        width: 150px;
        height: 100%;
    }

    .layout {
        height: 100%;
    }
  }
</style>