<template>
    <q-dialog v-model="exibeModal" persistent maximized full-height>
        <q-layout view="Lhh lpR fff" container class="bg-dark" style="height: 430px">
            <q-header class="row transparent" style="padding: 3px">
                <q-toolbar-title style="text-align: start; margin-left: 10px; font-size: 1.4rem">Caixa de Hoje</q-toolbar-title>
                <q-btn @click="fechaModal" flat dense icon="close" align="right" />
            </q-header>

            <q-page-container>
                <q-page style="padding: 5px">
                    <div class="row col-12 bg-white" style="padding: 5px; border-radius: 5px">
                        <label class="col-12 text-h6" style="text-align: center">Profissional</label>
                        <div class="col-md-6 col-xs-12" style="padding: 5px">
                            <TabelaCaixa Titulo="Serviço" :Dados="dadosServico" TipoItem="S" />
                        </div>
                        <div class="col-md-6 col-xs-12" style="padding: 5px">
                            <TabelaCaixa Titulo="Produto" :Dados="dadosProduto" TipoItem="P" />
                        </div>
                    </div>

                    <div class="col-12 q-mt-md">
                        <q-table
                            dense
                            separator="cell"
                            title="Por Forma de Pagamento"
                            :rows-per-page-options="totalLinhas"
                            :data="dadosFormaPagamento"
                            :columns="colunasFormaPagamento"
                        >
                            <template v-slot:body-cell-total="props">
                                <q-td key="total" :props="props">R$ {{props.row.total.toFixed(2)}}</q-td>
                            </template>
                            
                        </q-table>
                    </div>

                    <div class="col-12 q-mt-sm text-dark row justify-end">
                        <div class="column bg-white" style="border-radius: 10px">
                            <q-card-section style="height: 70px; padding-top: 10px">
                                <div class="row justify-end"><strong>CAIXA TOTAL:</strong></div>
                                <div class="row col-12 items-center justify-end">
                                    <q-icon color="green" name="monetization_on" size="22px" /> 
                                    <div style="font-size: 20px">R$ {{valorTotal.toFixed(2)}}</div>
                                </div>
                            </q-card-section>
                        </div>
                    </div>
                </q-page>
            </q-page-container>

            <q-footer class="transparent">
                <div class="row justify-center q-mb-sm">
                    <q-btn color="red" icon="close" label="Fechar" @click="fechaModal" />
                </div>
            </q-footer>
        </q-layout>
    </q-dialog>
</template>

<script>
import { Get } from 'src/utils/Conexao.js'
import TabelaCaixa from '../Tabelas/TabelaCaixa.vue'
export default {
    name: 'Modal-Dados-Caixa',
    components: { TabelaCaixa },
    data () {
        return {
            exibeModal: false,
            totalLinhas: [5],
            valorTotal: 0,
            dadosServico: [],
            dadosProduto: [],
            dadosFormaPagamento: [],
            colunasFormaPagamento: [
                { name: 'id', required: true, label: 'ID', align: 'right', field: 'id', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'titulo', required: true, label: 'Título', align: 'left', field: 'titulo', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: 'descricao', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'total', required: true, label: 'Valor Total', align: 'right', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' }
            ]
        }
    },
    methods: {
        fechaModal() {
            this.dadosServico = [],
            this.dadosProduto = [],
            this.dadosFormaPagamento = [],
            this.valorTotal = 0
            this.exibeModal = !this.exibeModal
        },
        exibirModal() {
            this.exibeModal = !this.exibeModal
            this.recebeDadosTabela()
        },
        recebeDadosTabela() {
            Get('v1/atendimento/geral/formapagamento').then(res => {
                this.dadosFormaPagamento = res.data
                var data = res.data
                var obj = {}
                for (var i = 0; i < data.length; i++) {
                    obj.valor = data[i].total
                    this.valorTotal += obj.valor
                    obj = {}
                }
            }).catch(err => console.log(err))
        }
    },
}
</script>

<style>

</style>