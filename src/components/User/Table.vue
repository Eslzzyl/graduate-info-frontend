<template>
  <v-container>
    <v-banner sticky style="font-size: 2rem;">表格</v-banner>
    <v-card rounded="xl" variant="elevated" elevation="5" class="card">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-text-field variant="outlined" density="compact" label="检索姓名" v-model="search" clearable></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
              :items="tableData" :loading="loading" :search="search" class="elevation-1" item-value="name"
              @update:options="loadItems" loading-text="正在加载数据...">
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination rounded="circle" v-model="page" :length="pageCount"></v-pagination>
                </div>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-fade-transition>
      <v-alert v-if="isErrorHappened" rounded="xl" variant="elevated" elevation="5" class="card">
          加载似乎出了一点问题。尝试刷新页面？<br>{{ requestError }}
      </v-alert>
    </v-fade-transition>
  </v-container>
</template>

<script setup>
// 语言原本应该用TypeScript的，但遇到了一些类型问题，不想深挖，就改JavaScript了
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import axiosInstance from '@/plugins/util/axiosInstance'
import { onMounted, ref } from 'vue';

const tableData = []
const search = ref('')
const loading = ref(true)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const isErrorHappened = ref(false)
const pageCount = ref(0)
const page = ref(0)
const sortBy = ref([])

const requestError = ref(null)

const headers = ref([
  {
    title: '姓名',
    align: 'center',
    sortable: false,
    key: 'name'
  },
  {
    title: '年级',
    align: 'center',  // 从没见过start end这种对齐方式，太阴间了
    sortable: true,
    key: 'grade',
  },
  {
    title: '专业',
    align: 'center',
    sortable: false,
    key: 'major',
  },
  {
    title: '去向类型',
    align: 'center',
    sortable: false,
    key: 'goneType',
  },
  {
    title: '去向',
    align: 'center',
    sortable: false,
    key: 'gone',
  },
  {
    title: '详情',
    align: 'center',
    sortable: false,
    key: 'moreInfo',
  },
])

// 页面挂载时加载第一页数据
onMounted(() => {
  loadItems({ page: 1, itemsPerPage, sortBy })
})

async function request({ page, itemsPerPage, sortBy, search }) {
  axiosInstance.get('/user/table', {
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
      isErrorHappened.value = true
      console.log('请求失败！')
    }
  }).catch((error) => {
    console.log(error)
    requestError.value = error
    isErrorHappened.value = true
  });
}

async function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true
  const result = await request({ page, itemsPerPage, sortBy, search })
  pageCount.value = result.pageCount
  const packedData = result.data
  loading.value = false
  if (packedData.length !== 0) {
    tableData.value = packedData
  }
}

// 这个函数有必要存在吗？
// function updateInfo(packedData) {
//   tableData = []
//   packedData.forEach(e => {
//     let obj = {}
//     obj.name = e.name
//     obj.avatar = e.avatar
//     obj.gender = e.gender
//     obj.grade = e.grade
//     obj.major = e.major
//     obj.class = e.class
//     obj.goneType = e.goneType
//     obj.gone = e.gone
//     obj.wechat = e.wechat
//     obj.qq = e.qq
//     obj.phone = e.phone
//     obj.mail = e.mail
//     obj.others = e.others
//     obj.comments = e.comments
//     tableData.push(obj)
//   })
// }

</script>

<style scoped>
.card {
  margin: 0 auto;
  margin-bottom: 15px;
  margin-top: 15px;
}
</style>