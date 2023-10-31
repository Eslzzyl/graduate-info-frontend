<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer :rail="rail" permanent @click="rail = false" theme="light">
        <!--如果要加背景图片，就用：-->
        <!-- <v-navigation-drawer image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" permanent theme="light"> -->
        <v-list-item prepend-avatar="/chino.jpg" :title="userName" nav>
          <template v-slot:append>
            <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>
        <v-list nav>
          <!-- <v-list-subheader v-if="!rail">毕业生去向信息共享系统</v-list-subheader>
          <v-list-subheader v-if="rail"></v-list-subheader> -->
          <v-list-item prepend-icon="mdi-home" title="主页" value="home" rounded="xl"
            @click="changeView('Home')"></v-list-item>
          <v-list-item prepend-icon="mdi-magnify" title="搜索" value="search" rounded="xl"
            @click="changeView('Search')"></v-list-item>
          <v-list-item prepend-icon="mdi-poll" title="统计" value="statistics" rounded="xl"
            @click="changeView('Statistics')"></v-list-item>
          <v-list-item prepend-icon="mdi-mail" title="消息" value="info" rounded="xl"
            @click="changeView('Message')"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="个人信息" value="account" rounded="xl"
            @click="changeView('Account')"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2" style="width: 70%; margin: 0 auto;">
            <v-dialog width="500">
              <template v-slot:activator="{ props }">
                <v-btn block v-bind="props" variant="text" icon="mdi-logout" v-if="rail"></v-btn>
                <v-btn block v-bind="props" variant="tonal" v-if="!rail">登出</v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="确认登出">
                  <v-card-text>
                    你确定要登出吗？
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="取消" @click="isActive.value = false;"></v-btn>
                    <v-btn text="确定" @click="isActive.value = false; logout()"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </template>

      </v-navigation-drawer>
      <v-main style="height: 100vh;">
        <transition>
          <component :is="currentView"></component>
        </transition>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang="ts">

import Home from './Home.vue'
import Message from './Message.vue'
import Account from './Account.vue'

export default {
  name: 'User',
  data() {
    return {
      rail: true,
      currentView: 'Home',
      userName: '香风智乃',
    }
  },
  components: {
    Home, Message, Account,
  },
  methods: {
    changeView(view: string) {
      this.currentView = view
    },
    logout() {
      this.$router.push('/')
    },
  },
}

</script>