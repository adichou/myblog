<template>
  <div class="markdown-content prose prose-custom max-w-none" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItPlantuml from 'markdown-it-plantuml'
import markdownItAnchor from 'markdown-it-anchor'
import mermaid from 'mermaid'
import Prism from 'prismjs'

// Import Prism languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-markdown'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

let mermaidInitialized = false

// Initialize Mermaid
onMounted(async () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    })
    mermaidInitialized = true
  }
})

// Initialize Markdown-it with plugins
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})
  .use(markdownItAnchor, {
    permalink: false,
    slugify: (s) => encodeURIComponent(s.trim().toLowerCase().replace(/\s+/g, '-'))
  })
  .use(markdownItPlantuml, {
    openMarker: '@startuml',
    closeMarker: '@enduml',
    server: 'https://www.plantuml.com/plantuml'
  })

// Custom renderer for code blocks with Prism highlighting and Mermaid
md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const langName = info.split(/\s+/g)[0]
  
  if (info === 'mermaid') {
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
    return `<div class="mermaid-container my-6">
      <div id="${id}" class="mermaid" data-processed="false">${token.content}</div>
    </div>`
  }
  
  if (langName && Prism.languages[langName]) {
    try {
      const highlighted = Prism.highlight(token.content, Prism.languages[langName], langName)
      return `<pre class="language-${langName}"><code class="language-${langName}">${highlighted}</code></pre>`
    } catch (err) {
      console.warn('Prism highlighting failed:', err)
    }
  }
  
  return `<pre><code>${md.utils.escapeHtml(token.content)}</code></pre>`
}

const renderedContent = computed(() => {
  if (!props.content) return ''
  return md.render(props.content)
})

// Render Mermaid diagrams after content update
const renderMermaid = async () => {
  await nextTick()
  const mermaidElements = document.querySelectorAll('.mermaid[data-processed="false"]')
  
  for (const element of mermaidElements) {
    try {
      const graphDefinition = element.textContent.trim()
      const id = element.id || `mermaid-${Math.random().toString(36).substr(2, 9)}`
      
      // Clear the element content
      element.innerHTML = ''
      
      // Render the mermaid diagram
      const { svg } = await mermaid.render(id + '_svg', graphDefinition)
      element.innerHTML = svg
      element.setAttribute('data-processed', 'true')
    } catch (error) {
      console.error('Mermaid rendering error:', error)
      element.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        <strong>Mermaid 渲染错误:</strong><br>
        ${error.message}
      </div>`
      element.setAttribute('data-processed', 'true')
    }
  }
}

// Watch for content changes and re-render
watch(
  () => renderedContent.value,
  async () => {
    await nextTick()
    // Highlight code blocks
    Prism.highlightAll()
    // Render Mermaid diagrams
    if (mermaidInitialized) {
      await renderMermaid()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.markdown-content {
  @apply text-gray-900;
}

.markdown-content :deep(h1) {
  @apply hidden;
}

.markdown-content :deep(h2) {
  @apply text-xl font-semibold mb-2 mt-3 text-gray-900;
}

.markdown-content :deep(h3) {
  @apply text-lg font-semibold mb-2 mt-3 text-gray-800;
}

.markdown-content :deep(h4) {
  @apply text-base font-medium mb-1 mt-2 text-gray-800;
}

.markdown-content :deep(p) {
  @apply mb-2 leading-normal;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .markdown-content :deep(h2) {
    @apply text-xl font-semibold mb-2 mt-3 text-gray-900;
  }
  
  .markdown-content :deep(h3) {
    @apply text-lg font-semibold mb-2 mt-3 text-gray-800;
  }
  
  .markdown-content :deep(h4) {
    @apply text-base font-medium mb-1 mt-2 text-gray-800;
  }
  
  .markdown-content :deep(p) {
    @apply mb-2 leading-snug text-sm;
  }
}

.markdown-content :deep(ul) {
  @apply mb-3 ml-6 list-disc;
}

.markdown-content :deep(ol) {
  @apply mb-3 ml-6 list-decimal;
}

.markdown-content :deep(li) {
  @apply mb-0.5 leading-normal;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-blue-50 italic;
}

/* 移动端列表优化 */
@media (max-width: 768px) {
  .markdown-content :deep(ul) {
    @apply mb-2 ml-4 list-disc;
  }
  
  .markdown-content :deep(ol) {
    @apply mb-2 ml-4 list-decimal;
  }
  
  .markdown-content :deep(li) {
    @apply mb-0 leading-snug text-sm;
  }
  
  .markdown-content :deep(blockquote) {
    @apply border-l-4 border-blue-500 pl-3 py-1.5 mb-2 bg-blue-50 italic text-sm;
  }
}

.markdown-content :deep(code) {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800;
}

.markdown-content :deep(pre) {
  @apply bg-white border border-gray-200 text-gray-800 p-3 rounded-lg mb-3 overflow-x-auto shadow-sm;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 text-gray-800;
}

.markdown-content :deep(table) {
  @apply w-full border-collapse mb-3;
}

/* 移动端代码和表格优化 */
@media (max-width: 768px) {
  .markdown-content :deep(pre) {
    @apply bg-white border border-gray-200 text-gray-800 p-2 rounded-lg mb-2 overflow-x-auto shadow-sm text-xs;
  }
  
  .markdown-content :deep(table) {
    @apply w-full border-collapse mb-2 text-sm;
  }
  
  .markdown-content :deep(th) {
    @apply border border-gray-300 px-2 py-1 bg-gray-100 font-semibold text-gray-900 text-xs;
  }
  
  .markdown-content :deep(td) {
    @apply border border-gray-300 px-2 py-1 text-gray-800 text-xs;
  }
}

.markdown-content :deep(th) {
  @apply border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-gray-900;
}

.markdown-content :deep(td) {
  @apply border border-gray-300 px-4 py-2 text-gray-800;
}

.markdown-content :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content :deep(img) {
  @apply max-w-full h-auto rounded-lg shadow-md mb-4;
}

.mermaid-container {
  @apply flex justify-center my-6;
}

.mermaid-container :deep(svg) {
  @apply max-w-full h-auto;
}

/* PlantUML styles */
.markdown-content :deep(.plantuml) {
  @apply flex justify-center my-6;
}

.markdown-content :deep(.plantuml img) {
  @apply max-w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg;
}
</style>