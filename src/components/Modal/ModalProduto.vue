<template>
  <q-dialog v-model="exibeModal" persistent full-height full-width>
        <q-layout view="Lhh lpR fff" container class="bg-brown">
          <q-header class="bg-dark row col-12" style="padding: 5px">
              <q-toolbar-title>Produtos</q-toolbar-title>
              <q-btn flat v-close-popup dense icon="close" align="right" />
          </q-header>

          <q-page-container>
                <q-page style="padding: 10px">
                    <div class="row">
                        <q-input :error="erroCampoNome" :error-message="erroMsgNome" v-model="nomeProduto" class="col-md-3 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Nome">
                            <template v-slot:prepend>
                                <q-icon name="drive_file_rename_outline" color="brown" />
                            </template>
                        </q-input>

                        <q-space />

                        <q-input mask="#.##" prefix="R$" reverse-fill-mask :error="erroCampoValor" :error-message="erroMsgValor" v-model="valorProduto" class="col-md-2 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Valor">
                            <template v-slot:prepend>
                                <q-icon name="attach_money" color="brown" />
                            </template>
                        </q-input>
                        
                        <q-space />

                        <div class="col-md-3 col-xs-12">
                            <q-select :error="erroCampoComissaoPorcentagem" :error-message="erroMsgComissaoPorcentagem" class="" color="dark" label-color="dark" bg-color="white" v-model="opcaoSelecionado" option-label="label" option-value="value" :options="opcoes" filled label="Comissão / Porcentagem">
                                <template v-slot:prepend>
                                    <q-icon name="price_check" color="brown" />
                                </template>
                            </q-select>
                        </div>

                        <q-space />

                        <q-input mask="#.##" prefix="R$" suffix="%" reverse-fill-mask :error="erroCampoValorComissaoPorcentagem" :error-message="erroMsgValorComissaoPorcentagem" v-model="valorComissaoPorcentagem" class="col-md-3 col-xs-12" color="dark" label-color="dark" bg-color="white" filled label="Valor Comis./Porc.">
                            <template v-slot:prepend>
                                <q-icon name="attach_money" color="brown" />
                            </template>
                        </q-input>                    

                        <q-space />

                        <div class="row justify-center botaoAdicionar col-md-1 col-xs-12">
                            <q-btn class="tamanhoBotao" :disable="desabilitarBotao" color="green" icon="add" @click="insereNovoProduto" />
                        </div>
                    </div>
                    <q-table
                        dense
                        class="tabela"
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
                                <q-btn @click="recebeDadosProdutos" size="12px" color="green" icon="update" round>
                                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]" content-style="font-size: 14px">Atualizar Tabela</q-tooltip>
                                </q-btn>
                                <div class="q-ml-md" style="font-size: 1.3rem">Lista</div>
                            </div>
                        </template>
                                            
                        <template v-slot:top-right>
                            <q-input dense v-model="filtroTabela" class="buscarProduto" placeholder="Buscar produto...">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>
                        
                        <template v-slot:body-cell-dataInclusao="props">
                            <q-td key="dataInclusao" :props="props">{{new Date(props.row.createdAt).toLocaleDateString('pt-BR')}}</q-td>
                        </template>

                        <template v-slot:body-cell-valor="props">
                            <q-td key="valor" :props="props">R$ {{props.row.valor.toFixed(2)}}</q-td>
                        </template>

                        <template v-slot:body-cell-comissaoPorcentagem="props">
                            <q-td v-if="props.row.porcentagemComissao === 'C'" key="comissaoPorcentagem" :props="props"><div>Comissão</div></q-td>
                            <q-td v-else key="comissaoPorcentagem" :props="props"><div>Porcentagem</div></q-td>
                        </template>

                        <template v-slot:body-cell-valorComissaoPorcentagem="props">
                            <q-td v-if="props.row.porcentagemComissao === 'C'" key="valorComissaoPorcentagem" :props="props">R$ {{props.row.valorPorcentagemComissao.toFixed(2)}}</q-td>
                            <q-td v-else key="valorComissaoPorcentagem" :props="props">% {{props.row.valorPorcentagemComissao.toFixed(2)}}</q-td>
                        </template>

                        <template v-slot:body-cell-acoes="props">
                            <q-td key="acoes" :props="props">
                                <q-btn-dropdown color="brown" dropdown-icon="build" align="center">
                                    <q-list>
                                        <q-item clickable v-close-popup @click="deletaProduto(props.row.id)">
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

                                        <q-item clickable v-close-popup @click="abrirModalDadosAlteracao(props.row)">
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
                    <div class="q-mt-sm row justify-center">
                        <q-btn color="red" icon="close" label="Fechar" @click="fechaModal" />
                    </div>
                </q-page>
          </q-page-container>
          <DadosProduto ref="dadosProduto" @atualizaTabela="recebeDadosProdutos" />
        </q-layout>
  </q-dialog>
</template>

<script>
import { Get, Post, Delete } from 'src/utils/Conexao.js'
import { Produto } from 'src/models/Produto/Produto.js'
import DadosProduto from '../AlteraItem/Produto.vue'

