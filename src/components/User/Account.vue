<template>
  <span class="header">个人信息</span>
  <v-main style="overflow-y: auto;">
    <v-card variant="elevated" elevation="5" class="card">
      <v-card-title>学籍信息</v-card-title>
      <v-form>
        <v-container>
          <v-row>
            <v-col>

            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <v-card variant="elevated" elevation="5" class="card">
      <v-card-title>去向信息</v-card-title>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-select variant="outlined" clearable v-model="goneType" label="去向类型" :items="goneTypeReceived"></v-select>
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

    <v-card variant="elevated" elevation="5" class="card">
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
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const studentName = ref<string>('')
const studentGender = ref<string>('')
const studentClass = ref<string>('')
const studentGrade = ref<string>('')
const studentGraduated = ref<boolean>(true)

const goneType = ref<string>('')
const goneTypeReceived = ref<Array<string>>(['升学', '就业', '出国'])
const goneInstitute = ref<string>('')

const contactQQ = ref<string>('')
const contactWeChat = ref<string>('')
const contactMail = ref<string>('')
const contactPhone = ref<string>('')
const contactOthers = ref<string>('')

const comments = ref<string>('')


</script>

<style>
.header {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 10px;
  margin-right: 20px;
  display: block;
}

.card {
  margin: 0 auto;
  margin-bottom: 15px;
  width: 90%;
}
</style>