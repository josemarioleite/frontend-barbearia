<template>
  <div class="row justify-center bg-dark">
      <div class="linhaVertical bg-white"></div>
      <div class="bg-white container">
        <div class="row justify-center col-12">
            <q-img class="imagem col-6" src="../../assets/bruceRelatorio.png" />
            <div class="col-6 row justify-center">
                <div><strong>Cliente: </strong></div>
            </div>
        </div>
        <hr class="q-mt-sm">
        <div class="titulo">Relatório de Atendimento (N° {{atendimentoID}})</div>
        <hr class="q-mt-sm">

        <!-- Serviços -->
        <div class="bg-grey-4 q-mt-xs col-12">
            <q-toolbar-title class="q-ma-sm col-12">Serviços</q-toolbar-title>
        </div>

        <div class="col-12">
            <div class="row text-bold">
                <div class="col-1" style="text-align: end">ID</div>
                <div class="col-4 over">Descrição</div>
                <div class="col-2" style="text-align: end">Quantidade</div>
                <div class="col-2 q-ml-md" style="text-align: end">Valor Unitário</div>
                <div class="col-2 q-ml-lg" style="text-align: end">Valor Total</div>
            </div>

            <div class="col-12 bg-dark" style="height: 1px"></div>

            <div class="col-12 q-mt-xs">
                <div class="row col-12" v-for="(item, index) in servicoAtendimento" :key="index">
                    <div class="col-1" style="text-align: end">{{item.id}}</div>
                    <div class="col-4 over">{{item.descricao}}</div>
                    <div class="col-2"  style="text-align: end">{{item.quantidade}}</div>
                    <div class="col-2 q-ml-md" style="text-align: end">R$ {{item.valorUnitario.toFixed(2)}}</div>
                    <div class="col-2 q-ml-lg" style="text-align: end">R$ {{item.valorTotal.toFixed(2)}}</div>
                </div>
            </div>

            <div class="row total">
                <div>Total: R$ {{valorTotalServico.toFixed(2)}}</div>
            </div>
        </div>

        <!-- Produtos -->

        <div class="bg-grey-4 q-mt-xs col-12">
            <q-toolbar-title class="q-ma-sm col-12">Produtos</q-toolbar-title>
        </div>

        <div class="col-12">
            <div class="row text-bold">
                <div class="col-1" style="text-align: end">ID</div>
                <div class="col-4 over">Descrição</div>
                <div class="col-2" style="text-align: end">Quantidade</div>
                <div class="col-2 q-ml-md" style="text-align: end">Valor Unitário</div>
                <div class="col-2 q-ml-lg" style="text-align: end">Valor Total</div>
            </div>

            <div class="col-12 bg-dark" style="height: 1px"></div>

            <div class="col-12">
                <div class="row col-12" v-for="(item, index) in produtoAtendimento" :key="index">
                    <div class="col-1" style="text-align: end">{{item.id}}</div>
                    <div class="col-4 over">{{item.descricao}}</div>
                    <div class="col-2"  style="text-align: end">{{item.quantidade}}</div>
                    <div class="col-2 q-ml-md" style="text-align: end">R$ {{item.valorUnitario.toFixed(2)}}</div>
                    <div class="col-2 q-ml-lg" style="text-align: end">R$ {{item.valorTotal.toFixed(2)}}</div>
                </div>
            </div>

            <div class="row total">
                <div>Total: R$ {{valorTotalProduto.toFixed(2)}}</div>
            </div>
        </div>

        <!-- Forma de Pagamento -->

        <div class="bg-grey-4 q-mt-xs col-12">
            <q-toolbar-title class="q-ma-sm col-12">Forma de Pagamento</q-toolbar-title>
        </div>

        <div class="col-12">
            <div class="row text-bold">
                <div class="col-1" style="text-align: end">ID</div>
                <div class="col-5 over">Descrição</div>
                <div class="col-3" style="text-align: center">Título</div>
                <div class="col-2" style="text-align: end; margin-left: 40px">Valor Total</div>
            </div>

            <div class="col-12 bg-dark" style="height: 1px"></div>

            <div class="col-12">
                <div class="row col-12" v-for="(item, index) in itemFormaAtendimento" :key="index">
                    <div class="col-1" style="text-align: end">{{item.id}}</div>
                    <div class="col-5 over">{{item.descricao}}</div>
                    <div class="col-3"  style="text-align: center">{{item.formaPagamento.titulo}}</div>
                    <div class="col-2" style="text-align: end; margin-left: 40px">R$ {{item.valor.toFixed(2)}}</div>
                </div>
            </div>

            <div class="row total">
                <div>Valor Geral Total: R$ {{valorTotalFormaPagamento.toFixed(2)}}</div>
            </div>

            <div class="col-12 bg-dark" style="height: 1px"></div>
            <div class="row justify-center q-mt-xs"><strong>Data</strong>: {{new Date().toLocaleDateString('pt-BR')}} - {{new Date().toLocaleTimeString('pt-BR')}}</div>
        </div>
      </div>
      <div class="linhaVertical bg-white"></div>
  </div>
</template>

<script>
import { Get } from 'src/utils/Conexao.js'

export default {
    name: 'Relatorio-Atendimento',
    data () {
        return {
            atendimentoID: '',
            valorTotalServico: 0,
            valorTotalProduto: 0,
            valorTotalFormaPagamento: 0,
            dadosAtendimento: [],
            itemFormaAtendimento: [],
            servicoAtendimento: [],
            produtoAtendimento: [],
        }
    },
    methods: {
        recebeDadosAtendimento() {
            var id = this.atendimentoID
            this.valorTotalServico = 0
            this.valorTotalProduto = 0
            this.valorTotalFormaPagamento = 0
            Get('v1/itematendimento/atendimentoservico/' + id).then(res => {
                this.servicoAtendimento = res.data
                for (var i = 0; i < res.data.length; i++) {
                    this.valorTotalServico += res.data[i].valorTotal
                }
            }).catch(err => console.log(err))
            Get('v1/itematendimento/atendimentoproduto/' + id).then(res => {
                this.produtoAtendimento = res.data
                for (var i = 0; i < res.data.length; i++) {
                    this.valorTotalProduto += res.data[i].valorTotal
                }
            }).catch(err => console.log(err))
            Get('v1/itemformapagamento/' + id).then(res => {
                this.itemFormaAtendimento = res.data
                for (var i = 0; i < res.data.length; i++) {
                    this.valorTotalFormaPagamento += res.data[i].valor
                }
            }).catch(err => console.log(err))
        },
        mostraId() {
            console.log(this.valorTotalFormaPagamento)
        }
    },
    mounted () {
        this.atendimentoID = this.$route.params.id
        this.recebeDadosAtendimento()
    }
}
</script>

<style scoped>
    .container {
        width: 45%;
    }

    .linhaVertical {
        width: 1px;
        height: 100vh;
        background: #000;
    }

    .imagem {
        left: 5px;
        margin-top: 10px;
        width: 25%;
    }

    .titulo {
        font-size: 1.1rem;
        text-align: center;
    }

    .over {
        padding-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .total {
        display: flex;
        justify-content: flex-end;
        margin-top: 5px;
        margin-right: 10px;
        font-weight: bold;
        font-size: 1rem;
    }
</style>