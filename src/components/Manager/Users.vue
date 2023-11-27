<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">用户管理</v-banner>
    <v-card rounded="xl" variant="elevated" elevation="5" class="card">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-text-field variant="outlined" density="compact" label="检索用户..." v-model="search" clearable></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="indigo-accent-1" @click="loadItems()">搜索</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="users"
              :items-length="totalItems" :loading="loading" :search="search" class="elevation-1"
              @update:options="loadItems" loading-text="正在加载数据...">
              <template v-slot:item.actions="{ item }">
                <v-icon icon="mdi-information-outline" size="small" class="me-2" @click="editItem(item)"></v-icon>
                <v-icon icon="mdi-delete" size="small" @click="dialogDelete = true; currItem.value = item"></v-icon>
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
      <v-dialog v-model="dialogDelete" max-width="500px">
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
      <v-dialog v-model="dialog" max-width="80vw">
        <v-card rounded="xl">
          <v-card-title>
            <span class="text-h5">编辑用户信息</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  学号：{{ currItem.id }}
                </v-col>
                <v-col>
                  姓名：{{ currItem.name }}
                </v-col>
                <v-col>
                  性别：{{ currItem.gender }}
                </v-col>
                <v-col>
                  年级：{{ currItem.grade }}
                </v-col>
                <v-col>
                  院系：{{ currItem.dept }}
                </v-col>
                <v-col>
                  专业：{{ currItem.major }}
                </v-col>
                <v-col>
                  班级：{{ currItem.class }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  是否已毕业：{{ currItem.graduated }}
                </v-col>
                <v-col>
                  去向类型：{{ currItem.goneType }}
                </v-col>
                <v-col>
                  去向单位：{{ currItem.gone }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  QQ：{{ currItem.qq }}
                </v-col>
                <v-col>
                  电话：{{ currItem.phone }}
                </v-col>
                <v-col>
                  微信：{{ currItem.wechat }}
                </v-col>
                <v-col>
                  邮箱：{{ currItem.mail }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  其他联系方式：{{ currItem.others }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  备注：{{ currItem.comments }}
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">确定</v-btn>
          </v-card-actions>
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

const dialog = ref(false)
const dialogDelete = ref(false)

const snackbar = ref(false)
const prompt = ref('')

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

const users = ref([])
const currItem = ref(null)

function editItem(item) {
  currItem.value = item
  dialog.value = true
}

function deleteItemConfirmed() {
  const currID = currItem.value.id
  users.value.splice(currItem.value, 1)

  axiosInstance.post('/manager/delete/users', {
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

// 页面挂载时加载第一页数据
onMounted(() => {
  loadItems({ page: 1, itemsPerPage, sortBy })
})

async function getInfo({ page, itemsPerPage, sortBy, search }) {
  axiosInstance.get('/manager/users', {
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
      console.error('请求失败！')
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error.message
    isErrorHappened.value = true
  });
}

async function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true
  const result = await getInfo({ page, itemsPerPage, sortBy, search })
  // const result = {
  //   data: [{
  //     id: '12345678',
  //     name: '香风智乃',
  //     gender: '女',
  //     grade: '2019',
  //     dept: '食品学院',
  //     major: '咖啡制作技术',
  //     class: '2',
  //     graduated: '是',
  //     goneType: '就业',
  //     gone: '兔子屋餐饮有限公司',
  //     qq: '12345321',
  //     wechat: '231231232',
  //     mail: 'aaaa@bbb.com',
  //     phone: '2132312321313',
  //     others: '',
  //     comments: '',
  //   },],
  //   pageCount: 1,
  // }
  pageCount.value = result.pageCount
  const packedData = result.data
  loading.value = false
  if (packedData.length !== 0) {
    users.value = packedData
  }
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

</script>

<style scoped>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}
</style>