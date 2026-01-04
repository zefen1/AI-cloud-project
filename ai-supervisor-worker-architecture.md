# AI 监工 + 干活 协作架构设计

## 场景：一个 AI 监工，一个 AI 干活

```
┌─────────────────┐
│   监工 AI       │  ← 分配任务、审核代码、质量检查
│  (Supervisor)   │
└────────┬────────┘
         │ 指派任务
         ↓
┌─────────────────┐
│   干活 AI       │  ← 编写代码、执行任务
│   (Worker)      │
└─────────────────┘
         │ 提交成果
         ↓
    共享工作空间
  (Git 仓库/文件系统)
```

## 方案 1: Claude Code (监工) + GPT-4 (干活) 【推荐】

### 架构
```
你 (用户)
  ↓
Claude Code (我，作为监工)
  ↓ 通过 API 调用
GPT-4 (干活)
  ↓ 输出代码
文件系统
```

### 实现代码

```python
# ai_team.py
import os
import anthropic
import openai
from typing import List, Dict

class AITeam:
    def __init__(self):
        self.supervisor = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        self.worker = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.task_history = []

    def supervisor_assigns_task(self, project_description: str) -> List[Dict]:
        """监工 AI 分析项目并分配任务"""
        print("📋 监工正在分析项目...")

        message = self.supervisor.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": f"""你是项目监工。分析以下项目需求，将其拆分成具体的编码任务。

项目描述：{project_description}

请输出 JSON 格式的任务列表，每个任务包含：
- task_id: 任务编号
- description: 任务描述
- file_path: 需要创建/修改的文件
- priority: 优先级 (1-5)

格式：
[
  {{"task_id": 1, "description": "...", "file_path": "...", "priority": 5}},
  ...
]"""
            }]
        )

        import json
        tasks = json.loads(message.content[0].text)
        self.task_history = tasks
        print(f"✅ 监工分配了 {len(tasks)} 个任务")
        return tasks

    def worker_executes_task(self, task: Dict) -> str:
        """干活 AI 执行具体任务"""
        print(f"⚙️  干活 AI 正在执行: {task['description']}")

        response = self.worker.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""你是编码工人。完成以下任务：

任务: {task['description']}
文件: {task['file_path']}

只输出完整的代码，不要解释。"""
            }]
        )

        code = response.choices[0].message.content
        print(f"✅ 完成任务 {task['task_id']}")
        return code

    def supervisor_reviews_code(self, task: Dict, code: str) -> Dict:
        """监工 AI 审核代码"""
        print(f"🔍 监工正在审核任务 {task['task_id']} 的代码...")

        message = self.supervisor.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": f"""你是代码审核员。审核以下代码：

任务要求：{task['description']}
提交的代码：
```
{code}
```

输出 JSON 格式：
{{
  "approved": true/false,
  "issues": ["问题1", "问题2"],
  "suggestions": ["建议1"],
  "score": 1-10
}}"""
            }]
        )

        import json
        review = json.loads(message.content[0].text)
        print(f"{'✅ 审核通过' if review['approved'] else '❌ 需要修改'} (评分: {review['score']}/10)")
        return review

    def run_project(self, project_description: str):
        """运行完整的 AI 团队协作流程"""
        print("🚀 AI 团队开始工作...\n")

        # 1. 监工分配任务
        tasks = self.supervisor_assigns_task(project_description)

        # 2. 对每个任务执行工作流
        for task in tasks:
            print(f"\n--- 任务 {task['task_id']}: {task['description']} ---")

            # 干活 AI 执行任务
            code = self.worker_executes_task(task)

            # 监工 AI 审核
            review = self.supervisor_reviews_code(task, code)

            # 如果通过，保存代码
            if review['approved']:
                with open(task['file_path'], 'w') as f:
                    f.write(code)
                print(f"💾 代码已保存到 {task['file_path']}")
            else:
                print(f"⚠️  问题: {', '.join(review['issues'])}")
                # 可以让干活 AI 重做

        print("\n🎉 项目完成！")

# 使用示例
if __name__ == "__main__":
    team = AITeam()

    team.run_project("""
    创建一个简单的 Python 计算器，包含：
    1. 加减乘除功能
    2. 单元测试
    3. README 文档
    """)
```

### 使用方法

```bash
# 1. 安装依赖
pip install anthropic openai

# 2. 设置 API keys
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"

# 3. 运行
python ai_team.py
```

## 方案 2: 两个 Claude Code 实例协作

### 架构
```
┌─────────────────────┐
│ Claude Code #1      │  ← 监工（你当前的会话）
│ (Supervisor)        │
└──────────┬──────────┘
           │ 通过文件系统通信
           ↓
    tasks.json (任务队列)
    results/ (工作成果)
           ↓
┌─────────────────────┐
│ Claude Code #2      │  ← 干活（另一个终端）
│ (Worker)            │
└─────────────────────┘
```

### 实现：基于文件的任务队列

