<template>
  <div>
    <div v-show="somenteLeitura == false" class="col-12 row items-center q-mb-xs">
      <q-select :disable="somenteLeitura" class="col-md-8 col-xs-6 q-pr-sm" option-value="id" option-label="descricao" v-model="servicoSelecionado" :options="servicos" label="Serviço" />
      <q-select :disable="somenteLeitura" class="col-md-3 col-xs-6 q-pr-xs" option-value="value" option-label="label" v-model="quantidadeSelecionada" :options="quantidadeOpcoes" label="Quantidade" />
      <div class="col-md-1 col-xs-12 q-mt-xs botaoAdicionar">
        <q-btn :disable="somenteLeitura" color="primary" icon="add" @click="adicionaServico">
          <q-tooltip anchor="center left" self="center right">Adicionar Serviço</q-tooltip>
        </q-btn>
      </div>
    </div>
      <q-table
        title="Serviços"
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
            <strong>TOTAL GERAL do Serviço:</strong>
            <div style="font-size: 20px" class="q-mb-xs">R$ {{valorTotal.toFixed(2)}}</div>
          </q-card-section>
        </q-card>
      </div>
  </div>
</template>

<script>
import { Get, Post, Patch } from 'src/utils/Conexao.js'

export default {
  name: 'ItemAtendimento',
  props: {
    AtendimentoId: Number,
    ModoLeitura : Boolean,
    DadosTabela: Array,
    FechaModal: Function
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
      servicoSelecionado: [],
      servicos: [],
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
      Get('v1/servico').then(res => {
        this.servicos = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    limpaDados() {
      this.servicoSelecionado = []
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
      if (this.servicoSelecionado == null || this.servicoSelecionado == '') {
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
        selecionado = this.servicoSelecionado

        var dado = Object()
        dado = this.dados

        var itens = Object()
        itens.id = selecionado.id
        itens.descricao = selecionado.descricao
        itens.quantidade = quantidade.value
        itens.valor = selecionado.valor
        itens.total = (parseFloat(selecionado.valor) * parseInt(quantidade.value))

        var itemAtendimento = Object()
        itemAtendimento.AtendimentoId = this.atendimentoID
        itemAtendimento.Descricao = selecionado.descricao
        itemAtendimento.Quantidade = quantidade.value
        itemAtendimento.TipoItem = "S"
        itemAtendimento.ProdutoServicoId = parseInt(selecionado.id)
        itemAtendimento.ValorUnitario = selecionado.valor
        itemAtendimento.ValorTotal = (selecionado.valor * parseInt(quantidade.value))

        if (dado.find(x => x.id == itens.id)) {
          this.$q.notify({
            type: 'negative',
            message: 'Serviço já adicionado, neste caso, modifique a quantidade',
            timeout: 2000
          })
          this.servicoSelecionado = []
          this.quantidadeSelecionada = null
        } else {
          this.dados.push(itens)
          this.itemAtendimento.push(itemAtendimento)
          this.servicoSelecionado = []
          this.quantidadeSelecionada = null
        }
      }
    },
    recebeDadosVisualizacao() {
      Get('v1/itematendimento/atendimentoservico/' + this.atendimentoID).then(res => {
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
    salvarServicos() {
      return new Promise((resolve, reject) => {
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
                  Patch('v1/atendimento/financeiro/' + this.atendimentoID).then(res => {
                    if (res.data.status == true) {
                      this.$q.notify({
                        color: 'accent',
                        message: 'Foi gerado financeiro, favor verificar...',
                        timeout: 3000
                      })
                      resolve(true)
                    }
                  }).catch(err => {
                    this.$q.notify({
                      type: 'negative',
                      message: 'Erro ao gerar financeiro, favor verificar mais tarde...',
                      timeout: 3000
                    })
                  })
                  this.limpaDados()
                  this.$emit('fechaModalOrdemServico')
                  this.FechaModal
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
          }, 1000)
        } else {
          this.$q.notify({
            color: 'red',
            message: 'Nenhum serviço selecionado!!!',
            timeout: 3000
          })
        }
      })
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

<style scoped>
  .botaoAdicionar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 40px;
  }

  @media only screen and (max-width: 499px) {
    .botaoAdicionar {
      width: 100%;
    }
  }
</style>
