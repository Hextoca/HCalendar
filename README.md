# 日历应用

一个集任务管理、思维导图和番茄钟功能于一体的日历应用。

## 项目简介
日历应用旨在帮助用户高效管理时间和任务，提供直观的日历视图、任务管理、思维导图编辑以及番茄钟功能，支持数据持久化和跨平台部署。

## 功能特性
- 日历视图（按日、周、月、年查看）
- 任务管理（支持增删改查操作）
- 思维导图创建与编辑
- 番茄钟提高生产力
- 后端 API 支持数据持久化

## 技术栈
- **前端**: React, React Flow
- **后端**: Flask
- **数据库**: JSON 文件（可替换为 SQLite 或 MongoDB）
- **部署**: Heroku

## 安装和运行指南

### 前端
1. 进入 `frontend` 目录：
   ```bash
   cd frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm start
   ```

### 后端
1. 进入 `backend` 目录：
   ```bash
   cd backend
   ```
2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
3. 启动后端服务器：
   ```bash
   python app.py
   ```

## 使用说明
1. 打开前端开发服务器提供的地址（通常为 `http://localhost:3000`）。
2. 注册或登录后即可使用日历、任务管理、思维导图和番茄钟功能。

## 贡献指南
欢迎贡献！请按照以下步骤参与：
1. Fork 本仓库。
2. 创建新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 提交更改：
   ```bash
   git commit -m "描述你的更改"
   ```
4. 推送到你的分支：
   ```bash
   git push origin feature/your-feature-name
   ```
5. 提交 Pull Request。

## 许可证
本项目基于 MIT 许可证开源。

## 致谢
感谢以下工具和库的支持：
- React
- React Flow
- Flask
- Heroku

## 屏幕截图
![日历视图](screenshots/calendar-view.png)
![任务管理](screenshots/task-management.png)

## 常见问题
### 如何更换数据库？
可以将 JSON 文件替换为 SQLite 或 MongoDB，修改后端代码以支持新的数据库。

### 如何部署到其他平台？
请参考 Heroku 部署指南，并根据目标平台调整配置文件。
