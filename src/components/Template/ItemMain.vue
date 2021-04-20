<template>
    <q-btn icon="exit_to_app" size="13px" style="background: #080808">
        <q-menu>
            <div class="row no-wrap q-pa-md">
                <div class="column justify-center">
                    <div class="text-h6 q-mb-md" style="font-family: 'Ruthie', cursive; font-size: 30px">BarberSoftHouse</div>
                    <div style="margin-top: 40px">
                        <div class="text-center">Versão: {{versaoApp}}</div>
                        <div class="text-center q-mb-md">Data: {{dataVersaoApp}}</div>  
                    </div>              
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                    <q-avatar size="72px" class="bg-dark">
                        <div class="text-white">{{nomeUsuario.substr(0, 1)}}</div>
                    </q-avatar>

                    <div class="text-subtitle2 q-mt-md q-mb-xs">{{nomeUsuario}}</div>

                    <q-btn
                        @click="removeItensLocalStorage"
                        color="primary"
                        label="Sair"
                        push
                        size="sm"
                        v-close-popup
                    />
                </div>
            </div>
        </q-menu>
    </q-btn>
</template>

<script>
export default {
    name: 'Item-Menu',
    data () {
        return {
            nomeUsuario: '',
            nomeLogin: '',
            versaoApp: '',
            dataVersaoApp: ''
        }
    },
    methods: {
        removeItensLocalStorage() {
            localStorage.removeItem('token')
            localStorage.removeItem('tokenContent')
            localStorage.removeItem('PeriodoCaixa')
            this.$router.push('/')
            window.history.forward()
        },
        dadosLocalStorage () {
            const obj = JSON.parse(localStorage.getItem('tokenContent'))
            this.nomeUsuario = obj.Usuario
            this.nomeLogin = obj.Login
        },
    },
    mounted () {
        this.versaoApp = '1.1.0'
        this.dataVersaoApp = '01/02/2021'
        this.dadosLocalStorage()
    }
}
</script>

<style>

</style>