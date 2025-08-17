import{e as I,k as M,c as C,g as $,o as V,_ as L,d as H,J as R,a as D,f as N,F as Y}from"./index-C9EsHdB6.js";const w={class:"page-container"},A=I({__name:"tree-child",setup(y){return M(()=>{console.log("树形数据虚拟滚动文档加载完成")}),(r,e)=>(V(),C("div",w,e[0]||(e[0]=[$(`<header class="header" data-v-a2838320><div class="header-content" data-v-a2838320><h1 data-v-a2838320>树形数据的虚拟列表与虚拟滚动优化</h1><p data-v-a2838320>高性能渲染大量层级数据的解决方案</p></div></header><main class="main-content" data-v-a2838320><section class="section" data-v-a2838320><h2 data-v-a2838320>概述</h2><p data-v-a2838320> 当需要渲染包含成千上万个节点的树形结构时，传统的全量渲染方式会导致严重的性能问题，包括： </p><ul class="list-disc" data-v-a2838320><li data-v-a2838320>DOM节点数量过多导致的内存占用激增</li><li data-v-a2838320>渲染和重绘性能下降，页面卡顿</li><li data-v-a2838320>用户交互响应迟缓</li><li data-v-a2838320>初始加载时间过长</li></ul><p data-v-a2838320> 虚拟列表（Virtual List）和虚拟滚动（Virtual Scrolling）技术通过只渲染可视区域内的节点， 显著减少DOM节点数量，从而解决上述性能问题。 </p></section><section class="section" data-v-a2838320><h2 data-v-a2838320>核心原理</h2><div class="subsection" data-v-a2838320><h3 data-v-a2838320>1. 虚拟列表工作原理</h3><p data-v-a2838320> 虚拟列表的核心思想是只渲染用户当前可见区域内的项目，而非所有数据。主要通过以下步骤实现： </p><ol class="list-decimal" data-v-a2838320><li data-v-a2838320>计算容器可视区域的高度</li><li data-v-a2838320>根据滚动位置确定当前可见的节点范围</li><li data-v-a2838320>只渲染可见范围内的节点</li><li data-v-a2838320>通过设置容器的总高度和偏移量来模拟完整列表的滚动效果</li></ol></div><div class="subsection" data-v-a2838320><h3 data-v-a2838320>2. 树形结构的特殊处理</h3><p data-v-a2838320> 树形数据相比普通列表增加了层级关系和展开/折叠状态，需要额外处理： </p><ol class="list-decimal" data-v-a2838320><li data-v-a2838320>维护节点的展开/折叠状态</li><li data-v-a2838320>计算每个节点的深度以实现缩进效果</li><li data-v-a2838320>递归计算可见节点，仅包含展开路径上的节点</li><li data-v-a2838320>动态更新可见节点列表当展开/折叠状态改变时</li></ol></div><div class="subsection" data-v-a2838320><h3 data-v-a2838320>3. 虚拟滚动关键计算</h3><p data-v-a2838320> 实现虚拟滚动的核心计算公式： </p><div class="code-block" data-v-a2838320><p data-v-a2838320>// 计算可见区域起始索引</p><p data-v-a2838320>const startIndex = Math.floor(scrollTop / itemHeight)</p><br data-v-a2838320><p data-v-a2838320>// 计算可见区域结束索引</p><p data-v-a2838320>const endIndex = startIndex + Math.ceil(viewportHeight / itemHeight) + buffer</p><br data-v-a2838320><p data-v-a2838320>// 计算偏移量</p><p data-v-a2838320>const offsetY = startIndex * itemHeight</p></div><p data-v-a2838320> 其中buffer是额外渲染的节点数量，用于避免滚动时出现空白。 </p></div></section><section class="section" data-v-a2838320><h2 data-v-a2838320>适用场景</h2><div class="two-columns" data-v-a2838320><div class="column box-primary" data-v-a2838320><h3 data-v-a2838320>推荐使用场景</h3><ul class="list-disc" data-v-a2838320><li data-v-a2838320>包含1000+节点的树形结构</li><li data-v-a2838320>节点层级深且结构复杂的数据</li><li data-v-a2838320>需要频繁展开/折叠操作的树</li><li data-v-a2838320>对性能要求高的交互式树组件</li><li data-v-a2838320>移动端或低性能设备上的树形展示</li></ul></div><div class="column box-secondary" data-v-a2838320><h3 data-v-a2838320>不适用场景</h3><ul class="list-disc" data-v-a2838320><li data-v-a2838320>节点数量较少（少于100个）</li><li data-v-a2838320>简单的、层级不深的树形结构</li><li data-v-a2838320>需要同时显示大部分节点的场景</li><li data-v-a2838320>对初始加载速度要求极高，可接受后续操作略卡顿</li></ul></div></div></section><section class="section" data-v-a2838320><h2 data-v-a2838320>关键原理性代码</h2><div class="subsection" data-v-a2838320><h3 data-v-a2838320>1. 可见节点计算逻辑</h3><p data-v-a2838320>递归计算所有可见节点，只包含展开路径上的节点：</p><div class="code-block" data-v-a2838320><pre data-v-a2838320>// 计算可见节点的核心函数
function getVisibleNodes(node, depth = 0, parentExpanded = true) {
  const visible = [];
  
  // 只有父节点展开时，当前节点才可见
  if (parentExpanded) {
    // 添加当前节点
    visible.push({ node, depth });
    
    // 如果当前节点展开且有子节点，递归处理子节点
    if (expanded[node.id] &amp;&amp; node.children?.length) {
      for (const child of node.children) {
        visible.push(...getVisibleNodes(child, depth + 1, true));
      }
    }
  }
  
  return visible;
}</pre></div></div><div class="subsection" data-v-a2838320><h3 data-v-a2838320>2. 虚拟滚动计算逻辑</h3><p data-v-a2838320>计算可视区域节点范围和偏移量：</p><div class="code-block" data-v-a2838320><pre data-v-a2838320>// 计算需要渲染的节点范围
function calculateVisibleRange(scrollTop, viewportHeight, itemHeight, totalItems) {
  // 可视区域第一个可见节点的索引
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
  
  // 可视区域最后一个可见节点的索引（额外加2个缓冲节点）
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const endIndex = Math.min(
    totalItems, 
    startIndex + visibleCount + 2
  );
  
  // 计算偏移量，用于定位可见节点
  const offsetY = startIndex * itemHeight;
  
  return { startIndex, endIndex, offsetY };
}</pre></div></div><div class="subsection" data-v-a2838320><h3 data-v-a2838320>3. 渲染优化逻辑</h3><p data-v-a2838320>只渲染可视区域内的节点：</p><div class="code-block" data-v-a2838320><pre data-v-a2838320>// 渲染可视区域内的节点
function renderVisibleNodes() {
  // 获取所有可见节点
  const allVisibleNodes = getVisibleNodes(rootNode);
  const totalNodes = allVisibleNodes.length;
  
  // 计算容器和可视区域信息
  const { clientHeight, scrollTop } = container;
  
  // 计算需要渲染的节点范围
  const { startIndex, endIndex, offsetY } = calculateVisibleRange(
    scrollTop, 
    clientHeight, 
    itemHeight, 
    totalNodes
  );
  
  // 清空现有内容
  treeContainer.innerHTML = &#39;&#39;;
  
  // 设置总高度，确保滚动条正常工作
  treeContainer.style.height = \`\${totalNodes * itemHeight}px\`;
  
  // 设置偏移量，让节点显示在正确位置
  treeContainer.style.transform = \`translateY(\${offsetY}px)\`;
  
  // 只渲染可见范围内的节点
  for (let i = startIndex; i &lt; endIndex; i++) {
    const { node, depth } = allVisibleNodes[i];
    const nodeElement = createNodeElement(node, depth);
    treeContainer.appendChild(nodeElement);
  }
}</pre></div></div></section><section class="section" data-v-a2838320><h2 data-v-a2838320>优势总结</h2><div class="three-columns" data-v-a2838320><div class="column box" data-v-a2838320><h3 data-v-a2838320>性能提升</h3><p data-v-a2838320> DOM节点数量从数千减少到数十，显著提高渲染和交互性能 </p></div><div class="column box" data-v-a2838320><h3 data-v-a2838320>内存优化</h3><p data-v-a2838320> 减少DOM节点带来的内存占用，降低浏览器崩溃风险 </p></div><div class="column box" data-v-a2838320><h3 data-v-a2838320>体验改善</h3><p data-v-a2838320> 滚动流畅度提升，操作响应更快，提供接近原生应用的体验 </p></div></div></section></main><footer class="footer" data-v-a2838320><p data-v-a2838320>大量树形数据展示示例</p></footer>`,3)])))}}),F=L(A,[["__scopeId","data-v-a2838320"]]),s=30,B=I({__name:"tree-data-structure",setup(y){const r={id:1,name:"Root",children:Array.from({length:100},(a,t)=>({id:200+(t+1),name:`Node ${200+(t+1)}`,children:Array.from({length:1e4},(l,n)=>({id:(t+3)*1e4+n+1,name:`Child ${(t+3)*1e4+n+1}`,children:[]}))}))};console.log("treeData"),console.log(r);const e=H(null),f=H(null);let g=0,o={1:!0},v=[],h=null;function b(a,t=0,l=!0){const n=[];if(l){if(n.push({node:a,depth:t,id:a.id}),a.children&&a.children.length>0&&o[a.id])for(const c of a.children)n.push(...b(c,t+1,!0));console.log("visible"),console.log(n)}return n}function p(){const a=e.value,t=f.value;if(!a||!t)return;v=b(r);const l=v.length,n=a.clientHeight,c=Math.floor(g/s),E=Math.min(l,c+Math.ceil(n/s)+2);t.innerHTML="";for(let u=c;u<E;u++){const{node:d,depth:k}=v[u],i=document.createElement("div");if(i.className="node",i.dataset.id=d.id.toString(),i.style.paddingLeft=`${k*20}px`,i.style.height=`${s}px`,i.style.lineHeight=`${s}px`,d.children&&d.children.length>0){const m=document.createElement("span");m.className="toggle-icon",m.textContent=o[d.id]?"−":"+",i.appendChild(m),i.addEventListener("click",T=>{T.stopPropagation(),o[d.id]=!o[d.id],p()})}const _=document.createElement("span");_.textContent=d.name,i.appendChild(_),t.appendChild(i)}t.style.height=`${l*s}px`}const x=()=>{const a=e.value;a&&(h&&cancelAnimationFrame(h),h=requestAnimationFrame(()=>{g=a.scrollTop,p()}))};return M(()=>{const a=e.value;a?(p(),a.addEventListener("scroll",x)):console.error("容器元素未找到")}),R(()=>{e.value&&e.value.removeEventListener("scroll",x)}),(a,t)=>(V(),C(Y,null,[D(F),N("div",{class:"tree-container",ref_key:"containerRef",ref:e},[N("div",{class:"tree",ref_key:"treeRef",ref:f},null,512)],512)],64))}});export{B as default};
