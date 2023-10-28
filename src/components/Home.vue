<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer permanent theme="light">
        <!--如果要加背景图片，就用：-->
        <!-- <v-navigation-drawer image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" permanent theme="light"> -->
        <v-list nav>
          <v-list-subheader>毕业生去向共享系统</v-list-subheader>
          <v-list-item prepend-icon="mdi-home" title="主页" value="home" rounded="xl"></v-list-item>
          <v-list-item prepend-icon="mdi-mail" title="消息" value="info" rounded="xl"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="个人信息" value="account" rounded="xl"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2" style="width: 70%; margin: 0 auto;">
            <v-btn block variant="outlined">
              登出
            </v-btn>
          </div>
        </template>

      </v-navigation-drawer>
      <v-main style="height: 100vh;"></v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
//
</script>

<style scoped></style>
