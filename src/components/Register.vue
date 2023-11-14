<template>
  <v-container>
    <v-row>
      <span class="subheader">注册</span>
    </v-row>
    <v-row>
      <v-form class="form" fast-fail @submit.prevent>
        <v-container>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-account"></v-icon></v-col>
            <v-col cols="11"><v-text-field v-model="studentID" label="学号" :rules="idRules" /></v-col>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-text-account"></v-icon></v-col>
            <v-col cols="11"><v-text-field v-model="studentName" label="姓名"></v-text-field></v-col>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-lock"></v-icon></v-col>
            <v-col cols="11"><v-text-field v-model="password" label="密码" /></v-col>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-lock-check"></v-icon></v-col>
            <v-col cols="11">
              <v-text-field v-model="passwordConfirmed" label="再次输入密码" :rules="passwordConfirmRules" />
            </v-col>
          </v-row>
          <v-row>
            <v-btn :color="getSkyColor()" id="register-btn" type="submit" @click="onRegisterSubmit">注册</v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" :color="getSkyColor()">
      {{ registerPrompt }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getSkyColor } from '@/plugins/util/color';
import { calculate_sha256 } from '@/plugins/util/encrypt';
import axiosInstance from '@/plugins/util/axiosInstance';

const studentID = ref<string>('')
const studentName = ref<string>('')
const password = ref<string>('')
const passwordConfirmed = ref<string>('')

const snackbar = ref<boolean>(false)
const registerPrompt = ref<string>('')

const idRules = [
  (value: string | any[]) => {
    if (value?.length == 10) {
      return true
    } else {
      return '学号长度有误'
    }
  },
]

const passwordConfirmRules = [
  () => {
    if (passwordConfirmed.value === password.value) {
      return true
    } else {
      return '两次输入的密码不一致'
    }
  },
]

function onRegisterSubmit() {
  if (studentID.value === '' || studentName.value === '' || password.value === '' || passwordConfirmed.value === '') {
    registerPrompt.value = '请你将信息输入完整'
    snackbar.value = true
    return
  }
  const hashed_password = calculate_sha256(password.value)

  axiosInstance.post('/register', {
    id: studentID,
    name: studentName,
    password: hashed_password,
  }).then((response) => {
    if (response.data.code === 0) {
      registerPrompt.value = "注册成功！现在请你返回到登录页进行登录。"
      snackbar.value = true
    } else if (response.data.code === 1) {  // 账号已存在
      registerPrompt.value = "你输入的学号已经有了一个对应的账号。"
      snackbar.value = true
    } else if (response.data.code === 2) {  // 学号和姓名不匹配
      registerPrompt.value = "你输入的学号和姓名不匹配。"
      snackbar.value = true
    } else if (response.data.code === 3) {  // 查无此人
      registerPrompt.value = "系统中没有你输入的学号的记录。"
      snackbar.value = true
    } else if (response.data.code === 4) {  // 其他情况
      registerPrompt.value = response.data.message
      snackbar.value = true
    }
  }).catch((error) => {
    registerPrompt.value = "遇到错误：" + error.message
    snackbar.value = true
    console.error('尝试注册时遇到错误：', error)
  })
}

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

#register-btn {
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