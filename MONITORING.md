# 项目变化监控指南

## 问题：如何监控其他人的代码提交？

当多人协作时，你需要知道：
- 谁提交了代码？
- 改了什么文件？
- 何时提交的？

## 解决方案

### 方案 1: 手动检查（最简单）

```bash
# 拉取最新代码
git fetch origin

# 查看其他人的提交
git log origin/main..HEAD --oneline

# 查看具体改了什么
git diff origin/main
```

### 方案 2: 使用监控脚本（推荐）

我已经创建了 `monitor.py` 脚本来自动监控项目变化。

#### 单次检查

```bash
python monitor.py
```

输出示例：
```
============================================================
⏰ 监控时间: 2026-01-07 10:30:00
============================================================

🔄 检查远程更新...

🔔 发现 2 个新提交！

📝 提交: a1b2c3d
   作者: 张三 <zhangsan@example.com>
   时间: 2026-01-07 09:15:00
   信息: 修复登录 bug
   文件: auth/login.py, tests/test_auth.py

📝 提交: e4f5g6h
   作者: 李四 <lisi@example.com>
   时间: 2026-01-07 09:45:00
   信息: 添加用户管理功能
   文件: users/manager.py, users/models.py
```

#### 持续监控模式

```bash
# 每 60 秒检查一次
python monitor.py watch 60

# 每 5 分钟检查一次
python monitor.py watch 300
```

### 方案 3: Git Hooks（自动触发）

在其他人 push 代码后自动运行检查。

创建 `.git/hooks/post-receive` 文件：

```bash
#!/bin/bash
# 当收到新的 push 时执行

echo "收到新的提交，运行监控..."
python monitor.py
```

### 方案 4: 定时任务（Cron）

让系统定期自动检查：

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每 10 分钟检查一次）
*/10 * * * * cd /home/user/AI-cloud-project && python monitor.py >> monitor.log 2>&1
```

## 与 AI 监工集成

修改 `ai_team.py`，让监工 AI 检查他人的提交：

```python
from monitor import ProjectMonitor

class AITeam:
    def __init__(self):
        # ... 原有代码 ...
        self.monitor = ProjectMonitor()

    def supervisor_check_updates(self):
        """监工检查团队成员的提交"""
        print("\n🔍 [监工] 检查团队成员的提交...")

        has_changes = self.monitor.monitor_once()

        if has_changes:
            print("\n👀 [监工] 发现新提交，准备审核...")
            # 这里可以调用代码审核逻辑
            self.review_team_commits()

    def review_team_commits(self):
        """审核团队成员的代码"""
        # 获取最近的提交
        result = subprocess.run(
            ["git", "log", "-1", "--name-only", "--pretty=format:%H|%an|%s"],
            capture_output=True,
            text=True
        )

        if result.stdout:
            lines = result.stdout.strip().split('\n')
            commit_info = lines[0].split('|')
            changed_files = lines[1:]

            print(f"\n审核提交: {commit_info[0][:7]}")
            print(f"作者: {commit_info[1]}")
            print(f"信息: {commit_info[2]}")

            # 对每个文件进行审核
            for file in changed_files:
                if file.endswith('.py'):
                    print(f"\n检查文件: {file}")
                    # 这里可以调用 linter、测试等
```

## 实时协作工作流

### 完整流程

```
1. 后台运行监控
   python monitor.py watch 60 &

2. 发现新提交
   → 监控脚本检测到变化
   → 记录到 changes_log.json

3. 手动或自动触发审核
   → 运行 AI 监工审核代码
   → 如果有问题，通知提交者

4. 继续开发
   → 监控循环继续...
```

## 通知方式

### 选项 1: 终端输出

```bash
# 在一个终端持续监控
python monitor.py watch 60
```

### 选项 2: 日志文件

```bash
# 输出到日志文件
python monitor.py watch 60 > monitor.log 2>&1 &

# 实时查看日志
tail -f monitor.log
```

### 选项 3: 邮件/Slack 通知（扩展）

可以修改 `monitor.py`，添加通知功能：

```python
def send_notification(commit):
    """发送通知到 Slack/Email"""
    # 发送 Slack 消息
    import requests
    webhook_url = "your-slack-webhook"
    requests.post(webhook_url, json={
        "text": f"新提交: {commit['subject']} by {commit['author']}"
    })
```

## 我（Claude Code）的角色

当你和我对话时，我会：

1. **主动检查更新**
   ```python
   git fetch origin
   git log --oneline -5
   ```

2. **分析新提交**
   - 谁提交的？
   - 改了什么？
   - 是否需要审核？

3. **执行审核任务**
   - 运行测试
   - 代码质量检查
   - 提出改进建议

## 示例场景

### 场景 1: 每天早上检查

```bash
# 你: 早上好，检查一下昨天晚上有没有新提交
# Claude: 好的，让我检查...

git fetch origin
git log --since="yesterday" --oneline

# 发现 3 个新提交，让我审核一下...
```

### 场景 2: 持续监控 + AI 审核

```bash
# 终端 1: 监控脚本
python monitor.py watch 60

# 终端 2: Claude Code 待命
# 当发现新提交时，你可以告诉我：
# "检查最新的提交并审核代码"

# 我会：
# 1. git pull
# 2. 分析改动
# 3. 运行测试
# 4. 代码审核
# 5. 给出反馈
```

## 总结

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **手动检查** | 简单直接 | 需要记得执行 | 小团队，不频繁 |
| **监控脚本** | 自动化，可定制 | 需要保持运行 | 中等规模项目 |
| **Git Hooks** | 自动触发 | 需要服务器配置 | 有服务器环境 |
| **Cron 定时** | 完全自动 | 可能有延迟 | 后台监控 |

**推荐做法：**
- 开发时使用 `monitor.py watch 60`
- 部署时配置 Git Hooks 或 Cron
- 需要 AI 审核时调用我（Claude Code）
