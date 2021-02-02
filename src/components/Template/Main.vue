<template>
  <q-drawer :width="250" show-if-above v-model="drawer" side="left" bordered content-class="bg-grey-3">
    <q-img class="absolute-top bg-dark imagemMenu" style="height: 120px" src="../../assets/menuBigode.jpg" /> <!-- src="https://cdn.quasar.dev/img/material.png" -->
    <div class="absolute-top bg-transparent" style="margin-top: 40px">
      <div class="text-weight-bold text-h4 textoImagemMenu text-brown">{{nomeUsuario}}</div>
      <div class="text-weight-bold text-h7 text-brown" style="margin-left: 10px">@{{nomeLogin}}</div>
    </div>
    <q-scroll-area style="height: calc(100% - 150px); margin-top: 115px; border-right: 1px solid #ddd">
      <q-list separator v-for="(item, index) in opcoesMenu" :key="index">
        <q-item @click="item.click" clickable v-ripple class="q-mb-xs bg-grey-5">
          <q-item-section avatar>
            <q-icon :name="item.icone" color="brown" />
          </q-item-section>
          <q-item-section class="text-dark">{{item.label}}</q-item-section>
        </q-item>
        <q-separator v-if="item.separador" />
      </q-list>
    </q-scroll-area>
    <div class="absolute-bottom">
      <div class="footerDrawer column justify-center" style="font-size: 12px">Versão: {{versaoApp}}</div>
      <div class="footerDrawer column justify-center" style="font-size: 12px">Data: {{dataVersaoApp}}</div>
    </div>
  </q-drawer>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      drawer: false,
      versaoApp: '',
      dataVersaoApp: '',
      nomeUsuario: '',
      nomeLogin: '',
      opcoesMenu: [
        {
          label: 'Atendimentos',
          icone: 'work',
          click: () => this.navegaPaginaMenu(1),
          show: true,
          separador: true
        },
        {
          label: 'Agenda',
          icone: 'book',
          click: () => this.navegaPaginaMenu(2),
          show: true,
          separador: true
        },
        {
          label: 'Sair',
          icone: 'exit_to_app',
          click: () => this.navegaPaginaMenu(3),
          show: true,
          separador: true
        }
      ]
    }
  },
  methods: {
    abreMenu () {
      this.drawer = !this.drawer
    },
    removeItensLocalStorage() {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenContent')
    },
    navegaPaginaMenu (idMenu) {
      switch (idMenu) {
        case 1:
          this.$router.push('/servicos')
          break;
        case 2:
          this.$router.push('/home')
          break;
        case 3:
          this.$router.push('/')
          this.removeItensLocalStorage()
          break;
        default:
          this.$router.push('/')
          break;
      }
    },
    dadosLocalStorage () {
      const obj = JSON.parse(localStorage.getItem('tokenContent'))
      this.nomeUsuario = obj.Usuario
      this.nomeLogin = obj.Login
    },
    noBack() {
      window.history.forward()
    }
  },
  mounted () {
    this.versaoApp = '1.0.0'
    this.dataVersaoApp = '14/11/2020'
    this.dadosLocalStorage()
    this.noBack()
  }
}
</script>

<style scoped>
  .imagemMenu {
    opacity: 0.2;
  }

  .textoImagemMenu {
    margin-left: 10px;
    margin-top: 10px;
    -webkit-text-stroke-width: 0.2px; /* largura da borda */
    -webkit-text-stroke-color: #fff;
    color: #000;
  }
</style>
