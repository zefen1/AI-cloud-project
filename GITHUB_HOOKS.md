# GitHub Hooks 通知 Claude Code 方案

## 问题：如何通过 GitHub 的钩子通知 Claude Code 有新提交？

### 区别：Git Hooks vs GitHub Webhooks

```
┌─────────────────────────────────────────────────────────────┐
│  Git Hooks (本地钩子)                                        │
│  ├─ .git/hooks/pre-commit     ← 提交前触发                  │
│  ├─ .git/hooks/post-commit    ← 提交后触发                  │
│  ├─ .git/hooks/pre-push       ← 推送前触发                  │
│  └─ .git/hooks/post-receive   ← 服务器接收后触发 (需要服务器) │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  GitHub Webhooks (远程钩子)                                  │
│  当 GitHub 上发生事件时:                                     │
│  ├─ Push 事件                                                │
│  ├─ Pull Request 事件                                        │
│  ├─ Issue 事件                                               │
│  └─ ... 更多事件                                             │
│                                                              │
│  GitHub 会发送 HTTP POST 到你指定的 URL                      │
└─────────────────────────────────────────────────────────────┘
```

## 核心问题

**我（Claude Code）不是常驻服务器**，所以：
- ❌ 无法直接接收 HTTP 请求
- ❌ 无法实时响应 webhook
- ✅ 只能在用户调用时被唤醒

## 解决方案

### 方案 1: GitHub Webhook → 中间服务器 → 通知文件（推荐）

```
GitHub 仓库
    ↓ (有新提交)
GitHub Webhook
    ↓ (HTTP POST)
你的服务器 (简单的 Flask/Express 服务)
    ↓ (写入文件)
notifications.json
    ↓ (下次对话时)
Claude Code 读取并处理
```

#### 实现代码：Webhook 接收服务器

```python
# webhook_server.py
from flask import Flask, request, jsonify
import json
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

NOTIFICATIONS_FILE = Path("notifications.json")

@app.route('/webhook', methods=['POST'])
def github_webhook():
    """接收 GitHub webhook"""

    # 验证签名（可选但推荐）
    # signature = request.headers.get('X-Hub-Signature-256')
    # if not verify_signature(signature, request.data):
    #     return jsonify({'error': 'Invalid signature'}), 403

    # 解析 webhook 数据
    event = request.headers.get('X-GitHub-Event')
    payload = request.json

    if event == 'push':
        # 提取关键信息
        notification = {
            'timestamp': datetime.now().isoformat(),
            'event': 'push',
            'repository': payload['repository']['full_name'],
            'pusher': payload['pusher']['name'],
            'commits': [
                {
                    'id': commit['id'][:7],
                    'message': commit['message'],
                    'author': commit['author']['name'],
                    'url': commit['url']
                }
                for commit in payload['commits']
            ],
            'ref': payload['ref'],  # 分支名
        }

        # 保存通知
        save_notification(notification)

        print(f"📨 收到新提交通知: {len(payload['commits'])} 个提交")

        return jsonify({'status': 'success'}), 200

    return jsonify({'status': 'ignored'}), 200

def save_notification(notification):
    """保存通知到文件"""
    notifications = []

    if NOTIFICATIONS_FILE.exists():
        notifications = json.loads(NOTIFICATIONS_FILE.read_text())

    notifications.append(notification)

    # 只保留最近 100 条
    notifications = notifications[-100:]

    NOTIFICATIONS_FILE.write_text(json.dumps(notifications, indent=2))

@app.route('/notifications', methods=['GET'])
def get_notifications():
    """查看通知（用于测试）"""
    if NOTIFICATIONS_FILE.exists():
        return NOTIFICATIONS_FILE.read_text()
    return jsonify([])

if __name__ == '__main__':
    # 在生产环境使用 gunicorn 等
    app.run(host='0.0.0.0', port=5000)
```

#### Claude Code 读取通知

```python
# check_notifications.py
import json
from pathlib import Path
from datetime import datetime

def check_notifications():
    """Claude Code 启动时检查通知"""
    notifications_file = Path("notifications.json")

    if not notifications_file.exists():
        print("📭 没有新通知")
        return []

    notifications = json.loads(notifications_file.read_text())

    # 找出未读通知（可以用时间戳判断）
    unread = [n for n in notifications if not n.get('read', False)]

    if unread:
        print(f"\n📬 你有 {len(unread)} 条新通知！\n")

        for notif in unread:
            print(f"🔔 {notif['timestamp']}")
            print(f"   仓库: {notif['repository']}")
            print(f"   提交者: {notif['pusher']}")
            print(f"   提交数: {len(notif['commits'])}")

            for commit in notif['commits']:
                print(f"     - {commit['id']}: {commit['message']}")
            print()

    return unread

# Claude Code 可以在启动时调用
if __name__ == "__main__":
    check_notifications()
```

#### 部署 Webhook 服务器

```bash
# 1. 安装依赖
pip install flask

# 2. 运行服务器（开发环境）
python webhook_server.py

# 3. 使用 ngrok 暴露到公网（用于测试）
# 下载 ngrok: https://ngrok.com/
ngrok http 5000
# 会得到一个公网 URL: https://xxxx.ngrok.io

# 4. 在 GitHub 配置 webhook
# 仓库 → Settings → Webhooks → Add webhook
# Payload URL: https://xxxx.ngrok.io/webhook
# Content type: application/json
# Events: Just the push event
```

