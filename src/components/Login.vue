<template>
  <!-- rounded: see https://vuetifyjs.com/en/styles/border-radius/#usage -->
  <v-sheet class="sheet" elevation="10" rounded="xl">
    <v-form class="form" fast-fail @submit.prevent>
      <v-text-field v-model="studentID" label="学号" :rules="idRules"></v-text-field>
      <v-text-field v-model="password" label="密码"></v-text-field>
      <v-btn class="login-btn" type="submit" block>登录</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">

let studentID: string = ''
let password: string = ''
let idRules = [
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
.sheet {
  width: 40%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: center;
}

.form {
  width: 70%;
  margin: 20px auto;
}

.login-btn {
  width: 70%;
}
</style>