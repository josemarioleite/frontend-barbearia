<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="bg-brown">
            <q-header style="padding: 5px" class="bg-dark">
                <q-toolbar-title>Serviços</q-toolbar-title>
            </q-header>

            <q-page-container>
                <q-page style="padding: 10px">
                    <div class="row q-mb-xs">
                      <q-input v-model="descricaoServico" :error="erroDescricaoServico" :error-message="erroMSGDescricao" class="col-md-5 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Descrição">
                        <template v-slot:prepend>
                            <q-icon name="construction" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <q-input mask="#.##" reverse-fill-mask prefix="R$" v-model="valorServico" :error="erroValorServico" :error-message="erroMSGValor" class="col-md-5 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Valor do Serviço">
                        <template v-slot:prepend>
                            <q-icon name="attach_money" color="brown" />
                        </template>
                      </q-input>

                      <q-space />

                      <div class="row justify-center">
                        <q-btn @click="insereNovoServico" :disable="desabilitarBotao" class="col-md-1 col-xs-12" color="green" icon="add" style="width: 55px; height: 55px" />
                      </div>
                    </div>

                    <q-table
                        dense
                        separator="cell"
                        :loading="carregando"
                        :rows-per-page-options="totalLinhasTabela"
                        :filter="filtroTabela"
                        :data="dados"
                        :columns="colunas"
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
                            <q-input dense v-model="filtroTabela" class="q-ml-xs" placeholder="Buscar serviço...">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:body-cell-createdAt="props">
                            <q-td key="createdAt" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}}</q-td>
                        </template>

                        <template v-slot:body-cell-valor="props">
                            <q-td key="valor" :props="props">R$ {{props.row.valor.toFixed(2)}}</q-td>
                        </template>

                        <template v-slot:body-cell-acoes="props">
                            <q-td key="acoes" :props="props">
                                <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                                    <q-list>
                                        <q-item clickable v-close-popup @click="abreModalVisualizacao(props.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="visibility" color="green" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>Visualizar</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-icon name="check_circle" color="green" />
                                            </q-item-section>
                                        </q-item>

                                        <q-item clickable v-close-popup @click="deletaServico(props.row.id)">
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

                                        <q-item clickable v-close-popup @click="abreModalAlteracao(props.row)">
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

            <q-footer class="transparent">
                <div class="row justify-center q-mb-md">
                    <q-btn color="red" icon="close" label="Fechar" @click="exibeModalServico" />
                </div>
            </q-footer>
            <DadosServico ref="dadosServico" @atualizaTabela="recebeDadosTabela" />
        </q-layout>
    </q-dialog>
</template>

<script>
import { Get, Post, Delete } from 'src/utils/Conexao.js'
import { Servico } from 'src/models/Servicos/Servico.js'
import DadosServico from 'src/components/AlteraItem/Servico.vue'

export default {
    name: 'ModalServico',
    components: {
        DadosServico
    },
    data () {
        return {
            carregando: false,
            exibeModal: false,
            erroDescricaoServico: false,
            erroValorServico: false,
            desabilitarBotao: false,
            dados: [],
            totalLinhasTabela: [6],
            erroMSGDescricao: '',
            erroMSGValor: '',
            descricaoServico: '',
            valorServico: '',
            filtroTabela: '',
            colunas: [
                { name: 'id', align: 'right', label: 'ID', field: 'id', sortable: true, headerClasses: 'bg-dark text-white' },
                { name: 'descricao', align: 'left', label: 'Descrição', field: 'descricao', sortable: true, headerClasses: 'bg-dark text-white' },
                { name: 'createdAt', align: 'left', label: 'Data de Inclusão', sortable: true, headerClasses: 'bg-dark text-white' },
                { name: 'valor', align: 'right', label: 'Valor', sortable: true, headerClasses: 'bg-dark text-white' },
                { name: 'acoes', align: 'right', label: 'Ações', sortable: true, headerClasses: 'bg-dark text-white' }
            ],
        }
    },
    methods: {
        abreModalVisualizacao(dados) {
            this.$refs.dadosServico.abreModalVisualizacao('Visualização', dados)
        },
        abreModalAlteracao(dados) {
            this.$refs.dadosServico.abreModalAlteracao('Alteração', dados)
        },
        exibeModalServico() {
            this.exibeModal = !this.exibeModal
        },
        recebeDadosTabela() {
            this.carregando = true
            Get('v1/servico').then(res => {
                this.dados = res.data
                this.carregando = false
            }).catch(err => {
                console.log(err)
                this.carregando = false
            })
        },
        limparCampos() {
            this.descricaoServico = null
            this.valorServico = null
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
        deletaServico(id) {
            this.confirmacao('excluir').then(() => {
                this.$q.notify({
                    message: 'Carregando...',
                    color: 'primary',
                    timeout: 2000
                })
                setTimeout(() => {
                    Delete('v1/servico/' + id).then(res => {
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
                        this.recebeDadosTabela()
                    }).catch(err => {
                        console.log(err)
                    })
                }, 1000)
            })
        },
        insereNovoServico() {
            this.validaCampos().then(() => {
                this.confirmacao('incluir').then(() => {
                    this.desabilitarBotao = true
                    var servico = new Servico()
                    servico.Descricao = this.descricaoServico.toUpperCase()
                    servico.Valor = this.valorServico
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        Post('v1/servico', servico).then(res => {
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
                            this.recebeDadosTabela()
                        }).catch(err => {
                            console.log(err)
                        })
                    }, 1000)
                })
            })
        }
    },
    beforeMount() {
        this.recebeDadosTabela()
    }
}
</script>

<style scoped>

</style>