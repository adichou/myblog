---
title: "Vue 3 Composition API 深度解析"
date: "2024-01-15"
author: "技术团队"
tags: ["Vue.js", "JavaScript", "前端开发"]
description: "Vue 3 的 Composition API 是一个全新的组件逻辑组织方式，它提供了更灵活的代码组织和更好的 TypeScript 支持。"
featured: true
draft: false
---

# Vue 3 Composition API 深度解析

## 简介

Vue 3 的 Composition API 是一个全新的组件逻辑组织方式，它提供了更灵活的代码组织和更好的 TypeScript 支持。

## 核心概念

### 1. setup() 函数

`setup()` 是 Composition API 的入口点：

```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 生命周期
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 返回给模板使用
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### 2. 响应式 API

#### ref()
用于创建响应式的基本数据类型：

```javascript
const message = ref('Hello Vue 3')
const count = ref(0)
const isVisible = ref(true)

// 访问值需要使用 .value
console.log(message.value) // 'Hello Vue 3'
message.value = 'Updated message'
```

#### reactive()
用于创建响应式的对象：

```javascript
const state = reactive({
  user: {
    name: 'John',
    age: 30
  },
  posts: []
})

// 直接访问属性
console.log(state.user.name) // 'John'
state.user.name = 'Jane'
```

### 3. 计算属性和侦听器

```javascript
import { ref, computed, watch } from 'vue'

setup() {
  const firstName = ref('John')
  const lastName = ref('Doe')
  
  // 计算属性
  const fullName = computed(() => {
    return `${firstName.value} ${lastName.value}`
  })
  
  // 侦听器
  watch(firstName, (newValue, oldValue) => {
    console.log(`名字从 ${oldValue} 改为 ${newValue}`)
  })
  
  return { firstName, lastName, fullName }
}
```

## 实际应用示例

### 用户管理组件

```javascript
import { ref, reactive, computed, onMounted } from 'vue'
import { fetchUsers, createUser } from '@/api/users'

export default {
  setup() {
    // 状态管理
    const users = ref([])
    const loading = ref(false)
    const error = ref('')
    
    // 表单数据
    const form = reactive({
      name: '',
      email: '',
      role: 'user'
    })
    
    // 计算属性
    const adminUsers = computed(() => {
      return users.value.filter(user => user.role === 'admin')
    })
    
    // 方法
    const loadUsers = async () => {
      try {
        loading.value = true
        users.value = await fetchUsers()
      } catch (err) {
        error.value = '加载用户失败'
      } finally {
        loading.value = false
      }
    }
    
    const addUser = async () => {
      try {
        const newUser = await createUser(form)
        users.value.push(newUser)
        // 重置表单
        Object.assign(form, { name: '', email: '', role: 'user' })
      } catch (err) {
        error.value = '创建用户失败'
      }
    }
    
    // 生命周期
    onMounted(() => {
      loadUsers()
    })
    
    return {
      users,
      loading,
      error,
      form,
      adminUsers,
      loadUsers,
      addUser
    }
  }
}
```

## 组合式函数 (Composables)

创建可复用的逻辑：

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  const isEven = computed(() => count.value % 2 === 0)
  
  return {
    count,
    increment,
    decrement,
    reset,
    isEven
  }
}
```

使用组合式函数：

```javascript
import { useCounter } from '@/composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement, isEven } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      isEven
    }
  }
}
```

## TypeScript 支持

Composition API 提供了出色的 TypeScript 支持：

```typescript
import { ref, computed, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  setup() {
    const users: Ref<User[]> = ref([])
    const selectedUser: Ref<User | null> = ref(null)
    
    const userCount = computed((): number => users.value.length)
    
    const selectUser = (user: User): void => {
      selectedUser.value = user
    }
    
    return {
      users,
      selectedUser,
      userCount,
      selectUser
    }
  }
})
```

## 最佳实践

### 1. 逻辑分组
将相关的响应式数据、计算属性和方法组织在一起：

```javascript
setup() {
  // 用户相关逻辑
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const login = async (credentials) => { /* ... */ }
  const logout = () => { /* ... */ }
  
  // 主题相关逻辑
  const theme = ref('light')
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  return {
    // 用户
    user,
    isLoggedIn,
    login,
    logout,
    // 主题
    theme,
    toggleTheme
  }
}
```

### 2. 提取可复用逻辑
将通用逻辑提取为组合式函数：

```javascript
// composables/useApi.js
export function useApi(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')
  
  const fetch = async () => {
    try {
      loading.value = true
      const response = await api.get(url)
      data.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return { data, loading, error, fetch }
}
```

### 3. 性能优化

使用 `shallowRef` 和 `shallowReactive` 优化大型对象：

```javascript
import { shallowRef, triggerRef } from 'vue'

const largeList = shallowRef([])

// 手动触发更新
largeList.value.push(newItem)
triggerRef(largeList)
```

## 迁移指南

### 从 Options API 迁移

**Options API:**
```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('mounted')
  }
}
```

**Composition API:**
```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    const increment = () => count.value++
    
    onMounted(() => {
      console.log('mounted')
    })
    
    return { count, doubleCount, increment }
  }
}
```

## 总结

Composition API 为 Vue 3 带来了：

- **更好的逻辑复用** - 通过组合式函数
- **更好的类型推导** - TypeScript 支持
- **更灵活的代码组织** - 按功能而非选项组织
- **更好的 Tree-shaking** - 按需导入

虽然学习曲线稍陡，但 Composition API 为大型应用提供了更好的可维护性和可扩展性。

---

*本文介绍了 Vue 3 Composition API 的核心概念和实际应用，希望能帮助开发者更好地理解和使用这个强大的新特性。*