#!/bin/bash

# 环境配置助手脚本
# 用于快速设置开发环境和生产环境的环境变量

echo "================================================"
echo "  OMS Web - 环境配置助手"
echo "================================================"
echo ""

# 检查是否已存在环境文件
if [ -f ".env.development" ]; then
    echo "⚠️  .env.development 已存在"
    read -p "是否覆盖? (y/n): " overwrite_dev
    if [ "$overwrite_dev" != "y" ]; then
        echo "跳过 .env.development 配置"
        SKIP_DEV=true
    fi
fi

if [ -f ".env.production" ]; then
    echo "⚠️  .env.production 已存在"
    read -p "是否覆盖? (y/n): " overwrite_prod
    if [ "$overwrite_prod" != "y" ]; then
        echo "跳过 .env.production 配置"
        SKIP_PROD=true
    fi
fi

echo ""

# 配置开发环境
if [ "$SKIP_DEV" != true ]; then
    echo "📝 配置开发环境 (.env.development)"
    echo ""
    echo "请输入开发环境的API地址"
    echo "示例: http://localhost:8080"
    read -p "API地址: " dev_api_url

    if [ -z "$dev_api_url" ]; then
        dev_api_url="http://localhost:8080"
        echo "使用默认值: $dev_api_url"
    fi

    cat >.env.development <<EOF
# 开发环境配置
# 自动生成于 $(date '+%Y-%m-%d %H:%M:%S')

# API基础URL
VITE_API_BASE_URL=$dev_api_url
EOF

    echo "✅ .env.development 创建成功"
    echo ""
fi

# 配置生产环境
if [ "$SKIP_PROD" != true ]; then
    echo "📝 配置生产环境 (.env.production)"
    echo ""
    echo "请输入生产环境的API地址"
    echo "示例: https://api.production.com"
    read -p "API地址: " prod_api_url

    if [ -z "$prod_api_url" ]; then
        prod_api_url="https://api.production.com"
        echo "使用默认值: $prod_api_url"
    fi

    cat >.env.production <<EOF
# 生产环境配置
# 自动生成于 $(date '+%Y-%m-%d %H:%M:%S')

# API基础URL
VITE_API_BASE_URL=$prod_api_url
EOF

    echo "✅ .env.production 创建成功"
    echo ""
fi

echo "================================================"
echo "  配置完成!"
echo "================================================"
echo ""
echo "📋 下一步:"
echo ""
echo "1. 安装依赖 (如果还没有安装):"
echo "   npm install"
echo ""
echo "2. 启动开发服务器:"
echo "   npm run dev"
echo ""
echo "3. 访问登录页面:"
echo "   http://localhost:5173/login"
echo ""
echo "================================================"
echo ""
echo "📖 更多信息请查看:"
echo "   - README.md - 项目说明"
echo "   - docs/OTP_LOGIN.md - OTP登录文档"
echo "   - docs/QUICK_TEST.md - 快速测试指南"
echo ""
echo "如有问题,请联系: jiangyang.me@gmail.com"
echo ""
