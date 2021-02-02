<template>
  <q-dialog v-model="exibeModal" persistent full-width class="col-xs-12">
      <q-layout view="Lhh lpR fff" container class="bg-brown">
          <q-header class="bg-dark" style="padding: 5px">
              <q-toolbar-title class="col-12">Profissional</q-toolbar-title>
          </q-header>

          <q-page-container>
              <q-page style="padding: 10px">
                  <div class="row">
                     
                      <q-input :error="erroNomeProfissional" :error-message="erroMSGNomeProfissional" v-model="nomeProfissional" class="col-md-3 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Nome">
                        <template v-slot:prepend>
                            <q-icon name="person" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input :error="erroDataNascimentoProfissional" :error-message="erroMSGDataNascimentoProfissional" v-model="dataNascimentoProfissional" class="col-md-2 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Data de Nascimento" mask="##/##/####">
                          <template v-slot:append>
                              <q-icon name="event" color="brown">
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

                      <q-space />

                      <q-input :error="erroTelefoneProfissional" :error-message="erroMSGTelefoneProfissional" v-model="telefoneProfissional" mask="(##)# ####-####" onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="col-md-2 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="N°Contato">
                        <template v-slot:prepend>
                            <q-icon name="tty" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input :error="erroCPFProfissional" :error-message="erroMSGCPFProfissional" v-model="cpfProfissional" mask="###.###.###-##" onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="col-md-2 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="CPF">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input reverse-fill-mask mask="#.##" suffix="%" prefix="%" :error="erroPorcentagemProfissional" :error-message="erroMSGPorcentagemProfissional" v-model.number="porcentagemProfissional" class="col-md-2 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Porcentagem">
                        <template v-slot:prepend>
                            <q-icon name="money" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <div class="row justify-center">
                        <q-btn :disable="desabilitarBotao" class="col-md-1 col-xs-2" color="green" icon="add" style="width: 55px; height: 56px" @click="insereNovoProfissional" />
                      </div>
                  </div>

                  <div class="row col-12 items-center justify-center">
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
                        class="col-md-3 col-xs-12"
                        label="Porcentagem do Produto"
                    >
                        <template v-slot:prepend>
                            <q-icon name="money" color="brown" />
                        </template>
                    </q-input>
                  </div>

                  <q-table
                    dense
                    separator="cell"
                    no-data-label="Sem Profissionais cadastrados"
                    :loading="carregando"
                    :rows-per-page-options="totalLinhasTabela"
                    :filter="filtroTabela"
                    :data="dados"
                    :columns="colunas"
                  >
                    <template v-slot:no-data="{ icon, message, filter }">
                        <div class="full-width row flex-center text-red-8 q-gutter-sm" style="font-size: 1rem">
                            <span>{{ message }}</span>
                            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                        </div>
                    </template>

                    <template v-slot:top-left>
                        <div class="row items-center">
                            <q-btn @click="recebeDadosProfissional" size="12px" color="green" icon="update" round>
                                <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Atualizar Tabela</q-tooltip>
                            </q-btn>
                            <div class="q-ml-md" style="font-size: 1.3rem">Lista</div>
                        </div>
                    </template>

                    <template v-slot:top-right>
                        <q-input dense v-model="filtroTabela" dark class="q-ml-xs" placeholder="Buscar profissional...">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>

                    <template v-slot:body-cell-dataNascimento="props">
                        <q-td key="dataNascimento" :props="props">{{new Date(props.row.dataNascimento).toLocaleDateString('pt-BR')}}</q-td>
                    </template>

                    <template v-slot:body-cell-telefoneCelular="props">
                        <q-td key="telefoneCelular" :props="props">{{props.row.telefoneCelular}}</q-td>
                    </template>

                    <template v-slot:body-cell-cpf="props">
                        <q-td key="cpf" :props="props">{{props.row.cpf}}</q-td>
                    </template>

                    <template v-slot:body-cell-porcentagem="props">
                        <q-td key="porcentagem" :props="props">{{props.row.porcentagem.toFixed(2)}} %</q-td>
                    </template>

                    <template v-slot:body-cell-geraPorcentagemProduto="props">
                        <q-td key="geraPorcentagemProduto" :props="props">{{props.row.geraPorcentagemProduto === 'S' ? 'Sim' : 'Não'}}</q-td>
                    </template>

                    <template v-slot:body-cell-porcentagemProduto="props">
                        <q-td key="porcentagemProduto" :props="props">{{props.row.porcentagemProduto.toFixed(2)}} %</q-td>
                    </template>

                    <template v-slot:body-cell-dataInclusao="props">
                        <q-td key="dataInclusao" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}}</q-td>
                    </template>

                    <template v-slot:body-cell-acoes="props">
                        <q-td key="acoes" :props="props">

                        <!-- DROPDOWN -->
                        <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                            <q-list>
                                <q-item clickable v-close-popup @click="deletaProfissional(props.row.id)">
                                    <q-item-section avatar>
                                        <q-avatar icon="delete" color="red" text-color="white" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>Deletar</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-icon name="clear" color="red" />
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-close-popup @click="abreModalEdicao(props.row)">
                                    <q-item-section avatar>
                                        <q-avatar icon="create" color="secondary" text-color="white" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>Editar</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-icon name="border_color" color="secondary" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>
                        </q-td>
                    </template>
                  </q-table>
                  <div class="row justify-center posicaoBotao" style="padding-top: 20px">
                    <q-btn color="red" icon="close" label="Fechar" @click="fechaModal" />
                  </div>
              </q-page>
          </q-page-container>

          <DadosProfissional ref="dadosProfissional" @atualizaGradeProfissional="recebeDadosProfissional" />
      </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete } from 'src/utils/Conexao.js'
