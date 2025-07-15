import fs from 'fs'
import path from 'path'

/**
 * Vite插件：提取Markdown文件的创建和修改时间
 * 用于在构建时获取真实的文件时间戳
 */
export function fileMetadataPlugin() {
  return {
    name: 'file-metadata',
    configureServer(server) {
      // 开发环境下的中间件
      server.middlewares.use('/api/file-metadata', (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`)
        const filePath = url.searchParams.get('path')
        
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing path parameter' }))
          return
        }
        
        try {
          const fullPath = path.resolve(process.cwd(), filePath.replace(/^\//, ''))
          const stats = fs.statSync(fullPath)
          
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            createdAt: stats.birthtime.toISOString(),
            updatedAt: stats.mtime.toISOString(),
            size: stats.size
          }))
        } catch (error) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'File not found' }))
        }
      })
    },
    
    generateBundle() {
      // 构建时生成文件元数据
      const mdBlogsDir = path.resolve(process.cwd(), 'md-blogs')
      const metadata = {}
      
      function scanDirectory(dir) {
        const files = fs.readdirSync(dir)
        
        files.forEach(file => {
          const filePath = path.join(dir, file)
          const stat = fs.statSync(filePath)
          
          if (stat.isDirectory()) {
            scanDirectory(filePath)
          } else if (file.endsWith('.md')) {
            const relativePath = path.relative(process.cwd(), filePath)
            const stats = fs.statSync(filePath)
            
            metadata[relativePath] = {
              createdAt: stats.birthtime.toISOString(),
              updatedAt: stats.mtime.toISOString(),
              size: stats.size
            }
          }
        })
      }
      
      if (fs.existsSync(mdBlogsDir)) {
        scanDirectory(mdBlogsDir)
      }
      
      // 生成元数据文件
      this.emitFile({
        type: 'asset',
        fileName: 'file-metadata.json',
        source: JSON.stringify(metadata, null, 2)
      })
    }
  }
}

/**
 * 获取文件元数据的工具函数
 */
export async function getFileMetadata(filePath) {
  if (typeof window !== 'undefined') {
    // 浏览器环境：从API或预生成的元数据文件获取
    try {
      // 首先尝试从预生成的元数据文件获取
      const response = await fetch('/file-metadata.json')
      if (response.ok) {
        const metadata = await response.json()
        return metadata[filePath] || null
      }
      
      // 开发环境下从API获取
      const apiResponse = await fetch(`/api/file-metadata?path=${encodeURIComponent(filePath)}`)
      if (apiResponse.ok) {
        return await apiResponse.json()
      }
    } catch (error) {
      console.warn('Failed to fetch file metadata:', error)
    }
    
    return null
  } else {
    // Node.js环境：直接读取文件系统
    try {
      const stats = fs.statSync(path.resolve(process.cwd(), filePath))
      return {
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
        size: stats.size
      }
    } catch (error) {
      console.warn('Failed to get file stats:', error)
      return null
    }
  }
}