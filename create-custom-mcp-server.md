# 如何为任何服务创建 MCP 服务器

## 问题：其他工具没有提供 MCP 怎么办？

**答案：自己创建一个 MCP 服务器来封装它们的 API！**

MCP 服务器本质上就是一个**中间层程序**，负责：
1. 接收 Claude Code 的请求
2. 调用第三方 API（OpenAI、Google、任何 HTTP API）
3. 返回结果给 Claude Code

## 方案 1: 创建简单的 MCP 服务器（推荐）

### 示例：为 OpenAI 创建 MCP 服务器

```typescript
// openai-mcp-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 创建 MCP 服务器
const server = new Server(
  {
    name: "openai-integration",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义可用的工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ask_gpt4",
        description: "向 GPT-4 提问",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "要问的问题",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generate_image",
        description: "使用 DALL-E 生成图片",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "图片描述",
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "ask_gpt4") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: args.prompt }],
    });

    return {
      content: [
        {
          type: "text",
          text: completion.choices[0].message.content,
        },
      ],
    };
  }

  if (name === "generate_image") {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: args.prompt,
      n: 1,
      size: "1024x1024",
    });

    return {
      content: [
        {
          type: "text",
          text: `图片已生成: ${response.data[0].url}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenAI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

### package.json

```json
{
  "name": "openai-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "openai": "^4.0.0"
  },
  "bin": {
    "openai-mcp-server": "./build/index.js"
  }
}
```

## 方案 2: 更简单的 Python MCP 服务器

```python
# simple_ai_mcp_server.py
import asyncio
import json
import sys
from typing import Any
import httpx

class SimpleMCPServer:
    def __init__(self):
        self.tools = {
            "call_any_api": self.call_any_api,
            "ask_chatgpt": self.ask_chatgpt,
        }

    async def call_any_api(self, url: str, method: str = "GET", data: dict = None):
        """调用任何 HTTP API"""
        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(url)
            elif method == "POST":
                response = await client.post(url, json=data)
            return response.json()

    async def ask_chatgpt(self, prompt: str):
        """调用 ChatGPT API"""
        import os
        api_key = os.getenv("OPENAI_API_KEY")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4",
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def handle_request(self, request: dict) -> dict:
        """处理 MCP 请求"""
        method = request.get("method")

        if method == "tools/list":
            return {
                "tools": [
                    {
                        "name": "call_any_api",
                        "description": "调用任何 HTTP API",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "url": {"type": "string"},
                                "method": {"type": "string"},
                                "data": {"type": "object"}
                            }
                        }
                    },
                    {
                        "name": "ask_chatgpt",
                        "description": "向 ChatGPT 提问",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "prompt": {"type": "string"}
                            }
                        }
                    }
                ]
            }

        elif method == "tools/call":
            tool_name = request["params"]["name"]
            arguments = request["params"]["arguments"]

            if tool_name in self.tools:
                result = await self.tools[tool_name](**arguments)
                return {
                    "content": [
                        {"type": "text", "text": str(result)}
                    ]
                }

        return {"error": "Unknown method"}

    async def run(self):
        """运行服务器（通过 stdio 通信）"""
        while True:
            line = await asyncio.get_event_loop().run_in_executor(
                None, sys.stdin.readline
            )
            if not line:
                break

            request = json.loads(line)
            response = await self.handle_request(request)

            print(json.dumps(response), flush=True)

if __name__ == "__main__":
    server = SimpleMCPServer()
    asyncio.run(server.run())
```

## 方案 3: 无需 MCP，直接代码集成（最简单）

如果觉得创建 MCP 服务器太复杂，**直接在项目代码中调用 API**：

```python
# ai_services.py
import os
import requests

class AIServices:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    def ask_gpt4(self, prompt: str) -> str:
        """调用 GPT-4"""
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {self.openai_key}"},
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        return response.json()["choices"][0]["message"]["content"]

    def ask_claude(self, prompt: str) -> str:
        """调用 Claude"""
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": self.anthropic_key,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        return response.json()["content"][0]["text"]

    def ask_local_llama(self, prompt: str) -> str:
        """调用本地 Ollama 模型"""
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama2",
                "prompt": prompt
            }
        )
        return response.json()["response"]

# 使用示例
ai = AIServices()
gpt_answer = ai.ask_gpt4("What is Python?")
claude_answer = ai.ask_claude("What is Python?")
local_answer = ai.ask_local_llama("What is Python?")
```

## 对比三种方案

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **自建 MCP 服务器** | 与 Claude Code 深度集成，可在对话中直接调用 | 需要额外开发 | 频繁在 Claude Code 中调用其他 AI |
| **Python MCP 服务器** | 简单易懂，快速开发 | 功能可能有限 | 快速原型和测试 |
| **直接 API 集成** | 最简单，直接有效 | 不能在对话中直接使用 | 项目代码需要调用多个 AI |

## 推荐做法

**对于大多数情况，直接 API 集成就够了！**

只有当你需要在 Claude Code 的对话中频繁调用其他 AI 时，才需要创建 MCP 服务器。

## 现成的 MCP 服务器示例

GitHub 上有很多开源的 MCP 服务器实现：

```bash
# 克隆一个 MCP 服务器模板
git clone https://github.com/modelcontextprotocol/servers.git
cd servers/src/fetch  # HTTP 请求服务器
npm install
npm run build
```

你可以基于这些模板修改，添加对任何 API 的支持。
