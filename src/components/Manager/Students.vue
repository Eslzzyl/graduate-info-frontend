<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">录入学生信息</v-banner>
    <v-card rounded="xl" variant="elevated" elevation="5" class="card">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-text-field variant="outlined" density="compact" label="检索学生..." v-model="search" clearable></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="students"
              :items-length="totalItems" :loading="loading" :search="search" class="elevation-1"
              @update:options="loadItems" loading-text="正在加载数据...">
              <template v-slot:item.actions="{ item }">
                <v-btn variant="tonal" @click="onAddItem(item)">新增</v-btn>
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
      <v-dialog v-model="dialogAdd" max-width="80vw">
        <v-card rounded="xl">
          <v-card-title>
            <span class="text-h5">新增去向信息</span>
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
                <v-col cols="1">
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
                  <v-select variant="outlined" clearable v-model="currItem.graduated" label="是否已毕业"
                    :items="studentGraduatedList"></v-select>
                </v-col>
                <v-col>
                  <v-select variant="outlined" clearable v-model="currItem.goneType" label="去向类型"
                    :items="goneTypeList"></v-select>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="currItem.gone" label="去向单位"
                    hint="输入工作单位时，建议带上岗位；输入学校时，建议带上专业方向" persistent-hint></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea variant="outlined" v-model="currItem.comments" label="备注"
                    hint="可以在这里输入其他想说的内容，如上岸经验、额外的自我介绍等" persistent-hint></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="currItem.qq" label="QQ"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="currItem.phone" label="电话"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="currItem.wechat" label="微信"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field variant="outlined" clearable v-model="currItem.mail" label="邮箱"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea variant="outlined" v-model="currItem.others" label="其他联系方式"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialogAdd = false">取消</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="onSaveItem">确定</v-btn>
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
import { ref, watch } from 'vue'
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
  }
])

const students = ref([])

watch(page, () => {
  loadItems({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})

const dialogAdd = ref(false)
const currItem = ref(null)
const goneTypeList = [
  "考研已上岸",
  "考研准备中",
  "推免",
  "考公已上岸",
  "考公准备中",
  "求职中",
  "企业就业",
  "出国出境深造",
  "其他"
]
const studentGraduatedList = ['是', '否']

function onAddItem(item) {
  currItem.value = item
  currItem.value.graduated = ''
  currItem.value.goneType = ''
  currItem.value.gone = ''
  currItem.value.comments = ''
  currItem.value.qq = ''
  currItem.value.phone = ''
  currItem.value.wechat = ''
  currItem.value.mail = ''
  currItem.value.others = ''
  dialogAdd.value = true
}

function onSaveItem() {
  console.log(currItem.value)
  if (currItem.value.goneType === '') {
    prompt.value = "请选择去向类型"
    snackbar.value = true
    dialogAdd.value = false
    return
  }

  dialogAdd.value = false
  
  axiosInstance.post("/manager/add", {
    id: currItem.value.id,
    graduated: currItem.value.graduated,
    goneType: currItem.value.goneType,
    gone: currItem.value.gone,
    // private 还没加
    comments: currItem.value.comments,
    mail: currItem.value.mail,
    phone: currItem.value.phone,
    wechat: currItem.value.wechat,
    qq: currItem.value.qq,
    others: currItem.value.others
  }).then((response) => {
    if (response.data.code === 1) {
      prompt.value = "保存成功"
      snackbar.value = true
      students.value.splice(students.value.indexOf(currItem.value), 1)
      currItem.value = null
    } else {
      prompt.value = "保存失败：" + response.data.message
      snackbar.value = true
    }
  }).catch((error) => {
    console.error(error)
    requestError.value = error.message
    isErrorHappened.value = true
  })
  
  dialogAdd.value = false
}

async function request({ page, itemsPerPage, sortBy, search }) {
  try {
    const response = await axiosInstance.post('/manager/students', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy,
      search: search,
    });
    console.log(response)
    if (response.data.code === 1) {
      console.log('请求成功，请求到' + response.data.data.length + '条信息')
      return (await response).data
    } else {
      prompt.value = '请求失败: ' + response.data.message
      snackbar.value = true
      console.error('请求失败: ', response.data.message)
    }
  } catch (error) {
    console.error(error)
    requestError.value = error
    isErrorHappened.value = true
  }
}

async function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true
  const result = await request({ page, itemsPerPage, sortBy, search: search.value })
  // const result = {
  //   data: [{
  //     id: '12345678',
  //     name: '香风智乃',
  //     gender: '女',
  //     grade: '2019',
  //     dept: '食品学院',
  //     major: '咖啡制作技术',
  //     class: '2',
  //   },],
  //   pageCount: 1,
  // }
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