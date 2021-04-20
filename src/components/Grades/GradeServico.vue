<template>
    <div class="transparent">
        <div class="q-mb-xs row" style="justify-content: space-between">
            <div class="q-ml-xs">
                <q-btn @click="abrirModalProduto" size="14px" round color="red" icon="shopping_cart" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Produtos</q-tooltip>
                </q-btn>
                <q-btn @click="abrirModalCliente" size="14px" round color="primary" icon="person_search" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Cliente</q-tooltip>
                </q-btn>
                <q-btn @click="abrirModalProfissional" size="14px" round color="accent" icon="group" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Profissional</q-tooltip>
                </q-btn>
                <q-btn @click="abrirModalServico" size="14px" round color="black" icon="content_cut">
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Serviços</q-tooltip>
                </q-btn>
            </div>
            <div>
                <q-fab
                    v-model="fab1"
                    icon="keyboard_arrow_right"
                    direction="left"
                    color="green"
                    padding="sm"
                    hide-label
                >
                    <q-fab-action v-if="dadosUsuario.Root === 'S'" @click="exibirModalCaixa" color="primary" icon="attach_money" label="Caixa" />
                    <q-fab-action @click="abrirModalFormaPagamento" color="secondary" icon="store" label="Forma de Pagamento" />
                </q-fab>
            </div>
        </div>

        <div class="q-mt-sm">
            <q-card>
                <q-tabs
                    dense
                    v-model="tabela"
                    class="text-dark"
                    active-color="brown"
                    indicator-color="brown"
                    align="justify"
                    style="height: 50px"
                >
                    <q-tab name="emAberto" label="Em Aberto" />
                    <q-tab name="aReceber" label="A Receber" />
                    <q-tab name="finalizado" label="Finalizado" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tabela" animated>
                    <q-tab-panel name="emAberto">
                        <TabelaAtendimento
                            ref="tabelaAtendimentoAberto"
                            TituloTabela="Atendimentos em Aberto"
                            MensagemTabelaSemDados="Nenhum atendimento em aberto..."
                            TipoTabela="A"
                            :MaximoLinha="maximoLinhas"
                            :AbreModalInclusao="exibirModalInclusao"
                            :AcaoBotaoInclusao="exibirModalInsereItens"
                            :TabelaEmAberto="true"
                            :BotaoAdicionarVisivel="true"
                        />
                    </q-tab-panel>

                    <q-tab-panel name="aReceber">
                        <TabelaAtendimento
                            ref="tabelaAtendimentoFinanceiro"
                            TituloTabela="Atendimentos a Receber"
                            MensagemTabelaSemDados="Nenhum atendimento a receber..."
                            TipoTabela="B"
                            :MaximoLinha="maximoLinhas"
                            :AcaoBotaoInclusao="exibirModalInsereFormaDePagamento"
                            :AbreModalInclusao="() => {}"
                            :TabelaFinanceiro="true"
                        />
                    </q-tab-panel>

                    <q-tab-panel name="finalizado">
                        <TabelaAtendimento
                            ref="tabelaAtendimentoFinalizado"
                            TituloTabela="Atendimentos Finalizados"
                            MensagemTabelaSemDados="Nenhum atendimento finalizado..."
                            TipoTabela="C"
                            :MaximoLinha="maximoLinhas"
                            :AbreModalInclusao="() => {}"
                            :TabelaFinalizado="true"
                            :ExibeModalVisualizacao="exibirModalVisualizacao"
                        />
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>
        </div>
        <ModalOrdemServico ref="modalOrdemServico" @atualizaGrade="recebeDadosTabelas('A')" @atualizaGradeEmAberto="recebeDadosTabelas('A')" @atualizaGradeFinanceiro="recebeDadosTabelas('B')" />
        <ModalProduto ref="modalProduto" />
        <ModalProfissional ref="modalProfissional" />
        <ModalCliente ref="modalCliente" />
        <ModalServico ref="modalServico" />
        <ModalFormaPagamento ref="modalFormaPagamento" />
        <ModalCaixa ref="modalCaixa" />
    </div>
</template>

