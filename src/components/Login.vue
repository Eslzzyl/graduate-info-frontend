<template>
  <v-container>
    <v-row>
      <span class="subheader">登录</span>
    </v-row>
    <v-row>
      <v-form class="form" fast-fail @submit.prevent>
        <v-container>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-account"></v-icon></v-col>
            <v-col cols="2-5"><v-text-field v-model="studentID" label="学号" :rules="idRules" /></v-col>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-lock"></v-icon></v-col>
            <v-col cols="2-5"><v-text-field v-model="password" label="密码" /></v-col>
          </v-row>
          <v-row>
            <v-btn :color="getSkyColor()" class="login-btn" type="submit" block>登录</v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import { getSkyColor } from '@/plugins/util/color';

const studentID = ref<string>('')
const password = ref<string>('')

const idRules = [
  (value: string | any[]) => {
    if (value?.length == 10) {
      return true
    } else {
      return '学号长度有误'
    }
  },
]

</script>

<style scoped>
.subheader {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto;
  display: block;
  text-align: center;
}

.form {
  width: 70%;
  margin: 20px auto;
  text-align: center;
}

.login-btn {
  width: 40%;
  margin: 0 auto;
}

.icon {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  vertical-align: center;
}
</style>