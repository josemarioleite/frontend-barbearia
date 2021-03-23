<template>
  <q-dialog v-model="exibeModal" persistent full-height full-width>
      <q-layout view="Lhh lpR fff" container class="bg-brown">
          <q-header class="row bg-dark" style="padding: 5px">
              <q-toolbar-title>Clientes</q-toolbar-title>
              <q-btn @click="fechaModal" flat dense icon="close" align="right" />
          </q-header>

          <q-page-container>
              <q-page padding>
                <div class="row col-12">
                    <q-input :error="erroNomeCliente" :error-message="erroMsgNome" v-model="clienteNome" class="col-md-8 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Nome do Cliente">
                        <template v-slot:prepend>
                            <q-icon name="credit_card" color="brown" />
                        </template>
                    </q-input>

                    <q-space />

                    <q-input v-model="telefoneCliente" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :mask="mascaraNumero" :error="erroTelefoneCliente" :error-message="erroMsgTelefone" class="col-md-3 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Telefone/Celular">
                        <template v-slot:prepend>
                            <q-icon name="credit_card" color="brown" />
                        </template>
                    </q-input>

                    <q-space />

                    <div class="row justify-center">
                        <q-btn @click="insereNovoCliente" class="col-md-2 col-xs-12" color="green" icon="add" style="width: 55px; height: 56px"  />
                    </div>
                </div>
                <q-table
                    :rows-per-page-options="totalLinhasTabela"
                    :filter="filtroBusca"
                    :data="dados"
                    :columns="colunas"
                    :loading="carregando"
                    dense
                    separator="cell"
                    style="color: #000"
                    row-key="id"
                >
                    <template v-slot:no-data="{ icon, message, filter }">
                        <div class="full-width row flex-center text-red-8 q-gutter-sm" style="font-size: 1rem">
                            <q-icon size="2em" name="sentiment_dissatisfied" />
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
                    
                    <template v-slot:top-right>
                        <q-input dense v-model="filtroBusca" class="q-ml-xs" placeholder="Buscar nome do cliente...">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>

                    <template v-slot:body-cell-telefoneCelular="props">
                        <q-td key="telefoneCelular" :props="props">{{(props.row.telefoneCelular === '' || props.row.telefoneCelular === null) ? 'S/N' : props.row.telefoneCelular}}</q-td>
                    </template>

                    <template v-slot:body-cell-dataInclusao="props">
                        <q-td key="dataInclusao" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}} - {{new Date(props.row.createdAt).toLocaleTimeString('pt-BR')}}</q-td>
                    </template>

                    <template v-slot:body-cell-acoes="props">
                        <q-td key="acoes" :props="props">
                            <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                                <q-list>
                                    <q-item clickable v-close-popup @click="desativaCliente(props.row.id)">
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

                                    <q-item clickable v-close-popup @click="exibirModalAlteracaoCliente(props.row)">
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
                <div class="row justify-center" style="padding-top: 5px">
                    <q-btn color="red" icon="close" label="Fechar" @click="fechaModal" />
                </div>
              </q-page>
          </q-page-container>
          <DadosCliente ref="dadosCliente" @atualizaGrade="recebeDadosTabela" />
      </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete } from '../../utils/Conexao.js'
import { Cliente } from 'src/models/Clientes/Cliente.js'
import DadosCliente from '../AlteraItem/Cliente.vue'

export default {
    name: 'ModalCliente',
    components: {
        DadosCliente
    },
    data () {
        return {
            totalLinhasTabela: [6],
            exibeModal: false,
            erroNomeCliente: false,
            erroTelefoneCliente: false,
            carregando: false,
            mascaraNumero: '(##)# ####-####',
            erroMsgNome: '',
            erroMsgTelefone: '',
            clienteNome: '',
            telefoneCliente: '',
            filtroBusca: '',
            filtroBuscaInativo: '',
            dataCriacao: [],
            dados: [],
            colunas: [
                { name: 'id', required: true, label: 'ID', align: 'right', field: 'id', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-dark text-white' },
                { name: 'nome', required: true, label: 'Nome', align: 'left', field: 'nome', sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-dark text-white' },
                { name: 'telefoneCelular', required: true, label: 'Celular / Telefone', align: 'left', sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-dark text-white' },
                { name: 'dataInclusao', required: true, label: 'Data de Inclusão', align: 'left', sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-dark text-white' },
                { name: 'acoes', required: true, label: 'Opções', align: 'center', sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-dark text-white' },
            ]
        }
    },
    methods: {
        abreModalCliente() {
            this.exibeModal = !this.exibeModal
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        exibirModalAlteracaoCliente(dados) {
            this.$refs.dadosCliente.exibirModalAlteracao('Alterar Cliente', dados)
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
        limparCampos() {
            this.clienteNome = null
            this.telefoneCliente = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.clienteNome == '' || this.clienteNome == null) {
                    this.erroNomeCliente = true
                    this.erroMsgNome = 'O Campo "Nome" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroNomeCliente = false
                    campoVazio = false
                }

                if (this.telefoneCliente == '' || this.telefoneCliente == null) {
                    this.erroTelefoneCliente = true
                    this.erroMsgTelefone = 'O Campo "Telefone/Celular" é obrigatório!'
                    campoVazio = true
                } else {
                    this.clienteTelefone = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        recebeDadosTabela() {
            this.carregando = true
            Get('v1/cliente').then(res => {
                this.dados = res.data
                this.carregando = false
            }).catch(err => {
                console.log(err)
                this.carregando = false
            })
        },
        desativaCliente(id) {
            this.confirmacao('Tem certeza que desejar excluir esse cliente ?').then(() => {
                this.$q.notify({
                    message: 'Carregando...',
                    color: 'blue',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/cliente/' + id).then(res => {
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
                            message: 'Erro',
                            caption: 'Não foi possível fazer exclusão',
                            color: 'red'
                        })
                        console.log(err)
                    })
                }, 1000)
            })
        },
        insereNovoCliente() {
            this.confirmacao('Deseja incluir este cliente ?').then(() => {
                this.validaCampos().then(() => {
                    this.$q.notify({
                        message: 'Incluindo...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        var cliente = new Cliente()
                        cliente.Nome = this.clienteNome.toUpperCase()
                        cliente.TelefoneCelular = this.telefoneCliente
                        Post('v1/cliente', cliente).then(res => {
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
                            console.log(err.message)
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
    },
    mounted() {
        this.recebeDadosTabela()
    }
}
</script>

<style scoped>
    .footerPage {
        margin-left: 620px;
        margin-bottom: 10px;
        padding: 5px;
        bottom: 0;
        left: 0;
        position: fixed;
    }

    @media only screen and (max-width: 499px) {
        /* .footerPage {
            padding: 10px;
        } */
    }
</style>