import { Profissional } from 'src/models/Profissional/Profissional.js'
import { ConverteStringPraDatetime } from 'src/utils/Datas.js'
import DadosProfissional from 'src/components/AlteraItem/Profissional.vue'

export default {
    name: 'ModalProfissional',
    components: { DadosProfissional },
    data () {
        return {
            nomeProfissional: '',
            dataNascimentoProfissional: '',
            cpfProfissional: '',
            telefoneProfissional: '',
            porcentagemProfissional: '',
            porcentagemProduto: '',
            filtroTabela: '',
            totalLinhasTabela: [5],
            erroMSGTelefoneProfissional: '',
            erroMSGNomeProfissional: '',
            erroMSGDataNascimentoProfissional: '',
            erroMSGCPFProfissional: '',
            erroMSGPorcentagemProfissional: '',
            recebePorcentagemProduto: false,
            carregando: false,
            erroPorcentagemProduto: false,
            erroPorcentagemProfissional: false,
            erroTelefoneProfissional: false,
            erroNomeProfissional: false,
            erroDataNascimentoProfissional: false,
            erroCPFProfissional: false,
            desabilitarBotao: false,
            exibeModal: false,
            dados: [],
            colunas: [
                { name: 'id', align: 'right', label: 'ID', field: 'id', headerClasses: 'bg-dark text-white' },
                { name: 'nome', align: 'left', label: 'Nome', field: 'nome', headerClasses: 'bg-dark text-white' },
                { name: 'dataNascimento', align: 'center', label: 'Data de Nascimento', headerClasses: 'bg-dark text-white' },
                { name: 'telefoneCelular', align: 'left', label: 'Telefone / Celular', headerClasses: 'bg-dark text-white' },
                { name: 'cpf', align: 'center', label: 'CPF', headerClasses: 'bg-dark text-white' },
                { name: 'porcentagem', align: 'right', label: 'Porcentagem %', headerClasses: 'bg-dark text-white' },
                { name: 'geraPorcentagemProduto', align: 'center', label: '% Prod. Vendido', headerClasses: 'bg-dark text-white' },
                { name: 'porcentagemProduto', align: 'right', label: 'Porcentagem no Produto %', headerClasses: 'bg-dark text-white' },
                { name: 'dataInclusao', align: 'center', label: 'Data Inclusão', headerClasses: 'bg-dark text-white' },
                { name: 'acoes', align: 'center', label: 'Ações', headerClasses: 'bg-dark text-white' },
            ]
        }
    },
    methods: {
        abreModalProfissional() {
            this.exibeModal = !this.exibeModal
        },
        abreModalEdicao(dados) {
            this.$refs.dadosProfissional.abreModalAlteracao('Editar Profissional', dados)
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
            this.limpaCampos()
        },
        limpaCampos() {
            this.nomeProfissional = null
            this.dataNascimentoProfissional = null
            this.cpfProfissional = null
            this.telefoneProfissional = null
            this.porcentagemProfissional = null
            this.recebePorcentagemProduto = false
            this.porcentagemProduto = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.nomeProfissional === '' || this.nomeProfissional === null) {
                    this.erroNomeProfissional = true
                    this.erroMSGNomeProfissional = 'O campo "Nome" é obrigatório'
                    campoVazio = true
                } else {
                    this.erroNomeProfissional = false
                    campoVazio = false
                }

                if (this.dataNascimentoProfissional === '' || this.dataNascimentoProfissional === null) {
                    this.erroDataNascimentoProfissional = true
                    this.erroMSGDataNascimentoProfissional = 'O campo "Data Nascimento" é obrigatório'
                    campoVazio = true
                } else {
                    this.erroDataNascimentoProfissional = false
                    campoVazio = false
                }

                if (this.cpfProfissional === '' || this.cpfProfissional === null) {
                    this.erroCPFProfissional = true
                    this.erroMSGCPFProfissional = 'Campo Obrigatório'
                    campoVazio = true
                } else {
                    this.erroCPFProfissional = false
                    campoVazio = false
                }

                if (this.cpfProfissional.length < 14) {
                    this.erroCPFProfissional = true
                    this.erroMSGCPFProfissional = 'CPF Inválido!'
                    campoVazio = true
                } else {
                    this.erroCPFProfissional = false
                    campoVazio = false
                }

                if (this.telefoneProfissional === '' || this.telefoneProfissional === null) {
                    this.erroTelefoneProfissional = true
                    this.erroMSGTelefoneProfissional = 'Campo Obrigatório'
                    campoVazio = true
                } else {
                    this.erroTelefoneProfissional = false
                    campoVazio = false
                }

                if (this.porcentagemProfissional === '' || this.porcentagemProfissional === null) {
                    this.erroPorcentagemProfissional = true
                    this.erroMSGPorcentagemProfissional = 'Campo Obrigatório'
                    campoVazio = true
                } else {
                    this.erroTelefoneProfissional = false
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

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Tem certeza que deseja incluir o Profissional ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        recebeDadosProfissional() {
            this.carregando = true
            setTimeout(() => {
                Get('v1/profissional').then(res => {
                    this.dados = res.data
                    this.carregando = false
                }).catch(err => {
                    console.log(err)
                    this.carregando = false
                })
            }, 1500);
        },
        deletaProfissional(idProfissional) {
            this.confirmacao().then(() => {
                this.$q.notify({
                    message: 'Deletando...',
                    color: 'accent',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/profissional/' + parseInt(idProfissional)).then(res => {
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
                        this.recebeDadosProfissional()
                    }).catch(err => {
                        this.$q.notify({
                            message: 'Erro ao deletar, tente novamente mais tarde',
                            color: 'red',
                            timeout: 2000
                        })
                    })
                }, 1000)
            })
        },
        insereNovoProfissional() {
            this.validaCampos().then(() => {
                this.confirmacao().then(async () => {
                    this.desabilitarBotao = true
                    const novoProfissional = new Profissional()
                    novoProfissional.Nome = this.nomeProfissional.toUpperCase()
                    novoProfissional.DataNascimento = await ConverteStringPraDatetime(this.dataNascimentoProfissional)
                    novoProfissional.CPF = this.cpfProfissional
                    novoProfissional.TelefoneCelular = this.telefoneProfissional
                    novoProfissional.Porcentagem = parseInt(this.porcentagemProfissional)
                    if (this.recebePorcentagemProduto == true) {
                        novoProfissional.GeraPorcentagemProduto = 'S'
                        novoProfissional.PorcentagemProduto = parseInt(this.porcentagemProduto)
                    } else {
                        novoProfissional.GeraPorcentagemProduto = 'N'
                        novoProfissional.PorcentagemProduto = 0
                    }
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'accent',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        Post('v1/profissional', novoProfissional).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                            }
                            else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                            this.desabilitarBotao = false
                            this.limpaCampos()
                            this.recebeDadosProfissional()
                        }).catch((err) => {
                            this.$q.notify({
                                message: 'Erro ao cadastrar profissional, verifique as informações',
                                color: 'red',
                                timeout: 2000
                            })
                            this.desabilitarBotao = false
                            console.log(err)
                        })
                    }, 1000)
                })
            })
        }
    },
    mounted() {
        this.recebeDadosProfissional()
    }
}
</script>

<style scoped>
    
</style>