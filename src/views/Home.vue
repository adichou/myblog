<template>
  <div class="min-h-screen">
    <!-- 简化的头部区域 -->
    <section class="bg-white border-b border-gray-200 py-4">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl">
          <div class="mb-2">
            <div class="inline-flex items-center gap-2 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 mb-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-green-700">持续更新中</span>
            </div>
          </div>
          
          <h1 class="text-2xl md:text-3xl mb-2 text-gray-900 font-bold">
            欢迎来到我的技术博客
          </h1>
          
          <p class="text-base text-gray-600 mb-4 leading-relaxed">
            探索前端技术、产品设计、个人项目，以及旅游与数码生活的点点滴滴
          </p>
          
          <!-- 技能标签 -->
          <div class="flex flex-wrap gap-1.5">
            <span v-for="skill in skills.slice(0, 6)" :key="skill.name" 
                  class="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-all duration-200">
              <i :class="skill.icon" class="mr-1 text-xs"></i>
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 精选文章 -->
    <section id="featured" class="py-6 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">精选文章</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">最新的技术分享和思考总结</p>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="ml-3 text-gray-600">正在加载文章...</span>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-700 font-medium">{{ error }}</span>
          </div>
        </div>
        
        <!-- 精选文章 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article v-for="post in featuredPosts" :key="post.slug" 
                   class="card group cursor-pointer"
                   @click="goToPost(post.slug)">
            <div class="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div class="absolute bottom-2 left-2">
                <span class="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium cursor-pointer hover:bg-white transition-colors" 
                      :class="getCategoryColor(post.category)"
                      @click.stop="navigateToCategory(post.category)">
                  {{ getCategoryDisplayName(post.category) }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(post.date) }}</span>
                <span>•</span>
                <i class="fas fa-clock"></i>
                <span>{{ post.readingTime || post.readTime }} 分钟阅读</span>
              </div>
              
              <h3 class="text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 font-semibold">
                {{ post.title }}
              </h3>
              
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                {{ post.description || post.excerpt }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags.slice(0, 2)" :key="tag"
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {{ tag }}
                  </span>
                </div>
                
                <div class="flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all duration-200">
                  <span class="text-xs">阅读更多</span>
                  <i class="fas fa-arrow-right text-xs"></i>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <!-- 如果没有精选文章，显示最新文章 -->
        <div v-if="!loading && !error && featuredPosts.length === 0 && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article v-for="post in recentPosts" :key="post.slug" 
                   class="card group cursor-pointer"
                   @click="goToPost(post.slug)">
            <div class="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div class="absolute bottom-2 left-2">
                <span class="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium cursor-pointer hover:bg-white transition-colors" 
                      :class="getCategoryColor(post.category)"
                      @click.stop="navigateToCategory(post.category)">
                  {{ getCategoryDisplayName(post.category) }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(post.date) }}</span>
                <span>•</span>
                <i class="fas fa-clock"></i>
                <span>{{ post.readingTime || post.readTime }} 分钟阅读</span>
              </div>
              
              <h3 class="text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 font-semibold">
                {{ post.title }}
              </h3>
              
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                {{ post.description || post.excerpt }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags.slice(0, 2)" :key="tag"
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {{ tag }}
                  </span>
                </div>
                
                <div class="flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all duration-200">
                  <span class="text-xs">阅读更多</span>
                  <i class="fas fa-arrow-right text-xs"></i>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <div class="text-center mt-8">
          <a href="#" class="btn-secondary">
            <i class="fas fa-th-large"></i>
            查看所有文章
          </a>
        </div>
      </div>
    </section>
    
    <!-- 项目展示 -->
    <section id="projects" class="py-6 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">项目展示</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">一些有趣的个人项目和开源贡献</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="project in projects" :key="project.id" class="card group">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <i :class="project.icon" class="text-white text-lg"></i>
                </div>
                <div class="flex gap-1.5">
                  <a :href="project.github" class="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <i class="fab fa-github text-gray-600 text-sm"></i>
                  </a>
                  <a :href="project.demo" class="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <i class="fas fa-external-link-alt text-gray-600 text-sm"></i>
                  </a>
                </div>
              </div>
              
              <h3 class="text-lg text-gray-900 mb-2 font-semibold">{{ project.title }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ project.description }}</p>
              
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tech in project.technologies" :key="tech"
                      class="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 关于我 -->
    <section id="about" class="py-12 bg-white">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl md:text-4xl text-gray-900 mb-6 font-bold">关于我</h2>
              <div class="prose prose-lg text-gray-600">
                <p class="mb-4">
                  我是一名热爱技术的前端开发工程师，专注于创造优雅的用户体验和高质量的代码。
                </p>
                <p class="mb-4">
                  除了技术分享，我也喜欢记录旅行中的美好瞬间，分享数码产品的使用心得，
                  希望通过这个博客与更多志同道合的朋友交流。
                </p>
                <p>
                  相信技术改变生活，用心感受世界的美好。
                </p>
              </div>
              
              <div class="mt-8 flex gap-4">
                <a href="#" class="btn-primary">
                  <i class="fas fa-envelope"></i>
                  联系我
                </a>
                <a href="#" class="btn-secondary">
                  <i class="fas fa-download"></i>
                  下载简历
                </a>
              </div>
            </div>
            
            <div class="relative">
              <div class="w-80 h-80 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                <i class="fas fa-user text-6xl text-primary-400"></i>
              </div>
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-500 rounded-xl flex items-center justify-center animate-float">
                <i class="fas fa-code text-white text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBlogPosts } from '@/composables/useBlogPosts'
