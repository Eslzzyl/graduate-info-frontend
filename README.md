# 高校毕业生去向信息共享系统 前端部分

## 简介

这个仓库保存了2023年秋季学期在合肥工业大学宣城校区计算机科学与技术专业2020级开设的《领域方向综合设计》课程设计项目的前端部分。

本项目拟向用户提供高校毕业生毕业去向信息共享的服务。

## 技术

- 框架：[Vuetify](https://vuetifyjs.com/zh-Hans/) 3（基于[Vue.js](https://cn.vuejs.org/) 3）
  - 尽量遵循 Material Design 风格
- 打包工具：Vite
- 引入的库：
  - [Vanta.js](https://www.vantajs.com/)
  - [Chart.js](http://chartjs.cn/)

## 功能

项目主要面向在校学生（普通用户），也提供了后台管理功能，可供教师使用。

### 普通用户

#### 注册和登录功能

计划支持多个账号凭据的登录

#### 维护自己的信息

包括去向信息、学籍信息、联系方式、账号信息等。

去向信息：包括去向类型（求职、考公、考研、出国出境等）、去向单位等。用户可以留下备注，为其他同学提供上岸经验。

学籍信息：包括年级、专业、班级、是否已毕业等。

联系方式：包括电话、邮箱、QQ、微信，也支持用户自行添加其他的联系方式。

账号信息：学号、密码。

#### 查看去向表

在服务器端做分页、排序和搜索，支持表格排序，自由搜索等。

#### 统计图

基于系统中数据形成多种统计图表。

#### 消息

还在构思当中

## 配色

拟采用 Material 风格的动态配色，根据当前的天空颜色确定配色

## 截图

待补
