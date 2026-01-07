# GitHub Actions 自动任务执行配置指南

## 功能说明

当 `task.md` 文件有更新时，GitHub Actions 会：
1. ✅ 自动检测到变化
2. 🤖 调用 Claude API 分析任务
3. 📝 生成执行计划
4. 🔧 自动执行任务
5. 🔀 创建 Pull Request 等待审核

---

## 配置步骤

### 1. 添加 API Key 到 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secret：

   ```
   Name: ANTHROPIC_API_KEY
   Value: 你的 Claude API Key (从 https://console.anthropic.com/ 获取)
   ```

### 2. 启用 GitHub Actions

确保仓库的 Actions 权限已启用：
1. **Settings** → **Actions** → **General**
2. 确保 **Allow all actions and reusable workflows** 已选中
3. **Workflow permissions** 设置为 **Read and write permissions**

### 3. 测试工作流

更新 `task.md` 文件并提交：

```bash
echo "创建一个 Hello World 页面" > task.md
git add task.md
git commit -m "test: 测试自动任务执行"
git push
```

### 4. 查看执行结果

1. 进入 GitHub 仓库的 **Actions** 标签
2. 查看 "自动执行任务" 工作流
3. 等待执行完成
4. 检查生成的 Pull Request

---

## 工作流程图

```
用户更新 task.md
    ↓
提交到 GitHub
    ↓
GitHub Actions 检测到 task.md 变化
    ↓
读取 task.md 内容
    ↓
调用 Claude API 分析任务
    ↓
Claude 生成执行计划（文件、命令）
    ↓
GitHub Actions 执行计划
    ↓
创建新分支
    ↓
提交执行结果
    ↓
创建 Pull Request
    ↓
等待你审核和合并
```

---

## task.md 格式建议

### 简单任务

```markdown
创建一个用户登录页面
```

### 详细任务

```markdown
创建用户登录功能：
1. 创建 /login 路由
2. 实现登录表单
3. 添加表单验证
4. 连接后端 API
```

### 复杂任务

```markdown
实现旅游打卡功能：
- 创建打卡页面 (app/check-in/page.tsx)
- 实现地理位置获取
- 上传照片功能
- 调用智能合约记录打卡
- 显示打卡历史

技术栈：
- Next.js App Router
- Tailwind CSS
- Web3.js
```

---

## 对比：监控脚本 vs GitHub Actions

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **监控脚本 (monitor.py)** | 本地运行，立即响应，可定制 | 需要保持运行，占用本地资源 | 开发调试阶段 |
| **GitHub Actions** | 自动化，云端运行，无需本地资源 | 有延迟（几秒到几分钟），依赖网络 | 生产环境，团队协作 |

**建议：**
- 开发时使用监控脚本（快速迭代）
- 生产时使用 GitHub Actions（自动化协作）

---

## 成本估算

- **GitHub Actions**:
  - 公共仓库：无限免费
  - 私有仓库：2000 分钟/月免费

- **Claude API**:
  - Sonnet: ~$3 / 1M tokens
  - 每次任务分析约 500-2000 tokens
  - 估算成本: $0.002 - $0.006 / 次

---

## 常见问题

### Q: API Key 安全吗？
A: 是的。存储在 GitHub Secrets 中的密钥是加密的，不会在日志中显示。

### Q: 如果任务执行失败怎么办？
A: 可以在 Actions 页面查看详细日志，修复后重新触发。

### Q: 可以手动触发吗？
A: 可以。在 Actions 页面选择工作流，点击 "Run workflow"。

### Q: 如何停止自动执行？
A: 暂时禁用工作流：Settings → Actions → 找到工作流 → Disable
