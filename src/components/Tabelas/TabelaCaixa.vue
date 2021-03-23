<template>
    <q-table
        dense
        separator="cell"
        :title="tituloTabela"
        :rows-per-page-options="totalLinhas"
        :data="dadosTabela"
        :columns="colunasTabela"
    >
        <template v-slot:body-cell-valor="props">
            <q-td key="valor" :props="props">R$ {{props.row.valorTotal.toFixed(2)}}</q-td>
        </template>

        <template v-slot:body-cell-porcentagem="props">
            <q-td v-if="tipoItem === 'S'" key="porcentagem" :props="props">{{props.row.porcentagemServico * 100}} %</q-td>
            <q-td v-else key="porcentagem" :props="props">{{props.row.porcentagemProduto * 100}} %</q-td>
        </template>
        
        <template v-slot:body-cell-porcentagemtotal="props">
            <q-td key="porcentagemtotal" :props="props">R$ {{props.row.totalGeral.toFixed(2)}}</q-td>
        </template>
        
    </q-table>
</template>

<script>
// import { Get } from 'src/utils/Conexao.js'

export default {
    name: 'Tabela-Caixa',
    props: {
        Dados: Array,
        TipoItem: String,
        Titulo: String
    },
    data() {
        return {
            totalLinhas: [4],
            tipoItem: this.TipoItem,
            dadosTabela: this.Dados,
            tituloTabela: this.Titulo,
            colunasTabela: [
                { name: 'id', required: true, label: 'ID', align: 'right', field: 'id', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'nome', required: true, label: 'Nome', align: 'left', field: 'nome', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'valor', required: true, label: 'Valor', align: 'right', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'porcentagem', required: true, label: 'Porcentagem', align: 'right', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' },
                { name: 'porcentagemtotal', required: true, label: 'Porcentagem Total', align: 'right', format: val => `${val}`, sortable: true, classes: 'bg-grey-2 ellipsis', style: 'max-width: 100px', headerClasses: 'bg-green text-white' }
            ]
        }
    },
    methods: {
        recebeDadosTabela() {
            // if (this.tipoItem == 'P') {
            //     Get('v1/caixa/produto').then(res => {
            //         this.dadosTabela = res.data
            //     }).catch(err => console.log(err))
            // } else if (this.tipoItem == 'S') {
            //     Get('v1/caixa/servico').then(res => {
            //         this.dadosTabela = res.data
            //     }).catch(err => console.log(err))
            // }
        }
    },
    created() {
        this.recebeDadosTabela()
    }
}
</script>

<style>

</style>