# AI 服务集成示例

## 1. OpenAI API 集成

```python
import openai

openai.api_key = "your-api-key"

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)
```

## 2. Anthropic Claude API 集成

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)
```

## 3. Google Gemini API 集成

```python
import google.generativeai as genai

genai.configure(api_key="your-api-key")
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content("Hello")
```

## 4. 本地 AI 模型（Ollama）

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 运行本地模型
ollama run llama2
```

```python
import requests

response = requests.post('http://localhost:11434/api/generate',
    json={
        "model": "llama2",
        "prompt": "Hello"
    })
```

## 5. MCP (Model Context Protocol) 服务器

Claude Code 支持 MCP 协议，可以连接到其他 AI 服务。

配置文件示例：
```json
{
  "mcpServers": {
    "custom-ai-service": {
      "command": "node",
      "args": ["path/to/mcp-server.js"]
    }
  }
}
```
