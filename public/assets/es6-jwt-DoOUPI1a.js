import{_ as t,c as d,o as e,g as n}from"./index-Cr-NJ8us.js";const s={name:"JwtDocumentation",mounted(){document.documentElement.setAttribute("lang","zh-CN")}},c={class:"jwt-doc"};function o(i,a,r,l,v,u){return e(),d("div",c,a[0]||(a[0]=[n(`<header data-v-739d1c02><h1 data-v-739d1c02>JWT 认证机制详解</h1><p class="intro" data-v-739d1c02>基于 JSON 的轻量级身份认证方案</p></header><section class="principle" data-v-739d1c02><h2 data-v-739d1c02>一、JWT 实现原理</h2><p data-v-739d1c02>JWT（JSON Web Token）由三部分组成，通过 <code data-v-739d1c02>.</code> 连接，结构为：<strong data-v-739d1c02>Header.Payload.Signature</strong></p><div class="structure" data-v-739d1c02><div class="part" data-v-739d1c02><h3 data-v-739d1c02>1. Header（头部）</h3><p data-v-739d1c02>声明算法和令牌类型，经 Base64Url 编码</p><pre class="code-block" data-v-739d1c02>{
    &quot;alg&quot;: &quot;RS256&quot;,  // 签名算法（HMAC/ RSA等）
    &quot;typ&quot;: &quot;JWT&quot;     // 令牌类型
  }</pre></div><div class="part" data-v-739d1c02><h3 data-v-739d1c02>2. Payload（负载）</h3><p data-v-739d1c02>存储用户信息（非敏感数据），经 Base64Url 编码（<span class="warning" data-v-739d1c02>注意：仅编码未加密！</span>）</p><pre class="code-block" data-v-739d1c02>{
    &quot;sub&quot;: &quot;123456&quot;,  // 主题（用户ID）
    &quot;name&quot;: &quot;张三&quot;,   // 自定义字段
    &quot;role&quot;: &quot;user&quot;,   // 权限角色
    &quot;exp&quot;: 1689000000 // 过期时间（时间戳）
  }</pre></div><div class="part" data-v-739d1c02><h3 data-v-739d1c02>3. Signature（签名）</h3><p data-v-739d1c02>通过密钥对前两部分加密生成，用于验证令牌有效性</p><pre class="code-block" data-v-739d1c02>// 伪代码
  signature = 加密算法(
    Base64Url(Header) + &quot;.&quot; + Base64Url(Payload),
    服务器私钥
  )</pre></div></div><p class="flow-title" data-v-739d1c02>完整认证流程：</p><ol class="flow" data-v-739d1c02><li data-v-739d1c02>用户登录 → 服务器验证通过 → 生成 JWT 并返回</li><li data-v-739d1c02>客户端存储 JWT（localStorage/ Cookie）</li><li data-v-739d1c02>后续请求携带 JWT（如：Authorization: Bearer &lt;token&gt;）</li><li data-v-739d1c02>服务器验证 JWT 签名 → 解析用户信息 → 授权访问</li></ol></section><section class="scenario" data-v-739d1c02><h2 data-v-739d1c02>二、使用场景与优劣势</h2><div class="scenario-content" data-v-739d1c02><div class="scenario-item" data-v-739d1c02><h3 data-v-739d1c02>适用场景</h3><ul data-v-739d1c02><li data-v-739d1c02>前后端分离项目（SPA）的身份认证</li><li data-v-739d1c02>微服务架构中的跨服务身份传递</li><li data-v-739d1c02>第三方登录授权（如 OAuth 2.0 流程）</li></ul></div><div class="scenario-item" data-v-739d1c02><h3 data-v-739d1c02>优势</h3><ul data-v-739d1c02><li data-v-739d1c02>无状态：服务器无需存储会话，便于集群扩展</li><li data-v-739d1c02>自包含：令牌包含用户信息，减少数据库查询</li><li data-v-739d1c02>跨域支持：可在不同域名间安全传递</li></ul></div><div class="scenario-item" data-v-739d1c02><h3 data-v-739d1c02>劣势</h3><ul data-v-739d1c02><li data-v-739d1c02>无法主动撤销：令牌颁发后在有效期内始终有效</li><li data-v-739d1c02>Payload 可解码：不能存储敏感信息（如密码）</li><li data-v-739d1c02>令牌体积可能过大：影响传输效率</li></ul></div></div></section><section class="security-warning" data-v-739d1c02><h2 data-v-739d1c02>三、重要安全提示</h2><div class="warning-box" data-v-739d1c02><p data-v-739d1c02><strong data-v-739d1c02>⚠️ JWT 只保证认证安全，不保证传输数据安全！</strong></p><p data-v-739d1c02>原因：</p><ul data-v-739d1c02><li data-v-739d1c02>Header 和 Payload 仅通过 Base64Url 编码（可逆转换），任何人都能解码查看内容</li><li data-v-739d1c02>Signature 仅确保数据未被篡改，但无法防止数据被窃取</li></ul><p data-v-739d1c02>解决方案：</p><ul data-v-739d1c02><li data-v-739d1c02>传输敏感数据必须使用 HTTPS 加密通道</li><li data-v-739d1c02>Payload 中禁止存放密码、令牌等敏感信息</li></ul></div></section><section class="code-example" data-v-739d1c02><h2 data-v-739d1c02>四、Node.js 后端关键代码示例</h2><div class="code-tabs" data-v-739d1c02><div class="code-tab" data-v-739d1c02><h3 data-v-739d1c02>1. 生成 JWT（登录接口）</h3><pre class="code-block" data-v-739d1c02>const jwt = require(&#39;jsonwebtoken&#39;);
  const fs = require(&#39;fs&#39;);
  const express = require(&#39;express&#39;);
  const app = express();
  
  // 解析JSON请求体
  app.use(express.json());
  
  // 读取私钥（用于签名）
  const privateKey = fs.readFileSync(&#39;./private.key&#39;, &#39;utf8&#39;);
  
  // 登录接口
  app.post(&#39;/login&#39;, (req, res) =&gt; {
    const { username, password } = req.body;
    
    // 1. 验证用户名密码（实际项目需查询数据库）
    if (username === &#39;admin&#39; &amp;&amp; password === &#39;123456&#39;) {
      // 2. 生成 JWT
      const token = jwt.sign(
        { 
          userId: 1, 
          username: &#39;admin&#39;, 
          role: &#39;admin&#39;  // 权限信息
        },
        privateKey,
        { 
          algorithm: &#39;RS256&#39;,  // 使用 RSA 算法
          expiresIn: &#39;1h&#39;     // 1小时后过期
        }
      );
      
      res.json({ token });
    } else {
      res.status(401).json({ message: &#39;账号密码错误&#39; });
    }
  });</pre></div><div class="code-tab" data-v-739d1c02><h3 data-v-739d1c02>2. 验证 JWT（中间件）</h3><pre class="code-block" data-v-739d1c02>// 读取公钥（用于验证）
  const publicKey = fs.readFileSync(&#39;./public.key&#39;, &#39;utf8&#39;);
  
  // JWT 验证中间件
  const authMiddleware = (req, res, next) =&gt; {
    // 1. 获取请求头中的 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(&#39;Bearer &#39;)) {
      return res.status(401).json({ message: &#39;未提供令牌&#39; });
    }
    const token = authHeader.split(&#39; &#39;)[1];
    
    try {
      // 2. 验证 token 并解析用户信息
      const decoded = jwt.verify(token, publicKey, {
        algorithms: [&#39;RS256&#39;]  // 强制指定算法（防攻击）
      });
      
      // 3. 将用户信息挂载到请求对象
      req.user = decoded;
      next(); // 验证通过，进入接口处理
    } catch (err) {
      res.status(403).json({ message: &#39;令牌无效或已过期&#39; });
    }
  };
  
  // 使用中间件保护接口
  app.get(&#39;/admin/data&#39;, authMiddleware, (req, res) =&gt; {
    // 从 req.user 中获取用户信息
    if (req.user.role !== &#39;admin&#39;) {
      return res.status(403).json({ message: &#39;权限不足&#39; });
    }
    res.json({ data: &#39;管理员专属数据&#39; });
  });
  
  // 启动服务器
  app.listen(3000, () =&gt; {
    console.log(&#39;服务器运行在 http://localhost:3000&#39;);
  });</pre></div></div></section>`,5)]))}const h=t(s,[["render",o],["__scopeId","data-v-739d1c02"]]);export{h as default};