```python
# supervisor.py (监工脚本)
import json
import time
from pathlib import Path

class Supervisor:
    def __init__(self):
        self.task_queue = Path("tasks.json")
        self.results_dir = Path("results")
        self.results_dir.mkdir(exist_ok=True)

    def create_tasks(self, project_description: str):
        """创建任务列表"""
        tasks = [
            {
                "id": 1,
                "description": "创建主程序文件 main.py",
                "status": "pending",
                "assigned_to": "worker"
            },
            {
                "id": 2,
                "description": "创建测试文件 test_main.py",
                "status": "pending",
                "assigned_to": "worker"
            }
        ]

        self.task_queue.write_text(json.dumps(tasks, indent=2))
        print(f"✅ 已创建 {len(tasks)} 个任务")

    def monitor_progress(self):
        """监控工作进度"""
        while True:
            tasks = json.loads(self.task_queue.read_text())

            completed = sum(1 for t in tasks if t['status'] == 'completed')
            total = len(tasks)

            print(f"进度: {completed}/{total}")

            if completed == total:
                print("🎉 所有任务完成！")
                break

            time.sleep(5)

    def review_results(self):
        """审核成果"""
        for result_file in self.results_dir.glob("*.py"):
            print(f"\n审核: {result_file.name}")
            code = result_file.read_text()
            print(code[:200] + "...")
            # 这里可以调用 Claude API 进行审核

# worker.py (干活脚本)
class Worker:
    def __init__(self):
        self.task_queue = Path("tasks.json")
        self.results_dir = Path("results")

    def process_tasks(self):
        """处理任务"""
        while True:
            tasks = json.loads(self.task_queue.read_text())

            # 找到第一个待处理任务
            pending = [t for t in tasks if t['status'] == 'pending']
            if not pending:
                print("没有待处理任务")
                break

            task = pending[0]
            print(f"⚙️  执行任务 {task['id']}: {task['description']}")

            # 执行任务（这里可以调用 GPT-4 API）
            result = self.execute_task(task)

            # 保存结果
            result_file = self.results_dir / f"task_{task['id']}.py"
            result_file.write_text(result)

            # 更新任务状态
            task['status'] = 'completed'
            self.task_queue.write_text(json.dumps(tasks, indent=2))

            print(f"✅ 完成任务 {task['id']}")

    def execute_task(self, task: Dict) -> str:
        """执行具体任务"""
        # 调用 OpenAI API
        import openai
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": task['description']}]
        )
        return response.choices[0].message.content
```

### 运行方式

```bash
# 终端 1 (监工)
python -c "
from supervisor import Supervisor
sup = Supervisor()
sup.create_tasks('创建计算器程序')
sup.monitor_progress()
"

# 终端 2 (干活)
python -c "
from worker import Worker
worker = Worker()
worker.process_tasks()
"
```

## 方案 3: 使用 AutoGen 框架（最专业）

```python
# autogen_team.py
import autogen

# 配置 LLM
config_list = [
    {
        "model": "gpt-4",
        "api_key": "your-openai-key",
    }
]

# 创建监工 Agent
supervisor = autogen.AssistantAgent(
    name="Supervisor",
    system_message="""你是项目监工。
    职责：分析需求、分配任务、审核代码、确保质量。
    你需要将大任务拆分成小任务，分配给 Worker。""",
    llm_config={"config_list": config_list},
)

# 创建干活 Agent
worker = autogen.AssistantAgent(
    name="Worker",
    system_message="""你是编码工人。
    职责：接收任务、编写代码、修复 bug。
    专注于实现功能，不要过度设计。""",
    llm_config={"config_list": config_list},
)

# 创建用户代理
user = autogen.UserProxyAgent(
    name="User",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding"},
)

# 创建群聊
groupchat = autogen.GroupChat(
    agents=[user, supervisor, worker],
    messages=[],
    max_round=20,
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list},
)

# 启动协作
user.initiate_chat(
    manager,
    message="请创建一个 Python 计算器程序，包含测试和文档",
)
```

## 方案对比

| 方案 | 优点 | 缺点 | 适合场景 |
|------|------|------|----------|
| **方案 1: API 调用** | 简单直接，完全控制 | 需要编写集成代码 | 快速原型，小项目 |
| **方案 2: 文件通信** | 异步，可扩展 | 需要任务队列管理 | 长期运行，多任务 |
| **方案 3: AutoGen** | 专业，功能强大 | 学习曲线，依赖框架 | 复杂 AI 协作系统 |

## 我的角色

**我（Claude Code）最适合做监工！**

因为我可以：
- ✅ 读取整个代码库
- ✅ 执行 Git 命令
- ✅ 运行测试和检查
- ✅ 审核代码质量
- ✅ 调用其他 AI 的 API

建议角色分配：
- **监工**: Claude Code (我)
- **干活**: GPT-4 / Gemini / 本地 Llama (通过 API)

## 立即可用的简单方案

```python
# simple_team.py - 最简单的实现
import openai
import os

def supervisor_plan(task: str) -> list:
    """监工：制定计划"""
    print("📋 监工制定计划...")
    return [
        "步骤1: 创建 main.py",
        "步骤2: 创建 test.py",
        "步骤3: 创建 README.md"
    ]

def worker_execute(step: str) -> str:
    """干活：执行步骤"""
    print(f"⚙️  干活执行: {step}")

    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"完成: {step}，只输出代码"}]
    )
    return response.choices[0].message.content

def supervisor_review(code: str) -> bool:
    """监工：审核代码"""
    print("🔍 监工审核...")
    # 这里可以做静态分析、运行测试等
    return len(code) > 10  # 简单检查

# 运行团队
task = "创建一个 Python 计算器"
steps = supervisor_plan(task)

for step in steps:
    code = worker_execute(step)
    if supervisor_review(code):
        print("✅ 通过")
        # 保存代码
    else:
        print("❌ 重做")
```

## 下一步

想要我帮你实现哪个方案？我可以：
1. 创建完整的 AI 团队协作脚本
2. 配置 AutoGen 框架
3. 设置基于文件的任务队列系统
