<template>
  <div class="transparent">
      <div class="q-mb-md row justify-end">
        <q-btn @click="paginaPrincipal" size="14px" round color="primary" icon="redo">
            <q-tooltip anchor="center left" self="center right" :offset="[10, 10]" content-style="font-size: 14px">Página Principal</q-tooltip>
        </q-btn>
      </div>
      <hr class="q-mb-md">
  </div>
</template>

<script>
export default {
  name: 'Financeiro',
  data () {
    return {

    }
  },
  methods: {
    paginaPrincipal() {
      this.$router.push('/home')
    }
  }
}
</script>

<style>

</style>