# Cloudflare Pages 部署指南

本指南将帮助你将 Vue 3 博客系统部署到 Cloudflare Pages，并实现真实的文件时间戳获取。

## 🚀 快速开始

### 1. 准备工作

确保你已经：
- 拥有 Cloudflare 账户
- 项目已推送到 GitHub/GitLab
- 本地已安装 Node.js 18+

### 2. 安装 Wrangler CLI

```bash
npm install -g wrangler
# 或者
yarn global add wrangler
```

### 3. 登录 Cloudflare

```bash
wrangler login
```

## 📁 项目配置

### 文件时间戳功能

项目已集成文件元数据插件，可以获取真实的文件创建和修改时间：

- **开发环境**：通过 `/api/file-metadata` API 获取
- **生产环境**：构建时生成 `file-metadata.json` 文件

### 关键配置文件

1. **`wrangler.toml`** - Cloudflare Pages 配置
2. **`public/_headers`** - HTTP 头部和缓存策略
3. **`public/_redirects`** - SPA 路由重定向
4. **`.github/workflows/deploy.yml`** - 自动部署工作流
5. **`plugins/file-metadata.js`** - 文件时间戳插件

## 🔧 部署步骤

### 方法一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 连接你的 Git 仓库
5. 配置构建设置：
   - **Framework preset**: Vue
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18`
   - **Root directory**: `/` (项目根目录)
   
   > **注意**: 路由配置和构建命令需要在 Cloudflare Dashboard 中设置，不能在 `wrangler.toml` 文件中配置。

### 方法二：通过 Wrangler CLI

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages publish dist --project-name=myblog
```

### 方法三：GitHub Actions 自动部署

1. 在 GitHub 仓库设置中添加 Secrets：
   - `CLOUDFLARE_API_TOKEN`: 你的 Cloudflare API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare Account ID

2. 推送代码到 main 分支，GitHub Actions 将自动部署

## 🔑 获取 Cloudflare 凭据

### API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 使用 "Custom token" 模板
4. 设置权限：
   - `Zone:Zone:Read`
   - `Zone:Page Rules:Edit`
   - `Account:Cloudflare Pages:Edit`

### Account ID

在 Cloudflare Dashboard 右侧边栏可以找到你的 Account ID。

## 🌐 域名配置

### 添加自定义域名

1. 在 Cloudflare Pages 项目设置中点击 "Custom domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

### SSL/TLS 设置

1. 在 Cloudflare Dashboard 中进入 "SSL/TLS" 部分
2. 设置加密模式为 "Full (strict)"
3. 启用 "Always Use HTTPS"
4. 启用 "Automatic HTTPS Rewrites"

## 📊 性能优化

### 缓存策略

项目已配置优化的缓存策略：
- 静态资源（JS/CSS）：1年缓存
- Markdown 文件：1小时缓存
- HTML 文件：1小时缓存
- API 响应：不缓存

### 文件压缩

Cloudflare 自动启用 Gzip 和 Brotli 压缩。

### CDN 加速

你的网站将通过 Cloudflare 的全球 CDN 网络提供服务。

## 🔍 监控和分析

### Web Analytics

在 Cloudflare Dashboard 中启用 Web Analytics：

1. 进入 "Analytics & Logs" > "Web Analytics"
2. 添加你的网站
3. 将提供的脚本添加到 `index.html`

### 错误监控

查看 Cloudflare Pages 的 "Functions" 日志来监控错误。

## 🐛 故障排除

### 常见问题

1. **配置文件验证错误**
   ```
   ✘ [ERROR] Configuration file for Pages projects does not support "route"
   ✘ [ERROR] Configuration file for Pages projects does not support "build"
   ```
   **解决方案**: Cloudflare Pages 项目的 `wrangler.toml` 不支持 `route` 和 `build` 配置项。这些设置需要在 Cloudflare Dashboard 中配置：
   - 移除 `wrangler.toml` 中的 `[build]` 和 `[env.*.route]` 配置
   - 在 Dashboard 的项目设置中配置构建命令和自定义域名

2. **构建失败**
   - 检查 Node.js 版本是否为 18+
   - 确保所有依赖都在 `package.json` 中

3. **路由不工作**
   - 确保 `_redirects` 文件在 `public` 目录中
   - 检查 SPA 重定向规则

4. **文件时间戳不准确**
   - 确保 Git 历史完整（`fetch-depth: 0`）
   - 检查文件元数据插件是否正确加载

### 调试命令

```bash
# 本地预览构建结果
npm run preview

# 检查 Wrangler 配置
wrangler pages project list

# 查看部署日志
wrangler pages deployment list --project-name=myblog
```

## 📚 更多资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Vue.js 部署指南](https://vuejs.org/guide/best-practices/production-deployment.html)

## 🎯 下一步

部署完成后，你可以：

1. 配置自定义域名
2. 启用 Web Analytics
3. 设置 Cloudflare Workers 进行高级功能
4. 配置 Cloudflare Images 优化图片
5. 使用 Cloudflare R2 存储大文件

---

如果遇到问题，请查看 Cloudflare Pages 的部署日志或联系支持团队。