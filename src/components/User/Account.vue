<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">个人信息</v-banner>
    <v-container>
      <v-fade-transition>
        <v-alert v-if="isGetInfoErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
          加载似乎出了一点问题。尝试刷新页面？<br>{{ requestError }}
        </v-alert>
      </v-fade-transition>
      <v-fade-transition>
        <v-card variant="elevated" elevation="5" class="card" rounded="xl">
          <v-card-title>学籍信息</v-card-title>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="3">
                  <v-text-field variant="outlined" clearable v-model="studentName" label="姓名"></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-select variant="outlined" clearable v-model="studentGender" label="性别"
                    :items="studentGenderList"></v-select>
                </v-col>
                <v-col cols="2">
                  <v-select variant="outlined" clearable v-model="studentGrade" label="年级"
                    :items="studentGradeList"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-select variant="outlined" clearable v-model="studentMajor" label="专业"
                    :items="studentMajorList"></v-select>
                </v-col>
                <v-col cols="2">
                  <v-text-field variant="outlined" clearable v-model="studentClass" label="班级" hint="只填数字即可，如“1”"
                    persistent-hint></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-select variant="outlined" clearable v-model="studentGraduated" label="是否已毕业"
                    :items="studentGraduatedList"></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-fade-transition>

      <v-fade-transition>
        <v-card variant="elevated" elevation="5" class="card" rounded="xl">
          <v-card-title>去向信息</v-card-title>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <v-select variant="outlined" clearable v-model="goneType" label="去向类型" :items="goneTypeList"></v-select>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="goneInstitute" label="去向单位"
                    hint="输入工作单位时，建议带上岗位；输入学校时，建议带上专业方向" persistent-hint></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea variant="outlined" v-model="comments" label="备注" hint="可以在这里输入其他想说的内容，如上岸经验、额外的自我介绍等"
                    persistent-hint></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-fade-transition>

      <v-fade-transition>
        <v-card variant="elevated" elevation="5" class="card" rounded="xl">
          <v-card-title>联系方式信息</v-card-title>
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="contactMail" label="邮箱"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="contactPhone" label="电话"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="contactQQ" label="QQ"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="contactWeChat" label="微信"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea variant="outlined" v-model="contactOthers" label="其他联系方式"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-fade-transition>

      <v-fab-transition>
        <v-card variant="elevated" elevation="5" class="card" rounded="xl">
          <v-card-title>账号</v-card-title>
          <v-form fast-fail @submit.prevent>
            <v-container>
              <v-row>
                <v-col>
                  学号：{{ studentID }}
                </v-col>
              </v-row>
              <v-row>
                <v-divider></v-divider>
              </v-row>
              <v-row>
                <v-col cols="3">
                  头像：
                  <v-avatar :image="studentAvatar !== '' ? studentAvatar : '/avatar/chino.jpg'" size="64"></v-avatar>
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
            </v-container>
          </v-form>
        </v-card>
      </v-fab-transition>
      <v-fade-transition>
        <v-alert v-if="isUpdateInfoErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
          上传数据时似乎出了一点问题。尝试重新上传？<br>{{ requestError }}
        </v-alert>
      </v-fade-transition>
      <v-btn @click="updateInfo">提交更改</v-btn>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '@/plugins/util/axiosInstance';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';

const studentName = ref('')
const studentGender = ref('')
const studentGenderList = ['男', '女', '其他']
const studentClass = ref('')
const studentGrade = ref('')
const studentGradeList = ref(['2020', '2021', '2022'])
const studentGraduated = ref('')
const studentGraduatedList = ['是', '否']
const studentMajor = ref('')
const studentMajorList = ref(['计算机科学与技术', '软件工程'])

const goneType = ref('')
const goneTypeList = ref(['升学', '就业', '出国'])
const goneInstitute = ref('')

const contactQQ = ref('')
const contactWeChat = ref('')
const contactMail = ref('')
const contactPhone = ref('')
const contactOthers = ref('')

const comments = ref('')

const studentID = ref('123456')
const newPassword = ref('')
const newPasswordConfirmed = ref('')

const studentAvatar = ref('')
const isSelectingAvatar = ref(false)
const isAvatarUpdated = ref(false)

const isGetInfoErrorHappened = ref(false)
const isUpdateInfoErrorHappened = ref(false)
const requestError = ref()

// https://cn.vuejs.org/api/built-in-special-attributes.html#ref
const avatarSelector = ref<HTMLElement>()

const passwordConfirmRules = [
  () => {
    if (newPassword.value === newPasswordConfirmed.value) {
      return true
    } else {
      return '两次输入的密码不一致'
    }
  },
]

const selectAvatarRules = [
  (value: File[]) => {
    return !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
  },
]

onMounted(() => {
  axiosInstance
    .get('/user/getinfo')
    .then((response) => {
      console.log(response)
      if (response.data.code === 1) {
        console.log('请求成功')
        isGetInfoErrorHappened.value = false
        // TODO
      } else {
        isGetInfoErrorHappened.value = true
        console.log('请求失败！')
      }
    }).catch((error) => {
      console.log(error)
      requestError.value = error
      isGetInfoErrorHappened.value = true
    })
})

async function updateInfo() {
  axiosInstance
    .post('/user/updateinfo', {
      // TODO
      // 注意，当isAvatarUpdated为true时，需要将头像上传到图床。
    }).then((response) => {
      console.log(response)
      if (response.data.code === 1) {
        console.log('请求成功')
        isUpdateInfoErrorHappened.value = false
      } else {
        isUpdateInfoErrorHappened.value = true
        console.log('请求失败！')
      }
    }).catch((error) => {
      console.log(error)
      requestError.value = error
      isUpdateInfoErrorHappened.value = true
    })
}

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
  const target = e.target as HTMLInputElement
  if (target !== null && target.files !== null) {
    isAvatarUpdated.value = true
    const selectedAvatar = target.files[0]
    studentAvatar.value = URL.createObjectURL(selectedAvatar)
    console.log(studentAvatar.value)
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