<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import NavigationBar from './components/navigation/NavigationBar.vue';
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <div class="wrapper">
    <RouterView />
  </div>
  <NavigationBar />
</template>

<style scoped>
.wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding-bottom: 40px;
}
</style>
