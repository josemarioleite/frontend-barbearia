<template>
  <div>
    <q-header elevated class="bg-black text-white" style="position: fixed">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="abreMenuHeader" /> -->
        <q-toolbar-title style="font-family: 'Ruthie', cursive; font-size: 30px">
          <q-avatar>
            <img src="../../assets/bigode.png">
          </q-avatar>
          BarberSoft  House...
        </q-toolbar-title>
        <!-- <q-toolbar-title style="margin-right: 80px">
          Atendimentos
        </q-toolbar-title> -->
        <div class="row justify-end">
          <Item />
        </div>
      </q-toolbar>
      <!-- <q-tabs align="center">
        <q-route-tab to="/home" label="Em Aberto" />
        <q-route-tab to="/home" label="A Receber" />
        <q-route-tab to="/home" label="Finalizados" />
      </q-tabs> -->
    </q-header>
    <!-- <Menu ref="menuHeader" /> -->
  </div>
</template>

<script>
// import Menu from './Main.vue'
import Item from './ItemMain.vue'

export default {
  name: 'Cabecalho',
  components: {
    Item
  },
  data () {
    return {
      drawer: false,
      nomeUsuario: '',
      nomeLogin: ''
    }
  },
  methods: {
    abreMenuHeader () {
      this.$refs.menuHeader.abreMenu()
    }
  }
}
</script>