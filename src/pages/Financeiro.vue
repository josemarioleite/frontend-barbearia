<template>
  <q-layout view="hhh Lpr fff" style="width: 100%">
    <Header />
      <q-page-container>
        <q-page padding class="bg-brown">
          <GradeFinanceiro />
        </q-page>
      </q-page-container>
    <!-- <Footer /> -->
  </q-layout>
</template>

<script>
import Header from '../components/Template/Header.vue'
// import Footer from '../components/Template/Footer.vue'
import GradeFinanceiro from '../components/Grades/GradeFinanceiro.vue'

export default {
  name: 'Home',
  components: { GradeFinanceiro, Header }
}
</script>