import{_ as o}from"./index-DIGHUu6Q.js";import{y as s,z as r,A as t,aC as l}from"./vue-origin-C13gnj91.js";import"./element-plus-DHgJS1aZ.js";const i={name:"ES6IterableDocs",methods:{scrollTo(d){const e=document.getElementById(d);e&&window.scrollTo({top:e.offsetTop-80,behavior:"smooth"})}}},c={class:"es6-iterable-docs"},v={class:"doc-nav"};function p(d,e,u,b,f,n){return r(),s("div",c,[e[5]||(e[5]=t("header",{class:"page-header"},[t("h1",{style:{margin:"0px"}},"ES6可遍历对象")],-1)),t("nav",v,[t("ul",null,[t("li",{onClick:e[0]||(e[0]=a=>n.scrollTo("definition"))},"基本概念"),t("li",{onClick:e[1]||(e[1]=a=>n.scrollTo("protocol"))},"迭代协议"),t("li",{onClick:e[2]||(e[2]=a=>n.scrollTo("built-in"))},"内置可遍历对象"),t("li",{onClick:e[3]||(e[3]=a=>n.scrollTo("custom"))},"自定义可遍历对象"),t("li",{onClick:e[4]||(e[4]=a=>n.scrollTo("usage"))},"使用场景")])]),e[6]||(e[6]=l(`<main class="doc-content" data-v-de713288><section id="definition" class="doc-section" data-v-de713288><h2 data-v-de713288>基本概念</h2><div class="section-content" data-v-de713288><p data-v-de713288>在ES6中，可遍历对象（Iterable Object）是指那些实现了可迭代协议的对象。这些对象可以被各种迭代机制处理，如for...of循环、扩展运算符等。</p><p data-v-de713288>可遍历对象的核心特征是拥有一个特殊的迭代器生成方法，通过这个方法可以创建一个迭代器来遍历对象中的数据。</p><div class="note" data-v-de713288> 可遍历对象的出现，统一了JavaScript中各种数据结构的遍历方式，使得不同数据结构可以使用相同的语法进行遍历操作。 </div></div></section><section id="protocol" class="doc-section" data-v-de713288><h2 data-v-de713288>迭代协议</h2><div class="section-content" data-v-de713288><p data-v-de713288>ES6中定义了两个与迭代相关的协议：可迭代协议和迭代器协议。</p><h3 data-v-de713288>可迭代协议</h3><p data-v-de713288>一个对象要成为可迭代对象，必须实现<code data-v-de713288>[Symbol.iterator]</code>方法，该方法是一个无参数函数，返回一个符合迭代器协议的对象。</p><div class="code-block" data-v-de713288><pre data-v-de713288>// 可迭代协议示例
  const iterableObj = {
    [Symbol.iterator]() {
      // 返回一个迭代器对象
      return {
        next() {
          // 实现迭代器协议
          return { value: &#39;数据&#39;, done: false };
        }
      };
    }
  };</pre></div><h3 data-v-de713288>迭代器协议</h3><p data-v-de713288>迭代器协议定义了产生一系列值的标准方式。一个对象要成为迭代器，必须实现一个next()方法，该方法返回一个包含以下两个属性的对象：</p><ul class="feature-list" data-v-de713288><li data-v-de713288><strong data-v-de713288>value</strong>：当前迭代位置的值，可以是任何类型</li><li data-v-de713288><strong data-v-de713288>done</strong>：布尔值，表示迭代是否结束。true表示迭代已结束，false表示还有更多值可供迭代</li></ul><div class="code-block" data-v-de713288><pre data-v-de713288>// 迭代器协议示例
  const iterator = {
    next() {
      if (/* 还有数据 */) {
        return { value: &#39;当前值&#39;, done: false };
      } else {
        return { value: undefined, done: true };
      }
    }
  };</pre></div><p data-v-de713288>此外，迭代器还可以选择性地实现return()和throw()方法：</p><ul class="feature-list" data-v-de713288><li data-v-de713288><strong data-v-de713288>return()</strong>：当迭代提前终止时调用（如break语句）</li><li data-v-de713288><strong data-v-de713288>throw()</strong>：用于向迭代器抛出错误</li></ul></div></section><section id="built-in" class="doc-section" data-v-de713288><h2 data-v-de713288>内置可遍历对象</h2><div class="section-content" data-v-de713288><p data-v-de713288>ES6中许多内置对象默认实现了可迭代协议，因此可以直接使用迭代语法：</p><ul class="built-in-list" data-v-de713288><li data-v-de713288><strong data-v-de713288>Array（数组）</strong><div class="code-block" data-v-de713288><pre data-v-de713288>const arr = [1, 2, 3];
  for (const item of arr) {
    console.log(item); // 1, 2, 3
  }</pre></div></li><li data-v-de713288><strong data-v-de713288>String（字符串）</strong><div class="code-block" data-v-de713288><pre data-v-de713288>const str = &quot;hello&quot;;
  for (const char of str) {
    console.log(char); // &#39;h&#39;, &#39;e&#39;, &#39;l&#39;, &#39;l&#39;, &#39;o&#39;
  }</pre></div></li><li data-v-de713288><strong data-v-de713288>Map</strong><div class="code-block" data-v-de713288><pre data-v-de713288>const map = new Map();
  map.set(&#39;name&#39;, &#39;张三&#39;);
  map.set(&#39;age&#39;, 20);
  for (const [key, value] of map) {
    console.log(key, value); // &#39;name&#39; &#39;张三&#39;, &#39;age&#39; 20
  }</pre></div></li><li data-v-de713288><strong data-v-de713288>Set</strong><div class="code-block" data-v-de713288><pre data-v-de713288>const set = new Set([1, 2, 3]);
  for (const item of set) {
    console.log(item); // 1, 2, 3
  }</pre></div></li><li data-v-de713288><strong data-v-de713288>其他</strong>：TypedArray、函数的arguments对象、NodeList对象等 </li></ul></div></section><section id="custom" class="doc-section" data-v-de713288><h2 data-v-de713288>自定义可遍历对象</h2><div class="section-content" data-v-de713288><p data-v-de713288>我们可以通过实现可迭代协议，将普通对象改造为可遍历对象。以下是创建自定义可遍历对象的步骤：</p><ol class="steps-list" data-v-de713288><li data-v-de713288>为对象添加<code data-v-de713288>[Symbol.iterator]</code>方法</li><li data-v-de713288>该方法返回一个迭代器对象</li><li data-v-de713288>迭代器对象必须包含next()方法</li><li data-v-de713288>next()方法返回包含value和done属性的对象</li></ol><h3 data-v-de713288>示例1：基本自定义可遍历对象</h3><div class="code-block" data-v-de713288><pre data-v-de713288>// 自定义可遍历的用户对象
  const user = {
    name: &#39;张三&#39;,
    hobbies: [&#39;读书&#39;, &#39;运动&#39;, &#39;编程&#39;],
    [Symbol.iterator]() {
      let index = 0;
      const hobbies = this.hobbies;
      return {
        next() {
          if (index &lt; hobbies.length) {
            return {
              value: hobbies[index++],
              done: false
            };
          } else {
            return {
              value: undefined,
              done: true
            };
          }
        }
      };
    }
  };
  
  // 使用for...of遍历
  for (const hobby of user) {
    console.log(hobby); // &#39;读书&#39;, &#39;运动&#39;, &#39;编程&#39;
  }</pre></div><h3 data-v-de713288>示例2：可遍历的类</h3><div class="code-block" data-v-de713288><pre data-v-de713288>// 创建一个可遍历的范围类
  class Range {
    constructor(start, end, step = 1) {
      this.start = start;
      this.end = end;
      this.step = step;
    }
    
    // 实现可迭代协议
    [Symbol.iterator]() {
      let current = this.start;
      const end = this.end;
      const step = this.step;
      
      return {
        next() {
          if (current &lt;= end) {
            const value = current;
            current += step;
            return { value, done: false };
          }
          return { done: true };
        }
      };
    }
  }
  
  // 使用
  const range = new Range(1, 5);
  for (const num of range) {
    console.log(num); // 1, 2, 3, 4, 5
  }</pre></div></div></section><section id="usage" class="doc-section" data-v-de713288><h2 data-v-de713288>可遍历对象的使用场景</h2><div class="section-content" data-v-de713288><p data-v-de713288>实现了可迭代协议的对象可以在多种场景下使用：</p><h3 data-v-de713288>1. for...of循环</h3><div class="code-block" data-v-de713288><pre data-v-de713288>const arr = [1, 2, 3];
  for (const item of arr) {
    console.log(item);
  }</pre></div><h3 data-v-de713288>2. 扩展运算符(...) </h3><div class="code-block" data-v-de713288><pre data-v-de713288>const range = new Range(1, 3);
  const arr = [...range]; // [1, 2, 3]</pre></div><h3 data-v-de713288>3. 解构赋值</h3><div class="code-block" data-v-de713288><pre data-v-de713288>const [a, b, c] = new Range(10, 30, 10);
  console.log(a, b, c); // 10, 20, 30</pre></div><h3 data-v-de713288>4. Array.from()</h3><div class="code-block" data-v-de713288><pre data-v-de713288>const iterable = {
    [Symbol.iterator]() {
      return {
        count: 0,
        next() {
          this.count++;
          return this.count &lt;= 3 
            ? { value: this.count, done: false }
            : { done: true };
        }
      };
    }
  };
  
  const arr = Array.from(iterable);
  console.log(arr); // [1, 2, 3]</pre></div><h3 data-v-de713288>5. 作为某些集合的构造函数参数</h3><div class="code-block" data-v-de713288><pre data-v-de713288>const set = new Set(new Range(1, 3));
  console.log(set); // Set {1, 2, 3}</pre></div></div></section></main>`,1))])}const k=o(i,[["render",p],["__scopeId","data-v-de713288"]]);export{k as default};
