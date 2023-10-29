<template>
  <!-- 动态背景：https://www.vantajs.com/-->
  <div class="main-container" ref="vantaRef" style="height: 100vh;">
    <Login v-if="isLogin"></Login>
    <Register v-if="!isLogin"></Register>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import CLOUDS from "vanta/dist/vanta.clouds.min"

import Login from './Login.vue';
import Register from './Register.vue';

const vantaRef = ref(null)
let vantaEffect: any = null

let isLogin = true

onMounted(() => {
  vantaEffect = CLOUDS({
    el: vantaRef.value,
    THREE: THREE,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    speed: 0.5,
  })
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})

</script>

<style scoped>

.main-container {
  display: flex;
  align-items:center;
  justify-content:center;
  vertical-align: center;
}
</style>