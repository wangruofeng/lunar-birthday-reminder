#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
# 默认端口配置，可通过环境变量 PORT 覆盖
PORT="${PORT:-3001}"
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"

start_service() {
    cd "${COZE_WORKSPACE_PATH}"
    echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
    npx next start --port ${DEPLOY_RUN_PORT}
}

echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
start_service
