<template>
  <v-app>
    <v-main>
      <router-view v-slot="{ Component }">
        <v-slide-y-transition>
          <component :is="Component" />
        </v-slide-y-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>
