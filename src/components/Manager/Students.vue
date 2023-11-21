<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">录入学生信息</v-banner>
    <v-card rounded="xl" variant="elevated" elevation="5" class="card">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-text-field variant="outlined" density="compact" label="检索学生..." v-model="search" clearable></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="indigo-accent-1" @click="loadItems()">搜索</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <v-btn color="indigo-accent-1" @click="dialog = true">新增学生</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="students"
              :items-length="totalItems" :loading="loading" :search="search" class="elevation-1"
              @update:options="loadItems" loading-text="正在加载数据...">
              <template v-slot:item.actions="{ item }">
                <v-btn variant="tonal" color="red-accent-2" @click="dialogDelete = true; currItem.value = item">删除</v-btn>
              </template>
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination rounded="circle" v-model="page" :length="pageCount"></v-pagination>
                </div>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="dialogDelete" max-width="30vw">
        <v-card>
          <v-card-title class="text-h5">确定删除</v-card-title>
          <v-card-text>
            你确定要删除这条记录吗？删除操作不可撤销！
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="indigo-accent-1" @click="dialogDelete = false">取消</v-btn>
            <v-btn variant="tonal" color="red-accent-2" @click="deleteItemConfirmed()">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="60vw">
        <v-card rounded="xl">
          <v-form fast-fail @submit.prevent>
            <v-card-title>
              <span class="text-h5">新增学生</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <v-text-field variant="outlined" label="学号" clearable v-model="studentID" :rules="idRules"></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field variant="outlined" label="姓名" clearable v-model="studentName"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-select variant="outlined" label="性别" clearable v-model="studentGender"
                      :items="['男', '女']"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">
                    <v-text-field variant="outlined" label="年级" clearable v-model="studentGrade"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field variant="outlined" label="院系" clearable v-model="studentDept"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field variant="outlined" label="专业" clearable v-model="studentMajor"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-select variant="outlined" label="班级" clearable v-model="studentClass"
                      :items="['1', '2', '3', '4', '5']"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog = false">取消</v-btn>
              <v-btn color="blue-darken-1" variant="text" type="submit" @click="newItemSaved()">保存</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-card>

    <v-fade-transition>
      <v-alert v-if="isErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
        加载似乎出了一点问题。尝试刷新页面？<br>{{ requestError }}
      </v-alert>
    </v-fade-transition>
    <v-snackbar v-model="snackbar" timeout="5000" rounded="pill" color="indigo-lighten-5">
      {{ prompt }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable';
import axiosInstance from '@/plugins/util/axiosInstance';

const isErrorHappened = ref(false)
const loading = ref(true)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const pageCount = ref(0)
const page = ref(0)
const sortBy = ref([])
const search = ref('')
const requestError = ref(null)

const studentID = ref('')
const studentName = ref('')
const studentGender = ref('')
const studentGrade = ref('')
const studentDept = ref('')
const studentMajor = ref('')
const studentClass = ref('')

const dialog = ref(false)
const dialogDelete = ref(false)

const snackbar = ref(false)
const prompt = ref('')

const idRules = [
  (value) => {
    if (value?.length == 10) {
      return true
    } else {
      return '学号长度有误'
    }
  },
]

const headers = ref([
  {
    title: '学号',
    align: 'center',
    sortable: true,
    key: 'id'
  },
  {
    title: '姓名',
    align: 'center',
    sortable: false,
    key: 'name'
  },
  {
    title: '性别',
    align: 'center',
    sortable: false,
    key: 'gender',
  },
  {
    title: '年级',
    align: 'center',
    sortable: true,
    key: 'grade'
  },
  {
    title: '院系',
    align: 'center',
    sortable: false,
    key: 'dept',
  },
  {
    title: '专业',
    align: 'center',
    sortable: false,
    key: 'major',
  },
  {
    title: '班级',
    align: 'center',
    sortable: true,
    key: 'class',
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'actions',
  },
])

const students = ref([])
const currItem = ref(null)

// 删除学生信息
function deleteItemConfirmed() {
  const currID = currItem.value.id
  students.value.splice(currItem.value, 1)
  axiosInstance.post('/manager/delete/students', {
    id: currID,
  }).then((response) => {
    console.log(response)
    if (response.data.code === 1) {
      console.log('删除成功')
      prompt.value = '删除成功'
      snackbar.value = true
    } else {
      console.error('删除失败')
      prompt.value = '删除失败'
      snackbar.value = true
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error
    isErrorHappened.value = true
  });
  dialogDelete.value = false
}

// 保存学生信息
function newItemSaved() {
  if (studentID.value === '' || studentName.value === '' || studentGender.value === '' || studentGrade.value === '' || studentDept.value === '' || studentMajor.value === '' || studentClass.value === '') {
    prompt.value = '请将信息输入完整'
    snackbar.value = true
    return
  }

  students.value.push({
    id: studentID.value,
    name: studentName.value,
    gender: studentGender.value,
    grade: studentGrade.value,
    dept: studentDept.value,
    major: studentMajor.value,
    class: studentClass.value,
  })
  // 清空学生信息
  studentID.value = ''
  studentName.value = ''
  studentGender.value = ''
  studentGrade.value = ''
  studentDept.value = ''
  studentMajor.value = ''
  studentClass.value = ''

  axiosInstance.post('/manager/add', {
    id: studentID.value,
    name: studentName.value,
    gender: studentGender.value,
    grade: studentGrade.value,
    dept: studentDept.value,
    major: studentMajor.value,
    class: studentClass.value,
  }).then((response) => {
    console.log(response)
    if (response.data.code === 1) {
      console.log('新增学生信息成功')
      prompt.value = '新增学生信息成功'
      snackbar.value = true
    } else {
      console.error('新增学生信息失败:', response.data.message)
      prompt.value = '新增学生信息失败: ' + response.data.message
      snackbar.value = true
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error
    isErrorHappened.value = true
  });

  dialog.value = false
}

// 页面挂载时加载第一页数据
onMounted(() => {
  loadItems({ page: 1, itemsPerPage, sortBy })
})

async function getInfo({ page, itemsPerPage, sortBy, search }) {
  axiosInstance.get('/manager/students', {
    page: page,
    itemsPerPage: itemsPerPage,
    sortBy: sortBy,
    search: search,
  }).then((response) => {
    console.log(response)
    if (response.data.code === 1) {
      console.log('请求成功，请求到' + response.data.data.length + '条信息')
      return response.data
    } else {
      prompt.value = '请求失败: ' + response.data.message
      snackbar.value = true
      console.error('请求失败: ', response.data.message)
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error
    isErrorHappened.value = true
  });
}

async function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true
  const result = await getInfo({ page, itemsPerPage, sortBy, search })
  pageCount.value = result.pageCount
  const packedData = result.data
  loading.value = false
  if (packedData.length !== 0) {
    students.value = packedData
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