<script>
import { Get } from '../../utils/Conexao'
import ModalOrdemServico from '../Modal/ModalOrdemServico.vue'
import ModalProduto from '../Modal/ModalProduto.vue'
import ModalProfissional from '../Modal/ModalProfissional.vue'
import ModalCliente from '../Modal/ModalCliente.vue'
import ModalServico from '../Modal/ModalServico.vue'
import ModalFormaPagamento from '../Modal/ModalFormaPagamento.vue'
import TabelaAtendimento from '../Tabelas/TabelaAtendimento.vue'
import ModalCaixa from '../Modal/ModalCaixa.vue'

export default {
    name: 'Servicos',
    components: {
        ModalOrdemServico, ModalProduto,
        ModalProfissional, ModalCliente,
        ModalServico, ModalFormaPagamento,
        ModalCaixa, TabelaAtendimento
    },
    data () {
        return {
            fab1: false,
            maximoLinhas: [5],
            tabela: 'emAberto',
            nomeProfissional: '',
            nomeCliente: '',
            telefoneCliente: '',
            filtroBuscar: '',
            separator: 'cell',
            dadosUsuario: {},
            caixaOperador: [],
            dados: [],
            colunas: [
                { name: 'showme', required: true, label: 'Inclusão', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'id', required: true, label: 'ID', align: 'right', field: 'id', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'situacao', required: true, label: 'Situação', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-blue-10 text-white' },
                { name: 'cliente', required: true, label: 'Cliente', align: 'left', classes: 'bg-grey-3 text-dark', headerClasses: 'bg-grey-8 text-white' },
                { name: 'celular', required: true, label: 'Celular', align: 'left', classes: 'bg-grey-3 text-dark', headerClasses: 'bg-grey-8 text-white' },
                { name: 'dataServico', required: true, label: 'Data e Hora do Serviço', align: 'left', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'profissional', required: true, label: 'Profissional', align: 'left', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' },
                { name: 'acoes', required: true, label: 'Opções', align: 'center', classes: 'bg-grey-2 text-dark', headerClasses: 'bg-dark text-white' }
            ]
        }
    },
    methods: {
        abrirModalProduto() {
            this.$refs.modalProduto.abreModalProduto()
        },
        abrirModalProfissional() {
            this.$refs.modalProfissional.abreModalProfissional()
        },
        abrirModalCliente() {
            this.$refs.modalCliente.abreModalCliente()
        },
        abrirModalServico() {
            this.$refs.modalServico.exibeModalServico()
        },
        abrirModalFormaPagamento() {
            this.$refs.modalFormaPagamento.exibeModalFormaPagamento()
        },
        exibirModalInclusao() {
            this.$refs.modalOrdemServico.exibirModalInclusao('Inclusão')
        },
        exibirModalVisualizacao(dados) {
            this.$refs.modalOrdemServico.exibirModalVisualizacao('Visualização', dados)
        },
        exibirModalInsereItens(dados) {
            this.$refs.modalOrdemServico.exibirModalInsereItens('Inserir Itens', dados)
        },
        exibirModalInsereFormaDePagamento(dados) {
            this.$refs.modalOrdemServico.exibirModalInsereFormaPagamento('Inserir Forma de Pagamento', dados)
        },
        exibirModalCaixa() {
            this.$refs.modalCaixa.exibirModal()
        },
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Tem certeza que deseja excluir este Atendimento ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        verificaTokenValido() {
            var obj = localStorage.getItem('token')
            if (obj != null || obj != '' || obj != undefined) {
                Get('v1/empresa/usuario/token').then(res => {
                    if (res.status == 200) {
                        console.log('O.K')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$router.push('/')
                })
            }
        },
        recebeDadosTabelas(tipoTabela) {
            if (tipoTabela == 'A') {
                this.$refs.tabelaAtendimentoAberto.recebeDadosTabela(tipoTabela)
            } else if (tipoTabela == 'B') {
                this.$refs.tabelaAtendimentoFinanceiro.recebeDadosTabela(tipoTabela)
            } else if (tipoTabela == 'C') {
                this.$refs.tabelaAtendimentoFinalizado.recebeDadosTabela(tipoTabela)
            }
        },
        dadosLocalStorage() {
            const obj = JSON.parse(localStorage.getItem('tokenContent'))
            this.dadosUsuario = obj
        }
    },
    created() {
        this.dadosLocalStorage()
    },
    mounted () {
        this.recebeDadosTabelas('A')
        this.verificaTokenValido()
    }
}
</script>