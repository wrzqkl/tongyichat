import express from 'express'; // 导入 Express 框架，用于构建 Web 服务器
import cors from 'cors'; // 导入 CORS 中间件，用于处理跨域请求
import OpenAI from 'openai'; // 导入 OpenAI 官方库，用于与 OpenAI API 交互
import { fileURLToPath } from 'url'; // 导入 url 模块的 fileURLToPath 函数，用于将文件 URL 转换为路径
import { dirname, join } from 'path'; // 导入 path 模块的 dirname 和 join 函数，用于处理文件和目录路径
console.log("==================服务器初始化开始==================");
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
console.log(`当前路径: ${_dirname}`);
const app = express(); // 创建一个 Express 应用
const port = process.env.PORT || 3000; // 设置服务器端口，默认为 3000 端口
console.log(`当前端口: ${port}`);
app.use(cors()); // 使用 CORS 中间件，允许跨域请求
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.static(join(_dirname, 'public'))); // 提供静态文件服务，默认目录为 public
console.log('中间层配置成功');
// 创建 OpenAI 实例，配置 API 密钥和基础 URL
const openai = new OpenAI({
    apiKey: "sk-e1c7036f643f439e9b223fcb41fa3649", 
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});
console.log("OpenAI实例创建成功");
// 定义一个POST路由，处理/api/chat接口的请求
app.post('/api/chat', async (req, res) => {
    console.log("------------收到聊天请求-------------");
    console.log(`请求时间: ${new Date().toLocaleString()}`);
    try {
        const { messages } = req.body; // 从请求体中获取消息数组
        console.log('接收到的消息：', messages);//打印接收到的消息
        const completion = await openai.chat.completions.create({
            model: "qwen-plus", // 使用的模型
            messages: [
                { role: "system", content: "You are a helpful assistant." },
               ...messages // 将请求体中的消息添加到模型输入中
            ]
        });
        console.log("AI接口调用成功");
        const aiResponse = completion.choices[0].message.content; // 获取 AI 的回复内容
        const aiRole = completion.choices[0].message.role; // 获取 AI 的角色
        console.log(`AI回复内容:${aiRole};${aiResponse.substring(0, 50)}...`); // 打印AI的回复内容(截取前50个字符)
        res.json({
            message: aiResponse,
            role: aiRole
        }); // 将AI的回复内容和角色作为JSON响应返回
        console.log('AI回复已发送给用户浏览器');
    } catch (error) {
        console.error("AI接口调用失败:", error);
    }
});

app.listen(port, () => {
    console.log(`服务器正在监听端口 ${port}`);
    console.log(`地址: http://localhost:${port}`);
});

