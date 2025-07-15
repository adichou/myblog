# DevInsights - Vue 3 博客框架

一个基于 Vue 3 构建的现代化博客框架，专为IT技术人员设计，支持技术分享、项目展示、旅游记录和数码评测。

## ✨ 特性

- 🚀 **Vue 3 + Vite** - 现代化的开发体验
- 📱 **响应式设计** - 完美适配各种设备
- 🎨 **Tailwind CSS** - 优雅的UI设计
- 📖 **三列布局** - 文章目录、内容区域、TOC导航
- 🔍 **智能搜索** - 快速找到想要的内容
- 🏷️ **标签分类** - 灵活的内容组织
- 📊 **阅读进度** - 实时显示阅读进度
- 💫 **流畅动画** - 精心设计的交互体验

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **样式框架**: Tailwind CSS
- **图标库**: Font Awesome
- **Markdown**: markdown-it
- **代码高亮**: Prism.js

## 📦 安装依赖

```bash
npm install
```

## 🚀 开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果

## 🏗️ 构建生产版本

```bash
npm run build
```

## 👀 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 公共组件
│   ├── Header.vue      # 导航栏组件
│   └── Footer.vue      # 页脚组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   └── BlogPost.vue    # 文章详情页
├── style.css           # 全局样式
├── main.js            # 应用入口
└── App.vue            # 根组件
```

## 🎯 核心功能

### 首页设计
- 英雄区域展示个人品牌
- 精选文章卡片展示
- 项目作品集
- 个人介绍区域
- 技能标签云

### 文章页面
- **三列响应式布局**:
  - 左侧：文章目录导航
  - 中间：文章内容区域
  - 右侧：TOC目录 + 阅读进度
- 文章元信息展示
- 代码语法高亮
- 相关文章推荐
- 社交分享功能

### 响应式设计
- 移动端优先设计
- 平板和桌面端适配
- 灵活的栅格布局
- 触摸友好的交互

## 🎨 设计特色

- **现代化UI**: 简洁优雅的界面设计
- **渐变色彩**: 精心搭配的色彩方案
- **流畅动画**: 自然的过渡效果
- **玻璃拟态**: 现代化的视觉效果
- **暗色模式**: 护眼的阅读体验（待实现）

## 📝 内容类型

- **技术文章**: 前端开发、编程技巧
- **项目展示**: 个人作品和开源项目
- **旅游分享**: 旅行游记和摄影作品
- **数码评测**: 科技产品使用心得
- **生活感悟**: 个人思考和生活记录

## 🔧 自定义配置

### 主题色彩
在 `tailwind.config.js` 中修改主题色彩：

```javascript
colors: {
  primary: {
    500: '#3b82f6', // 主色调
    600: '#2563eb',
  },
  secondary: {
    500: '#ec4899', // 辅助色
    600: '#db2777',
  }
}
```

### 字体配置
在 `src/style.css` 中自定义字体：

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

## 🚀 部署

### Vercel
```bash
npm run build
# 将 dist 目录部署到 Vercel
```

### Netlify
```bash
npm run build
# 将 dist 目录部署到 Netlify
```

### GitHub Pages
```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- 邮箱: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- 博客: [https://your-blog.com](https://your-blog.com)

---

**DevInsights** - 用技术记录生活，用代码表达思想 ✨