### 方案 2: GitHub Actions → 创建通知文件（更简单）

不需要自己的服务器！使用 GitHub Actions 自动创建通知。

#### GitHub Actions 配置

```yaml
# .github/workflows/notify-on-push.yml
name: 通知 Claude Code

on:
  push:
    branches:
      - main
      - claude/**

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: 创建通知文件
        run: |
          mkdir -p .claude/notifications

          cat > .claude/notifications/push-$(date +%s).json <<EOF
          {
            "timestamp": "$(date -Iseconds)",
            "event": "push",
            "ref": "${{ github.ref }}",
            "sha": "${{ github.sha }}",
            "actor": "${{ github.actor }}",
            "message": "${{ github.event.head_commit.message }}",
            "files_changed": $(git diff-tree --no-commit-id --name-only -r ${{ github.sha }} | jq -R -s -c 'split("\n")[:-1]')
          }
          EOF

      - name: 提交通知文件
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .claude/notifications/
          git commit -m "🔔 通知: 新提交 ${{ github.sha }}" || exit 0
          git push
```

当有新提交时：
1. GitHub Actions 运行
2. 创建通知文件 `.claude/notifications/push-xxx.json`
3. 自动提交回仓库
4. Claude Code 下次启动时读取这些文件

### 方案 3: 本地 Git Hooks（最简单，但仅限本地）

```bash
# .git/hooks/post-commit
#!/bin/bash

# 创建通知文件
mkdir -p .claude/notifications

cat > .claude/notifications/commit-$(date +%s).json <<EOF
{
  "timestamp": "$(date -Iseconds)",
  "event": "commit",
  "author": "$(git config user.name)",
  "message": "$(git log -1 --pretty=%B)",
  "sha": "$(git rev-parse HEAD)",
  "files": $(git diff-tree --no-commit-id --name-only -r HEAD | jq -R -s -c 'split("\n")[:-1]')
}
EOF

echo "📝 已创建提交通知"
```

```bash
# 使 hook 可执行
chmod +x .git/hooks/post-commit
```

### 方案 4: 定时检查 + 智能通知（实用方案）

结合之前的监控脚本：

```python
# smart_monitor.py
import json
from pathlib import Path
from monitor import ProjectMonitor

class SmartMonitor(ProjectMonitor):
    def __init__(self):
        super().__init__()
        self.notification_file = Path(".claude/last_check.json")

    def save_last_check(self):
        """保存最后检查的时间和 commit"""
        data = {
            'timestamp': datetime.now().isoformat(),
            'last_commit': self.get_current_commit()
        }
        self.notification_file.parent.mkdir(exist_ok=True)
        self.notification_file.write_text(json.dumps(data, indent=2))

    def check_and_notify(self):
        """检查并创建通知"""
        has_changes = self.monitor_once()

        if has_changes:
            # 创建醒目的通知文件
            Path("NEW_COMMITS.txt").write_text(
                f"🔔 检测到新提交！\n"
                f"时间: {datetime.now()}\n"
                f"请运行: python check_notifications.py\n"
            )
            print("\n✅ 已创建通知文件: NEW_COMMITS.txt")

        self.save_last_check()

# 使用 cron 定期运行
# */10 * * * * cd ~/AI-cloud-project && python smart_monitor.py
```

## 完整工作流程

### 推荐：方案 2 (GitHub Actions) + 监控脚本

```
1. 团队成员提交代码
   ↓
2. GitHub Actions 自动运行
   → 创建 .claude/notifications/xxx.json
   → 提交回仓库
   ↓
3. 本地监控脚本（每分钟运行）
   → git fetch
   → 发现新的通知文件
   → 显示醒目提示
   ↓
4. 你看到提示后
   → 告诉 Claude Code: "检查新通知"
   → Claude Code 读取通知文件
   → 自动 pull 最新代码
   → 分析改动
   → 运行审核
```

## Claude Code 的启动检查

```python
# claude_startup.py
# Claude Code 每次启动时运行

def on_startup():
    """Claude Code 启动时自动检查"""

    # 1. 检查通知文件
    notifications = check_notifications()

    # 2. 如果有新提交，自动拉取
    if notifications:
        print("🔄 发现新提交，正在拉取...")
        subprocess.run(["git", "pull"])

        print("📊 准备分析改动...")
        # 分析代码、运行测试等

    # 3. 检查 NEW_COMMITS.txt
    if Path("NEW_COMMITS.txt").exists():
        print(Path("NEW_COMMITS.txt").read_text())
        Path("NEW_COMMITS.txt").unlink()  # 删除已读通知

# 集成到 Claude Code
# 在每次对话开始时调用 on_startup()
```

## 总结

| 方案 | 复杂度 | 实时性 | 推荐度 |
|------|--------|--------|--------|
| **Webhook + 服务器** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **GitHub Actions** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **本地 Hooks** | ⭐ | ⭐ | ⭐⭐ |
| **定时监控** | ⭐ | ⭐ | ⭐⭐⭐ |

**最佳实践：**
- 小团队：使用方案 4（定时监控）
- 中型团队：使用方案 2（GitHub Actions）
- 大型团队/企业：使用方案 1（Webhook 服务器）

## 我（Claude Code）的配合

每次你和我对话时，我会：
1. 自动运行 `check_notifications()`
2. 如果有新通知，告诉你
3. 询问是否要审核新代码
4. 自动拉取并分析

你不需要记住，我会主动提醒！
