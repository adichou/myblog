---
title: "JavaScript 性能优化最佳实践"
date: "2024-01-10"
author: "前端团队"
tags: ["JavaScript", "性能优化", "前端开发"]
description: "深入探讨JavaScript性能优化的各种技巧和最佳实践，包括代码层面、DOM操作、异步处理等多个方面的优化策略。"
featured: true
draft: false
---

# JavaScript 性能优化最佳实践

## 概述

性能优化是现代 Web 开发中的关键环节。本文将深入探讨 JavaScript 性能优化的各个方面，从基础概念到高级技巧。

## 1. 代码层面优化

### 避免全局变量

全局变量会污染全局命名空间，并且访问速度较慢：

```javascript
// ❌ 不好的做法
var userName = 'John';
var userAge = 30;

function getUserInfo() {
  return userName + ' is ' + userAge + ' years old';
}

// ✅ 更好的做法
(function() {
  const user = {
    name: 'John',
    age: 30
  };
  
  function getUserInfo() {
    return `${user.name} is ${user.age} years old`;
  }
  
  // 只暴露必要的接口
  window.UserModule = { getUserInfo };
})();
```

### 使用适当的数据结构

选择正确的数据结构对性能至关重要：

```javascript
// 查找操作：使用 Map 而不是 Object
const userMap = new Map();
userMap.set('user1', { name: 'John', age: 30 });
userMap.set('user2', { name: 'Jane', age: 25 });

// O(1) 时间复杂度
const user = userMap.get('user1');

// 唯一值集合：使用 Set
const uniqueIds = new Set([1, 2, 3, 4, 5]);
unique Ids.has(3); // 快速查找
```

### 函数优化

```javascript
// 使用函数缓存（记忆化）
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 昂贵的计算函数
const expensiveCalculation = memoize((n) => {
  console.log('计算中...');
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += i;
  }
  return result;
});

console.log(expensiveCalculation(1000)); // 计算中... 499500
console.log(expensiveCalculation(1000)); // 499500 (从缓存获取)
```

## 2. DOM 操作优化

### 批量 DOM 操作

```javascript
// ❌ 低效的做法
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  document.body.appendChild(div); // 每次都触发重排
}

// ✅ 高效的做法
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment); // 只触发一次重排
```

### 使用事件委托

```javascript
// ❌ 为每个元素添加事件监听器
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
  button.addEventListener('click', handleClick);
});

// ✅ 使用事件委托
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('button')) {
    handleClick(e);
  }
});
```

### 虚拟滚动

对于大量数据的列表，实现虚拟滚动：

```javascript
class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );
    
    this.container.innerHTML = '';
    
    for (let i = this.startIndex; i < endIndex; i++) {
      const item = document.createElement('div');
      item.style.height = `${this.itemHeight}px`;
      item.textContent = this.items[i];
      this.container.appendChild(item);
    }
  }
  
  bindEvents() {
    this.container.addEventListener('scroll', () => {
      const newStartIndex = Math.floor(
        this.container.scrollTop / this.itemHeight
      );
      
      if (newStartIndex !== this.startIndex) {
        this.startIndex = newStartIndex;
        this.render();
      }
    });
  }
}
```

## 3. 异步操作优化

### 使用 Web Workers

将计算密集型任务移到 Web Worker ：

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

worker.onmessage = (e) => {
  console.log('计算结果:', e.data.result);
};

// worker.js
self.onmessage = (e) => {
  const { numbers } = e.data;
  
  // 执行复杂计算
  const result = numbers.reduce((sum, num) => {
    // 模拟复杂计算
    for (let i = 0; i < 1000000; i++) {
      sum += num * Math.random();
    }
    return sum;
  }, 0);
  
  self.postMessage({ result });
};
```

### 请求优化

```javascript
// 请求去重
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async request(url, options = {}) {
    const key = `${url}_${JSON.stringify(options)}`;
    
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    const promise = fetch(url, options)
      .then(response => response.json())
      .finally(() => {
        this.pendingRequests.delete(key);
      });
    
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// 请求批处理
class BatchRequestManager {
  constructor(batchSize = 5, delay = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
    this.queue = [];
    this.timer = null;
  }
  
  request(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, options, resolve, reject });
      this.scheduleFlush();
    });
  }
  
  scheduleFlush() {
    if (this.timer) return;
    
    this.timer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }
  
  async flush() {
    const batch = this.queue.splice(0, this.batchSize);
    this.timer = null;
    
    if (batch.length === 0) return;
    
    try {
      const promises = batch.map(({ url, options }) => 
        fetch(url, options).then(r => r.json())
      );
      
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        const { resolve, reject } = batch[index];
        if (result.status === 'fulfilled') {
          resolve(result.value);
        } else {
          reject(result.reason);
        }
      });
    } catch (error) {
      batch.forEach(({ reject }) => reject(error));
    }
    
    if (this.queue.length > 0) {
      this.scheduleFlush();
    }
  }
}
```

## 4. 内存管理

### 避免内存泄漏

```javascript
// ❌ 可能导致内存泄漏
class Component {
  constructor() {
    this.data = new Array(1000000).fill(0);
    
    // 忘记清理事件监听器
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // 忘记清理定时器
    this.timer = setInterval(() => {
      console.log('定时任务');
    }, 1000);
  }
  
