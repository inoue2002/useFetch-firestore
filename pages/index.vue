<script setup lang="ts">
import { where } from 'firebase/firestore';
import { useFirestoreData } from '../composables/useFirestoreData';

const { data: users, pending, error, refresh } = useFirestoreData('recipes', [where('age', '>', 18)]);
</script>

<template>
  <div>
    <h1>User List</h1>
    <!-- <button @click="refresh">Refresh</button> -->
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        <NuxtLink to="/about">{{ user.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
