<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <header class="max-w-4xl mx-auto mb-12">
        <!-- 面包屑导航 -->
        <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <router-link to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            首页
          </router-link>
          <span>/</span>
          <span class="text-gray-700 dark:text-gray-300">#{{ tag }}</span>
        </nav>
        
        <!-- 标签标题 -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            #{{ tag }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            包含 "{{ tag }}" 标签的所有文章
          </p>
          <div class="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
            <span>{{ filteredPosts.length }} 篇文章</span>
          </div>
        </div>
      </header>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">正在加载文章...</span>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-700 dark:text-red-300 font-medium">{{ error }}</span>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div v-else-if="filteredPosts.length > 0" class="max-w-4xl mx-auto">
        <div class="grid gap-8">
          <article 
            v-for="post in filteredPosts" 
            :key="post.slug"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            @click="navigateToPost(post)"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <span 
                    class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    @click.stop="navigateToCategory(post.category)"
                  >
                    {{ getCategoryDisplayName(post.category) }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400 text-sm">
                    {{ formatDate(post.date) }}
                  </span>
                </div>
                <span class="text-gray-500 dark:text-gray-400 text-sm">
                  {{ post.readingTime }} 分钟阅读
                </span>
              </div>
              
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ post.title }}
              </h2>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {{ post.description }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="postTag in post.tags.slice(0, 3)" 
                    :key="postTag"
                    class="px-2 py-1 text-xs rounded cursor-pointer transition-colors"
                    :class="postTag === tag 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                    @click.stop="navigateToTag(postTag)"
                  >
                    #{{ postTag }}
                  </span>
                </div>
                
                <div class="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all duration-200">
                  <span class="text-sm">阅读更多</span>
                  <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="max-w-2xl mx-auto text-center py-12">
        <div class="mb-6">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            暂无文章
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            没有找到包含 "{{ tag }}" 标签的文章
          </p>
        </div>
        <router-link 
          to="/"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
          返回首页
        </router-link>
      </div>
      
      <!-- 相关标签 -->
      <div v-if="relatedTags.length > 0" class="max-w-4xl mx-auto mt-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关标签</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="relatedTag in relatedTags" 
              :key="relatedTag"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              @click="navigateToTag(relatedTag)"
            >
              #{{ relatedTag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogPosts } from '@/composables/useBlogPosts'

const route = useRoute()
const router = useRouter()
const { posts, loadPosts, getPostsByTag, getAllTags } = useBlogPosts()

const loading = ref(true)
const error = ref(null)
const tag = computed(() => route.params.tag)

// 过滤当前标签的文章
const filteredPosts = computed(() => {
  return getPostsByTag(tag.value)
})

// 相关标签（排除当前标签）
const relatedTags = computed(() => {
  const allTags = getAllTags()
  return allTags.filter(t => t !== tag.value).slice(0, 10)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取分类显示名称
const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'tech': '技术',
    'tutorials': '教程',
    'projects': '项目',
    'life': '生活',
    'thoughts': '思考'
  }
  return categoryMap[category] || category
}

// 导航到文章页面
const navigateToPost = (post) => {
  router.push(`/post/${post.slug}`)
}

// 导航到分类页面
const navigateToCategory = (category) => {
  router.push(`/category/${category}`)
}

// 导航到标签页面
const navigateToTag = (tag) => {
  router.push(`/tag/${tag}`)
}

// 加载文章数据
const loadTagPosts = async () => {
  try {
    loading.value = true
    error.value = null
    await loadPosts()
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = err.message || '加载文章时发生错误'
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(() => route.params.tag, () => {
  if (route.name === 'Tag') {
    loadTagPosts()
  }
}, { immediate: true })

onMounted(() => {
  loadTagPosts()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>