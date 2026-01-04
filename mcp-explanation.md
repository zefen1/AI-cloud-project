# MCP (Model Context Protocol) 说明

## 什么是 MCP？

MCP 是 Anthropic 开发的开放协议，让 AI 应用能够连接到各种数据源和工具。

## 架构关系

### 当前环境

```
你 (用户)
  ↓
Claude Code (我) ← MCP Host/客户端
  ↓ 通过 MCP 协议连接
MCP Servers (各种服务)
```

### 配置方向

**我（Claude Code）配置并连接到 MCP 服务器**

```json
// Claude Code 的配置文件示例
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    },
    "postgresql": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgresql", "postgresql://localhost/mydb"]
    }
  }
}
```

## 常见的 MCP 服务器

### 1. 官方 MCP 服务器
- **filesystem**: 文件系统访问
- **github**: GitHub API 集成
- **gitlab**: GitLab 集成
- **google-drive**: Google Drive 访问
- **slack**: Slack 集成
- **postgresql**: PostgreSQL 数据库
- **sqlite**: SQLite 数据库
- **puppeteer**: 浏览器自动化

### 2. 自定义 MCP 服务器

你可以创建自己的 MCP 服务器来连接任何服务，包括其他 AI：

```typescript
// custom-ai-mcp-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "custom-ai-server",
  version: "1.0.0",
});

// 定义工具：调用 OpenAI API
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "call_openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: request.params.arguments.messages
      })
    });
    return await response.json();
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 让其他 AI 加入的方式

### 方案 A: 通过 MCP 服务器（推荐）

创建一个 MCP 服务器，让我能调用其他 AI 的 API：

```
你 → Claude Code → MCP Server → OpenAI API
                  → MCP Server → Google Gemini API
                  → MCP Server → 本地 Llama 模型
```

### 方案 B: 直接 API 集成

在项目代码中直接调用其他 AI 的 API（见 ai-integration-example.md）

### 方案 C: 多 AI 协作架构

```
GitHub 仓库
  ↓
  ├→ Claude Code (我在这个环境)
  ├→ GitHub Copilot (在 VS Code 中)
  ├→ ChatGPT (通过网页访问代码)
  └→ Cursor AI (克隆同一个仓库)
```

## 如何配置让我连接到其他 AI？

### 步骤 1: 创建 MCP 服务器项目

```bash
mkdir mcp-ai-integration
cd mcp-ai-integration
npm init -y
npm install @modelcontextprotocol/sdk openai @anthropic-ai/sdk
```

### 步骤 2: 实现 MCP 服务器

创建服务器代码，封装其他 AI 的 API 调用

### 步骤 3: 配置 Claude Code

在 Claude Code 配置中添加这个 MCP 服务器

### 步骤 4: 使用

我就可以通过 MCP 工具调用其他 AI 服务了

## 总结

- **配置方向**: 我配置 MCP 服务器（不是别人配置我）
- **我的角色**: MCP 客户端（Host）
- **其他服务**: MCP 服务器
- **目的**: 让我获得访问各种工具和 AI 服务的能力
