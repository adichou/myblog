<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 主布局容器 -->
    <div class="flex min-h-screen">
      <!-- 左侧边栏 - 只在非首页显示 -->
      <div v-if="!isHomePage" class="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-10">
        <Sidebar />
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="flex-1" :class="{ 'ml-64': !isHomePage }">
        <!-- 主要内容 -->
        <main class="min-h-screen">
          <router-view />
        </main>
        
        <!-- 页脚 -->
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

// 判断是否为首页
const isHomePage = computed(() => {
  return route.name === 'Home' || route.path === '/'
})
</script>

<style scoped>
/* 组件特定样式 */
</style>