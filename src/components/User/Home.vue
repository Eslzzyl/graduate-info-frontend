<template>
  <v-container>
    <v-row>
      <v-carousel id="carousel" class="rounded-xl" cycle height="600" hide-delimiter-background :show-arrows="false">
        <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src" cover>
          <span class="title">毕业生去向信息共享系统</span>
        </v-carousel-item>
      </v-carousel>
    </v-row>
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card @click="$emit('gotoTableEvent')" v-bind="props" class="card" color="indigo-lighten-5"
              :elevation="isHovering ? 10 : 5" rounded="xl">
              <v-card-title><v-icon icon="mdi-table"></v-icon> 表格</v-card-title>
              <v-card-subtitle>通过搜索和排序功能迅速检索信息</v-card-subtitle>
            </v-card>
          </template>
        </v-hover>
      </v-col>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card @click="$emit('gotoStatisticsEvent')" v-bind="props" class="card" color="indigo-lighten-5"
              :elevation="isHovering ? 10 : 5" rounded="xl">
              <v-card-title><v-icon icon="mdi-poll"></v-icon> 统计</v-card-title>
              <v-card-subtitle>通过多种多样的图表发现去向规律</v-card-subtitle>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card @click="$emit('gotoMessageEvent')" v-bind="props" class="card" color="indigo-lighten-5"
              :elevation="isHovering ? 10 : 5" rounded="xl">
              <v-card-title><v-icon icon="mdi-mail"></v-icon> 消息</v-card-title>
              <v-card-subtitle>利用站内消息与同学互动</v-card-subtitle>
            </v-card>
          </template>
        </v-hover>
      </v-col>
      <v-col>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card @click="$emit('gotoAccountEvent')" v-bind="props" class="card" color="indigo-lighten-5"
              :elevation="isHovering ? 10 : 5" rounded="xl">
              <v-card-title><v-icon icon="mdi-account"></v-icon> 个人信息</v-card-title>
              <v-card-subtitle>维护自己的去向信息和账号信息</v-card-subtitle>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  {
    src: '/image/hfut-xc/1.jpg'
  },
  {
    src: '/image/hfut-xc/2.jpg'
  },
  {
    src: '/image/hfut-xc/3.jpg'
  },
  {
    src: '/image/hfut-xc/4.jpg'
  },
  {
    src: '/image/hfut-xc/5.jpg'
  },
  {
    src: '/image/hfut-xc/6.jpg'
  },
  {
    src: '/image/hfut-xc/7.jpg'
  },
  {
    src: '/image/hfut-xc/8.jpg'
  },
  {
    src: '/image/hfut-xc/9.jpg'
  },
  {
    src: '/image/hfut-xc/10.jpg'
  },
  {
    src: '/image/hfut-xc/11.jpg'
  },
  {
    src: '/image/hfut-xc/12.jpg'
  },
  {
    src: '/image/hfut-xc/13.jpg'
  },
  {
    src: '/image/hfut-xc/14.jpg'
  },
  {
    src: '/image/hfut-xc/15.jpg'
  },
  {
    src: '/image/hfut-xc/16.jpg'
  },
]

</script>

<style scoped>
.card {
  margin: 0 auto;
  height: 200px;
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}

#carousel {
  border-radius: 10px;
  margin-bottom: 10px;
}

.title {
  margin-left: 15px;
  margin-top: 15px;
  font-size: 3rem;
  color: aliceblue;
}

#v-card-title {
  font-weight: bold;
}

</style>
