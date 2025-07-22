<template>
  <footer class="bg-dark-900 text-white">
    <div class="container mx-auto px-4 lg:px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 品牌信息 -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-code text-white text-sm"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gradient">DevInsights</h3>
              <p class="text-xs text-gray-400">技术与思考</p>
            </div>
          </div>
          <p class="text-gray-300 mb-3 max-w-md text-sm">
            分享前端开发、产品设计、技术思考以及生活感悟。
            专注于创造有价值的内容，连接技术与人文。
          </p>
          <div class="flex gap-2">
            <a href="#" class="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
              <i class="fab fa-github text-sm"></i>
            </a>
            <a href="#" class="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
              <i class="fab fa-twitter text-sm"></i>
            </a>
            <a href="#" class="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
              <i class="fab fa-linkedin text-sm"></i>
            </a>
            <a href="#" class="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
              <i class="fas fa-envelope text-sm"></i>
            </a>
          </div>
        </div>
        
        <!-- 快速链接 -->
        <div>
          <h4 class="font-semibold mb-2 text-white text-sm">快速导航</h4>
          <ul class="space-y-1">
            <li><a href="#" class="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm">首页</a></li>
            <li><a href="#" class="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm">技术文章</a></li>
            <li><a href="#" class="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm">项目展示</a></li>
            <li><a href="#" class="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm">旅游分享</a></li>
            <li><a href="#" class="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm">数码评测</a></li>
          </ul>
        </div>
        
        <!-- 分类标签 -->
        <div>
          <h4 class="font-semibold mb-2 text-white text-sm">热门标签</h4>
          <div class="flex flex-wrap gap-1">
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              Vue.js
            </span>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              React
            </span>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              TypeScript
            </span>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              Node.js
            </span>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              设计
            </span>
            <span class="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200 cursor-pointer">
              旅行
            </span>
          </div>
        </div>
      </div>
      
      <!-- 底部版权 -->
      <div class="border-t border-gray-800 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-xs mb-2 md:mb-0">
          © {{ currentYear }} DevInsights. 保留所有权利.
        </p>
        <div class="flex gap-4 text-xs">
          <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">隐私政策</a>
          <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">使用条款</a>
          <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">RSS订阅</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>