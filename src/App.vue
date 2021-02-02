<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { Get } from './utils/Conexao'
export default {
  name: 'App'
}
</script>

<style>
  body, html {
    height: 100%;
    width: 100%;
  }

  body {
    background: white;
  }
</style>