export default {
    name: 'Produto',
    components: {
        DadosProduto
    },
    data () {
        return {
            totalLinhasTabela: [6],
            nomeProduto: '',
            valorProduto: '',
            valorComissaoPorcentagem: '',
            filtroTabela: '',
            erroMsgNome: '',
            erroMsgValor: '',
            erroMsgValorComissaoPorcentagem: '',
            erroMsgComissaoPorcentagem: '',
            carregando: false,
            erroCampoNome: false,
            erroCampoValor: false,
            erroCampoComissaoPorcentagem: false,
            erroCampoValorComissaoPorcentagem: false,
            desabilitarBotao: false,
            exibeModal: false,
            opcaoSelecionado: '',
            opcoes: [
                {value: 'P', label: 'Porcentagem'},
                {value: 'C', label: 'Comissão'},
            ],
            dados: [],
            colunas: [
                { name: 'id', align: 'right', label: 'Id', field: 'id', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'nome', align: 'left', label: 'Descrição', field: 'nome', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'dataInclusao', align: 'left', label: 'Data Inclusão', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'valor', align: 'right', label: 'Valor', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'comissaoPorcentagem', align: 'right', label: 'Comissão/Porcentagem', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'valorComissaoPorcentagem', align: 'right', label: 'Valor Comis./Porcen.', sortable: true, headerClasses: 'bg-dark text-white text-bold' },
                { name: 'acoes', align: 'center', label: 'Ações', headerClasses: 'bg-dark text-white text-bold'}
            ]
        }
    },
    methods: {
        abreModalProduto() {
            this.exibeModal = !this.exibeModal
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        abrirModalDadosVisualizacao(dados) {
            this.$refs.dadosProduto.abreModalVisualizacao('Visualizar Produto', dados)
        },
        abrirModalDadosAlteracao(dados) {
            this.$refs.dadosProduto.abreModalAlteracao('Alterar Produto', dados)
        },
        limparCampos() {
            this.nomeProduto = null
            this.valorProduto = null
            this.opcaoSelecionado = null
            this.valorComissaoPorcentagem = null
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.nomeProduto === '' || this.nomeProduto === null) {
                    this.erroCampoNome = true
                    this.erroMsgNome = 'O Campo "Nome" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoNome = false
                    campoVazio = false
                }

                if (this.valorProduto === '' || this.valorProduto === null) {
                    this.erroCampoValor = true
                    this.erroMsgValor = 'O Campo "Valor" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoValor = false
                    campoVazio = false
                }

                if (this.opcaoSelecionado === '' || this.opcaoSelecionado === null) {
                    this.erroCampoComissaoPorcentagem = true
                    this.erroMsgComissaoPorcentagem = 'O Campo "Comissão/Porcentagem" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoComissaoPorcentagem = false
                    campoVazio = false
                }

                if (this.valorComissaoPorcentagem === '' || this.valorComissaoPorcentagem === null) {
                    this.erroCampoValorComissaoPorcentagem = true
                    this.erroMsgValorComissaoPorcentagem = 'O Campo "Valor Comissão/Porcentagem" é obrigatório!'
                    campoVazio = true
                } else {
                    this.erroCampoValorComissaoPorcentagem = false
                    campoVazio = false
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Tem certeza que deseja incluir este Produto ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        recebeDadosProdutos() {
            this.carregando = true
            Get('v1/produto').then(res => {
                this.dados = res.data
                this.carregando = false
            }).catch(err => {
                console.log(err)
                this.carregando = false
            })
        },
        deletaProduto(idProduto) {
            this.confirmacao().then(() => {
                this.$q.notify({
                    message: 'Deletando...',
                    color: 'primary',
                    timeout: 1000
                })
                setTimeout(() => {
                    Delete('v1/produto/' + parseInt(idProduto)).then(res => {
                        this.$q.notify({
                            message: res.data.msg,
                            color: 'green',
                            timeout: 2000
                        })
                        this.recebeDadosProdutos()
                    }).catch(err => {
                        this.$q.notify({
                            message: 'Erro ao deletar, tente novamente mais tarde',
                            color: 'red',
                            timeout: 2000
                        })
                    })
                }, 1000)
            })
        },
        removeVirgula(valor) {
            var rpc = valor.replace(/,/g, ".")
            return rpc
        },
        insereNovoProduto() {
            this.validaCampos().then(() => {
                this.confirmacao().then(() => {
                    this.desabilitarBotao = true
                    const valor = this.removeVirgula(this.valorProduto)
                    const novoProduto = new Produto()
                    novoProduto.Nome = this.nomeProduto.toUpperCase()
                    novoProduto.Valor = parseFloat(valor)
                    novoProduto.PorcentagemComissao = this.opcaoSelecionado.value.toUpperCase()
                    novoProduto.ValorPorcentagemComissao = parseFloat(this.valorComissaoPorcentagem)
                    this.$q.notify({
                        message: 'Carregando...',
                        color: 'primary',
                        timeout: 1000
                    })
                    setTimeout(() => {
                        Post('v1/produto', novoProduto).then(res => {
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
                            this.recebeDadosProdutos()
                        }).catch((err) => {
                            this.$q.notify({
                                message: 'Erro ao cadastrar produto, verifique as informações',
                                color: 'red',
                                timeout: 2000
                            })
                            this.desabilitarBotao = false
                            console.log(err)
                        })
                    }, 1000)
                })
            })
        }
    },
    created() {
        this.recebeDadosProdutos()
    }
}
</script>

<style scoped>
    .botaoAdicionar {
        display: flex;
        justify-content: center;
        width: 60px;
        height: 56px;
    }

    .tamanhoBotao {
        height: 56px;
    }

    .hide-Label {
        visibility: hidden;
    }

    .iconeBotaoAdicionar {
        margin-top: 12px;
    }

    @media only screen and (max-width: 499px) {
        .botaoAdicionar {
            width: 100%;
        }

        .tamanhoBotao {
            height: 35px;
        }

        .hide-Label {
            visibility: visible;
        }

        .iconeBotaoAdicionar {
            margin-top: 0px;
        }

        .buscarProduto {
            width: 275px;
        }

        .botaoFechar {
            margin: 10px;
            margin-left: 100px;
            bottom: 0;
            left: 0;
        }
    }
</style>