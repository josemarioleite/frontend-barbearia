<template>
    <div>
        <q-table
            separator="cell"
            :no-data-label="MensagemTabelaSemDados"
            :loading="carregando"
            :rows-per-page-options="maximoLinhas"
            :filter="filtroBuscar"
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
                    <q-btn @click="showLoading(TipoTabela)" size="12px" color="green" icon="update" round>
                        <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Atualizar Tabela</q-tooltip>
                    </q-btn>
                    <div class="q-ml-md tituloTabela">{{tituloTabela}}</div>
                </div>
            </template>

            <template v-slot:top-right>
                <div v-show="botaoAdicionarVisivel == true">
                    <q-btn rounded class="botaoAdicionar" @click="adicionarNovoAtendimento" color="teal" icon="add">
                        <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Adicionar Novo Atendimento</q-tooltip>
                    </q-btn>
                </div>
                <q-input class="row justify-center inputPesquisa" dense v-model="filtroBuscar" placeholder="Pesquisar...">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body-cell-showme="props">
                <q-td key="showme" :props="props">
                    <q-btn @click="AcaoBotaoInclusao(props.row)" v-if="props.row.situacaoId == 1" icon="content_cut" dense color="primary" :props="props" size="10px" class="q-mr-sm">
                        <q-tooltip content-style="font-size: 12px" transition-show="flip-right" transition-hide="flip-left">Inserir Item no Atendimento - N°{{props.row.id}}</q-tooltip>
                    </q-btn>
                    <q-btn @click="AcaoBotaoInclusao(props.row)" v-if="props.row.situacaoId == 2" icon="content_cut" dense color="green" :props="props" size="10px" class="q-mr-sm">
                        <q-tooltip content-style="font-size: 12px" transition-show="flip-right" transition-hide="flip-left">A Receber do Atendimento - N°{{props.row.id}}</q-tooltip>
                    </q-btn>
                    <q-btn v-if="props.row.situacaoId == 3" icon="done" dense color="red" :props="props" size="10px" class="q-mr-sm">
                        <q-tooltip content-style="font-size: 12px" transition-show="flip-right" transition-hide="flip-left">Atendimento - N°{{props.row.id}} finalizado</q-tooltip>
                    </q-btn>
                    <q-btn v-if="props.row.situacaoId == 4" icon="clear" dense color="yellow" :props="props" size="10px" class="q-mr-sm">
                        <q-tooltip content-style="font-size: 12px" transition-show="flip-right" transition-hide="flip-left">Atendimento - N°{{props.row.id}} cancelado</q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <!-- <template v-slot:body-cell-situacao="props">
                <q-td key="situacao" :props="props">
                    <div v-if="props.row.situacaoId == 1">
                        <q-btn icon="iens" round dense color="primary" :props="props" size="10px" class="q-mr-sm">
                            <q-tooltip content-style="font-size: 14px" transition-show="flip-right" transition-hide="flip-left">Situação: {{props.row.situacao.descricao}}</q-tooltip>
                        </q-btn>
                    </div>
                    <div v-if="props.row.situacaoId == 2">
                        <q-btn icon="iens" round dense color="green" :props="props" size="10px" class="q-mr-sm">
                            <q-tooltip content-style="font-size: 14px" transition-show="flip-right" transition-hide="flip-left">Situação: {{props.row.situacao.descricao}}</q-tooltip>
                        </q-btn>
                    </div>
                    <div v-if="props.row.situacaoId == 3">
                        <q-btn icon="iens" round dense color="red" :props="props" size="10px" class="q-mr-sm">
                            <q-tooltip content-style="font-size: 14px" transition-show="flip-right" transition-hide="flip-left">Situação: {{props.row.situacao.descricao}}</q-tooltip>
                        </q-btn>
                    </div>
                    <div v-if="props.row.situacaoId == 4">
                        <q-btn icon="iens" round dense color="yellow" :props="props" size="10px" class="q-mr-sm">
                            <q-tooltip content-style="font-size: 14px" transition-show="flip-right" transition-hide="flip-left">Situação: {{props.row.situacao.descricao}}</q-tooltip>
                        </q-btn>
                    </div>
                </q-td>
            </template> -->

            <template v-slot:body-cell-cliente="props">
                <q-td key="cliente" :props="props">{{props.row.cliente.nome}}</q-td>
            </template>

            <template v-slot:body-cell-celular="props">
                <q-td key="celular" :props="props">{{props.row.cliente.telefoneCelular}}</q-td>
            </template>

            <template v-slot:body-cell-dataServico="props">
                <q-td key="dataServico" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}} - {{new Date(props.row.createdAt).toLocaleTimeString('pt-BR')}}</q-td>
            </template>

            <template v-slot:body-cell-profissional="props">
                <q-td key="profissional" :props="props">{{props.row.profissional.nome}}</q-td>
            </template>

            <template v-slot:body-cell-acoes="props">
                <q-td key="acoes" :props="props">
                    <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                        <q-list>
                            <!-- <q-item v-if="props.row.situacaoId == 3" clickable v-close-popup @click="abreRelatorioAtendimento(props.row.id)">
                                <q-item-section avatar>
                                    <q-avatar icon="receipt_long" color="accent" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>Relatório</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-icon name="receipt" color="accent" />
                                </q-item-section>
                            </q-item> -->

                            <q-item v-if="props.row.situacaoId == 3" clickable v-close-popup @click="ExibeModalVisualizacao(props.row)">
                                <q-item-section avatar>
                                    <q-avatar icon="remove_red_eye" color="primary" text-color="white" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>Visualizar</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-icon name="open_in_new" color="blue" />
                                </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="desativaAtendimento(props.row.id)">
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
                        </q-list>
                    </q-btn-dropdown>
                </q-td>
            </template>
        </q-table>
        <q-dialog v-model="alerta" persistent>
            <q-card class="bg-dark">
                <q-card-section class="bg-red-7 text-white row">
                    <q-icon name="warning" class="text-yellow" style="font-size: 2rem; margin-right: 5px" />
                    <div class="text-h6">Atenção</div>
                </q-card-section>

                <q-card-section class="q-mt-sm text-white">{{mensagemAlerta}}</q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Fechar" color="red" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { Get, Delete } from 'src/utils/Conexao.js'
