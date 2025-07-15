<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <span class="ml-4 text-gray-600 text-lg">正在加载文章...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="container mx-auto px-4 py-20">
      <div class="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <h2 class="text-xl font-semibold text-red-700">文章加载失败</h2>
        </div>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="$router.go(-1)"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          返回上一页
        </button>
      </div>
    </div>
    
    <!-- 文章内容 -->
    <div v-else-if="post">
      <!-- 文章头部 -->
      <header class="fixed top-0 left-64 right-0 z-10 bg-cover bg-center bg-no-repeat border-b border-gray-200" 
              style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://bingw.jasonzeng.dev/?resolution=1366x768&index=random&qlt=100'); height: 100px;">
        <div class="container mx-auto px-4 lg:px-6 py-4 h-full flex items-center">
          <div class="max-w-4xl mx-auto text-center w-full">
              
          <!-- 文章标题和元信息 -->
          <div class="mb-2">
            <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {{ post.title }}
            </h1>
          </div>
          
          <!-- 文章元信息 -->
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <div class="flex items-center gap-2">
                <i class="fas fa-calendar"></i>
                <span>创建：{{ formatDate(post.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-edit"></i>
                <span>最近更新：{{ formatDate(post.updatedAt) }}</span>
              </div>
          </div>
          
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 - 两列布局 -->
    <main class="container mx-auto px-6 py-8 relative z-5" style="margin-top: 120px;">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧：文章内容 -->
        <article class="lg:col-span-9 xl:col-span-9">
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <!-- 文章封面图 -->
            <div v-if="post.coverImage" class="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <!-- 文章正文 -->
            <div class="p-8 lg:p-12">
              <MarkdownRenderer :content="post.content" class="prose prose-lg max-w-none" />
              

            </div>
          </div>
          

        </article>
        
        <!-- 右侧：文章目录 -->
        <aside class="hidden lg:block lg:col-span-3 xl:col-span-3 relative z-5">
          <div class="sticky" style="top: 120px;">
            <!-- 文章目录 -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <nav class="space-y-1" id="toc-nav">
                <a 
                  v-for="heading in tableOfContents" 
                  :key="heading.id"
                  :href="`#${heading.id}`"
                  v-show="heading.level > 1"
                  class="toc-link block p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200 cursor-pointer"
                  :class="[
                    {
                      'text-primary-600 bg-primary-50 font-medium': activeHeading === heading.id
                    },
                    `ml-${(heading.level - 2) * 4}`
                  ]"
                  :style="{ marginLeft: `${(heading.level - 2) * 16}px` }"
                  @click.prevent="scrollToHeading(heading.id)"
                >
                  {{ heading.text }}
                </a>
              </nav>
              

            </div>
            
            <!-- 回到顶部按钮 -->
            <div class="mt-6">
              <button 
                @click="scrollToTop"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <i class="fas fa-arrow-up"></i>
                <span>回到顶部</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { useBlogPosts } from '@/composables/useBlogPosts'

const route = useRoute()
const router = useRouter()
const { getPostBySlug, getRelatedPosts, loadPosts, posts } = useBlogPosts()

const loading = ref(true)
const error = ref(null)
const isLiked = ref(false)
const activeHeading = ref('')

// 动态加载的文章数据
const post = ref(null)

const relatedPosts = ref([])

const categories = ref([
  { name: '前端技术', count: 15 },
  { name: '设计', count: 8 },
  { name: '旅行', count: 12 },
  { name: '数码', count: 6 },
  { name: '生活', count: 4 }
])

const tableOfContents = computed(() => {
  if (!post.value?.content) return []
  
  // 从markdown内容中提取标题
  const headings = []
  const content = post.value.content
  const lines = content.split('\n')
  
  lines.forEach(line => {
    const trimmedLine = line.trim()
    const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2]
      const id = encodeURIComponent(text.trim().toLowerCase().replace(/\s+/g, '-'))
      
      headings.push({
        level,
        id,
        text
      })
    }
  })
  
  return headings
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    post.value.likes++
  } else {
    post.value.likes--
  }
}

const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 120 // 固定标题栏高度
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}



const goToPost = (slug) => {
  router.push(`/post/${slug}`)
}

// 加载文章
const loadPost = async () => {
  try {
    loading.value = true
    error.value = null
    
    const slug = route.params.slug
    if (!slug) {
      throw new Error('文章标识符不能为空')
    }
    
    // 确保文章数据已加载
    if (posts.value.length === 0) {
      await loadPosts()
    }
    
    const foundPost = getPostBySlug(slug)
    if (!foundPost) {
      throw new Error('文章不存在')
    }
    
    post.value = foundPost
    
    // 加载相关文章
    relatedPosts.value = getRelatedPosts(foundPost, 4)
    
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = err.message || '加载文章时发生错误'
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(() => route.params.slug, () => {
  if (route.name === 'BlogPost') {
    loadPost()
  }
}, { immediate: true })

const updateActiveHeading = () => {
  const headings = tableOfContents.value
  const scrollTop = window.pageYOffset + 100
  
  for (let i = headings.length - 1; i >= 0; i--) {
    const element = document.getElementById(headings[i].id)
    if (element && element.offsetTop <= scrollTop) {
      activeHeading.value = headings[i].id
      
      // 更新 TOC 中的活跃状态
      document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active')
      })
      document.querySelector(`a[href="#${headings[i].id}"]`)?.classList.add('active')
      break
    }
  }
}

const handleScroll = () => {
  updateActiveHeading()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化
  loadPost()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 确保代码块样式正确 */
:deep(pre) {
  background-color: #1a1a1a;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

:deep(code) {
  font-family: 'JetBrains Mono', monospace;
}

:deep(h2), :deep(h3), :deep(h4) {
  scroll-margin-top: 8rem;
}
</style>