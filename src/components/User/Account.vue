<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">个人信息</v-banner>
    <v-container style="max-height: 90vh; overflow-y: auto;">
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
                  :items="studentGenderSelect"></v-select>
              </v-col>
              <v-col cols="2">
                <v-select variant="outlined" clearable v-model="studentGrade" label="年级"
                  :items="studentGradeSelect"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select variant="outlined" clearable v-model="studentMajor" label="专业"
                  :items="studentMajorSelect"></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field variant="outlined" clearable v-model="studentClass" label="班级"
                  hint="只填数字即可，如“1”" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select variant="outlined" clearable v-model="studentGraduated" label="是否已毕业"
                  :items="studentGraduatedSelect"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>

      <v-card variant="elevated" elevation="5" class="card" rounded="xl">
        <v-card-title>去向信息</v-card-title>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select variant="outlined" clearable v-model="goneType" label="去向类型" :items="goneTypeSelect"></v-select>
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

      <v-btn elevation="5">提交上述信息的更改</v-btn>

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
                <v-avatar image="/avatar/chino.jpg" size="64"></v-avatar>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn>上传新头像</v-btn>
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
                <v-text-field variant="outlined" v-model="newPasswordConfirmed" label="再次输入以确认密码" :rules="passwordConfirmRules"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn type="submit">提交新密码</v-btn>
              </v-col>
            </v-row>
          </v-container>
          </v-form>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const studentName = ref<string>('')
const studentGender = ref<string>('')
const studentGenderSelect = ['男', '女', '其他']
const studentClass = ref<string>('')
const studentGrade = ref<string>('')
const studentGradeSelect = ref<Array<string>>(['2020', '2021', '2022'])
const studentGraduated = ref<string>('')
const studentGraduatedSelect = ['是', '否']
const studentMajor = ref<string>('')
const studentMajorSelect = ref<Array<string>>(['计算机科学与技术', '软件工程'])

const goneType = ref<string>('')
const goneTypeSelect = ref<Array<string>>(['升学', '就业', '出国'])
const goneInstitute = ref<string>('')

const contactQQ = ref<string>('')
const contactWeChat = ref<string>('')
const contactMail = ref<string>('')
const contactPhone = ref<string>('')
const contactOthers = ref<string>('')

const comments = ref<string>('')

const studentID = ref<string>('123456')
const newPassword = ref<string>('')
const newPasswordConfirmed = ref<string>('')

const passwordConfirmRules = [
  () => {
    if (newPassword.value === newPasswordConfirmed.value) {
      return true
    } else {
      return '两次输入的密码不一致'
    }
  },
]

function getInfo() {

}

</script>

<style>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}
</style>