import { useRouter } from 'vue-router'

const router = useRouter()
const { 
  loading, 
  error, 
  featuredPosts, 
  publishedPosts, 
  categories, 
  allTags,
  loadPosts,
  getRecentPosts 
} = useBlogPosts()

const skills = ref([
  { name: 'Vue.js', icon: 'fab fa-vuejs', delay: '0s' },
  { name: 'React', icon: 'fab fa-react', delay: '0.1s' },
  { name: 'TypeScript', icon: 'fab fa-js-square', delay: '0.2s' },
  { name: 'Node.js', icon: 'fab fa-node-js', delay: '0.3s' },
  { name: 'Python', icon: 'fab fa-python', delay: '0.4s' },
  { name: 'UI/UX', icon: 'fas fa-palette', delay: '0.5s' },
  { name: '摄影', icon: 'fas fa-camera', delay: '0.6s' },
  { name: '旅行', icon: 'fas fa-plane', delay: '0.7s' }
])

const recentPosts = ref([])

const projects = ref([
  {
    id: 1,
    title: 'Vue 组件库',
    description: '基于 Vue 3 和 TypeScript 构建的现代化组件库，提供丰富的 UI 组件和完善的文档。',
    icon: 'fab fa-vuejs',
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS'],
    github: 'https://github.com',
    demo: 'https://demo.com'
  },
  {
    id: 2,
    title: '个人博客系统',
    description: '使用 Vue 3 构建的响应式博客系统，支持 Markdown 编辑、标签分类、搜索等功能。',
    icon: 'fas fa-blog',
    technologies: ['Vue 3', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com',
    demo: 'https://demo.com'
  },
  {
    id: 3,
    title: '数据可视化平台',
    description: '基于 D3.js 和 Vue 的数据可视化平台，支持多种图表类型和交互式数据探索。',
    icon: 'fas fa-chart-bar',
    technologies: ['Vue 3', 'D3.js', 'Python', 'FastAPI'],
    github: 'https://github.com',
    demo: 'https://demo.com'
  },
  {
    id: 4,
    title: '旅行记录 App',
    description: '记录旅行足迹的移动应用，支持照片分享、路线规划、游记编写等功能。',
    icon: 'fas fa-map-marked-alt',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    github: 'https://github.com',
    demo: 'https://demo.com'
  }
])

const getCategoryColor = (category) => {
  const colors = {
    '前端技术': 'text-blue-700',
    '设计': 'text-purple-700',
    '旅行': 'text-green-700',
    '数码': 'text-orange-700',
    '生活': 'text-pink-700'
  }
  return colors[category] || 'text-gray-700'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 导航到文章详情页
const goToPost = (slug) => {
  router.push(`/post/${slug}`)
}

// 导航到分类页面
const navigateToCategory = (category) => {
  router.push(`/category/${category}`)
}

// 获取分类的中文名称
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
  recentPosts.value = getRecentPosts(4)
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