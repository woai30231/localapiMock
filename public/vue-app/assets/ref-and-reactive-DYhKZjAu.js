import{_ as n,r as o,c as a,o as g,f as b,g as r,a as c,w as d,b as s}from"./index-DPbHrZ8z.js";const y={};function v(k,e){const t=o("el-title");return g(),a("div",null,[b("h2",null,[c(t,null,{default:d(()=>e[0]||(e[0]=[s("递归创建一个es6 Proxy对象",-1)])),_:1,__:[0]})]),e[1]||(e[1]=r(`<p data-v-86181b78> 相对于递归创建一个proxy，我先来实现一个不递归创建的Proxy对象，代码如下： </p><div class="code-block" data-v-86181b78><pre data-v-86181b78>                <code data-v-86181b78>
                    function createProxy(obj){
                        return new Proxy(obj,{
                            get(target,key){
                                console.log(&quot;监听到正在读值操作：target-&gt;&quot;+target+&#39;,key-&gt;&#39;+key)
                                return target[key];
                            },
                            set(target,key,value){
                                console.log(&quot;监听到正在写值操作：target-&gt;&quot;+target+&#39;,key-&gt;&#39;+key)
                                target[key] = value;
                            }
                        })
                    }
                </code>
            </pre></div><p data-v-86181b78>看一下调用效果：</p><div class="code-block" data-v-86181b78><pre data-v-86181b78>                <code data-v-86181b78>
                    &gt; const o = {name:&#39;obj&#39;,&#39;msg&#39;:{hobby:&#39;看书&#39;,age:20}}
                    undefined
                    &gt; const o1 = createProxy(o)
                    undefined
                    &gt; o1.name
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;name
                    &#39;obj&#39;
                    &gt; o1.name = &#39;newname&#39;
                    监听到正在写值操作：target-&gt;[object Object],key-&gt;name
                    &#39;newname&#39;
                    &gt; o1.msg.hobby
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    &#39;看书&#39;
                    &gt; o1.msg.hobby = &#39;爬山&#39;
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    &#39;爬山&#39;
                    &gt; 
                </code>
            </pre></div><p data-v-86181b78> 我们可以看到无论是新赋值或者读取深层次属性，只能监听到顶层属性的读写操作！这就会有问题了，如果我们通过es6解构的话，那么深层次的属性就不是个proxy对象，就无法监听读写操作，如下： </p><div class="code-block" data-v-86181b78><pre data-v-86181b78>                <code data-v-86181b78>
                    &gt; const {msg} = o1
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    undefined
                    &gt; msg.hobby
                    &#39;爬山&#39;
                    &gt; 
                </code>
            </pre></div><p data-v-86181b78>所以如果我们将来希望创建的代理对象内部所有属性将来解构出去的时候依然能监听读写操作，那么就需要深层次创建proxy的方法，于是写了一个方法如下：</p><div class="code-block" data-v-86181b78><pre data-v-86181b78>                <code data-v-86181b78>
                    function deepCreateProxy(obj){
                        for(let key in obj){
                        if(typeof obj[key] == &#39;object&#39;){
                            obj[key] = deepCreateProxy(obj[key]);
                        }
                        };
                        return new Proxy(obj,{
                            get(target,key){
                                console.log(&quot;监听到正在读值操作：target-&gt;&quot;+target+&#39;,key-&gt;&#39;+key)
                                return target[key];
                            },
                            set(target,key,value){
                                console.log(&quot;监听到正在写值操作：target-&gt;&quot;+target+&#39;,key-&gt;&#39;+key)
                                target[key] = value;
                            }
                        })
                    };
                </code>
            </pre></div><p data-v-86181b78>我们再看一下效果：</p><div class="code-block" data-v-86181b78><pre data-v-86181b78>                <code data-v-86181b78>
                    &gt; const o2 = deepCreateProxy(o)
                    undefined
                    &gt; o2.name
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;name
                    &#39;newname&#39;
                    &gt; o2.name = &#39;new-o2-name&#39;
                    监听到正在写值操作：target-&gt;[object Object],key-&gt;name
                    &#39;new-o2-name&#39;
                    &gt; o2.msg.hobby = &#39;游泳&#39;
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    监听到正在写值操作：target-&gt;[object Object],key-&gt;hobby
                    &#39;游泳&#39;
                    &gt; o2.msg.hobby
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;hobby
                    &#39;游泳&#39;
                    &gt; const {msg:msg1} = o2
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;msg
                    undefined
                    &gt; msg1.hobby
                    监听到正在读值操作：target-&gt;[object Object],key-&gt;hobby
                    &#39;游泳&#39;
                    &gt; msg1.hobby = &#39;游戏&#39;
                    监听到正在写值操作：target-&gt;[object Object],key-&gt;hobby
                    &#39;游戏&#39;
                    &gt; 
                </code>
            </pre></div><p data-v-86181b78>发现现在解构出来依然是个代理对象，能监听读写操作！这能做什么呢？这里类比vue3中的reactive创建的响应式对象，如果解构出深层次的对象依然是个响应式对象，可以直接用属性达到响应效果，但是前提是这个属性是引用值哈！</p><p data-v-86181b78>如果是解构出来是基础类值的话，那么就要用toRefs包一下，返回一个带value属性的响应对象。</p>`,12))])}const j=n(y,[["render",v],["__scopeId","data-v-86181b78"]]);export{j as default};
