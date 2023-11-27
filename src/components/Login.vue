<template>
  <v-container>
    <v-row>
      <span class="subheader">登录</span>
    </v-row>
    <v-row>
      <v-form class="form" fast-fail @submit.prevent>
        <v-container>
          <v-row>
            <v-radio-group v-model="userType" inline>
              <v-radio label="我是学生" value="user"></v-radio>
              <v-radio label="我是管理员" value="manager"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-account"></v-icon></v-col>
            <v-col cols="11"><v-text-field v-model="userID" :label="userType === 'user' ? '学号' : '工号'"
                :rules="idRules" /></v-col>
          </v-row>
          <v-row>
            <v-col class="icon" cols="1"><v-icon icon="mdi-lock"></v-icon></v-col>
            <v-col cols="11"><v-text-field v-model="password" label="密码"
                :hint="userType === 'user' ? '初始密码为学号后6位' : '初始密码为工号后6位'" persistent-hint /></v-col>
          </v-row>
          <v-row>
            <v-btn :color="getSkyColor()" id="login-btn" type="submit" @click="onLoginSubmit" block>登录</v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" :color="getSkyColor()">
      {{ loginPrompt }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router';

import { getSkyColor } from '@/plugins/util/color';
import { calculate_sha256 } from '@/plugins/util/encrypt';
import axiosInstance from '@/plugins/util/axiosInstance';

const userID = ref<string>('')
const password = ref<string>('')

const snackbar = ref<boolean>(false)
const loginPrompt = ref<string>('')

const userType = ref('user')

// https://router.vuejs.org/zh/guide/advanced/composition-api.html
const router = useRouter()

const idRules = [
  (value: string | any[]) => {
    if (value?.length == 10) {
      return true
    } else {
      return '学号长度有误'
    }
  },
]

function onLoginSubmit() {
  if (userID.value === '' || password.value === '') {
    loginPrompt.value = '请你将信息输入完整'
    snackbar.value = true
    return
  }
  const hashed_password = calculate_sha256(password.value)

  axiosInstance.post('/login/user', {
    id: userID,
    password: hashed_password,
  }).then((response) => {
    if (response.data.code === 0) {
      loginPrompt.value = "登录成功！"
      snackbar.value = true
      // TODO 需要增加逻辑
      const name = response.data.name
      const avatar = response.data.avatar
      const token = response.data.jwt
      window.localStorage.setItem("name", name)
      window.localStorage.setItem("avatar", avatar)
      window.localStorage.setItem("token", token)

      window.localStorage.setItem("id", userID.value)
      window.localStorage.setItem("hashed_password", hashed_password)
      const user_type = response.data.user_type
      if (userType.value === 'user') {
        router.push('/user')
      } else if (userType.value === 'manager') {
        router.push('/manager')
      }
    } else if (response.data.code === 1) {  // 账号不存在
      loginPrompt.value = "你输入的学号尚未注册。"
      snackbar.value = true
    } else if (response.data.code === 2) {  // 账号已存在但密码不正确
      loginPrompt.value = "你输入的密码有误。"
      snackbar.value = true
    } else if (response.data.code === 3) {  // 其他情况
      loginPrompt.value = response.data.message
      snackbar.value = true
    }
  }).catch((error) => {
    loginPrompt.value = "遇到错误：" + error.message
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

#login-btn {
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