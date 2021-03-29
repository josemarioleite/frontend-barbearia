<template>
    <div>
        <q-dialog v-model="statusModal" persistent>
            <q-layout view="hHh Lpr lff" container :style="styleModal" class="shadow-2 bg-white rounded-borders">
                <q-header elevated class="bg-green-9">
                    <q-toolbar>
                        <q-toolbar-title>{{tituloModal}}</q-toolbar-title>
                        <q-btn @click="fechaModal" flat dense icon="close" align="right" />
                    </q-toolbar>
                </q-header>

                <q-page-container>
                    <q-page style="padding: 10px">
                        <q-input readonly outlined color="dark" filled label="Data de Abertura" label-color="primary" v-model="dataAbertura" class="q-mb-sm text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly outlined color="dark" filled label="Data de Fechamento" label-color="primary" v-model="dataFechamento" class="q-mb-sm text-green" />
                        <q-input readonly outlined color="dark" filled label="Usuário de Abertura" label-color="primary" v-model="usuario.Usuario" class="q-mb-sm text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly outlined color="dark" filled label="Usuário de Fechamento" label-color="primary" v-model="usuario.Usuario" class="q-mb-sm text-green" />
                        <q-input v-show="fechamentoCaixa === true" readonly v-model="valorSaldo" mask="#.##" fill-mask="0" reverse-fill-mask color="primary" label-color="primary" filled label="Saldo" prefix="R$" class="q-mb-sm" />
                        <q-input v-show="fechamentoCaixa === false" v-model="valorTroco" mask="#.##" fill-mask="0" reverse-fill-mask color="green" filled label="Valor de Troco" prefix="R$" class="q-mb-sm">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="valorTroco = null" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <q-input v-show="fechamentoCaixa === true" v-model="valorSangria" mask="#.##" fill-mask="0" reverse-fill-mask color="green" filled label="Valor Sangria" prefix="R$" class="q-mb-sm">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="valorSangria = null" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <q-input v-model="observacao" color="green" filled label="Observação" :rules="[ val => val.length <= 300 || 'O número máximo de caracteres é: 50']">
                            <template v-slot:append>
                                <q-icon name="cancel" @click.stop="observacao = ''" class="cursor-pointer" />
                            </template>
                        </q-input>

                        <div class="column items-center q-mt-md">
                            <div class="row">
                                <q-btn v-show="fechamentoCaixa === false" rounded align="center" label="Abrir Caixa" size="12px" color="green-9" icon="fas fa-box-open" />
                                <q-btn v-show="fechamentoCaixa === true" rounded align="center" label="Fechar Caixa" size="12px" color="blue-9" icon="fas fa-archive" />
                                <q-btn @click="fechaModal" class="q-ml-sm" rounded align="center" label="Cancelar" size="12px" color="red" icon="close" />
                            </div>
                        </div>
                    </q-page>
                </q-page-container>
            </q-layout>
        </q-dialog>
    </div>
</template>

<script>
export default {
    name: 'Periodo-Caixa',
    data () {
        return {
            statusModal: false,
            fechamentoCaixa: false,
            usuario: [],
            valorTroco: null,
            valorSaldo: null,
            valorSangria: null,
            dataAbertura: null,
            dataFechamento: null,
            tituloModal: null,
            caixaNome: null,
            styleModal: null,
            observacao: '',
            caixaId: 0
        }
    },
    methods: {
        async aberturaCaixaOperador(dados, titulo) {
            this.styleModal = 'height: 385px; width: 475px'
            this.dataAbertura = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.statusModal = !this.statusModal
            this.tituloModal = titulo
            this.caixaNome = dados.nome
            this.caixaId = dados.id
        },
        async fechamentoCaixaOperador(dados, titulo) {
            var dataAtual = await new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
            this.fechamentoCaixa = true
            this.styleModal = 'height: 590px; width: 475px'
            this.dataAbertura = dataAtual
            this.dataFechamento = dataAtual
            this.statusModal = !this.statusModal
            this.tituloModal = titulo
            this.caixaNome = dados.nome
            this.caixaId = dados.id
        },
        fechaModal() {
            this.fechamentoCaixa = false
            this.statusModal = !this.statusModal
            this.limparCampos()
        },
        limparCampos() {
            this.usuario = []
            this.tituloModal = null
            this.caixaId = null
            this.valorTroco = null
            this.valorSaldo = null
            this.valorSangria = null
            this.styleModal = null
            this.observacao = null
            this.dataAbertura = null
            this.dataFechamento = null
        }
    },
    created() {
        var obj = JSON.parse(localStorage.getItem('tokenContent'))
        console.log(obj)
        this.usuario = obj
        this.valorTroco = parseFloat(this.valorTroco)
    }
}
</script>

<style>

</style>