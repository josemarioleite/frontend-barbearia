<template>
  <q-dialog v-model="exibeModal" persistent>
      <q-layout view="Lhh lpR fff" container class="bg-brown">
          <q-header class="bg-dark" style="padding: 5px">
              <q-toolbar-title class="col-12">Produtos</q-toolbar-title>
          </q-header>

          <q-page-container>
              <q-page style="padding: 10px">
                  <div class="row q-mb-xs">
                      <q-input :error="erroCampoNome" :error-message="erroMsgNome" v-model="nomeProduto" class="col-md-5 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Nome do Produto">
                        <template v-slot:prepend>
                            <q-icon name="store" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input mask="#.##" prefix="R$" reverse-fill-mask :error="erroCampoValor" :error-message="erroMsgValor" v-model="valorProduto" class="col-md-5 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Valor do Produto">
                        <template v-slot:prepend>
                            <q-icon name="attach_money" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <div class="row justify-center">
                        <q-btn :disable="desabilitarBotao" class="col-md-1 col-xs-12 botaoAdicionar" color="green" @click="insereNovoProduto">
                            <q-icon name="add" class="iconeBotaoAdicionar" />
                            <label class="hide-Label">Adicionar Produto</label>
                        </q-btn>
                      </div>
                  </div>
                  <q-table
                    dense
                    class="tabela"
                    title="Lista"
                    separator="cell"
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
                            <q-btn @click="recebeDadosProdutos" size="12px" color="green" icon="update" round>
                                <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Atualizar Tabela</q-tooltip>
                            </q-btn>
                            <div class="q-ml-md" style="font-size: 1.3rem">Lista</div>
                        </div>
                    </template>
                                        
                    <template v-slot:top-right>
                        <q-input dense v-model="filtroTabela" class="buscarProduto" placeholder="Buscar produto...">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    
                    <template v-slot:body-cell-dataInclusao="props">
                        <q-td key="dataInclusao" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}}</q-td>
                    </template>

                    <template v-slot:body-cell-valor="props">
                        <q-td key="valor" :props="props">R$ {{props.row.valor.toFixed(2)}}</q-td>
                    </template>

                    <template v-slot:body-cell-acoes="props">
                        <q-td key="acoes" :props="props">
                            <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                                <q-list>
                                    <q-item clickable v-close-popup @click="deletaProduto(props.row.id)">
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

                                    <q-item clickable v-close-popup @click="abrirModalDadosAlteracao(props.row)">
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
                  <div class="botaoFechar">
                     <q-btn color="red" icon="close" label="Fechar" @click="fechaModal" />
                  </div>
              </q-page>
          </q-page-container>

          <!-- <q-footer class="transparent"> -->
              
          <!-- </q-footer> -->
          <DadosProduto ref="dadosProduto" @atualizaTabela="recebeDadosProdutos" />
      </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete } from 'src/utils/Conexao.js'
import { Produto } from 'src/models/Produto/Produto.js'
import DadosProduto from '../AlteraItem/Produto.vue'

export default {
    name: 'Produto',
    components: {
        DadosProduto
    },
    data () {
        return {
            totalLinhasTabela: [6],
            nomeProduto: '',
            valorProduto: '',
            filtroTabela: '',
            erroMsgNome: '',
            erroMsgValor: '',
            carregando: false,
            erroCampoNome: false,
            erroCampoValor: false,
            desabilitarBotao: false,
            exibeModal: false,
            dados: [],
            colunas: [
                { name: 'id', align: 'right', label: 'Id', field: 'id', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'nome', align: 'left', label: 'Descrição', field: 'nome', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'dataInclusao', align: 'left', label: 'Data Inclusão', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'valor', align: 'right', label: 'Valor', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'acoes', align: 'center', label: 'Ações', headerClasses: 'bg-dark text-white text-bold'}
            ]
        }
    },
    methods: {
        abreModalProduto() {
            this.exibeModal = !this.exibeModal
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        abrirModalDadosVisualizacao(dados) {
            this.$refs.dadosProduto.abreModalVisualizacao('Visualizar Produto', dados)
        },
        abrirModalDadosAlteracao(dados) {
            this.$refs.dadosProduto.abreModalAlteracao('Alterar Produto', dados)
        },
        limparCampos() {
            this.nomeProduto = null
            this.valorProduto = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.nomeProduto === '' || this.nomeProduto === null) {
                    this.erroCampoNome = true
                    this.erroMsgNome = 'O Campo "Nome" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoNome = false
                    campoVazio = false
                }

                if (this.valorProduto === '' || this.valorProduto === null) {
                    this.erroCampoValor = true
                    this.erroMsgValor = 'O Campo "Valor" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoValor = false
                    campoVazio = false
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
                    title: 'Tem certeza que deseja incluir este Produto ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        recebeDadosProdutos() {
            this.carregando = true
            Get('v1/produto').then(res => {
                this.dados = res.data
                this.carregando = false
            }).catch(err => {
                console.log(err)
                this.carregando = false
            })
        },
        deletaProduto(idProduto) {
            this.confirmacao().then(() => {
                this.$q.notify({
                    message: 'Deletando...',
                    color: 'primary',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/produto/' + parseInt(idProduto)).then(res => {
                        this.$q.notify({
                            message: res.data.msg,
                            color: 'green',
                            timeout: 2000
                        })
                        this.recebeDadosProdutos()
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
        removeVirgula(valor) {
            var rpc = valor.replace(/,/g, ".")
            return rpc
        },
        insereNovoProduto() {
            this.validaCampos().then(() => {
                this.confirmacao().then(() => {
                    this.desabilitarBotao = true
                    const valor = this.removeVirgula(this.valorProduto)
                    const novoProduto = new Produto()
                    novoProduto.Nome = this.nomeProduto.toUpperCase()
                    novoProduto.Valor = parseFloat(valor)
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        Post('v1/produto', novoProduto).then(res => {
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
                            this.desabilitarBotao = false
                            this.limparCampos()
                            this.recebeDadosProdutos()
                        }).catch((err) => {
                            this.$q.notify({
                                message: 'Erro ao cadastrar produto, verifique as informações',
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
    created() {
        this.recebeDadosProdutos()
    }
}
</script>

<style scoped>
    .botaoAdicionar {
        width: 55px;
        height: 56px
    }

    .hide-Label {
        visibility: hidden;
    }

    .iconeBotaoAdicionar {
        margin-top: 12px;
    }

    .botaoFechar {
        position: absolute;
        margin: 10px;
        margin-left: 220px;
        bottom: 0;
        left: 0;
    }

    @media only screen and (max-width: 450px) {
        .botaoAdicionar {
            margin-left: 95px;
            width: 120px;
            height: 50px;
        }

        .hide-Label {
            visibility: visible;
        }

        .iconeBotaoAdicionar {
            margin-top: 0px;
        }

        .buscarProduto {
            width: 275px;
        }

        .botaoFechar {
            position: absolute;
            margin: 10px;
            margin-left: 106px;
            bottom: 0;
            left: 0;
        }
    }
</style>