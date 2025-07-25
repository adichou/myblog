#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 在中英文之间自动添加空格
 * 如果已经有空格则不重复添加
 * @param {string} text - 需要处理的文本
 * @returns {string} - 处理后的文本
 */
function addSpaceBetweenChineseAndEnglish(text) {
  // 中文字符范围：\u4e00-\u9fff
  // 英文字符范围：a-zA-Z0-9
  
  // 在中文后面、英文前面添加空格（如果没有空格的话）
  text = text.replace(/([^\x00-\xff])([a-zA-Z0-9])/g, (match, chinese, english) => {
    return chinese + ' ' + english
  })
  
  // 在英文后面、中文前面添加空格（如果没有空格的话）
  text = text.replace(/([a-zA-Z0-9])([^\x00-\xff])/g, (match, english, chinese) => {
    return english + ' ' + chinese
  })
  
  // 处理数字和中文之间的空格
  text = text.replace(/([0-9])([^\x00-\xff])/g, (match, number, chinese) => {
    return number + ' ' + chinese
  })
  
  text = text.replace(/([^\x00-\xff])([0-9])/g, (match, chinese, number) => {
    return chinese + ' ' + number
  })
  
  return text
}

/**
 * 处理单个markdown文件
 * @param {string} filePath - 文件路径
 */
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    let inCodeBlock = false
    let inFrontMatter = false
    let inPlantUML = false
    let frontMatterCount = 0
    let currentCodeBlockType = ''
    
    // 支持的图表代码块类型
    const diagramTypes = ['mermaid', 'plantuml', 'puml', 'dot', 'graphviz', 'flowchart', 'sequence', 'gantt', 'pie', 'mindmap']
    
    const processedLines = lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // 检测代码块开始
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          // 代码块开始
          inCodeBlock = true
          // 提取代码块类型
          const codeBlockMatch = trimmedLine.match(/^```(\w+)/)
          currentCodeBlockType = codeBlockMatch ? codeBlockMatch[1].toLowerCase() : ''
        } else {
          // 代码块结束
          inCodeBlock = false
          currentCodeBlockType = ''
        }
        return line
      }
      
      // 检测 PlantUML 特殊语法
      if (trimmedLine.startsWith('@startuml') || trimmedLine.startsWith('@startdot') || 
          trimmedLine.startsWith('@startmindmap') || trimmedLine.startsWith('@startgantt') ||
          trimmedLine.startsWith('@startsalt') || trimmedLine.startsWith('@startjson') ||
          trimmedLine.startsWith('@startyaml') || trimmedLine.startsWith('@startcreole')) {
        inPlantUML = true
        return line
      }
      
      if (trimmedLine.startsWith('@enduml') || trimmedLine.startsWith('@enddot') || 
          trimmedLine.startsWith('@endmindmap') || trimmedLine.startsWith('@endgantt') ||
          trimmedLine.startsWith('@endsalt') || trimmedLine.startsWith('@endjson') ||
          trimmedLine.startsWith('@endyaml') || trimmedLine.startsWith('@endcreole')) {
        inPlantUML = false
        return line
      }
      
      // 检测front matter
      if (trimmedLine === '---') {
        frontMatterCount++
        if (frontMatterCount <= 2) {
          inFrontMatter = frontMatterCount === 1
          return line
        }
      }
      
      // 跳过 front matter 和 PlantUML 特殊语法
      if (inFrontMatter || inPlantUML) {
        return line
      }
      
      // 特殊处理：mermaid timeline 图表内容需要格式化
      if (inCodeBlock && currentCodeBlockType === 'mermaid') {
        // 检查是否是 timeline 类型
        if (trimmedLine === 'timeline' || 
            trimmedLine.startsWith('title ') ||
            /^\s*\d{4}:\s/.test(trimmedLine)) {
          // 对 timeline 的标题和时间线条目进行格式化
          return addSpaceBetweenChineseAndEnglish(line)
        }
        // 其他 mermaid 语法不处理
        return line
      }
      
      // 跳过其他代码块
      if (inCodeBlock) {
        return line
      }
      
      // 跳过代码行（以4个空格或tab开头）
      if (line.match(/^(\s{4,}|\t)/)) {
        return line
      }
      
      // 跳过行内代码（包含反引号的行）
      if (line.includes('`')) {
        // 对于包含行内代码的行，只处理代码块外的部分
        const parts = line.split('`')
        const processedParts = parts.map((part, partIndex) => {
          // 奇数索引是代码块内容，不处理
          if (partIndex % 2 === 1) {
            return part
          }
          return addSpaceBetweenChineseAndEnglish(part)
        })
        return processedParts.join('`')
      }
      
      // 处理普通文本行
      return addSpaceBetweenChineseAndEnglish(line)
    })
    
    const processedContent = processedLines.join('\n')
    
    // 只有内容发生变化时才写入文件
    if (processedContent !== content) {
      fs.writeFileSync(filePath, processedContent, 'utf8')
      console.log(`✅ 已处理: ${filePath}`)
      return true
    } else {
      console.log(`⏭️  无需处理: ${filePath}`)
      return false
    }
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
    return false
  }
}

/**
 * 递归处理目录中的所有markdown文件
 * @param {string} dirPath - 目录路径
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
  let processedCount = 0
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      processedCount += processDirectory(filePath)
    } else if (file.endsWith('.md')) {
      if (processMarkdownFile(filePath)) {
        processedCount++
      }
    }
  })
  
  return processedCount
}

// 主函数
function main() {
  const blogDir = path.join(__dirname, '../md-blogs')
  
  if (!fs.existsSync(blogDir)) {
    console.error('❌ md-blogs 目录不存在')
    process.exit(1)
  }
  
  console.log('🚀 开始处理中英文间距...')
  console.log(`📁 处理目录: ${blogDir}`)
  console.log('─'.repeat(50))
  
  const processedCount = processDirectory(blogDir)
  
  console.log('─'.repeat(50))
  console.log(`✨ 处理完成！共处理了 ${processedCount} 个文件`)
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  addSpaceBetweenChineseAndEnglish,
  processMarkdownFile,
  processDirectory
}