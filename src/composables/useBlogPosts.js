import { ref, computed } from 'vue'
import { getFileMetadata } from '../../plugins/file-metadata.js'

// 解析 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return {
      metadata: {},
      content: content
    }
  }
  
  const frontmatter = match[1]
  const bodyContent = match[2]
  const metadata = {}
  
  // 解析 YAML 格式的 frontmatter
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      // 处理数组格式 ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/["']/g, ''))
          .filter(item => item.length > 0)
      }
      
      // 处理布尔值
      if (value === 'true') value = true
      if (value === 'false') value = false
      
      metadata[key] = value
    }
  })
  
  return {
    metadata,
    content: bodyContent
  }
}

// 从文件路径提取信息
function extractPostInfo(path) {
  const pathParts = path.split('/')
  const fileName = pathParts[pathParts.length - 1]
  const slug = fileName.replace('.md', '')
  const category = pathParts[pathParts.length - 2] || 'uncategorized'
  
  return { slug, category }
}

// 生成文章摘要
function generateExcerpt(content, maxLength = 200) {
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}

export function useBlogPosts() {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // 加载所有博客文章
  const loadPosts = async () => {
    loading.value = true
    error.value = null
    
    try {

      const modules = import.meta.glob('/md-blogs/**/*.md', { as: 'raw' })
      
      const postPromises = Object.entries(modules).map(async ([path, moduleLoader]) => {
        try {
          const content = await moduleLoader()
          const { slug, category } = extractPostInfo(path)
          const { metadata, content: bodyContent } = parseFrontmatter(content)
          

          const titleMatch = bodyContent.match(/^#\s+(.+)$/m)
          const title = metadata.title || (titleMatch ? titleMatch[1] : slug)
          

          const fileMetadata = await getFileMetadata(path.replace('/md-blogs/', 'md-blogs/'))
          const createdAt = metadata.date || (fileMetadata?.createdAt ? fileMetadata.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])
          const updatedAt = metadata.updated || (fileMetadata?.updatedAt ? fileMetadata.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0])
          

          const dateMatch = bodyContent.match(/发布时间：(\d{4}-\d{2}-\d{2})/)
          const publishDate = createdAt || (dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0])
          

          const authorMatch = bodyContent.match(/作者：([^\n]+)/)
          const author = metadata.author || (authorMatch ? authorMatch[1].trim() : '未知作者')
          

          const tagsMatch = bodyContent.match(/标签：([^\n]+)/)
          let tags = metadata.tags || []
          if (!tags.length && tagsMatch) {
            tags = tagsMatch[1].split(/[,，]/).map(tag => tag.trim()).filter(tag => tag.length > 0)
          }
          
          return {
            slug,
            category,
            path,
            title,
            author,
            date: publishDate,
            createdAt: createdAt,
            updatedAt: updatedAt,
            tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
            description: metadata.description || generateExcerpt(bodyContent),
            featured: metadata.featured || false,
            draft: metadata.draft || false,
            content: bodyContent,
            rawContent: content,
            readingTime: Math.ceil(bodyContent.length / 1000)
          }
        } catch (err) {
          console.error(`Error loading post ${path}:`, err)
          return null
        }
      })
      
      const loadedPosts = await Promise.all(postPromises)
      posts.value = loadedPosts
        .filter(post => post !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        
    } catch (err) {
      error.value = err.message
      console.error('Error loading blog posts:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 计算属性
  const publishedPosts = computed(() => 
    posts.value.filter(post => !post.draft)
  )
  
  const featuredPosts = computed(() => 
    publishedPosts.value.filter(post => post.featured)
  )
  
  const categories = computed(() => {
    const categoryMap = new Map()
    publishedPosts.value.forEach(post => {
      const count = categoryMap.get(post.category) || 0
      categoryMap.set(post.category, count + 1)
    })
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
  })
  
  const allTags = computed(() => {
    const tagMap = new Map()
    publishedPosts.value.forEach(post => {
      post.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0
        tagMap.set(tag, count + 1)
      })
    })
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })
  
  // 方法
  const getPostBySlug = (slug) => {
    return publishedPosts.value.find(post => post.slug === slug)
  }
  
  const getPostsByCategory = (category) => {
    return publishedPosts.value.filter(post => post.category === category)
  }
  
  const getPostsByTag = (tag) => {
    return publishedPosts.value.filter(post => post.tags.includes(tag))
  }
  
  const searchPosts = (query) => {
    const lowercaseQuery = query.toLowerCase()
    return publishedPosts.value.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }
  
  const getRecentPosts = (limit = 5) => {
    return publishedPosts.value.slice(0, limit)
  }
  
  const getRelatedPosts = (currentPost, limit = 3) => {
    return publishedPosts.value
      .filter(post => post.slug !== currentPost.slug)
      .filter(post => {
        // 相同分类或有共同标签
        return post.category === currentPost.category ||
               post.tags.some(tag => currentPost.tags.includes(tag))
      })
      .slice(0, limit)
  }
  
  return {
    // 状态
    posts,
    loading,
    error,
    
    // 计算属性
    publishedPosts,
    featuredPosts,
    categories,
    allTags,
    
    // 方法
    loadPosts,
    getPostBySlug,
    getPostsByCategory,
    getPostsByTag,
    searchPosts,
    getRecentPosts,
    getRelatedPosts
  }
}