#!/usr/bin/env python3
"""
AI 团队协作脚本
监工 AI (Claude) + 干活 AI (GPT-4)
"""

import os
import json
import openai
from pathlib import Path

class AITeam:
    def __init__(self):
        # 干活 AI 配置
        self.worker_client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.workspace = Path("./workspace")
        self.workspace.mkdir(exist_ok=True)

    def supervisor_create_plan(self, project_description: str) -> list:
        """监工：制定任务计划（这个由我 Claude Code 完成）"""
        print("\n📋 [监工] 正在分析项目并制定计划...")
        print(f"项目需求: {project_description}\n")

        # 这里是监工（Claude）制定的任务清单
        # 在实际使用中，你可以让我动态分析
        tasks = [
            {
                "id": 1,
                "file": "main.py",
                "description": "创建主程序文件，包含基本的类结构",
                "status": "pending"
            },
            {
                "id": 2,
                "file": "utils.py",
                "description": "创建工具函数文件",
                "status": "pending"
            },
            {
                "id": 3,
                "file": "test_main.py",
                "description": "创建单元测试文件",
                "status": "pending"
            }
        ]

        print(f"✅ [监工] 已制定 {len(tasks)} 个任务\n")
        for task in tasks:
            print(f"  任务 {task['id']}: {task['description']}")

        return tasks

    def worker_execute(self, task: dict) -> str:
        """干活 AI：执行具体编码任务"""
        print(f"\n⚙️  [干活] 正在执行任务 {task['id']}: {task['description']}")

        # 调用 GPT-4 编写代码
        response = self.worker_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业的 Python 程序员。只输出代码，不要解释。代码要简洁、可运行。"
                },
                {
                    "role": "user",
                    "content": f"创建文件 {task['file']}，要求：{task['description']}\n\n只输出完整的 Python 代码，不要其他内容。"
                }
            ],
            temperature=0.7,
        )

        code = response.choices[0].message.content

        # 清理代码块标记
        if code.startswith("```python"):
            code = code[9:]
        if code.startswith("```"):
            code = code[3:]
        if code.endswith("```"):
            code = code[:-3]
        code = code.strip()

        print(f"✅ [干活] 完成编码，共 {len(code.splitlines())} 行")
        return code

    def supervisor_review(self, task: dict, code: str) -> dict:
        """监工：审核代码质量"""
        print(f"\n🔍 [监工] 正在审核任务 {task['id']} 的代码...")

        # 基本检查
        issues = []
        score = 10

        # 检查代码长度
        if len(code) < 10:
            issues.append("代码太短，可能不完整")
            score -= 3

        # 检查是否有基本的 Python 语法元素
        if "def " not in code and "class " not in code:
            issues.append("没有找到函数或类定义")
            score -= 2

        # 检查文件类型匹配
        if task['file'].startswith('test_') and 'assert' not in code and 'test' not in code.lower():
            issues.append("测试文件缺少测试断言")
            score -= 2

        approved = score >= 7 and len(issues) == 0

        result = {
            "approved": approved,
            "score": score,
            "issues": issues,
            "suggestions": []
        }

        if approved:
            print(f"✅ [监工] 审核通过！评分: {score}/10")
        else:
            print(f"❌ [监工] 需要改进 (评分: {score}/10)")
            for issue in issues:
                print(f"   - {issue}")

        return result

    def save_code(self, filename: str, code: str):
        """保存代码到文件"""
        filepath = self.workspace / filename
        filepath.write_text(code, encoding='utf-8')
        print(f"💾 [系统] 代码已保存到: {filepath}")

    def run_project(self, project_description: str):
        """运行完整的 AI 团队协作流程"""
        print("=" * 60)
        print("🚀 AI 团队开始工作")
        print("=" * 60)

        # 步骤 1: 监工制定计划
        tasks = self.supervisor_create_plan(project_description)

        # 步骤 2: 逐个执行任务
        completed = 0
        for task in tasks:
            print("\n" + "-" * 60)

            # 干活 AI 编码
            code = self.worker_execute(task)

            # 监工审核
            review = self.supervisor_review(task, code)

            # 如果通过，保存代码
            if review['approved']:
                self.save_code(task['file'], code)
                task['status'] = 'completed'
                completed += 1
            else:
                task['status'] = 'failed'
                print(f"⚠️  [系统] 任务 {task['id']} 未通过审核，需要重做")

        # 总结
        print("\n" + "=" * 60)
        print(f"🎉 工作完成！{completed}/{len(tasks)} 个任务通过审核")
        print("=" * 60)
        print(f"\n生成的文件在: {self.workspace.absolute()}")

def main():
    """主函数"""
    # 检查 API Key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ 错误: 请设置 OPENAI_API_KEY 环境变量")
        print("   export OPENAI_API_KEY='your-api-key'")
        return

    # 创建 AI 团队
    team = AITeam()

    # 运行项目
    project = """
    创建一个简单的待办事项管理器 (Todo Manager)，要求：
    1. 可以添加、删除、查看待办事项
    2. 包含基本的工具函数
    3. 有完整的单元测试
    """

    team.run_project(project)

if __name__ == "__main__":
    main()