export default {
    name: 'Tabela-Atendimento',
    props: {
        ExibeModalInclusao: Function,
        ExibeModalVisualizacao: Function,
        MaximoLinha: Array,
        TipoTabela: String,
        MensagemTabelaSemDados: String,
        TituloTabela: String,
        FiltroBusca: String,
        BotaoAdicionarVisivel: Boolean,
        TabelaFinalizado: Boolean,
        TabelaEmAberto: Boolean,
        TabelaFinanceiro: Boolean,
        AcaoBotaoInclusao: Function,
        AbreModalInclusao: Function
    },
    data () {
        return {
            alerta: false,
            mensagemAlerta: '',
            tituloTabela: this.TituloTabela,
            maximoLinhas: this.MaximoLinha,
            filtroBuscar: this.FiltroBusca,
            botaoAdicionarVisivel: this.BotaoAdicionarVisivel,
            tipoTabela: this.TipoTabela,
            carregando: false,
            caixaAberto: [],
            dados: [],
            colunas: [
                { name: 'showme', required: true, label: 'Inclusão', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'id', required: true, label: 'ID', align: 'right', field: 'id', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                // { name: 'situacao', required: true, label: 'Situação', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-blue-10 text-white' },
                { name: 'cliente', required: true, label: 'Cliente', align: 'left', classes: 'bg-grey-3 text-dark', headerClasses: 'bg-grey-8 text-white' },
                { name: 'celular', required: true, label: 'Celular', align: 'left', classes: 'bg-grey-3 text-dark', headerClasses: 'bg-grey-8 text-white' },
                { name: 'dataServico', required: true, label: 'Data do Serviço', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'profissional', required: true, label: 'Profissional', align: 'left', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'acoes', required: true, label: 'Opções', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' }
            ],
        }
    },
    methods: {
        adicionarNovoAtendimento() {
            this.obterCaixaOperador()

            setTimeout(() => {
                var dados = this.verificaCaixaOperador()

                if (dados == true) {
                    this.AbreModalInclusao()
                } else {
                    this.alerta = !this.alerta
                    this.mensagemAlerta = 'Para inserir um novo atendimento é necessário um Caixa Operador estar aberto, por favor, verifique antes.'
                }
            }, 350);
        },
        notificacao(msg) {
            this.$q.notify({
                message: msg,
                color: 'purple',
                timeout: 750
            })
        },
        recebeDadosTabela(tipoTabela, exibeNotificacao) {
            // Tipo A => Em Aberto
            // Tipo B => A Receber
            // TIpo C => Finalizado
            if (tipoTabela == 'A') {
                this.carregando = true
                if (this.TabelaEmAberto == true) {
                    Get('v1/atendimento/aberto').then(res => {
                        this.dados = res.data
                        if (exibeNotificacao === 'S') {
                            this.notificacao('Atendimentos em aberto carregado')
                        }
                        this.carregando = false
                    })
                }
            } else if (tipoTabela == 'B') {
                this.carregando = true
                if (this.TabelaFinanceiro == true) {
                    Get('v1/atendimento/financeiro').then(res => {
                        this.dados = res.data
                        if (exibeNotificacao === 'S') {
                            this.notificacao('Atendimentos a receber carregado')
                        }
                        this.carregando = false
                    })
                }
            } else if (tipoTabela == 'C') {
                this.carregando = true
                if (this.TabelaFinalizado == true) {
                    Get('v1/atendimento/finalizado').then(res => {
                        this.dados = res.data
                        if (exibeNotificacao === 'S') {
                            this.notificacao('Atendimentos finalizados carregado')
                        }
                        this.carregando = false
                    })
                }
            }
        },
        confirmacao(id) {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Tem certeza que deseja excluir o Atendimento n°: ' + id + '?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        abreRelatorioAtendimento(id) {
            this.$router.push('/relatorio/' + id)
        },
        desativaAtendimento(id) {
            this.confirmacao(id).then(() => {
                this.$q.notify({
                    message: 'Deletando...',
                    color: 'primary',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/atendimento/' + id).then(res => {
                        if (res.data.status == true) {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'green',
                                timeout: 2000
                            })
                            Delete('v1/itemformapagamento/' + id).then(res => {
                                if (res.data.status == true) {
                                    console.log('O.K, forma de pagamento excluído')
                                }
                            }).catch(err => console.log('Erro ao deletar item de pagamento'))
                            this.recebeDadosTabela(this.TipoTabela, 'N')
                        } else {
                            this.$q.notify({
                                message: res.data.msg,
                                color: 'green',
                                timeout: 2000
                            })
                        }
                        this.recebeDadosTabela(this.TipoTabela, 'N')
                    }).catch(err => {
                        console.log(err)
                    })
                }, 1000);
            })
        },
        obterCaixaOperador() {
            Get('v1/caixaoperador').then(res => {
                this.caixaAberto = res.data
            }).catch(err => console.log('Erro: ' + err))
        },
        verificaCaixaOperador() {
            //Função responsável por verificar se o Caixa operador está aberto ou não
            var dados = this.caixaAberto

            for (var i = 0; i < dados.length; i++) {
                if (dados[i].caixaAberto === 'S') {
                    return true
                } else {
                    return false
                }
            }
        },
        showLoading(dado) {
            this.$q.loading.show()
            this.timer = setTimeout(() => {
                this.recebeDadosTabela(dado, 'S')
                this.$q.loading.hide()
                this.timer = void 0
            }, 2000)
        }
    },
    beforeDestroy () {
        if (this.timer !== void 0) {
            clearTimeout(this.timer)
            this.$q.loading.hide()
        }
    },
    created() {
        this.obterCaixaOperador()
        this.recebeDadosTabela('A', 'N')
        this.recebeDadosTabela('B', 'N')
        this.recebeDadosTabela('C', 'N')
    }
}
</script>

<style scoped>
    .tituloTabela {
        font-size: 1.3rem;
    }

    .botaoAdicionar {
        margin-right: 10px;
        width: 40px;
        height: 40px;
    }

    @media only screen and (max-width: 450px) {
        .hide-label {
            display: none !important;
        }
        
        .botaoAdicionar {
            margin-top: 5px;
            width: 38px;
            height: 35px;
        }
        .tituloTabela {
            font-size: 1.1rem;
        }

        .inputPesquisa {
            width: 225px;
        }
    }
</style>