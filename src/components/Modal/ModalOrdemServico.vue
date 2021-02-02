<template>
  <q-dialog v-model="exibeModal" persistent full-width :maximized="fullHeight" :full-height="fullHeight" class="modalOrdemServico">
    <q-layout view="Lhh lpR fff" container class="bg-brown modalOrdemServico" :style="stilo">

      <q-header class="row bg-dark" style="padding: 5px">
          <q-img src="../../assets/bigode.png" alt="Bigode" style="width: 35px" />
          <q-toolbar-title class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive;">{{tituloModal}}</q-toolbar-title>
          <q-toolbar-title v-show="modalInclusao == false" class="q-mt-xs" style="font-size: 1.2rem; font-family: cursive; text-align: end">Atendimento N°: {{idOrdemServico}}</q-toolbar-title>
          <q-btn flat v-close-popup dense icon="close" align="right" />
      </q-header>

      <q-page-container class="row" style="margin: 10px;">

        <div v-show="modalInclusao == true" class="col-12 row q-mb-md">
          <div class="col-md-6 row justify-end items-center q-pr-sm">
            <hr class="bg-dark" style="width: 90%">
            <q-btn @click="exibirModalProfissional" flat round dense icon="group" color="white" class="bg-accent justify-start">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Profissional</q-tooltip>
            </q-btn>
          </div>

          <div class="col-md-6 row justify-end items-center q-pr-sm">
            <hr class="bg-dark" style="width: 90%">
            <q-btn @click="exibirModalCliente" flat round dense icon="person_search" color="white" class="bg-primary justify-start">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Cliente</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Modal Inclusão -->

        <div class="col-12 row q-mb-sm" style="padding: 0px">
          <div class="componentsMobile col-md-6 col-xs-12" style="padding-right: 5px">
            <q-select
              @filter="filtraProfissional"
              :options="profissionalSelect"
              :readonly="modalInclusao == false"
              option-value="id"
              option-label="nome"
              class="inputSelect"
              use-input
              hide-selected
              filled
              fill-input
              outlined 
              v-model="profissionalSelecionado"
              label="Selecionar Profissional"
              bg-color="white"
            >
              
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <div class="row items-center">
                      <q-icon class="q-mr-xs" name="sentiment_dissatisfied" color="brown" size="15px"/>Sem Resultados
                    </div>
                  </q-item-section>
                </q-item>
              </template>
              
              <template v-slot:prepend>
                <q-icon name="content_cut" color="brown"/>
              </template>
            </q-select>
          </div>

          <div class="componentsMobile col-md-6 col-xs-12" style="padding-right: 5px">
            <q-select 
              @filter="filtraCliente"
              :options="clienteSelect"
              :readonly="modalInclusao == false"
              option-value="id"
              option-label="nome"
              class="inputSelect"
              use-input
              hide-selected
              filled
              fill-input
              outlined 
              v-model="clienteSelecionado"
              label="Selecionar Cliente"
              bg-color="white"
            >
              
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <div class="row items-center">
                      <q-icon class="q-mr-xs" name="sentiment_dissatisfied" color="brown" size="15px"/>Sem Resultados
                    </div>
                  </q-item-section>
                </q-item>
              </template>
              
              <template v-slot:prepend>
                <q-icon name="person" color="brown"/>
              </template>
            </q-select>
          </div>
        </div>

        <!-- Final -->

        <div v-show="modalInclusao == false" class="col-12 row bg-white borda" style="padding: 5px">
          <div class="col-md-6 col-xs-12" style="padding: 2px">
            <ItemServico 
              ref="itemServicoAtendimento"
              @fechaModalOrdemServico="fechaModal"
              :AtendimentoId="idOrdemServico"
              :ModoLeitura="somenteLeitura"
            />
          </div>

          <div class="col-md-6 col-xs-12" style="padding: 2px">
            <ItemProduto
              ref="itemProdutoAtendimento"
              :AtendimentoId="idOrdemServico"
              :ModoLeitura="somenteLeitura"
            />
          </div>

          <div class="col-md-12 col-xs-12" style="padding: 2px">
            <ItemFormaPagamento
              ref="itemFormaPagamento"
              :AtendimentoId="idOrdemServico"
              :ModoLeitura="somenteLeituraFormaPagamento"
              :IsVisible="isVisibleFormaPagamento"
            />
          </div>
          
          <div v-show="somenteLeitura != true" class="col-12 row justify-center" style="padding: 5px">
            <q-btn @click="salvarItensTabela" icon="save" label="Salvar" color="green" class="q-mb-xs justify-center" />
          </div>

          <div v-show="modalInsereFormaPagamento == true" class="q-mt-sm col-12 row justify-center" style="padding: 5px">
            <q-btn @click="salvarFormaPagamentoTabela" icon="save" label="Salvar Forma de Pagamento" color="green" style="border-radius: 5px" />
          </div>
        </div>


      </q-page-container>

      <!-- <q-footer class="transparent"> -->
        <div class="row justify-end botaoModal">
          <q-btn v-show="modalInclusao == true" icon="save" label="Salvar" color="green" @click="adicionarNovoAtendimento" style="border-radius: 5px" />
          <q-btn icon="close" label="Fechar" color="red" class="q-ml-sm" @click="fechaModal" style="border-radius: 5px" />
        </div>
      <!-- </q-footer> -->
      <ItemCliente ref="itemCliente" @atualizaCampo="recebeDadosTabela" />
      <ItemProfissional ref="itemProfissional" @atualizaCampo="recebeDadosTabela" />
    </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete, Patch } from 'src/utils/Conexao.js'
