<template>
  <div id="app" class="min-h-screen bg-gray-50" :class="{ 'sidebar-open': isSidebarOpen && !isHomePage }">
    <!-- 移动端汉堡菜单按钮 -->
    <button 
      v-if="!isHomePage" 
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 lg:hidden"
    >
      <i class="fas fa-bars text-gray-600"></i>
    </button>
    
    <!-- 移动端遮罩层 -->
    <div 
      v-if="!isHomePage && isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>
    
    <!-- 主布局容器 -->
    <div class="flex min-h-screen">
      <!-- 左侧边栏 - 桌面端固定显示，移动端可切换 -->
      <div 
         v-if="!isHomePage" 
         :class="[
           'w-64 bg-white border-r border-gray-200 h-full z-40 sidebar-container',
           'lg:fixed lg:left-0 lg:top-0',
           'fixed left-0 top-0 transform transition-transform duration-300 ease-in-out',
           isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
         ]"
       >
        <Sidebar />
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="flex-1" :class="{ 'lg:ml-64': !isHomePage }">
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

// 侧边栏状态管理
const isSidebarOpen = ref(false)

// 判断是否为首页
const isHomePage = computed(() => {
  return route.name === 'Home' || route.path === '/'
})

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 路由变化时关闭侧边栏
watch(route, () => {
  isSidebarOpen.value = false
})
</script>

<style scoped>
/* 防止移动端侧边栏打开时背景滚动 */
.sidebar-open {
  overflow: hidden;
}

/* 移动端触摸优化 */
@media (max-width: 1023px) {
  .sidebar-container {
    -webkit-overflow-scrolling: touch;
  }
}
</style>