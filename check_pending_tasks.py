#!/usr/bin/env python3
"""
Claude Code 启动时自动检查待处理任务
"""

import json
from pathlib import Path
from datetime import datetime

class TaskChecker:
    def __init__(self):
        self.task_file = Path(".claude/tasks/pending-task.json")
        self.task_md = Path("task.md")

    def has_pending_task(self):
        """检查是否有待处理的任务"""
        return self.task_file.exists()

    def get_task(self):
        """获取待处理的任务"""
        if not self.has_pending_task():
            return None

        with open(self.task_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def mark_as_processing(self):
        """标记任务为处理中"""
        if not self.has_pending_task():
            return

        task = self.get_task()
        task['status'] = 'processing'
        task['started_at'] = datetime.now().isoformat()

        with open(self.task_file, 'w', encoding='utf-8') as f:
            json.dump(task, f, indent=2, ensure_ascii=False)

    def mark_as_completed(self):
        """标记任务为已完成"""
        if not self.has_pending_task():
            return

        task = self.get_task()
        task['status'] = 'completed'
        task['completed_at'] = datetime.now().isoformat()

        # 移动到历史
        history_dir = Path(".claude/tasks/history")
        history_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        history_file = history_dir / f"task_{timestamp}.json"

        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(task, f, indent=2, ensure_ascii=False)

        # 删除待处理任务
        self.task_file.unlink()

        print(f"✅ 任务已完成并归档到: {history_file}")

    def display_task(self):
        """显示待处理的任务"""
        task = self.get_task()
        if not task:
            print("📭 没有待处理的任务")
            return False

        print("\n" + "="*60)
        print("🔔 发现待处理的任务！")
        print("="*60)
        print(f"\n📅 创建时间: {task['timestamp']}")
        print(f"👤 提交者: {task['author']}")
        print(f"📝 提交: {task['commit'][:7]}")
        print(f"📊 状态: {task['status']}")
        print(f"\n📋 任务内容:\n")
        print("-"*60)
        print(task['task_content'])
        print("-"*60)
        print("\n🤖 Claude Code 准备执行此任务\n")

        return True

def main():
    """主函数"""
    checker = TaskChecker()

    if checker.has_pending_task():
        checker.display_task()
        return True
    else:
        print("✅ 没有待处理的任务")
        return False

if __name__ == "__main__":
    has_task = main()
    exit(0 if has_task else 1)
