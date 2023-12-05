<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">个人信息</v-banner>
    <v-card variant="elevated" elevation="5" class="card" rounded="xl">
      <v-card-title>管理员账号</v-card-title>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-text-field variant="outlined" readonly v-model="managerID" label="工号" hint="不可修改"
                persistent-hint></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field variant="outlined" readonly v-model="managerName" label="姓名" hint="不可修改"
                persistent-hint></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-divider></v-divider>
          </v-row>
          <v-row>
            <v-col cols="3">
              头像：
              <v-avatar :image="managerAvatar !== '' && managerAvatar !== 'null' ? managerAvatar : '/avatar/alice.jpg'" size="64"></v-avatar>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-btn variant="tonal" :loading="isSelectingAvatar" @click="handleAvatarButton">上传新头像</v-btn>
              <!-- Create a File Input that will be hidden but triggered with JavaScript -->
              <input v-show="false" ref="avatarSelector" type="file" @change="updateAvatar">
            </v-col>
          </v-row>
          <v-row>
            <v-divider></v-divider>
          </v-row>
          <v-row>
            <v-col>
              修改密码：
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field variant="outlined" v-model="newPassword" label="新密码"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field variant="outlined" v-model="newPasswordConfirmed" label="再次输入以确认密码"
                :rules="passwordConfirmRules"></v-text-field>
            </v-col>
          </v-row>
          <v-btn @click="updateInfo">提交更改</v-btn>
        </v-container>
      </v-form>
    </v-card>
    <v-fade-transition>
      <v-alert v-if="isUpdateInfoErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
        上传数据时似乎出了一点问题。尝试重新上传？<br>{{ requestError }}
      </v-alert>
    </v-fade-transition>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" color="indigo-lighten-4">
      {{ avatarPrompt }}
      <v-btn variant="text" @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import axiosInstance from '@/plugins/util/axiosInstance';
import { calculate_sha256 } from '@/plugins/util/encrypt';

const managerID = ref('12345678')
const managerName = ref('爱丽丝·卡塔雷特')
const managerAvatar = ref('')
const isSelectingAvatar = ref(false)
const isAvatarUpdated = ref(false)
const newPassword = ref('')
const newPasswordConfirmed = ref('')

const isUpdateInfoErrorHappened = ref(false)
const requestError = ref()

const snackbar = ref(false)
const avatarPrompt = ref('')

const passwordConfirmRules = [
  () => {
    if (newPassword.value === newPasswordConfirmed.value) {
      return true
    } else {
      return '两次输入的密码不一致'
    }
  },
]

onMounted(() => {
  managerID.value = window.localStorage.getItem('id') as string
  managerName.value = window.localStorage.getItem('name') as string
  managerAvatar.value = window.localStorage.getItem('avatar') as string
})

async function updateInfo() {
  let hashed_password;
  if (newPassword.value != '') {
    hashed_password = calculate_sha256(newPassword.value);
  } else {
    hashed_password = window.localStorage.getItem("hashed_password");
  }
  axiosInstance.post('/manager/updateinfo', {
      id: managerID.value,
      avatar: managerAvatar.value,
      password: hashed_password,
    }).then((response) => {
      console.log(response)
      if (response.data.code === 1) {
        console.log('请求成功')
        isUpdateInfoErrorHappened.value = false
      } else {
        isUpdateInfoErrorHappened.value = true
        console.error('请求失败！', response.data.message)
        requestError.value = response.data.message
      }
    }).catch((error) => {
      console.log(error)
      requestError.value = error
      isUpdateInfoErrorHappened.value = true
    })
}

const emit = defineEmits<{
  (event: 'change-avatar', avatar: string): void
}>()

// https://cn.vuejs.org/api/built-in-special-attributes.html#ref
const avatarSelector = ref<HTMLElement>()

// 这个函数仅仅用于唤起文件选择对话框，不承载任何业务逻辑
function handleAvatarButton() {
  isSelectingAvatar.value = true

  // After obtaining the focus when closing the FilePicker, return the button state to normal
  window.addEventListener('focus', () => {
    isSelectingAvatar.value = false
  }, { once: true });

  // Trigger click on the FileInput
  (avatarSelector.value as HTMLElement).click();
}

function updateAvatar(e: Event) {
  isSelectingAvatar.value = true    // 上传时也转圈
  const target = e.target as HTMLInputElement
  if (target !== null && target.files !== null) {
    isAvatarUpdated.value = true
    const selectedAvatar = target.files[0]
    const formData = new FormData();
    formData.append('file', selectedAvatar);

    axios.post("https://img.eslzzyl.eu.org/upload", formData)
      .then((response) => {
        managerAvatar.value = response.data
        window.localStorage.setItem("avatar", managerAvatar.value)
        avatarPrompt.value = "头像上传成功，你仍然需要点击下面的提交按钮来提交更改"
        snackbar.value = true
        console.log("新头像URL：", managerAvatar.value)
        isSelectingAvatar.value = false
        emit('change-avatar', managerAvatar.value)
      }).catch((error) => {
        console.error('上传头像时遇到问题：', error)
        avatarPrompt.value = "上传头像时遇到问题：" + error.message
        snackbar.value = true
        isSelectingAvatar.value = false
        return
      })
  }
}

</script>

<style scoped>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}
</style>