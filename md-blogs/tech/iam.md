---
html:
  embed_local_images: false
  embed_svg: false
  offline: false
  toc: true

export_on_save:
  html: true
---

# Authentication API 
众所周知，Authentication API 是分布式系统架构最基础，也是最关键一环。其关键性在于该 API 是用户访问系统的开始，如果该 API 不可用，后面的业务再怎么可用我们

## 这是一个图标
```mermaid
block-beta
  columns 2
  block:1:2
    control("控制平面---管理用户凭证")
  end
  arrow1<["凭证下发"]>(down)
  arrow2<["凭证获取"]>(up)
  block:dp:2
    block
      dp1("数据平面1")
    end
    block
      dp2("数据平面2")
    end
    block
      dp3("……")
    end
    block
      dp4("数据平面n")
    end
  end
```
很明显第二种会使数据平面依赖控制平面，从而影响了我们这里缺一不可。我们可以

```mermaid
mindmap
  root
    A
    B
    C
```
我们有什么办法呢？

### 这是一个图标2

!!!failure 失败
    有什么办法呢？

women 



  