import ItemServico from '../Itens/ItemServico.vue'
import ItemProduto from '../Itens/ItemProduto.vue'
import ItemCliente from '../Itens/ItemCliente.vue'
import ItemProfissional from '../Itens/ItemProfissional.vue'
import ItemFormaPagamento from '../Itens/ItemFormaPagamento.vue'
import { Atendimento } from 'src/models/Atendimento/Atendimento.js'
export default{
  name: 'ModalOrdemServico',
  components: {
    ItemServico, ItemProduto, ItemCliente, ItemProfissional, ItemFormaPagamento
  },
  data () {
    return {
      dadosOS: [],
      fullHeight: false,
      exibeModal: false,
      isVisibleFormaPagamento: false,
      somenteLeituraFormaPagamento: false,
      somenteLeitura: false,
      modalInsereFormaPagamento: false,
      modalInsereItens: false,
      modalInclusao: false,
      modalAlteracao: false,
      modalVisualizacao: false,
      dadosTabelaVisualizacaoItens: [],
      idOrdemServico: 0,
      clientes: [],
      profissionais: [],
      profissionalSelect: [],
      clienteSelect: [],
      stilo: '',
      clienteSelecionado: '',
      profissionalSelecionado: '',
      tituloModal: ''
    }
  },
  methods: {
    filtraProfissional(val, update) {
      if (val === '') {
        update(() => {
          this.profissionalSelect = this.profissionais
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.profissionalSelect = this.profissionais.filter(f => f.nome.toLowerCase().indexOf(needle) > -1)
      })
    },
    filtraCliente(val, update) {
      if (val === '') {
        update(() => {
          this.clienteSelect = this.clientes
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.clienteSelect = this.clientes.filter(f => f.nome.toLowerCase().indexOf(needle) > -1)
      })
    },
    fechaModal() {
      this.exibeModal = !this.exibeModal
      this.limpaCamposModal()
    },
    limpaCamposModal() {
      this.idOrdemServico = null
      this.clienteSelecionado = null
      this.profissionalSelecionado = null
    },
    exibirModalInclusao(titulo) {
      this.stilo = 'height: 230px'
      this.fullHeight = false
      this.exibeModal = !this.exibeModal
      this.tituloModal = titulo
      this.modalInclusao = true
      this.modalInsereFormaPagamento = false
      this.somenteLeitura = false
      this.modalAlteracao = false
      this.modalExclusao = false
      this.modalReativacao = false
      this.recebeDadosTabela()
    },
    exibirModalVisualizacao(tituloModal, dados) {
      this.fullHeight = true
      this.stilo = 'height: 620px'
      this.exibeModal = !this.exibeModal
      this.somenteLeitura = true
      this.modalVisualizacao = true
      this.isVisibleFormaPagamento = true
      this.somenteLeituraFormaPagamento = true
      this.modalInsereFormaPagamento = false
      this.modalAlteracao = false
      this.modalInclusao = false
      this.modalExclusao = false
      this.modalReativacao = false
      this.tituloModal = tituloModal
      this.idOrdemServico = dados.id
      this.profissionalSelecionado = dados.profissional.nome
      this.clienteSelecionado = dados.cliente.nome + ' - ' + dados.cliente.telefoneCelular
    },
    exibirModalInsereFormaPagamento(tituloModal, dados) {
      this.fullHeight = true
      this.stilo = ''
      this.exibeModal = !this.exibeModal
      this.somenteLeitura = true
      this.modalVisualizacao = true
      this.isVisibleFormaPagamento = true
      this.modalInsereFormaPagamento = true
      this.somenteLeituraFormaPagamento = false
      this.modalAlteracao = false
      this.modalInclusao = false
      this.modalExclusao = false
      this.modalReativacao = false
      this.tituloModal = tituloModal
      this.idOrdemServico = dados.id
      this.profissionalSelecionado = dados.profissional.nome
      this.clienteSelecionado = dados.cliente.nome + ' - ' + dados.cliente.telefoneCelular
    },
    exibirModalInsereItens(tituloModal, dados) {
      this.fullHeight = true
      this.stilo = 'height: 620px'
      this.exibeModal = !this.exibeModal
      this.modalInsereItens = true
      this.isVisibleFormaPagamento = false
      this.modalInsereFormaPagamento = false
      this.somenteLeitura = false
      this.modalAlteracao = false
      this.modalInclusao = false
      this.modalExclusao = false
      this.modalReativacao = false
      this.dadosOS = dados
      this.tituloModal = tituloModal
      this.idOrdemServico = dados.id
      this.profissionalSelecionado = dados.profissional.nome
      this.clienteSelecionado = dados.cliente.nome + ' - ' + dados.cliente.telefoneCelular
    },
    salvarItensTabela() {
      this.confirmacao().then(() => {
        this.$refs.itemProdutoAtendimento.salvarProdutos()
        this.$refs.itemServicoAtendimento.salvarServicos().then(() => {
          this.$emit('atualizaGradeEmAberto')
        })
      })
    },
    salvarFormaPagamentoTabela() {
      this.confirmacao().then(() => {
        this.$refs.itemFormaPagamento.salvarFormaPagamento().then(() => {
          Patch('v1/atendimento/finaliza/' + this.idOrdemServico).then(res => {
            if (res.data.status == true) {
              this.$q.notify({
                color: 'accent',
                message: 'O atendimento foi finalizado com sucesso',
                timeout: 3000
              })
            }
            this.fechaModal()
            this.$emit('atualizaGradeFinanceiro')
          }).catch(err => {
            this.$q.notify({
              type: 'positive',
              message: 'Erro ao finalizar atendimento, favor verificar mais tarde...',
              timeout: 3000
            })
          })
        })
      })
    },
    confirmacao() {
      return new Promise((resolve, reject) => {
        this.$q.dialog({
          dark: true,
          title: 'Tem certeza que deseja fazer essa operação ?',
          cancel: 'Sair',
          persistent: true
        }).onOk(() => {
            resolve()
        })
      })
    },
    desativaAtendimento() {
      this.confirmacao().then(() => {
        this.$q.notify({
          color: 'primary',
          message: 'Carregando...',
          timeout: 2000
        })
      setTimeout(() => {
        var id = this.idOrdemServico
        Delete('v1/atendimento/' + id).then(res => {
          if (res.data.status) {
            this.$q.notify({
              message: res.data.msg,
              color: 'green',
              timeout: 3000
            })
            this.$emit('atualizaGrade')
            this.limpaCamposModal()
            this.fechaModal()
          }
        }).catch(err => {
          console.log(err)
        })
        }, 2000)
      })
    },
    adicionarNovoAtendimento() {
      var atendimento = new Atendimento()
      atendimento.ClienteId = this.clienteSelecionado.id
      atendimento.ProfissionalId = this.profissionalSelecionado.id
      this.$q.notify({
        color: 'primary',
        message: 'Carregando...',
        timeout: 2000
      })
      setTimeout(() => {
        Post('v1/atendimento', atendimento).then(res => {
          if (res.data.status) {
            this.$q.notify({
              message: res.data.msg,
              color: 'green',
              timeout: 3000
            })
            this.$emit('atualizaGrade')
            this.limpaCamposModal()
            this.fechaModal()
          }
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao cadastrar, tente novamente...',
            timeout: 3000
          })
        }, 3000)
      })
    },
    recebeDadosTabela() {
      Get('v1/profissional').then(res => {
        this.profissionais = res.data
      }).catch(err => {
        console.log(err)
      })
      Get('v1/cliente').then(res => {
        this.clientes = res.data
      }).catch(err => {
        console.log(err)
      })
      Get('v1/formapagamento').then(res => {
        this.formaPagamento = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    exibirModalCliente() {
      this.$refs.itemCliente.exibeModalCliente('Incluir Cliente')
    },
    exibirModalProfissional() {
      this.$refs.itemProfissional.exibeModalProfissional('Incluir Profissional')
    }
  },
  beforeMount(){
    this.recebeDadosTabela()
  }
}
</script>

<style scoped>
  .inputSelect {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .borda {
    border-radius: 10px;
    /* border-top-right-radius: 10px;
    border-top-left-radius: 10px; */
  }

  .bordaFim {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .botaoModal {
    margin-right: 14px;
    margin-bottom: 12px;
  }
</style>
