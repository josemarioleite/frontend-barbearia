<template>
    <div class="col-12" style="padding: 5px">
        <div class="col-md-6 row justify-end items-center q-pa-sm">
            <hr class="bg-primary linhaInclusao">
            <q-btn @click="abreModalCadastro" flat round dense icon="add" color="white" class="bg-primary justify-start">
                <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                    <strong>Cadastrar</strong>novo caixa
                </q-tooltip>
            </q-btn>
        </div>
        <q-list v-for="item in dados" :key="item.id" bordered class="q-mb-xs rounded-borders col-12">
            <q-expansion-item
                :icon="item.caixaAberto === 'S' ? 'fas fa-box-open' : 'fas fa-archive'"
                :label="item.nome"
                :header-class="item.caixaAberto === 'S' ? 'text-green' : 'text-red'"
                :caption="item.caixaAberto === 'S' ? 'Caixa Aberto: Sim' : 'Caixa Aberto: Não'"
            >
                <div class="row justify-center col-12 q-mb-xs">
                    <q-btn v-show="item.caixaAberto === 'N'" class="q-pt-xs q-pb-xs col-3" label="Abrir Caixa" size="10px" rounded align="center" color="green" icon="attach_money" @click="abrirCaixa(item)" />
                    <q-btn v-show="item.caixaAberto === 'S'" class="q-pt-xs q-pb-xs col-3" label="Fechar" size="10px" rounded align="center" color="primary" icon="attach_money" @click="fecharCaixa(item)" />
                    <q-btn class="q-pt-xs q-ml-sm q-pb-xs col-3" rounded align="center" label="Atualizar" size="10px" color="purple" icon="update" @click="abreModalAlteracao(item)" />
                    <q-btn class="q-pt-xs q-ml-sm q-pb-xs col-3" rounded align="center" label="Desativar" size="10px" color="red" icon="close" @click="deletarCaixa(item)" />
                </div>
            </q-expansion-item>
        </q-list>
        <q-dialog v-model="alerta">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Atenção</div>
                </q-card-section>

                <q-card-section class="q-pt-none">{{mensagemAlerta}}</q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Fechar" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-page-sticky position="bottom-right" :offset="[18, 16]">
            <q-btn @click="showLoading" round color="accent" icon="update">
                <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                    <strong>Atualizar</strong>tela
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
        <PeriodoCaixa ref="periodoCaixa" @atualizaGrade="obterCaixas" />
        <CadastroCaixa ref="cadastroCaixa" @atualizaGrade="obterCaixas" />
    </div>
</template>

<script>
import { Get, Delete } from 'src/utils/Conexao.js'
import CadastroCaixa from './CadastroCaixa.vue'
import PeriodoCaixa from './PeriodoCaixa.vue'

export default {
    name: 'Cadastro-Caixa',
    components: { CadastroCaixa, PeriodoCaixa },
    data () {
        return {
            statusModal: false,
            alerta: false,
            mensagemAlerta: '',
            headerClass: '',
            dados: []
        }
    },
    methods: {
        verificaCaixaAberto() {
            var dados = this.dados
            for (var i = 0; i < dados.length; i++) {
                if (dados[i].caixaAberto === 'S') {
                    console.log(dados[i].caixaAberto)
                    return true
                } else{
                    return false
                }
            }
        },
        abrirCaixa(dados) {
            var caixaAberto = this.verificaCaixaAberto()
            if (caixaAberto == true) {
                this.alerta = !this.alerta
                this.mensagemAlerta = 'Já existe um caixa em aberto, o que é sugerido é no próximo passo fazer o fechamento.'
            } else {
                this.$refs.periodoCaixa.aberturaCaixaOperador(dados, 'Abertura de Caixa')
            }
        },
        fecharCaixa(dados) {
            this.$refs.periodoCaixa.fechamentoCaixaOperador(dados, 'Fechamento de Caixa')
        },
        abreModalCadastro() {
            this.$refs.cadastroCaixa.abreModalCadastro()
        },
        abreModalAlteracao(dados) {
            this.$refs.cadastroCaixa.abreModalAtualizaCaixa(dados)
        },
        obterCaixas() {
            Get('v1/caixaoperador').then(res => {
                if (parseInt(res.status) === 200) {
                    this.dados = res.data
                } else {
                    this.$q.notify({
                        message: 'Não foi possível obter dados dos caixas',
                        type: 'negative',
                        timeout: 2000
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$q.notify({
                    message: 'Erro ao obter dados do Caixa',
                    type: 'negative',
                    timeout: 2000
                })
            })
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
                }).onCancel(() => {
                    reject()
                })
            })
        },
        deletarCaixa(dados) {
            if (dados.caixaAberto === 'S') {
                this.$q.notify({
                    message: 'O Caixa ainda está aberto, antes de desativar, deve-se fazer o fechamento',
                    type: 'negative',
                    timeout: 3000
                })
            } else {
                this.confirmacao('Tem certeza que deseja desativar este caixa ?').then(() => {
                    setTimeout(() => {
                        Delete('v1/caixaoperador/' + parseInt(dados.id)).then(res => {
                            this.$q.notify({
                                message: 'Desativando...',
                                color: 'blue',
                                timeout: 1000
                            })

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
                        }).catch(err => {
                            this.$q.notify({
                                message: 'Erro',
                                caption: 'Não foi possível fazer inclusão, tente novamente mais tarde',
                                color: 'red'
                            })
                            console.log(err)
                        })
                    }, 2000);
                }).catch(() => {
                    this.$refs.slideRef
                })
                this.obterCaixas()
            }
        },
        showLoading () {
            this.$q.loading.show()
            this.timer = setTimeout(() => {
                this.obterCaixas()
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
        this.obterCaixas()
    }
}
</script>

<style>
.espacoEntre {
    padding-left: 20px;
}

.espacoTexto {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-size: 12px;
}

.linhaInclusao {
    width: 85%;
}

@media only screen and (max-width: 599px) {
    .espacoEntre {
        padding: 1px;
    }

    .linhaInclusao {
        display: none;
    }
}
</style>
