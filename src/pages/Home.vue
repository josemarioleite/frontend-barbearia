<template>
  <q-layout view="hhh Lpr fff" style="width: 100%">
    <Header />
      <q-page-container>
        <q-img alt="barber" src="../assets/man2.jpg" class="imagemFundo" />
        <q-page class="transparent" style="padding: 10px">
          <GradeServico />
        </q-page>
      </q-page-container>
    <!-- <Footer /> -->
  </q-layout>
</template>

<script>
import Header from '../components/Template/Header.vue'
// import Footer from '../components/Template/Footer.vue'
import GradeServico from '../components/Grades/GradeServico.vue'

export default {
  name: 'Home',
  components: { GradeServico, Header }
}
</script>

<style scoped>
  .imagemFundo {
    position: absolute;
    width: 100%;
    height: 92vh;
  }

  @media screen and (min-width: 1919px) {
    .imagemFundo {
      position: absolute;
      width: 100%;
      height: 94.7vh;
    }
  }

  @media screen and (max-width: 499px) {
    .imagemFundo {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>