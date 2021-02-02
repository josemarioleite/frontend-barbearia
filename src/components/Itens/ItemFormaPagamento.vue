<template>
    <div>
        <div v-show="isVisible == true">
            <hr class="q-mt-sm col-12">
            <div v-show="somenteLeitura == false" class="col-12 row items-center q-mb-xs">
                <q-select :disable="somenteLeitura" class="col-md-8 col-xs-12 q-pr-sm" option-value="id" option-label="descricao" v-model="formaPagamentoSelecionado" :options="formasDePagamentos" label="Selecionar Forma de Pagamento" />
                <q-input mask="#.##" reverse-fill-mask prefix="R$" :disable="somenteLeitura" class="col-md-3 col-xs-12 q-pr-xs" v-model.lazy="valorPagamento" label="Valor R$" />
                <q-btn @click="adicionaFormaDePagamento" :disable="somenteLeitura" class="col-md-1 col-xs-2 q-mt-xs" color="primary" icon="add" style="height: 40px">
                    <q-tooltip anchor="center left" self="center right">Adicionar Pagamento</q-tooltip>
                </q-btn>
            </div>
            <q-table
                dense
                :data="dados"
                :columns="colunas"
                :rows-per-page-options="maximoLinhas"
                title="Forma de Pagamento"
            >
                <template v-slot:top-right>
                    <q-btn v-show="somenteLeitura == false" @click="limpaCamposTabela" round size="10px" color="teal" icon="cleaning_services">
                        <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Limpar dados da tabela</q-tooltip>
                    </q-btn>
                </template>

                <template v-slot:body-cell-descricao="props">
                    <q-td key="descricao" :props="props">{{props.row.descricao}}</q-td>
                </template>

                <template v-slot:body-cell-titulo="props">
                    <q-td key="titulo" :props="props">{{props.row.titulo}}</q-td>
                </template>

                <template v-slot:body-cell-valor="props">
                    <q-td key="valor" :props="props">R$ {{props.row.valor.toFixed(2)}}</q-td>
                </template>

                <template v-slot:bottom>
                    <div v-show="somenteLeitura == false" class="col-12 q-mt-sm row justify-end" style="font-size: 1rem"><strong>Valor: R$ {{valorTotalFormaPagamento.toFixed(2)}}</strong></div>
                </template>
            </q-table>

            <div class="row col-xs-12 bg-white justify-end items-end q-mt-md" style="padding: 5px">
                <q-icon name="monetization_on" color="green" size="30px" class="q-mr-sm" />
                <div class="text-h6" ref="vlrTtotal"><strong>Valor Total: </strong>R$ {{valorTotal.toFixed(2)}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Get, Post } from 'src/utils/Conexao.js'
import { ItemFormaPagamentoIncluir } from 'src/models/FormasPagamento/ItemFormaPagamento.js'

