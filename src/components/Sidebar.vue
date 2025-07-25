<template>
  <aside class="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
    <div class="p-4">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group mb-4">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <i class="fas fa-code text-white text-sm"></i>
        </div>
        <div>
          <h1 class="text-lg text-gradient font-bold">DevInsights</h1>
          <p class="text-xs text-gray-500">技术与思考</p>
        </div>
      </router-link>
      
      <!-- 文章目录 -->
      <nav class="space-y-1">
        <div class="mb-3">
          <router-link to="/" class="flex items-center gap-2 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i class="fas fa-home text-primary-500 text-sm"></i>
            <span class="font-medium text-sm">首页</span>
          </router-link>
        </div>
        
        <!-- 动态目录结构 -->
        <div v-if="loading" class="flex items-center justify-center py-2">
          <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
          <span class="ml-2 text-xs text-gray-600">加载中...</span>
        </div>
        
        <div v-else-if="error" class="text-red-500 text-xs p-2">
          {{ error }}
        </div>
        
        <div v-else>
          <!-- 按分类展示文章 -->
          <div v-for="category in categories" :key="category.name" class="mb-2">
            <div class="flex items-center justify-between px-2 py-1 text-xs text-gray-800 uppercase tracking-wide font-semibold">
              <span>{{ getCategoryDisplayName(category.name) }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{{ category.count }}</span>
            </div>
            
            <div class="ml-2 space-y-0.5">
              <router-link 
                v-for="post in getPostsByCategory(category.name)" 
                :key="post.slug"
                :to="`/post/${post.slug}`"
                class="block px-2 py-1 text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 group"
              >
                <div class="flex items-center gap-1.5">
                  <i class="fas fa-file-alt text-xs text-gray-400 group-hover:text-primary-500"></i>
                  <span class="truncate">{{ post.title }}</span>
                </div>
              </router-link>
            </div>
          </div>
          

        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBlogPosts } from '@/composables/useBlogPosts'

const { 
  loading, 
  error, 
  categories, 
  allTags,
  loadPosts,
  getPostsByCategory
} = useBlogPosts()

const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'tech': '技术文章',
    'tutorials': '教程指南', 
    'projects': '项目展示',
    'thoughts': '思考随笔'
  }
  return categoryMap[category] || category
}



onMounted(async () => {
  await loadPosts()
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>