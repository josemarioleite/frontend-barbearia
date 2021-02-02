<template>
  <div>
    <div v-show="somenteLeitura == false" class="col-12 row items-center q-mb-xs">
      <q-select :disable="somenteLeitura" class="col-md-8 col-xs-12 q-pr-sm" option-value="id" option-label="nome" v-model="produtoSelecionado" :options="produtos" label="Selecionar Produto" />
      <q-select :disable="somenteLeitura" class="col-md-3 col-xs-12 q-pr-xs" option-value="value" option-label="label" v-model="quantidadeSelecionada" :options="quantidadeOpcoes" label="Quantidade" />
      <q-btn :disable="somenteLeitura" class="col-md-1 col-xs-2 q-mt-xs" color="primary" icon="add" style="height: 40px" @click="adicionaServico">
        <q-tooltip anchor="center left" self="center right">Adicionar Serviço</q-tooltip>
      </q-btn>
    </div>
      <q-table
        title="Produtos"
        color="black"
        row-key="id"
        card-style="border-radius: 10px"
        dense
        :rows-per-page-options="maximoLinhas"
        :data="dados"
        :columns="colunas"
      >
        <template v-slot:top-right>
          <q-btn v-show="somenteLeitura == false" @click="dados.pop()" round size="10px" color="teal" icon="cleaning_services">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Limpar dados da tabela</q-tooltip>
          </q-btn>
        </template>

        <template v-slot:body-cell-descricao="props">
          <q-td key="descricao" :props="props">{{props.row.descricao}}</q-td>
        </template>

        <template v-slot:body-cell-quantidade="props">
          <q-td key="quantidade" :props="props">{{props.row.quantidade}}</q-td>
        </template>

        <template v-slot:body-cell-valor="props">
          <q-td key="valor" :props="props">R$ {{props.row.valor.toFixed(2)}}</q-td>
        </template>

        <template v-slot:body-cell-total="props">
          <q-td key="total" :props="props">R$ {{props.row.total.toFixed(2)}}</q-td>
        </template>
      </q-table>

      <div v-show="somenteLeitura == true" class="q-mt-xs row justify-end">
        <q-card style="width: 200px" class="shadow-15">
          <q-card-section style="text-align: end; height: 65px">
            <strong>TOTAL GERAL do Produto:</strong>
            <div style="font-size: 20px" class="q-mb-xs">R$ {{valorTotal.toFixed(2)}}</div>
          </q-card-section>
        </q-card>
      </div>
  </div>
</template>

<script>
import { Get, Post } from 'src/utils/Conexao.js'
import { ItemAtendimento } from 'src/models/ItensAtendimento/ItemAtendimento.js'

export default {
  name: 'ItemAtendimento',
  props: {
    AtendimentoId: Number,
    ModoLeitura : Boolean,
    DadosTabela: Array
  },
  data () {
    return {
      atendimentoID: this.AtendimentoId,
      somenteLeitura: this.ModoLeitura,
      dadosTabelaVisualizacao: this.DadosTabela,
      quantidadeSelecionada: '',
      quantidadeOpcoes: [
        { value: 1, label: 1}, { value: 2, label: 2}, { value: 3, label: 3},
        { value: 4, label: 4}, { value: 5, label: 5}, { value: 6, label: 6},
        { value: 7, label: 7}, { value: 8, label: 8}, { value: 9, label: 9},
        { value: 10, label: 10}, { value: 11, label: 11}, { value: 12, label: 12}
      ],
      valorTotal: 0,
      maximoLinhas: [4],
      itemAtendimento: [],
      produtoSelecionado: [],
      produtos: [],
      dados: [],
      colunas: [
        { name: 'id', align: 'right', label: 'Id', field: 'id', sortable: true },
        { name: 'descricao', align: 'left', label: 'Descrição', sortable: true },
        { name: 'quantidade', align: 'right', label: 'Quantidade', sortable: true },
        { name: 'valor', align: 'right', label: 'Valor Unitário', sortable: true },
        { name: 'total', align: 'right', label: 'Total', sortable: true }
      ]
    }
  },
  methods: {
    recebeDados() {
      Get('v1/produto').then(res => {
        this.produtos = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    limpaDados() {
      this.produtoSelecionado = []
      this.dados = []
      this.itemAtendimento = []
    },
    confirmacao() {
      return new Promise((resolve, reject) => {
        this.$q.dialog({
            dark: true,
            title: 'Tem certeza que inserir esses itens ?',
            cancel: 'Sair',
            persistent: true
        }).onOk(() => {
            resolve()
        })
      })
    },
    adicionaServico() {
      if (this.produtoSelecionado == null || this.produtoSelecionado == '') {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, selecione um serviço',
          timeout: 2000
        })
      } else if (this.quantidadeSelecionada == '' || this.quantidadeSelecionada == null) {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, insira a quantidade',
          timeout: 2000
        })
      } else {
        var quantidade = this.quantidadeSelecionada
        var selecionado = Object()
        selecionado = this.produtoSelecionado

        var dado = Object()
        dado = this.dados

        var itens = Object()
        itens.id = selecionado.id
        itens.descricao = selecionado.nome
        itens.quantidade = quantidade.value
        itens.valor = selecionado.valor
        itens.total = (parseFloat(selecionado.valor) * parseInt(quantidade.value))

        var itemAtendimento = Object()
        itemAtendimento.AtendimentoId = this.atendimentoID
        itemAtendimento.Descricao = selecionado.nome
        itemAtendimento.Quantidade = quantidade.value
        itemAtendimento.TipoItem = "P"
        itemAtendimento.ValorUnitario = selecionado.valor
        itemAtendimento.ValorTotal = (selecionado.valor * parseInt(quantidade.value))

        if (dado.find(x => x.id == itens.id)) {
          this.$q.notify({
            type: 'negative',
            message: 'Serviço já adicionado, neste caso, modifique a quantidade',
            timeout: 2000
          })
          this.produtoSelecionado = []
          this.quantidadeSelecionada = null
        } else {
          this.dados.push(itens)
          this.itemAtendimento.push(itemAtendimento)
          this.produtoSelecionado = []
          this.quantidadeSelecionada = null
        }
      }
    },
    limparProdutos() {
      this.dados = []
      this.salvarItemAtendimento = []
    },
    recebeDadosVisualizacao() {
      Get('v1/itematendimento/atendimentoproduto/' + this.atendimentoID).then(res => {
        var obj = {}
        for (var i = 0; i < res.data.length; i++) {
          obj.id = res.data[i].id
          obj.descricao = res.data[i].descricao
          obj.quantidade = res.data[i].quantidade
          obj.valor = res.data[i].valorUnitario
          obj.total = res.data[i].valorTotal
          this.valorTotal += obj.total
          this.dados.push(obj)
          obj = {}
        }
      }).catch(err => console.log(err))
    },
    salvarProdutos() {
      if (this.dados.length > 0) {
        this.$q.notify({
          color: 'primary',
          message: 'Carregando...',
          timeout: 2000
        })
        setTimeout(() => {
          var item = this.itemAtendimento
          for (var i = 0; i < item.length; i++) {
            Post('v1/itematendimento', item[i]).then(res => {
              if (res.data.status == true) {
                this.$q.notify({
                  color: 'green',
                  message: res.data.msg,
                  timeout: 2000
                })
                this.limpaDados()
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
            })
          }
        }, 1000);
      }
    }
  },
  mounted () {
    this.recebeDados()
    if (this.somenteLeitura == true) {
      this.recebeDadosVisualizacao()
    }
  }
}
</script>