export default {
    name: 'Item-Forma_Pagamento',
    props: {
        AtendimentoId: Number,
        ModoLeitura: Boolean,
        IsVisible: Boolean,
        DadosTabela: Array
    },
    data () {
        return {
            atendimentoId: this.AtendimentoId,
            somenteLeitura: this.ModoLeitura,
            dadosTabelaVisualizacao: this.DadosTabela,
            isVisible: this.IsVisible,
            valorDescontoPagamento: '',
            valorPagamento: '',
            valorTotal: 0,
            valorTotalFormaPagamento: 0,
            maximoLinhas: [4],
            pagamento: [],
            formaPagamentoSelecionado: [],
            formasDePagamentos: [],
            dados: [],
            colunas: [
                { name: 'id', align: 'right', label: 'Id', field: 'id', sortable: true },
                { name: 'descricao', align: 'left', label: 'Descrição', sortable: true },
                { name: 'titulo', align: 'left', label: 'Título', sortable: true },
                { name: 'valor', align: 'right', label: 'Valor', sortable: true },
            ]
        }
    },
    methods: {
        recebeDadosTabela() {
            Get('v1/formapagamento').then(res => {
                this.formasDePagamentos = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        limpaCamposTabela() {
            this.dados = []
            if (this.valorTotalFormaPagamento != null) {
                this.valorTotalFormaPagamento = 0
            }
            this.limparCampos()
        },
        limparCampos() {
            this.dados = []
            this.pagamento = []
            this.valorPagamento = null
            this.formaPagamentoSelecionado = []
        },
        recebeDadosVisualizacao() {
            Get('v1/itemformapagamento/' + this.atendimentoId).then(res => {
                var obj = {}
                for (var i = 0; i < res.data.length; i++) {
                    obj.id = res.data[i].id
                    obj.descricao = res.data[i].descricao
                    obj.titulo = res.data[i].formaPagamento.titulo
                    obj.valor = res.data[i].valor
                    this.dados.push(obj)
                    obj = {}
                }
            }).catch(err => {
                console.log(err)
            })
        },
        adicionaFormaDePagamento() {
            if (this.formaPagamentoSelecionado == null || this.formaPagamentoSelecionado == '') {
                this.$q.notify({
                    type: 'negative',
                    message: 'Por favor, Selecione uma forma de Pagamento',
                    timeout: 2000
                })
            } else if (this.valorPagamento == '' || this.valorPagamento == null) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Por favor, insira o valor',
                    timeout: 2000
                })
            } else {
                var valor = parseFloat(this.valorPagamento)
                var selecionado = Object()
                selecionado = this.formaPagamentoSelecionado

                var dado = Object()
                dado = this.dados

                var itens = Object()
                itens.id = selecionado.id
                itens.descricao = selecionado.descricao
                itens.titulo = selecionado.titulo
                itens.valor = parseFloat(valor)

                var itemFormaPagamento = new ItemFormaPagamentoIncluir()
                itemFormaPagamento.AtendimentoId = this.atendimentoId
                itemFormaPagamento.Descricao = selecionado.descricao
                itemFormaPagamento.FormaPagamentoId = selecionado.id
                itemFormaPagamento.Valor = parseFloat(valor)

                if (dado.find(x => x.id == itens.id)) {
                    this.$q.notify({
                        type: 'negative',
                        message: 'Forma de Pagamento já incluido',
                        timeout: 2000
                    })
                    this.formaPagamentoSelecionado = []
                    this.valorPagamento = null
                    this.valorDescontoPagamento = null
                } else {
                    const soma = parseFloat(this.valorTotalFormaPagamento) + parseFloat(valor)
                    if (valor > this.valorTotal) {
                        this.$q.notify({
                            type: 'negative',
                            message: 'O valor ultrapassa o Total, por favor, insira um valor correto!',
                            timeout: 3000
                        })
                    } else if (soma > this.valorTotal) {
                        this.$q.notify({
                            type: 'negative',
                            message: 'Valor total excedido, por favor, insira um valor correto!',
                            timeout: 3000
                        })
                    } else {
                        this.valorTotalFormaPagamento += Number(parseFloat(valor).toFixed(2))
                        this.dados.push(itens)
                        this.pagamento.push(itemFormaPagamento)
                        this.formaPagamentoSelecionado = []
                        this.valorPagamento = null
                        this.valorDescontoPagamento = null
                    }
                }
            }
        },
        salvarFormaPagamento() {
            return new Promise((resolve, reject) => {
                if (this.valorTotalFormaPagamento > 0) {
                    if (this.valorTotalFormaPagamento > this.valorTotal) {
                        this.$q.dialog({
                            dark: true,
                            title: 'Atenção',
                            message: 'Valor ultrapassa o Total, por favor, insira o Valor correto',
                            persistent: true
                        })
                    } else {
                        if (this.dados.length > 0) {
                            this.$q.notify({
                                color: 'primary',
                                message: 'Carregando...',
                                timeout: 1000
                            })
                            setTimeout(() => {
                                var item = this.pagamento
                                for (var i = 0; i < item.length; i++) {
                                    Post('v1/itemformapagamento', item[i]).then(res => {
                                    if (res.data.status == true) {
                                        this.$q.notify({
                                            color: 'green',
                                            message: res.data.msg,
                                            timeout: 2000
                                        })
                                        this.limparCampos()
                                        resolve(true)
                                    } else {
                                        this.$q.notify({
                                            color: 'red',
                                            message: res.data.msg,
                                            timeout: 2000
                                        })
                                    }
                                    }).catch(err => {
                                        this.$q.notify({
                                            type: 'negative',
                                            message: 'Erro ao inserir item, tente novamente mais tarde',
                                            timeout: 2000
                                        })
                                        console.log(err.message)
                                        reject(false)
                                        console.log('RESOLVE - - - - - >' + reject)
                                    })
                                }
                            }, 1000);
                        }
                    }
                } else {
                    this.$q.notify({
                        type: 'negative',
                        message: 'Tabela vazia...',
                        timeout: 3000
                    })
                }
            })
        },
        recebeDadosValorTotal() {
            if (this.atendimentoId != null) {
                Get('v1/itematendimento/atendimento/' + this.atendimentoId).then(res => {
                    this.valorTotal = 0
                    var obj = {}
                    var data = res.data
                    for (var i = 0; i < data.length; i++) {
                        obj.total = data[i].valorTotal
                        this.valorTotal += obj.total
                        obj = {}
                    }
                }).catch(err => console.log(err))
            }
        }, 
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Deseja incluir a forma de pagamento ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        }
    },
    created() {
        this.recebeDadosTabela()
        this.recebeDadosValorTotal()
        if (this.ModoLeitura == true) {
            this.recebeDadosVisualizacao()
        }
    }
}
</script>

<style>

</style>