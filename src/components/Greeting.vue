<template>
  <!-- 动态背景：https://www.vantajs.com/-->
  <div class="main-container" ref="vantaRef" style="height: 100vh;">
    <!-- rounded: see https://vuetifyjs.com/en/styles/border-radius/#usage -->
    <v-sheet class="sheet" elevation="10" rounded="xl">
      <v-container>
        <v-row>
          <v-img class="hfut-badge" src="/image/hfut.webp" height="60" width="60" />
          <span class="header">毕业生去向信息共享系统</span>
        </v-row>
        <v-row>
          <Login v-if="currComponent == 'Login'"></Login>
          <Register v-if="currComponent == 'Register'"></Register>
        </v-row>
        <v-row>
          <v-btn :color="DynamicColor.getSkyColor()" variant="tonal" v-if="currComponent == 'Login'" class="prompt"
            @click="currComponent = 'Register'">没有账号？去注册</v-btn>
          <v-btn :color="DynamicColor.getSkyColor()" variant="tonal" v-if="currComponent == 'Register'" class="prompt"
            @click="currComponent = 'Login'">去登录</v-btn>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import CLOUDS from "vanta/dist/vanta.clouds.min"

import * as DynamicColor from '@/plugins/util/color';

import Login from './Login.vue';
import Register from './Register.vue';

const vantaRef = ref(null)
let vantaEffect: any = null

const currComponent = ref<string>('')
currComponent.value = 'Login'

onMounted(() => {
  const currSkyColor = DynamicColor.getSkyColor()
  const currCloudColor = DynamicColor.getCloudColor()
  const currSunColor = DynamicColor.getSunColor()
  const currSunGlareColor = DynamicColor.getSunGlareColor()

  vantaEffect = CLOUDS({
    el: vantaRef.value,
    THREE: THREE,
    skyColor: currSkyColor,
    cloudColor: currCloudColor,
    cloudShadowColor: '#262646',
    sunColor: currSunColor,
    sunlightColor: currSunColor,
    sunGlareColor: currSunGlareColor,
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
.hfut-badge {
  margin-top: 10px;
  margin-right: 0;
}

.header {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
  margin-top: 10px;
  margin-right: 20px;
  display: block;
  text-align: center;
}

.prompt {
  font-size: 0.8rem;
  color: #454545;
  margin: 0 auto;
  margin-bottom: 10px;
  display: block;
  text-align: center;
}

.sheet {
  width: 35%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: center;
}

.main-container {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: center;
}
</style>