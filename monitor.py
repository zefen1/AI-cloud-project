#!/usr/bin/env python3
"""
项目变化监控脚本
监控 Git 仓库的变化，包括其他人的提交
"""

import subprocess
import time
import json
from datetime import datetime
from pathlib import Path

class ProjectMonitor:
    def __init__(self, repo_path="."):
        self.repo_path = Path(repo_path)
        self.last_commit = self.get_current_commit()
        self.changes_log = []

    def get_current_commit(self):
        """获取当前 HEAD 的 commit hash"""
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        return result.stdout.strip()

    def fetch_remote(self):
        """拉取远程更新"""
        print("🔄 检查远程更新...")
        subprocess.run(
            ["git", "fetch", "origin"],
            cwd=self.repo_path,
            capture_output=True
        )

    def get_current_branch(self):
        """获取当前分支名"""
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        return result.stdout.strip()

    def get_new_commits(self):
        """获取新的提交"""
        current_branch = self.get_current_branch()
        remote_branch = f"origin/{current_branch}"

        result = subprocess.run(
            ["git", "log", f"{self.last_commit}..{remote_branch}",
             "--pretty=format:%H|%an|%ae|%s|%ci"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )

        commits = []
        for line in result.stdout.strip().split('\n'):
            if line:
                hash, author, email, subject, date = line.split('|')
                commits.append({
                    'hash': hash[:7],
                    'author': author,
                    'email': email,
                    'subject': subject,
                    'date': date
                })
        return commits

    def get_changed_files(self, commit_hash):
        """获取某个提交改动的文件"""
        result = subprocess.run(
            ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", commit_hash],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]

    def check_for_changes(self):
        """检查是否有新变化"""
        self.fetch_remote()

        new_commits = self.get_new_commits()

        if new_commits:
            print(f"\n🔔 发现 {len(new_commits)} 个新提交！\n")

            for commit in new_commits:
                print(f"📝 提交: {commit['hash']}")
                print(f"   作者: {commit['author']} <{commit['email']}>")
                print(f"   时间: {commit['date']}")
                print(f"   信息: {commit['subject']}")

                # 获取改动的文件
                files = self.get_changed_files(commit['hash'])
                if files:
                    print(f"   文件: {', '.join(files)}")
                print()

                # 记录变化
                self.changes_log.append({
                    'timestamp': datetime.now().isoformat(),
                    'commit': commit,
                    'files': files
                })

            # 更新最后的 commit
            self.last_commit = new_commits[0]['hash']
            return True
        else:
            print("✅ 没有新的提交")
            return False

    def get_local_changes(self):
        """检查本地未提交的变化"""
        # 检查未跟踪的文件
        result = subprocess.run(
            ["git", "ls-files", "--others", "--exclude-standard"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        untracked = [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]

        # 检查已修改的文件
        result = subprocess.run(
            ["git", "diff", "--name-only"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        modified = [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]

        # 检查已暂存的文件
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only"],
            cwd=self.repo_path,
            capture_output=True,
            text=True
        )
        staged = [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]

        return {
            'untracked': untracked,
            'modified': modified,
            'staged': staged
        }

    def monitor_once(self):
        """执行一次监控"""
        print(f"{'='*60}")
        print(f"⏰ 监控时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")

        # 检查远程变化
        has_remote_changes = self.check_for_changes()

        # 检查本地变化
        local_changes = self.get_local_changes()

        if any(local_changes.values()):
            print("\n📁 本地变化:")
            if local_changes['untracked']:
                print(f"   未跟踪: {', '.join(local_changes['untracked'])}")
            if local_changes['modified']:
                print(f"   已修改: {', '.join(local_changes['modified'])}")
            if local_changes['staged']:
                print(f"   已暂存: {', '.join(local_changes['staged'])}")
        else:
            print("\n✅ 本地无变化")

        return has_remote_changes or any(local_changes.values())

    def monitor_loop(self, interval=60):
        """持续监控（每隔一段时间检查一次）"""
        print(f"🚀 开始监控项目，每 {interval} 秒检查一次")
        print("按 Ctrl+C 停止\n")

        try:
            while True:
                self.monitor_once()
                print(f"\n⏳ 等待 {interval} 秒后继续...\n")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n\n⏹️  监控已停止")
            self.save_changes_log()

    def save_changes_log(self):
        """保存变化日志"""
        if self.changes_log:
            log_file = self.repo_path / "changes_log.json"
            with open(log_file, 'w') as f:
                json.dump(self.changes_log, f, indent=2)
            print(f"📄 变化日志已保存到: {log_file}")

def main():
    import sys

    monitor = ProjectMonitor()

    if len(sys.argv) > 1 and sys.argv[1] == "watch":
        # 持续监控模式
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        monitor.monitor_loop(interval)
    else:
        # 单次检查模式
        monitor.monitor_once()

if __name__ == "__main__":
    main()
