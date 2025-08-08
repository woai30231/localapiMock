import{c as m,o as s,g,e as _,d as w,m as k,a as t,f as b,w as o,r as l,b as u,T as q,i as p,S as x,U as A,V as R,_ as y}from"./index-D-Pu53Ky.js";const N={class:"doc-container"},C={__name:"router-switch-descr",setup(v){return(a,n)=>(s(),m("div",N,n[0]||(n[0]=[g(`<main class="doc-content"><section class="doc-section"><h2>什么是路由切换动画？</h2><p> 路由切换动画是指在 Vue 应用中切换页面（路由）时，通过平滑的过渡效果增强用户体验的方式。 结合 <code>&lt;transition&gt;</code>、<code>&lt;keep-alive&gt;</code> 和 <code>&lt;router-view&gt;</code> 三个组件，我们可以实现既美观又高效的路由切换效果。 </p><p>本文档将基于一个完整示例，详细讲解实现方法。</p></section><section class="doc-section"><h2>完整实现示例</h2><p>下面是一个可以直接使用的完整实现，包含了路由过渡动画和组件缓存功能：</p><div class="code-block"><pre><code>&lt;template&gt;
    &lt;!-- 路由视图通过插槽传递当前组件和路由信息 --&gt;
    &lt;router-view v-slot=&quot;{ Component, route }&quot;&gt;
      &lt;!-- 过渡动画容器 --&gt;
      &lt;transition :name=&quot;transitionName&quot;&gt;
        &lt;!-- 组件缓存容器 --&gt;
        &lt;keep-alive :include=&quot;keepAliveRoutes&quot;&gt;
          &lt;!-- 动态渲染当前路由组件 --&gt;
          &lt;component 
            :is=&quot;Component&quot; 
            :key=&quot;route.fullPath&quot; 
          /&gt;
        &lt;/keep-alive&gt;
      &lt;/transition&gt;
    &lt;/router-view&gt;
  &lt;/template&gt;
  
  &lt;script setup&gt;
  import { ref, watch } from &#39;vue&#39;
  import { useRoute } from &#39;vue-router&#39;
  
  // 定义需要缓存的路由名称（对应路由配置中的name属性）
  const keepAliveRoutes = [&#39;Home&#39;, &#39;About&#39;]
  
  // 过渡动画名称
  const transitionName = ref(&#39;fade&#39;)
  const route = useRoute()
  
  // 根据路由切换方向动态改变过渡效果
  watch(
    () =&gt; route.path,
    (_toPath, fromPath) =&gt; {
      // 根据路由来自哪里判断方向
      const fromDepth = fromPath.includes(&quot;switch2&quot;);
      
      transitionName.value = fromDepth ? &#39;slide-left&#39; : &#39;slide-right&#39;
    }
  )
  &lt;/script&gt;
  
  &lt;style&gt;
  /* 基础淡入淡出效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 左右滑动效果 */
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    position: absolute;
    width: 100%;
    transition: transform 0.3s ease;
  }
  
  /* 向左滑动 */
  .slide-left-enter-from {
    transform: translateX(100%);
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
  }
  
  /* 向右滑动 */
  .slide-right-enter-from {
    transform: translateX(-100%);
  }
  .slide-right-leave-to {
    transform: translateX(100%);
  }
  &lt;/style&gt;</code></pre></div></section><section class="doc-section"><h2>核心部分解析</h2><div class="section-item"><h3>1. 模板结构</h3><p>模板部分是实现功能的核心，包含三个关键组件的嵌套关系：</p><div class="code-block small"><pre><code>&lt;!-- 路由视图通过插槽传递组件和路由信息 --&gt;
  &lt;router-view v-slot=&quot;{ Component, route }&quot;&gt;
    &lt;!-- 过渡动画容器 --&gt;
    &lt;transition :name=&quot;transitionName&quot;&gt;
      &lt;!-- 组件缓存容器 --&gt;
      &lt;keep-alive :include=&quot;keepAliveRoutes&quot;&gt;
        &lt;!-- 动态渲染当前路由组件 --&gt;
        &lt;component 
          :is=&quot;Component&quot; 
          :key=&quot;route.fullPath&quot; 
        /&gt;
      &lt;/keep-alive&gt;
    &lt;/transition&gt;
  &lt;/router-view&gt;</code></pre></div><p>各部分作用：</p><ul><li><code>&lt;router-view&gt;</code>：提供路由匹配的组件（Component）和路由信息（route）</li><li><code>&lt;transition&gt;</code>：提供动画效果，通过 <code>:name</code> 动态切换动画类型</li><li><code>&lt;keep-alive&gt;</code>：缓存指定组件，通过 <code>:include</code> 控制需要缓存的组件</li><li><code>&lt;component&gt;</code>：动态渲染当前路由对应的组件</li></ul></div><div class="section-item"><h3>2. 脚本逻辑</h3><p>脚本部分主要处理动画类型的动态切换和缓存配置：</p><div class="code-block small"><pre><code>import { ref, watch } from &#39;vue&#39;
  import { useRoute } from &#39;vue-router&#39;
  
  // 定义需要缓存的路由名称
  const keepAliveRoutes = [&#39;Home&#39;, &#39;About&#39;]
  
  // 过渡动画名称
  const transitionName = ref(&#39;fade&#39;)
  const route = useRoute()
  
  // 根据路由切换方向动态改变过渡效果
  watch(
    () =&gt; route.path,
    (toPath, fromPath) =&gt; {
      // 根据路由层级判断方向
      const toDepth = toPath.split(&#39;/&#39;).length
      const fromDepth = fromPath.split(&#39;/&#39;).length
      
      transitionName.value = toDepth &gt; fromDepth ? &#39;slide-left&#39; : &#39;slide-right&#39;
    }
  )</code></pre></div><p>核心逻辑：</p><ul><li><code>keepAliveRoutes</code>：数组中定义需要缓存的组件名称（对应路由配置的 name 属性）</li><li><code>transitionName</code>：用于动态切换动画类型的响应式变量</li><li>watch 监听器：根据路由路径的层级变化（深度）判断导航方向，动态改变动画类型</li></ul></div><div class="section-item"><h3>3. 样式定义</h3><p>样式部分定义了两种动画效果：淡入淡出和左右滑动：</p><div class="code-block small"><pre><code>/* 基础淡入淡出效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 左右滑动效果 */
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    position: absolute;
    width: 100%;
    transition: transform 0.3s ease;
  }</code></pre></div><p>Vue 过渡类名说明：</p><ul><li><code>xxx-enter-from</code>：进入动画的起始状态</li><li><code>xxx-enter-active</code>：进入动画的过程状态</li><li><code>xxx-leave-to</code>：离开动画的结束状态</li><li><code>xxx-leave-active</code>：离开动画的过程状态</li></ul></div></section><section class="doc-section"><h2>配套路由配置</h2><p>为了使上述代码正常工作，需要配合正确的路由配置（router/index.js）：</p><div class="code-block"><pre><code>// router/index.js
  import { createRouter, createWebHistory } from &#39;vue-router&#39;
  import Home from &#39;../views/Home.vue&#39;
  import About from &#39;../views/About.vue&#39;
  
  const routes = [
    {
      path: &#39;/&#39;,
      name: &#39;Home&#39;, // 需与keepAliveRoutes中的名称一致
      component: Home
    },
    {
      path: &#39;/about&#39;,
      name: &#39;About&#39;, // 需与keepAliveRoutes中的名称一致
      component: About
    },
    {
      path: &#39;/detail/:id&#39;,
      name: &#39;Detail&#39;, // 这个组件不会被缓存（未在keepAliveRoutes中）
      component: () =&gt; import(&#39;../views/Detail.vue&#39;)
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  export default router</code></pre></div><p>注意事项：</p><ul><li>路由配置中的 <code>name</code> 属性需要与 <code>keepAliveRoutes</code> 中的名称对应才能被缓存</li><li>可以通过动态导入（<code>() =&gt; import()</code>）实现组件的懒加载</li></ul></section><section class="doc-section"><h2>实现效果说明</h2><div class="effect-item"><h3>动态动画方向</h3><p>根据路由层级自动切换动画方向：</p><ul><li>进入更深层级的路由（如从 <code>/</code> 到 <code>/about</code>）时，使用向左滑动动画</li><li>返回上一层级的路由（如从 <code>/about</code> 到 <code>/</code>）时，使用向右滑动动画</li><li>首次加载时使用淡入淡出动画</li></ul></div><div class="effect-item"><h3>组件缓存效果</h3><p>在 <code>keepAliveRoutes</code> 中定义的组件（Home、About）会被缓存：</p><ul><li>切换路由后返回时，组件状态会被保留（如表单输入内容、滚动位置）</li><li>不会重新执行组件的 <code>onMounted</code> 等生命周期钩子</li><li>未在列表中的组件（如 Detail）不会被缓存，每次访问都会重新创建</li></ul></div></section><section class="doc-section"><h2>如何使用</h2><ol class="steps"><li>将示例代码保存为一个 Vue 组件（如 <code>App.vue</code> 或专门的 <code>RouteTransition.vue</code>）</li><li>确保你的路由配置正确，并包含 <code>name</code> 属性</li><li>根据需要修改 <code>keepAliveRoutes</code> 数组，指定需要缓存的组件</li><li>调整动画样式（过渡时间、动画效果）以匹配你的应用风格</li><li>如果需要，可以修改路由深度判断逻辑，以适应你的路由结构</li></ol></section></main>`,1)])))}},D={style:{height:"250px",transform:"translate(0,0)"}},P=_({__name:"router-switch-transition",setup(v){const a=w("fade"),n=R();return k(()=>n.path,(c,e)=>{const i=e.includes("switch2");a.value=i?"slide-left":"slide-right"}),(c,e)=>{const i=l("el-button"),d=l("el-col"),f=l("el-row"),h=l("router-view");return s(),m("div",null,[t(f,{gutter:10},{default:o(()=>[t(d,{span:3},{default:o(()=>[t(i,{onClick:e[0]||(e[0]=r=>c.$router.replace({name:"router-switch1"})),type:"primary"},{default:o(()=>e[2]||(e[2]=[u("切换路由1",-1)])),_:1,__:[2]})]),_:1}),t(d,{span:3},{default:o(()=>[t(i,{onClick:e[1]||(e[1]=r=>c.$router.replace({name:"router-switch2"})),type:"primary"},{default:o(()=>e[3]||(e[3]=[u("切换路由2",-1)])),_:1,__:[3]})]),_:1})]),_:1}),b("div",D,[t(h,null,{default:o(({Component:r})=>[t(q,{name:a.value},{default:o(()=>[(s(),p(A,null,[(s(),p(x(r)))],1024))]),_:2},1032,["name"])]),_:1})]),t(C)])}}}),V=y(P,[["__scopeId","data-v-378e095c"]]);export{V as default};
