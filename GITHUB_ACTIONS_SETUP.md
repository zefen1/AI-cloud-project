# GitHub Actions 自动任务通知配置

## 工作原理（无需 API Key！）

这个方案**不需要调用 Claude API**，完全在你的云环境中运行：

```
用户更新 task.md
    ↓
GitHub Actions 检测到变化
    ↓
创建任务通知文件 (.claude/tasks/pending-task.json)
    ↓
提交通知文件到仓库
    ↓
你的云环境中的 Claude Code 检测到通知
    ↓
自动执行任务
    ↓
创建 PR
```

---

## 配置步骤

### 1. 启用 GitHub Actions 写权限

1. 进入仓库 **Settings** → **Actions** → **General**
2. **Workflow permissions** 设置为 **Read and write permissions**
3. ✅ 保存

**就这样！不需要 API Key！**

---

## 使用方法

### 方式 1: 自动检测（推荐）

我（Claude Code）会在每次对话时自动检查：

```python
# 我会自动运行
python check_pending_tasks.py
```

如果有待处理任务，我会：
1. 显示任务内容
2. 询问是否执行
3. 执行任务
4. 创建 PR

### 方式 2: 手动触发

你也可以主动问我：

```
"有待处理的任务吗？"
"执行待处理的任务"
"检查 task.md"
```

---

## 完整流程示例

### 1. 你更新任务

```bash
echo "创建一个用户登录页面" > task.md
git add task.md
git commit -m "新任务：用户登录"
git push
```

### 2. GitHub Actions 自动运行

```
✅ 检测到 task.md 更新
📝 创建通知文件: .claude/tasks/pending-task.json
💾 提交并推送
```

### 3. 你拉取更新

```bash
git pull
```

### 4. 告诉我执行

```
你: "执行任务"

我: 检测到任务...
    🔔 发现待处理的任务！
    📋 任务: 创建一个用户登录页面
    🤖 开始执行...
    [创建代码...]
    ✅ 完成！已创建 PR
```

---

## 工作流程图

```
┌─────────────────────────────────────────────┐
│  用户更新 task.md 并 push                   │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  GitHub Actions 触发                        │
│  - 检测 task.md 变化                        │
│  - 创建 .claude/tasks/pending-task.json    │
│  - 提交回仓库                               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  用户在云环境中                              │
│  - git pull 拉取通知                        │
│  - 告诉 Claude Code: "执行任务"            │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Claude Code (在云环境中)                    │
│  - 读取 pending-task.json                   │
│  - 分析任务内容                              │
│  - 生成代码                                  │
│  - 创建功能分支                              │
│  - 提交代码                                  │
│  - 创建 Pull Request                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  用户审核 PR 并合并                          │
└─────────────────────────────────────────────┘
```

---

## 优势

### ✅ 完全免费
- 不需要调用 Claude API
- 只用 GitHub Actions（免费额度足够）
- 在你现有的云环境中运行

### ✅ 无需额外配置
- 不需要 API Key
- 不需要 Secrets
- 只需启用 Actions 写权限

### ✅ 安全可控
- 代码在你的环境中执行
- 你可以审核每一步
- 通过 PR 机制控制合并

### ✅ 灵活
- 可以手动触发
- 可以批量处理
- 可以暂停或跳过

---

## 文件说明

### `.github/workflows/auto-execute-task.yml`
GitHub Actions 工作流，负责：
- 检测 task.md 变化
- 创建任务通知文件
- 提交回仓库

### `check_pending_tasks.py`
Python 脚本，我（Claude Code）用来：
- 检查是否有待处理任务
- 显示任务详情
- 标记任务状态

### `.claude/tasks/pending-task.json`
任务通知文件（由 GitHub Actions 创建）：
```json
{
  "timestamp": "2026-01-07T14:30:00Z",
  "commit": "abc1234",
  "author": "用户名",
  "status": "pending",
  "task_content": "创建一个用户登录页面"
}
```

### `.claude/tasks/history/`
已完成任务的历史记录

---

## 对比其他方案

| 方案 | API 调用 | 成本 | 执行环境 | 控制度 |
|------|---------|------|----------|---------|
| **当前方案** | ❌ 无 | 免费 | 你的云环境 | ⭐⭐⭐⭐⭐ |
| API 方案 | ✅ 有 | 按量付费 | GitHub Actions | ⭐⭐⭐ |
| 监控脚本 | ❌ 无 | 免费 | 本地 | ⭐⭐⭐⭐ |

---

## 常见问题

### Q: 为什么不直接在 GitHub Actions 中执行任务？
A: 因为 GitHub Actions 环境是临时的，而你的云环境：
- 已经配置好所有依赖
- 可以直接访问项目文件
- 我（Claude Code）可以直接执行
- 更灵活可控

### Q: 如果我不在云环境怎么办？
A: 任务会一直等待。下次你进入云环境时：
1. git pull 拉取通知
2. 告诉我执行任务
3. 或者运行 `python check_pending_tasks.py`

### Q: 可以自动执行吗？不用我说"执行任务"？
A: 可以！我可以在每次对话开始时自动检查并询问你。

### Q: 任务会丢失吗？
A: 不会。任务通知保存在 Git 仓库中，完成后会归档到 history/ 目录。

---

## 测试步骤

1. **合并这个 PR**

2. **启用 Actions 写权限**
   - Settings → Actions → General
   - Workflow permissions → Read and write

3. **测试任务创建**
   ```bash
   echo "测试：创建一个 Hello World 页面" > task.md
   git add task.md
   git commit -m "test: 测试任务"
   git push
   ```

4. **查看 Actions**
   - 进入 Actions 标签
   - 看到 "检测任务更新并通知" 运行

5. **拉取并执行**
   ```bash
   git pull
   python check_pending_tasks.py
   # 或直接告诉我: "执行任务"
   ```

---

## 进阶配置

### 自动检查（启动时）

可以在 Claude Code 启动脚本中添加：

```bash
#!/bin/bash
cd /home/user/AI-cloud-project
git pull
python check_pending_tasks.py
```

### 定期检查（Cron）

```bash
# 每 10 分钟检查一次
*/10 * * * * cd /home/user/AI-cloud-project && git pull && python check_pending_tasks.py
```

### 通知集成

可以在 GitHub Actions 中添加通知：

```yaml
- name: 发送通知
  run: |
    # 发送到 Slack/Discord/邮件
    curl -X POST webhook-url -d '{"text": "新任务！"}'
```
