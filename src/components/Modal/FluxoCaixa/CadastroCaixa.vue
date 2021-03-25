<template>
    <div class="col-12" style="padding: 5px">
        <q-list v-for="item in dados" :key="item.id" bordered class="q-mb-xs rounded-borders col-12">
            <q-slide-item ref="slideRef" @right="resetaSlider; deletarCaixa(item.id);" right-color="red">
                <template v-slot:right>
                    <div class="row items-center">Desativar caixar
                        <q-icon right name="close" />
                    </div>
                </template>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar class="bg-dark">
                            <div class="text-white">{{item.nome.substr(0, 1)}}</div>
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>{{item.nome}}</q-item-section>
                </q-item>
            </q-slide-item>
        </q-list>        
    </div>
</template>

<script>
import { Get, Delete } from 'src/utils/Conexao.js'

export default {
    name: 'Cadastro-Caixa',
    data () {
        return {
            statusModal: false,            
            headerClass: '',
            dados: []
        }
    },
    methods: {
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
        deletarCaixa(id) {
            this.confirmacao('Tem certeza que deseja desativar este caixa ?').then(() => {
                setTimeout(() => {
                    Delete('v1/caixaoperador/' + parseInt(id)).then(res => {
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
                            this.obterCaixas()
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
        },
        resetaSlider({reset}) {
            this.finalize(reset)
        },
        finalize (reset) {
            this.timer = setTimeout(() => {
                reset()
            }, 2000)
        }
    },
    beforeDestroy() {
        clearTimeout(this.timer)
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