  handleResize() {
    // 处理窗口大小变化
  }
}

// ✅ 正确的做法
class Component {
  constructor() {
    this.data = new Array(1000000).fill(0);
    this.handleResize = this.handleResize.bind(this);
    
    window.addEventListener('resize', this.handleResize);
    
    this.timer = setInterval(() => {
      console.log('定时任务');
    }, 1000);
  }
  
  handleResize() {
    // 处理窗口大小变化
  }
  
  destroy() {
    // 清理事件监听器
    window.removeEventListener('resize', this.handleResize);
    
    // 清理定时器
    clearInterval(this.timer);
    
    // 清理大对象
    this.data = null;
  }
}
```

### 对象池模式

```javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 1 }),
  (particle) => {
    particle.x = 0;
    particle.y = 0;
    particle.vx = 0;
    particle.vy = 0;
    particle.life = 1;
  }
);

// 获取粒子
const particle = particlePool.acquire();
particle.x = 100;
particle.y = 200;

// 使用完毕后释放
particlePool.release(particle);
```

## 5. 性能监控

### Performance API

```javascript
// 测量函数执行时间
function measurePerformance(fn, name) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    
    console.log(`${name} 执行时间: ${end - start}ms`);
    return result;
  };
}

// 使用示例
const optimizedFunction = measurePerformance(
  expensiveCalculation,
  'expensiveCalculation'
);

// 监控页面加载性能
window.addEventListener('load', () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  
  console.log('页面加载性能指标:');
  console.log('DNS 查询:', navigation.domainLookupEnd - navigation.domainLookupStart);
  console.log('TCP 连接:', navigation.connectEnd - navigation.connectStart);
  console.log('请求响应:', navigation.responseEnd - navigation.requestStart);
  console.log('DOM 解析:', navigation.domContentLoadedEventEnd - navigation.responseEnd);
  console.log('总加载时间:', navigation.loadEventEnd - navigation.navigationStart);
});
```

### 自定义性能监控

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }
  
  startTimer(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }
  
  endTimer(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      this.notifyObservers(name, metric);
    }
  }
  
  addObserver(callback) {
    this.observers.push(callback);
  }
  
  notifyObservers(name, metric) {
    this.observers.forEach(callback => {
      callback(name, metric);
    });
  }
  
  getMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

// 使用示例
const monitor = new PerformanceMonitor();

monitor.addObserver((name, metric) => {
  if (metric.duration > 100) {
    console.warn(`性能警告: ${name} 执行时间过长 (${metric.duration}ms)`);
  }
});

monitor.startTimer('dataProcessing');
// 执行数据处理
processLargeDataset();
monitor.endTimer('dataProcessing');
```

## 6. 工具和技巧

### 代码分割

```javascript
// 动态导入实现代码分割
async function loadModule() {
  const { heavyModule } = await import('./heavy-module.js');
  return heavyModule;
}

// 路由级别的代码分割
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/profile',
    component: () => import('./views/Profile.vue')
  }
];
```

### 预加载和预获取

```javascript
// 预加载关键资源
function preloadResource(url, type = 'script') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  document.head.appendChild(link);
}

// 预获取可能需要的资源
function prefetchResource(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// 智能预加载
class IntelligentPreloader {
  constructor() {
    this.userBehavior = new Map();
    this.preloadThreshold = 0.7; // 70% 概率阈值
  }
  
  trackUserAction(action, nextResource) {
    if (!this.userBehavior.has(action)) {
      this.userBehavior.set(action, new Map());
    }
    
    const actionMap = this.userBehavior.get(action);
    const count = actionMap.get(nextResource) || 0;
    actionMap.set(nextResource, count + 1);
  }
  
  shouldPreload(action, resource) {
    const actionMap = this.userBehavior.get(action);
    if (!actionMap) return false;
    
    const resourceCount = actionMap.get(resource) || 0;
    const totalCount = Array.from(actionMap.values())
      .reduce((sum, count) => sum + count, 0);
    
    return (resourceCount / totalCount) >= this.preloadThreshold;
  }
  
  handleUserAction(action) {
    const actionMap = this.userBehavior.get(action);
    if (!actionMap) return;
    
    actionMap.forEach((count, resource) => {
      if (this.shouldPreload(action, resource)) {
        prefetchResource(resource);
      }
    });
  }
}
```

## 总结

JavaScript 性能优化是一个持续的过程，需要：

1. **代码层面** - 选择合适的算法和数据结构
2. **DOM 操作** - 减少重排重绘，使用事件委托
3. **异步处理** - 合理使用 Web Workers 和请求优化
4. **内存管理** - 避免内存泄漏，使用对象池
5. **性能监控** - 建立完善的性能监控体系
6. **工具使用** - 代码分割、预加载等现代化工具

记住，过早优化是万恶之源。首先编写可读、可维护的代码，然后通过性能分析找出真正的瓶颈进行针对性优化。

---

*性能优化是一门艺术，需要在功能实现、代码可读性和执行效率之间找到平衡点。*