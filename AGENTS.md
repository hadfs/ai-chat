# 仓库指南

## 项目结构与模块组织
- `server/` — NestJS API（控制器、服务、模块）。入口：`server/src/main.ts`。单元测试与代码同目录，命名为 `*.spec.ts`；端到端（e2e）测试位于 `server/test/`。
- `website/` — React + Vite 应用。应用代码在 `website/src/`（视图在 `src/views/`，API 客户端在 `src/request/`，资源在 `src/assets/`）。
- 根目录文档见 `README.md`。避免在仓库中存放密钥；当修改鉴权或 CORS 时，请查看 `server/src/lib/token.ts` 与 `server/src/lib/Cors.ts`。

## 构建、测试与开发命令
在各包目录中执行 `npm install` 之后，从对应目录运行以下命令。

服务器（NestJS）：
- `npm run dev` — 以监听模式启动服务器。
- `npm run build` — 编译到 `dist/`。
- `npm run start:prod` — 运行已编译的服务器。
- `npm run test` / `test:watch` / `test:cov` / `test:e2e` — 单元测试、监听、覆盖率、端到端测试。

网站（React + Vite）：
- `npm run dev` — 启动 Vite 开发服务器。
- `npm run build` — 进行类型检查并构建。
- `npm run preview` — 预览生产构建。

## 代码风格与命名规范
- 使用 TypeScript，缩进为 2 个空格。
- 代码检查：两个应用均使用 ESLint（`npm run lint`）。格式化：`server` 使用 Prettier（`npm run format`）。
- 命名：React 组件与 Nest 类使用 PascalCase；函数与变量使用 camelCase；非组件文件使用 kebab-case；React 组件文件可使用 PascalCase。
- 保持模块/组件聚焦；将相关样式/资源与组件同目录放置。

## 测试指南
- 服务器使用 Jest。将单元测试与源码放在一起，命名为 `*.spec.ts`；端到端测试位于 `server/test/`，命名为 `*.e2e-spec.ts`。
- 关注服务/控制器的有效覆盖率；通过 `npm run test:cov` 查看。
- 网站当前尚未配置测试运行器；欢迎提交添加测试的 PR。

## 提交与拉取请求指南
- 遵循 Conventional Commits（可在历史中看到）：`feat: ...`、`fix: ...`、`chore: ...`、`docs: ...`。
- PR 应包含：清晰的描述、关联的 Issue、验证步骤；UI 变更请附上截图或 GIF。
- 保持变更范围聚焦；当行为发生变化时请更新文档。

## 安全与配置提示
- 不要提交 API 密钥或令牌。使用本地 `.env` 文件与环境变量。
- 当修改鉴权或 CORS 时，请审阅 `server/src/lib/token.ts` 与 `server/src/lib/Cors.ts`，并在合并前进行本地测试。
