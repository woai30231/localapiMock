import{_ as o,c as l,o as i,f as t,g as s}from"./index-Cr-NJ8us.js";const r={name:"DebounceThrottleDocs",methods:{scrollTo(d){const a=document.getElementById(d);a&&window.scrollTo({top:a.offsetTop-80,behavior:"smooth"})}}},c={class:"debounce-throttle-docs"},v={class:"doc-nav"};function b(d,a,u,m,p,n){return i(),l("div",c,[a[4]||(a[4]=t("header",{class:"page-header"},[t("h1",{style:{margin:"0px"}},"JavaScript防抖和节流")],-1)),t("nav",v,[t("ul",null,[t("li",{onClick:a[0]||(a[0]=e=>n.scrollTo("debounce"))},"防抖(Debounce)"),t("li",{onClick:a[1]||(a[1]=e=>n.scrollTo("throttle"))},"节流(Throttle)"),t("li",{onClick:a[2]||(a[2]=e=>n.scrollTo("difference"))},"区别与对比"),t("li",{onClick:a[3]||(a[3]=e=>n.scrollTo("scenarios"))},"应用场景")])]),a[5]||(a[5]=s(`<main class="doc-content" data-v-a521a1b7><section id="debounce" class="doc-section" data-v-a521a1b7><h2 data-v-a521a1b7>防抖(Debounce)</h2><div class="section-content" data-v-a521a1b7><p data-v-a521a1b7>防抖是指触发事件后，在n秒内函数只能执行一次，如果n秒内又触发了事件，则重新计算函数执行时间。</p><h3 data-v-a521a1b7>基本实现</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 基础防抖函数实现
  function debounce(func, delay) {
    let timer = null;
    
    return function(...args) {
      // 清除之前的定时器
      if (timer) clearTimeout(timer);
      
      // 设置新的定时器
      timer = setTimeout(() =&gt; {
        func.apply(this, args);
        timer = null;
      }, delay);
    };
  }</pre></div><h3 data-v-a521a1b7>立即执行版本</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 立即执行的防抖函数
  function debounceImmediate(func, delay, immediate = true) {
    let timer = null;
    
    return function(...args) {
      if (timer) clearTimeout(timer);
      
      // 立即执行的情况
      if (immediate &amp;&amp; !timer) {
        func.apply(this, args);
      }
      
      timer = setTimeout(() =&gt; {
        // 非立即执行的情况
        if (!immediate) {
          func.apply(this, args);
        }
        timer = null;
      }, delay);
    };
  }</pre></div><h3 data-v-a521a1b7>Vue中使用</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// Vue组件中使用防抖
  export default {
    methods: {
      // 定义防抖方法
      handleSearch: debounce(function(keyword) {
        // 实际搜索逻辑
        console.log(&#39;搜索:&#39;, keyword);
      }, 500),
      
      // 或者在生命周期中绑定
      init() {
        this.handleScroll = debounce(this.handleScroll, 300);
        window.addEventListener(&#39;scroll&#39;, this.handleScroll);
      }
    },
    beforeDestroy() {
      // 移除事件监听
      window.removeEventListener(&#39;scroll&#39;, this.handleScroll);
    }
  }</pre></div></div></section><section id="throttle" class="doc-section" data-v-a521a1b7><h2 data-v-a521a1b7>节流(Throttle)</h2><div class="section-content" data-v-a521a1b7><p data-v-a521a1b7>节流是指连续触发事件，但在n秒内只执行一次函数，保证函数有规律地执行。</p><h3 data-v-a521a1b7>时间戳实现</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 时间戳版节流
  function throttleTimestamp(func, interval) {
    let lastTime = 0;
    
    return function(...args) {
      const now = Date.now();
      
      // 如果当前时间与上次执行时间的差大于间隔时间
      if (now - lastTime &gt; interval) {
        func.apply(this, args);
        lastTime = now;
      }
    };
  }</pre></div><h3 data-v-a521a1b7>定时器实现</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 定时器版节流
  function throttleTimer(func, interval) {
    let timer = null;
    
    return function(...args) {
      if (!timer) {
        timer = setTimeout(() =&gt; {
          func.apply(this, args);
          timer = null;
        }, interval);
      }
    };
  }</pre></div><h3 data-v-a521a1b7>综合版实现</h3><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 综合版节流（支持立即执行和尾部执行）
  function throttle(func, interval, options = { leading: true, trailing: false }) {
    let lastTime = 0;
    let timer = null;
    const { leading, trailing } = options;
    
    const clear = () =&gt; {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    
    return function(...args) {
      const now = Date.now();
      
      // 第一次执行时，如果不需要立即执行，则设置lastTime为当前时间
      if (!lastTime &amp;&amp; !leading) lastTime = now;
      
      const remaining = interval - (now - lastTime);
      
      if (remaining &lt;= 0) {
        // 时间差大于间隔，执行函数
        clear();
        func.apply(this, args);
        lastTime = now;
      } else if (trailing &amp;&amp; !timer) {
        // 尾部执行
        timer = setTimeout(() =&gt; {
          func.apply(this, args);
          lastTime = Date.now();
          timer = null;
        }, remaining);
      }
    };
  }</pre></div></div></section><section id="difference" class="doc-section" data-v-a521a1b7><h2 data-v-a521a1b7>区别与对比</h2><div class="section-content" data-v-a521a1b7><div class="comparison-table" data-v-a521a1b7><table data-v-a521a1b7><thead data-v-a521a1b7><tr data-v-a521a1b7><th data-v-a521a1b7>特性</th><th data-v-a521a1b7>防抖(Debounce)</th><th data-v-a521a1b7>节流(Throttle)</th></tr></thead><tbody data-v-a521a1b7><tr data-v-a521a1b7><td data-v-a521a1b7>核心思想</td><td data-v-a521a1b7>触发后延迟执行，重新触发则重新计时</td><td data-v-a521a1b7>固定间隔内只执行一次</td></tr><tr data-v-a521a1b7><td data-v-a521a1b7>执行次数</td><td data-v-a521a1b7>事件停止触发后执行一次</td><td data-v-a521a1b7>间隔固定，多次执行</td></tr><tr data-v-a521a1b7><td data-v-a521a1b7>时间控制</td><td data-v-a521a1b7>从最后一次触发开始计算延迟</td><td data-v-a521a1b7>按固定间隔计算</td></tr><tr data-v-a521a1b7><td data-v-a521a1b7>适用场景</td><td data-v-a521a1b7>输入验证、搜索联想等</td><td data-v-a521a1b7>滚动加载、窗口调整等</td></tr></tbody></table></div><div class="note" data-v-a521a1b7><strong data-v-a521a1b7>记忆要点：</strong> 防抖是&quot;延迟执行，重新触发则重置计时&quot;，节流是&quot;固定频率执行，无论触发多频繁&quot;。 </div></div></section><section id="scenarios" class="doc-section" data-v-a521a1b7><h2 data-v-a521a1b7>应用场景</h2><div class="section-content" data-v-a521a1b7><h3 data-v-a521a1b7>防抖适用场景</h3><ul class="scenario-list" data-v-a521a1b7><li data-v-a521a1b7><strong data-v-a521a1b7>搜索框输入联想</strong><p data-v-a521a1b7>用户输入时，不需要每次按键都请求接口，而是等待用户停止输入一段时间后再请求</p><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 搜索输入防抖示例
  const searchInput = document.getElementById(&#39;search-input&#39;);
  const handleSearch = debounce(function(value) {
    console.log(&#39;请求搜索:&#39;, value);
    // 实际接口请求逻辑...
  }, 500);
  
  searchInput.addEventListener(&#39;input&#39;, (e) =&gt; {
    handleSearch(e.target.value);
  });</pre></div></li><li data-v-a521a1b7><strong data-v-a521a1b7>表单验证</strong><p data-v-a521a1b7>输入框内容验证，等待用户输入完成后再进行验证</p></li><li data-v-a521a1b7><strong data-v-a521a1b7>按钮点击防重复提交</strong><p data-v-a521a1b7>防止用户快速点击按钮导致多次提交</p></li><li data-v-a521a1b7><strong data-v-a521a1b7>浏览器窗口大小调整</strong><p data-v-a521a1b7>窗口大小调整完成后再执行布局调整逻辑</p></li></ul><h3 data-v-a521a1b7>节流适用场景</h3><ul class="scenario-list" data-v-a521a1b7><li data-v-a521a1b7><strong data-v-a521a1b7>滚动加载</strong><p data-v-a521a1b7>监听滚动事件，固定间隔检测是否到达页面底部</p><div class="code-block" data-v-a521a1b7><pre data-v-a521a1b7>// 滚动加载节流示例
  const handleScroll = throttle(function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // 判断是否到达页面底部
    if (scrollTop + clientHeight &gt;= scrollHeight - 100) {
      console.log(&#39;加载更多数据&#39;);
      // 加载数据逻辑...
    }
  }, 1000);
  
  window.addEventListener(&#39;scroll&#39;, handleScroll);</pre></div></li><li data-v-a521a1b7><strong data-v-a521a1b7>高频点击事件</strong><p data-v-a521a1b7>如游戏中的射击按钮，限制每秒触发次数</p></li><li data-v-a521a1b7><strong data-v-a521a1b7>鼠标移动/拖拽事件</strong><p data-v-a521a1b7>如拖拽元素时更新位置，固定频率更新</p></li><li data-v-a521a1b7><strong data-v-a521a1b7>视频/音频播放进度更新</strong><p data-v-a521a1b7>固定间隔更新进度条，避免过于频繁</p></li></ul></div></section></main>`,1))])}const g=o(r,[["render",b],["__scopeId","data-v-a521a1b7"]]);export{g as default};
