# 多人多 AI 协作指南

## 团队成员使用不同 AI 工具

### 支持的 AI 工具

团队成员可以使用任何 AI 工具，只要能访问 Git 仓库：

| 团队成员 | AI 工具 | 工作环境 | 协作方式 |
|---------|---------|----------|----------|
| 你 | Claude Code | 当前云环境 | 主分支开发 + 代码审核 |
| 同事A | Gemini | 自己的云环境/本地 | 功能分支开发 |
| 同事B | GitHub Copilot | VS Code 本地 | 功能分支开发 |
| 同事C | ChatGPT | 网页/本地 | 功能分支开发 |

## 协作流程

### 1. 初始设置（每个成员）

```bash
# 克隆仓库
git clone https://github.com/zefen1/AI-cloud-project.git
cd AI-cloud-project

# 设置用户信息
git config user.name "你的名字"
git config user.email "your@email.com"
```

### 2. 开始新功能（每个成员）

```bash
# 创建功能分支
git checkout -b feature/描述性名称

# 例如：
git checkout -b feature/user-authentication
git checkout -b feature/api-optimization
git checkout -b feature/ui-improvements
```

### 3. 使用各自的 AI 工具开发

**使用 Gemini 的同事：**
```
1. 在 Google AI Studio 或集成了 Gemini 的 IDE 中
2. 让 Gemini 帮忙写代码
3. 保存文件
```

**使用 Claude Code 的你：**
```
1. 在当前云环境对话
2. 让我帮你写代码
3. 代码自动保存
```

**使用 Copilot 的同事：**
```
1. 在 VS Code 中
2. Copilot 自动补全
3. 保存文件
```

### 4. 提交和推送

```bash
# 查看改动
git status
git diff

# 提交代码
git add .
git commit -m "功能描述：具体做了什么"

# 推送到远程
git push origin feature/你的分支名

# 如果是第一次推送
git push -u origin feature/你的分支名
```

### 5. 创建 Pull Request

```bash
# 方式 1: 使用 gh 命令
gh pr create --title "功能标题" --body "详细描述"

# 方式 2: 在 GitHub 网页上
# 访问仓库 → Pull Requests → New Pull Request
```

### 6. 代码审核（由 Claude Code 负责）

当有新的 PR 时，监控系统会检测到：

```
🔔 新的 Pull Request！
PR #123: 添加用户认证功能 (by 同事A, 使用 Gemini)

审核负责人: Claude Code
```

我会：
1. ✅ 检查代码质量
2. ✅ 运行测试
3. ✅ 检查安全问题
4. ✅ 提出改进建议
5. ✅ 批准或请求修改

## 分支策略

```
main (主分支)
  ├─ claude/init-xiang-project-T21mI  ← 你当前的分支
  ├─ feature/gemini-auth              ← Gemini 用户的功能
  ├─ feature/copilot-api              ← Copilot 用户的功能
  └─ feature/chatgpt-ui               ← ChatGPT 用户的功能
```

### 分支命名规范

- `feature/功能名` - 新功能
- `bugfix/问题描述` - Bug 修复
- `refactor/重构内容` - 代码重构
- `docs/文档内容` - 文档更新

## 冲突解决

### 当出现合并冲突时

```bash
# 1. 拉取最新的主分支
git checkout main
git pull origin main

# 2. 回到你的功能分支
git checkout feature/你的分支

# 3. 合并主分支（或 rebase）
git merge main
# 或
git rebase main

# 4. 解决冲突
# 编辑有冲突的文件，解决 <<<< ==== >>>> 标记

# 5. 继续
git add .
git commit -m "解决合并冲突"
git push
```

## 实际协作示例

### 例子 1: Gemini 用户提交代码

```bash
# 同事 (使用 Gemini)
$ git checkout -b feature/login-page
$ # 使用 Gemini 生成登录页面代码
$ git add login.html login.css
$ git commit -m "添加登录页面 (Gemini生成)"
$ git push origin feature/login-page
$ gh pr create --title "登录页面" --body "使用 Gemini 生成的登录界面"
```

```bash
# 你的监控系统
🔔 发现新提交！
📝 提交: abc1234
   作者: 同事A
   信息: 添加登录页面 (Gemini生成)
   文件: login.html, login.css
```

```
你: "审核这个登录页面的 PR"

我 (Claude Code):
好的，让我检查...
1. ✅ HTML 结构良好
2. ✅ CSS 样式规范
3. ⚠️  缺少表单验证
4. ⚠️  建议添加 CSRF 保护

建议：
- 添加客户端表单验证
- 添加 CSRF token
- 改进无障碍支持

整体评分: 7/10
需要小修改后可以合并
```

### 例子 2: 多人同时开发

```
时间线：

10:00 - 你 (Claude) 在 main 分支工作
10:30 - 同事A (Gemini) 创建 feature/auth 分支
11:00 - 同事B (Copilot) 创建 feature/api 分支
11:30 - 同事A 提交 PR #1
12:00 - 监控系统通知你
12:10 - 你让我审核 PR #1
12:20 - 我批准，合并到 main
12:30 - 同事B 提交 PR #2
12:40 - 监控系统通知你
12:50 - 你让我审核 PR #2
```

## 通信渠道

### 代码层面
- Git commits
- Pull Requests
- Code reviews

### 团队沟通
- Slack/Discord - 日常讨论
- GitHub Issues - 任务跟踪
- GitHub Discussions - 技术讨论

## 最佳实践

### ✅ 推荐做法

1. **频繁提交** - 小步快跑，及时提交
2. **清晰的提交信息** - 说明做了什么和为什么
3. **及时同步** - 经常 pull 主分支的更新
4. **功能分支** - 一个分支只做一件事
5. **代码审核** - 所有代码都要经过审核

### ❌ 避免的问题

1. 不要直接推送到 main
2. 不要提交大量未测试的代码
3. 不要忽略合并冲突
4. 不要提交敏感信息（密码、密钥等）
5. 不要在 PR 中混入无关的修改

## AI 工具使用建议

### 对于 Gemini 用户

```python
# 提示词示例
"使用 Python 创建一个用户认证 API，
要求：
- 使用 JWT token
- 密码加密存储
- 包含登录和注册端点
- 添加单元测试"
```

### 对于 Claude Code 用户 (你)

```
"审核最新的 PR，检查：
- 代码质量
- 安全问题
- 性能问题
- 测试覆盖率"
```

### 对于 Copilot 用户

```python
# 通过注释引导 Copilot
# Create a function to validate email addresses
# Returns True if valid, False otherwise
def validate_email(email: str) -> bool:
    # Copilot 会自动补全
```

## 监控和通知

当前监控系统会自动检测：
- ✅ 新的提交
- ✅ 新的分支
- ✅ 新的 Pull Request
- ✅ 文件变化

检测到变化后，你可以：
1. 让 Claude Code 审核
2. 运行自动化测试
3. 检查代码质量
4. 合并到主分支

## 总结

**核心原则：**
1. 不同 AI 工具的用户在各自的环境工作
2. 通过 Git 仓库共享代码
3. 通过 Pull Request 协作和审核
4. 监控系统自动检测变化
5. Claude Code 负责代码审核和质量把关

**不需要：**
- ❌ 共享同一个云环境
- ❌ 同时使用同一个 AI
- ❌ 直接访问彼此的电脑

**只需要：**
- ✅ 访问同一个 Git 仓库
- ✅ 遵循分支和 PR 流程
- ✅ 使用各自喜欢的 AI 工具
