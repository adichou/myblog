<template>
  <header class="sticky top-0 z-50 bg-white/80 bg-glass border-b border-gray-200/50 backdrop-blur-md">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <i class="fas fa-code text-white text-lg"></i>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl text-gradient font-bold">DevInsights</h1>
            <p class="text-xs text-gray-500">技术与思考</p>
          </div>
        </router-link>
        
        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link to="/" class="nav-link">首页</router-link>
          <a href="#featured" class="nav-link">精选文章</a>
          <router-link to="/markdown-demo" class="nav-link">Markdown演示</router-link>
          <a href="#projects" class="nav-link">项目展示</a>
          <a href="#travel" class="nav-link">旅游分享</a>
          <a href="#digital" class="nav-link">数码评测</a>
          <a href="#about" class="nav-link">关于我</a>
        </nav>
        
        <!-- 搜索和主题切换 -->
        <div class="flex items-center gap-4">
          <!-- 搜索按钮 -->
          <button 
            @click="toggleSearch"
            class="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
          >
            <i class="fas fa-search"></i>
          </button>
          
          <!-- 移动端菜单按钮 -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        v-show="showMobileMenu"
        class="md:hidden py-4 border-t border-gray-200 animate-slide-up"
      >
        <nav class="flex flex-col gap-2">
          <router-link to="/" class="nav-link py-2">首页</router-link>
          <a href="#featured" class="nav-link py-2">精选文章</a>
          <router-link to="/markdown-demo" class="nav-link py-2">Markdown演示</router-link>
          <a href="#projects" class="nav-link py-2">项目展示</a>
          <a href="#travel" class="nav-link py-2">旅游分享</a>
          <a href="#digital" class="nav-link py-2">数码评测</a>
          <a href="#about" class="nav-link py-2">关于我</a>
        </nav>
      </div>
    </div>
    
    <!-- 搜索覆盖层 -->
    <div 
      v-show="showSearch"
      class="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-slide-up"
    >
      <div class="container mx-auto px-4 lg:px-6 py-4">
        <div class="relative">
          <input 
            ref="searchInput"
            v-model="searchQuery"
            type="text" 
            placeholder="搜索文章、项目或话题..."
            class="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @keyup.enter="performSearch"
          >
          <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <button 
            @click="toggleSearch"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const showMobileMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showSearch.value) {
    showSearch.value = false
  }
}

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showMobileMenu.value) {
    showMobileMenu.value = false
  }
  
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 这里可以实现搜索逻辑
    toggleSearch()
  }
}
</script>