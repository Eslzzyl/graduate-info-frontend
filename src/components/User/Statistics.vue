<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">统计信息</v-banner>
    <v-card class="card" rounded="xl" variant="elevated" elevation="5">
      <v-container>
        <v-form fast-fail @submit.prevent>
          <v-row>
            <v-col cols="2">
              <v-select variant="outlined" clearable :items="gradeList" v-model="currGrade" label="年级"
                :rules="nutNullRule"></v-select>
            </v-col>
            <v-col cols="3">
              <v-select variant="outlined" clearable :items="Object.keys(deptList)" v-model="currDept" label="院系"
                @change="onSelectDept" :rules="nutNullRule"></v-select>
            </v-col>
            <v-col cols="3">
              <v-select variant="outlined" clearable :items="currMajorList" v-model="currMajor" label="专业"
                :rules="nutNullRule"></v-select>
            </v-col>
            <v-col cols="1">
              <v-btn variant="tonal" type="submit" @click="search">检索</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-container>
          <v-row>
            <v-col>
              <Pie :data="typeChartData" :options="ChartOptions"></Pie>
            </v-col>
            <v-col>
              <Pie :data="goneChartData" :options="ChartOptions"></Pie>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-card>
    <v-fade-transition>
      <v-alert v-if="isErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
        似乎出了一点问题。尝试刷新网页？<br>{{ requestError }}
      </v-alert>
    </v-fade-transition>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" color="indigo-lighten-5">
      {{ prompt }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import axiosInstance from '@/plugins/util/axiosInstance';
import { ref, onMounted } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const gradeList = ref([''])
const deptList = ref([])
const currMajorList = ref([''])
const currGrade = ref('')
const currDept = ref('')
const currMajor = ref('')

const goneTypeData = ref([])
const goneData = ref([])

const nutNullRule = [
  (value) => {
    if (value !== '') {
      return true
    } else {
      return '请选择'
    }
  },
]

const typeChartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
})
const goneChartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
})
const ChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

const snackbar = ref(false)
const prompt = ref('')
const requestError = ref('')
const isErrorHappened = ref(false)

onMounted(() => {
  axiosInstance.post('/user/list')
    .then((response) => {
      console.log(response)
      if (response.data.code === 1) {
        gradeList.value = response.data.data.grade
        deptList.value = Object.keys(response.data.data.dept)
      } else {
        console.error(response.data.message)
        prompt.value = response.data.message
        snackbar.value = true
      }
    }).catch((error) => {
      console.error(error)
      requestError.value = error.message
      isErrorHappened.value = true
    })
})

function onSelectDept() {
  currMajorList.value = deptList.value[currDept.value]
}

function search() {
  axiosInstance.post('/user/stat', {
    mode: 1,
    data: {
      grade: currGrade,
      dept: currDept,
      major: currMajor,
    }
  }).then((response) => {
    if (response.data.code === 1) {
      console.log(response)
      goneTypeData.value = response.data.type
      goneData.value = response.data.gone
      formatChartParams()
    } else {
      prompt.value = "服务端请求出错：" + response.data.message
      snackbar.value = true
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error.message
    isErrorHappened.value = true
  })
}

function formatChartParams() {

}

</script>

<style scoped>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}</style>