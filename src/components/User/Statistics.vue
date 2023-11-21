<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">统计信息</v-banner>
    <v-card class="card" rounded="xl" variant="elevated" elevation="5">
      <v-row>
        <v-col>
          <v-select></v-select>
        </v-col>
      </v-row>
    </v-card>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" color="indigo-lighten-5">
      {{ prompt }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import axiosInstance from '@/plugins/util/axiosInstance';
import { ref, onMounted } from 'vue';

const gradeList = ref([])
const deptList = ref([])
const dept = ref(null)
const currMajorList = ref([])

const snackbar = ref(false)
const prompt = ref('')

onMounted(() => {
  axiosInstance.get('/user/list')
    .then((response) => {
      console.log(response)
      if (response.data.code === 1) {
        dept.value = response.data.dept
        gradeList.value = response.data.grade
        deptList.value = Object.keys(response.data.dept)
      } else {
        console.error(response.data.message)
        prompt.value = response.data.message
        snackbar.value = true
      }
    }).catch((error) => {
      console.error(error)
      prompt.value = error.message
      snackbar.value = true
    })
})

</script>

<style scoped>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}
</style>