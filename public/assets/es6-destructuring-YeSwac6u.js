import{e,c as d,g as c,o,_ as n}from"./index-BFWoMKAC.js";const t={class:"page-container"},s=e({__name:"es6-destructuring",setup(l){return(v,a)=>(o(),d("div",t,a[0]||(a[0]=[c(`<header class="page-header" data-v-4fd4ace5><h1 data-v-4fd4ace5>ES6 解构特性详解</h1><p data-v-4fd4ace5>简化数据提取的现代JavaScript语法</p></header><main class="main-content" data-v-4fd4ace5><section class="content-section" data-v-4fd4ace5><h2 data-v-4fd4ace5>什么是解构？</h2><p data-v-4fd4ace5> 解构是ES6（ECMAScript 2015）引入的一种新语法，允许我们从数组或对象中提取数据，并将提取的值赋值给变量， 从而使代码更简洁、更易读。 </p><p data-v-4fd4ace5> 简单来说，解构就是&quot;拆包&quot;——把数组或对象中的数据&quot;拆&quot;出来，直接赋值给变量，而不必通过索引或属性名逐个访问。 </p></section><section class="content-section" data-v-4fd4ace5><h2 data-v-4fd4ace5>数组解构</h2><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>基本用法</h3><p data-v-4fd4ace5>从数组中提取提取元素并并并并赋值并并赋值并并赋值给变量：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>// 传统方式
  const arr = [1, 2, 3];
  const a = arr[0];
  const b = arr[1];
  const c = arr[2];
  
  // 解构方式
  const [x, y, z] = [1, 2, 3];
  console.log(x); // 1
  console.log(y); // 2
  console.log(z); // 3</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>跳过元素</h3><p data-v-4fd4ace5>可以通过空位置跳过不需要的元素：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const [a, , b] = [10, 20, 30];
  console.log(a); // 10
  console.log(b); // 30</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>默认值</h3><p data-v-4fd4ace5>当提取的值不存在时，可以设置默认值：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>// 当数组长度不足时
  const [a, b, c = 3] = [1, 2];
  console.log(c); // 3
  
  // 当提取的值为undefined时
  const [d = 10] = [undefined];
  console.log(d); // 10</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>剩余元素</h3><p data-v-4fd4ace5>使用展开运算符<code data-v-4fd4ace5>...rest</code>获取剩余元素：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const [a, ...rest] = [1, 2, 3, 4, 5];
  console.log(a); // 1
  console.log(rest); // [2, 3, 4, 5]</pre></div></div></section><section class="content-section" data-v-4fd4ace5><h2 data-v-4fd4ace5>对象解构</h2><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>基本用法</h3><p data-v-4fd4ace5>从对象中提取属性并赋值给变量：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>// 传统方式
  const obj = { name: &#39;张三&#39;, age: 20 };
  const name = obj.name;
  const age = obj.age;
  
  // 解构方式
  const { name, age } = { name: &#39;张三&#39;, age: 20 };
  console.log(name); // &quot;张三&quot;
  console.log(age); // 20</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>重命名变量</h3><p data-v-4fd4ace5>可以为提取的属性指定不同的变量名：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const person = { name: &#39;李四&#39;, age: 25 };
  // 将name属性提取到变量username中
  const { name: username, age } = person;
  console.log(username); // &quot;李四&quot;
  console.log(age); // 25</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>默认值</h3><p data-v-4fd4ace5>当对象中没有对应的属性时，可以设置默认值：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const { name = &#39;默认名称&#39;, age = 18 } = { name: &#39;王五&#39; };
  console.log(name); // &quot;王五&quot;
  console.log(age); // 18</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>嵌套对象解构</h3><p data-v-4fd4ace5>可以解构嵌套的对象：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const user = {
    name: &#39;赵六&#39;,
    info: {
      address: &#39;北京&#39;,
      phone: &#39;123456789&#39;
    }
  };
  
  // 解构嵌套对象
  const { 
    name, 
    info: { address, phone } 
  } = user;
  
  console.log(name); // &quot;赵六&quot;
  console.log(address); // &quot;北京&quot;
  console.log(phone); // &quot;123456789&quot;</pre></div></div></section><section class="content-section" data-v-4fd4ace5><h2 data-v-4fd4ace5>其他常见用法</h2><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>函数参数解构</h3><p data-v-4fd4ace5>在函数参数中使用解构，使代码更简洁：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>// 传统方式
  function printUser(user) {
    console.log(user.name, user.age);
  }
  
  // 解构方式
  function printUser({ name, age }) {
    console.log(name, age);
  }
  
  // 带默认值的函数参数解构
  function printUser({ name = &#39;匿名&#39;, age = 0 } = {}) {
    console.log(name, age);
  }
  
  printUser({ name: &#39;孙七&#39;, age: 30 }); // 孙七 30</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>字符串解构</h3><p data-v-4fd4ace5>字符串也可以进行解构， treated as类数组对象：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>const [a, b, c, d] = &#39;hello&#39;;
  console.log(a); // &quot;h&quot;
  console.log(b); // &quot;e&quot;
  console.log(c); // &quot;l&quot;
  console.log(d); // &quot;l&quot;</pre></div></div><div class="example-block" data-v-4fd4ace5><h3 data-v-4fd4ace5>交换变量值</h3><p data-v-4fd4ace5>使用解构可以更简洁地交换变量值：</p><div class="code-block" data-v-4fd4ace5><pre data-v-4fd4ace5>// 传统方式
  let x = 1, y = 2;
  let temp = x;
  x = y;
  y = temp;
  
  // 解构方式
  let x = 1, y = 2;
  [x, y] = [y, x];
  console.log(x); // 2
  console.log(y); // 1</pre></div></div></section><section class="content-section summary-section" data-v-4fd4ace5><h2 data-v-4fd4ace5>总结</h2><ul data-v-4fd4ace5><li data-v-4fd4ace5>解构是ES6中非常实用的特性，可以简化数据提取过程</li><li data-v-4fd4ace5>数组解构按位置提取元素，对象解构按属性名提取</li><li data-v-4fd4ace5>支持默认值、重命名、嵌套解构等高级用法</li><li data-v-4fd4ace5>在函数参数、变量交换等场景中特别有用</li><li data-v-4fd4ace5>合理使用解构可以使代码更简洁、更易读</li></ul></section></main><footer class="page-footer" data-v-4fd4ace5><p data-v-4fd4ace5>ES6解构特性介绍 © 2023</p></footer>`,3)])))}}),i=n(s,[["__scopeId","data-v-4fd4ace5"]]);export{i as default};
