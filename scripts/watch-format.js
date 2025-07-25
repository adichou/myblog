#!/usr/bin/env node

import chokidar from 'chokidar'
import path from 'path'
import { fileURLToPath } from 'url'
import { processMarkdownFile } from './format-spacing.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 文件监听器 - 在markdown文件保存时自动格式化中英文间距
 */
function startWatcher() {
  const blogDir = path.join(__dirname, '../md-blogs')
  
  console.log('👀 启动文件监听器...')
  console.log(`📁 监听目录: ${blogDir}`)
  console.log('💡 当 .md 文件保存时将自动格式化中英文间距')
  console.log('🛑 按 Ctrl+C 停止监听')
  console.log('─'.repeat(50))
  
  // 创建文件监听器
  const watcher = chokidar.watch(`${blogDir}/**/*.md`, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true,
    ignoreInitial: true // 忽略初始扫描
  })
  
  // 防抖处理 - 避免频繁触发
  const debounceMap = new Map()
  
  function debounceProcess(filePath, delay = 1000) {
    const existingTimeout = debounceMap.get(filePath)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }
    
    const timeout = setTimeout(() => {
      console.log(`📝 检测到文件变化: ${path.relative(blogDir, filePath)}`)
      processMarkdownFile(filePath)
      debounceMap.delete(filePath)
    }, delay)
    
    debounceMap.set(filePath, timeout)
  }
  
  // 监听文件变化事件
  watcher
    .on('change', (filePath) => {
      debounceProcess(filePath)
    })
    .on('add', (filePath) => {
      console.log(`➕ 新增文件: ${path.relative(blogDir, filePath)}`)
      debounceProcess(filePath, 500) // 新文件延迟短一些
    })
    .on('error', (error) => {
      console.error('❌ 监听器错误:', error)
    })
  
  // 优雅退出
  process.on('SIGINT', () => {
    console.log('\n🛑 正在停止文件监听器...')
    watcher.close().then(() => {
      console.log('✅ 文件监听器已停止')
      process.exit(0)
    })
  })
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  startWatcher()
}

export { startWatcher }