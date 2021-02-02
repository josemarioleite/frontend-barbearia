<template>
  <q-dialog v-model="exibeModal" persistent>
      <q-layout view="Lhh lpR fff" container class="bg-brown">
          <q-header class="bg-dark" style="padding: 5px">
            <q-toolbar-title class="col-12">Forma de Pagamento</q-toolbar-title>
          </q-header>

          <q-page-container>
              <q-page style="padding: 10px">
                  <div class="row">
                      <q-input :error="erroDescricao" :error-message="erroMSGDescricao" v-model="descricaoFormaPagamento" bg-color="white" class="col-md-7 col-xs-12" color="dark" label-color="dark" filled label="Descrição">
                        <template v-slot:prepend>
                            <q-icon name="credit_card" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input :error="erroTitulo" :error-message="erroMSGTitulo" v-model="tituloFormaPagamento" class="col-md-3 col-xs-12" bg-color="white" color="dark" label-color="dark" filled label="Título">
                        <template v-slot:prepend>
                            <q-icon name="request_quote" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <div class="row justify-center">
                        <q-btn @click="insereFormaPagamento" :disable="desabilitarBotao" class="col-md-1 col-xs-12" color="green" icon="add" style="width: 55px; height: 55px"  />
                      </div>
                  </div>

                  <q-table
                    dense
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
                            <q-btn @click="recebeDadosTabela" size="12px" color="green" icon="update" round>
                                <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Atualizar Tabela</q-tooltip>
                            </q-btn>
                            <div class="q-ml-md" style="font-size: 1.3rem">Lista</div>
                        </div>
                    </template>
                    
                    <template v-slot:body-cell-dataInclusao="props">
                        <q-td key="dataInclusao" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}}</q-td>
                    </template>

                    <template v-slot:body-cell-acoes="props">
                        <q-td key="acoes" :props="props">
                            <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                                <q-list>
                                    <q-item clickable v-close-popup @click="deletaFormaPagamento(props.row.id)">
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

                                    <q-item clickable v-close-popup @click="exibeModalAlteracao(props.row)">
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
              </q-page>
          </q-page-container>

          <q-footer class="transparent" reveal>
            <div class="row justify-center q-mb-sm">
                <q-btn color="red" icon="close" label="Fechar" @click="exibeModalFormaPagamento" />
            </div>
          </q-footer>
          <FormaPagamento ref="formaPagamento" @atualizaTabela="recebeDadosTabela" />
      </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete } from 'src/utils/Conexao.js'
import { FormaPagamentoIncluir } from 'src/models/FormasPagamento/FormaPagamento.js'
import FormaPagamento from '../AlteraItem/FormaPagamento.vue'

export default {
    name: 'Forma-Pagamento',
    components: { FormaPagamento },
    data () {
        return {
            totalLinhasTabela: [5],
            dados: [],
            colunas: [
                { name: 'id', align: 'right', label: 'Id', field: 'id', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'descricao', align: 'left', label: 'Descrição', field: 'descricao', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'titulo', align: 'left', label: 'Título', field: 'titulo', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'dataInclusao', align: 'left', label: 'Data Inclusão', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'acoes', align: 'center', label: 'Ações', headerClasses: 'bg-dark text-white text-bold'}
            ],
            exibeModal: false,
            erroDescricao: false,
            erroTitulo: false,
            desabilitarBotao: false,
            carregando: false,
            filtroTabela: '',
            erroMSGDescricao: '',
            erroMSGTitulo: '',
            descricaoFormaPagamento: '',
            tituloFormaPagamento: ''
        }
    },
    methods: {
        exibeModalFormaPagamento() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        exibeModalAlteracao(dados) {
            this.$refs.formaPagamento.exibeModalFormaPagamento('Alteração', dados)
        },
        recebeDadosTabela() {
            this.carregando = true
            Get('v1/formapagamento').then(res => {
                this.dados = res.data
                this.carregando = false
            }).catch(err => {
                console.log(err)
                this.carregando = false
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

                if (this.descricaoFormaPagamento === '' || this.descricaoFormaPagamento === null) {
                    this.erroDescricao = true
                    this.erroMSGDescricao = 'O Campo "Descrição" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroDescricao = false
                    campoVazio = false
                }

                if (this.tituloFormaPagamento === '' || this.tituloFormaPagamento === null) {
                    this.erroTitulo = true
                    this.erroMSGTitulo = 'O Campo "Valor" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroTitulo = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        limparCampos() {
            this.descricaoFormaPagamento = null
            this.tituloFormaPagamento = null
        },
        deletaFormaPagamento(id) {
            this.confirmacao('Tem certeza que deseja excluir essa forma de pagamento ?').then(() => {
                this.$q.notify({
                    message: 'Excluindo...',
                    color: 'primary',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/formapagamento/' + id).then(res => {
                        if (res.data.status == true) {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'green',
                                timeout: 2000
                            })
                            this.limparCampos()
                            this.recebeDadosTabela()
                        } else {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'red',
                                timeout: 2000
                            })
                        }
                    }).catch(err => {
                        this.$q.notify({
                            message: 'Não foi possível fazer a exclusão, tente novamente mais tarde',
                            color: 'red',
                            timeout: 2000
                        })
                    })
                }, 1000);
            })
        },
        insereFormaPagamento() {
            this.confirmacao('Tem certeza que deseja inserir essa forma de pagamento ?').then(() => {
                this.validaCampos().then(() => {
                    this.$q.notify({
                        message: 'Incluindo...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        var titulo = this.tituloFormaPagamento
                        var descricao = this.descricaoFormaPagamento
                        var formaPagamento = new FormaPagamentoIncluir()
                        formaPagamento.Descricao = descricao.toUpperCase()
                        formaPagamento.Titulo = titulo.toUpperCase()
                        Post('v1/formapagamento', formaPagamento).then(res => {
                            if (res.data.status == true) {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'green',
                                    timeout: 2000
                                })
                                this.limparCampos()
                                this.recebeDadosTabela()
                            } else {
                                this.$q.notify({
                                    message: res.data.msg,
                                    color: 'red',
                                    timeout: 2000
                                })
                            }
                        }).catch(err => {
                            this.$q.notify({
                                message: 'Não foi possível fazer inclusão, tente novamente mais tarde',
                                color: 'red',
                                timeout: 2000
                            })
                        })
                    }, 1000)
                })
            })
        }
    },
    created() {
        this.recebeDadosTabela()
    }
}
</script>

<style>

</style>