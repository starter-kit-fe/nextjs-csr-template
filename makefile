# 获取当前时间并格式化版本号
VERSION := $(shell TZ="Asia/Shanghai" date +"%y.%m%d.%H%M")

# 默认目标 - 当输入不存在的命令时显示帮助
.DEFAULT_GOAL := help

# 帮助信息
.PHONY: help
help: ## 显示此帮助信息
	@echo ""
	@echo "🚀 可用的 Make 命令："
	@echo ""
	@echo "版本管理："
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(version|tag)"
	@echo ""
	@echo "开发命令："
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(dev|build|test|start|install)"
	@echo ""
	@echo "其他命令："
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -v -E "(version|tag|dev|build|test|start|install)"
	@echo ""
	@echo "📝 示例："
	@echo "  make dev          # 启动开发服务器"
	@echo "  make push-tag     # 更新版本并推送标签"
	@echo "  make clean        # 清理构建文件"
	@echo ""

# 版本管理命令
.PHONY: update-version
update-version: ## 更新 package.json 中的版本号到当前时间格式
	@echo "📦 更新 package.json 版本到: $(VERSION)"
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	@node -e "const fs = require('fs'); \
		try { \
			const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
			pkg.version = '$(VERSION)'; \
			fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n'); \
			console.log('✅ 版本更新成功: $(VERSION)'); \
		} catch(e) { \
			console.error('❌ 更新版本失败:', e.message); \
			process.exit(1); \
		}"

.PHONY: push-version
push-version: update-version ## 更新版本并提交到 Git
	@echo "📤 提交版本变更到 Git"
	@if ! git diff --quiet; then \
		git add .; \
		git commit -m "bump version to v$(VERSION)"; \
		git push; \
		echo "✅ 版本提交成功"; \
	else \
		echo "ℹ️  没有变更需要提交"; \
	fi

.PHONY: push-tag
push-tag: push-version ## 创建并推送 Git 标签
	@echo "🏷️  创建并推送标签: v$(VERSION)"
	@if git tag -l | grep -q "v$(VERSION)"; then \
		echo "⚠️  标签 v$(VERSION) 已存在"; \
	else \
		git tag v$(VERSION); \
		git push origin v$(VERSION); \
		echo "✅ 标签推送成功: v$(VERSION)"; \
	fi

# 开发命令
.PHONY: dev
dev: ## 启动开发服务器
	@echo "🚀 启动开发服务器..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	npm run dev

.PHONY: build
build: ## 构建项目
	@echo "🔨 构建项目..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	npm run build

.PHONY: start
start: ## 启动生产服务器
	@echo "▶️  启动生产服务器..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	npm start

.PHONY: test
test: ## 运行测试
	@echo "🧪 运行测试..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	npm test

.PHONY: install
install: ## 安装依赖
	@echo "📥 安装项目依赖..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	npm install

# 工具命令
.PHONY: clean
clean: ## 清理构建文件和依赖
	@echo "🧹 清理项目文件..."
	@rm -rf node_modules dist build .next out
	@echo "✅ 清理完成"

.PHONY: lint
lint: ## 运行代码检查
	@echo "🔍 运行代码检查..."
	@if [ ! -f package.json ]; then \
		echo "❌ 错误: 找不到 package.json 文件"; \
		exit 1; \
	fi
	@if npm run | grep -q "lint"; then \
		npm run lint; \
	else \
		echo "⚠️  项目中没有配置 lint 脚本"; \
	fi

.PHONY: format
format: ## 格式化代码
	@echo "💅 格式化代码..."
	@if [ -f package.json ] && pnpm list prettier >/dev/null 2>&1; then \
		npx prettier --write .; \
		echo "✅ 代码格式化完成"; \
	elif command -v prettier >/dev/null 2>&1; then \
		prettier --write .; \
		echo "✅ 代码格式化完成"; \
	else \
		echo "⚠️  Prettier 未安装"; \
		echo "   请选择以下方式之一安装:"; \
		echo "   • 项目本地安装: npm install --save-dev prettier"; \
		echo "   • 全局安装: npm install -g prettier"; \
		echo "   • 使用 npx: npx prettier --write ."; \
	fi

.PHONY: version
version: ## 显示当前版本信息
	@echo "📋 版本信息："
	@echo "  当前时间格式版本: $(VERSION)"
	@if [ -f package.json ]; then \
		echo "  package.json 版本: $$(node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version)")"; \
	fi
	@if command -v git >/dev/null 2>&1 && [ -d .git ]; then \
		echo "  Git 最新标签: $$(git describe --tags --abbrev=0 2>/dev/null || echo '无标签')"; \
	fi

.PHONY: status
status: ## 显示项目状态
	@echo "📊 项目状态："
	@echo "  项目目录: $$(pwd)"
	@if [ -f package.json ]; then \
		echo "  项目名称: $$(node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).name || '未设置')")"; \
		echo "  项目版本: $$(node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version || '未设置')")"; \
	fi
	@if command -v git >/dev/null 2>&1 && [ -d .git ]; then \
		echo "  Git 分支: $$(git branch --show-current 2>/dev/null || echo '未知')"; \
		echo "  Git 状态: $$(git status --porcelain | wc -l | tr -d ' ') 个文件有变更"; \
	fi
	@if [ -d node_modules ]; then \
		echo "  依赖状态: ✅ 已安装"; \
	else \
		echo "  依赖状态: ❌ 未安装"; \
	fi

# 快速命令别名
.PHONY: d
d: dev ## dev 的简写

.PHONY: b
b: build ## build 的简写

.PHONY: t
t: test ## test 的简写

.PHONY: i
i: install ## install 的简写

.PHONY: v
v: version ## version 的简写

# 捕获所有未定义的目标
%:
	@echo "❌ 未知命令: '$@'"
	@echo ""
	@$(MAKE) help