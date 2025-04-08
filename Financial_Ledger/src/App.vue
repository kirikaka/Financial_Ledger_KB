<script setup>
import { RouterLink, RouterView } from 'vue-router';
import TransactionList from './pages/TransactionList.vue';

</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <TransactionList/>
  <RouterView />
  
</template>

<style scoped></style>
