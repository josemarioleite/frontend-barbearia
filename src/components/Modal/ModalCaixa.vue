<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="hHh Lpr lff" container style="height: 500px; width: width: 750px" class="shadow-2 bg-white rounded-borders">
            <q-header elevated class="bg-green">
                <q-toolbar>
                    <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
                    <q-toolbar-title>Caixa</q-toolbar-title>
                    <q-btn @click="fechaModal" flat dense icon="close" align="right" />
                </q-toolbar>
            </q-header>

            <q-drawer
                v-model="drawer"
                show-if-above

                :mini="miniState"
                @mouseover="miniState = false"
                @mouseout="miniState = true"

                :width="220"
                :breakpoint="500"
                bordered
                content-class="bg-grey-3"
            >
                <q-scroll-area class="fit">
                    <q-list padding>
                        <q-item @click="clicavel('cadastrocaixa')" :active="nameRouter === 'cadastrocaixa'" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="paid" />
                            </q-item-section>

                            <q-item-section>Caixa</q-item-section>
                        </q-item>

                        <q-item @click="abreDadosCaixa" :active="nameRouter === 'movimento'" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="price_check" />
                            </q-item-section>

                            <q-item-section>Movimento</q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item @click="fechaModal" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="exit_to_app" />
                            </q-item-section>

                            <q-item-section>
                                Fechar
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>
            </q-drawer>

            <q-page-container>
                <q-page>
                    <Caixa v-if="nameRouter === 'cadastrocaixa'" />
                </q-page>
            </q-page-container>
        </q-layout>
        <ModalDadosCaixa ref="modalDadosCaixa" />
    </q-dialog>
</template>

<script>
import Caixa from './FluxoCaixa/Caixa.vue'
import ModalDadosCaixa from './ModalDadosCaixa.vue'

export default {
  components: { Caixa, ModalDadosCaixa },
  data () {
    return {
        drawer: false,
        exibeModal: false,
        miniState: true,
        nameRouter: ''
    }
  },
  methods : {
    exibirModal() {
        this.exibeModal = !this.exibeModal
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
            })
        })
    },
    fechaModal() {
        this.exibeModal = !this.exibeModal
        this.nameRouter = null
    },
    clicavel(router) {
        this.nameRouter = router
    },
    abreDadosCaixa() {
        this.$refs.modalDadosCaixa.exibirModal()
    }
  },
  created() {
      this.nameRouter = 'cadastrocaixa'
  }
}
</script>