#!/bin/bash
set -Eeuo pipefail

# 默认端口配置，可通过环境变量 PORT 覆盖
PORT="${PORT:-3001}"
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
NODE_ENV=development
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"

cd "${COZE_WORKSPACE_PATH}"

kill_port_if_listening() {
    local pids
    # 使用 lsof 命令，兼容 macOS 和 Linux
    pids=$(lsof -ti:${DEPLOY_RUN_PORT} 2>/dev/null || true)
    if [[ -z "${pids}" ]]; then
      echo "Port ${DEPLOY_RUN_PORT} is free."
      return
    fi
    echo "Port ${DEPLOY_RUN_PORT} in use by PIDs: ${pids} (SIGKILL)"
    echo "${pids}" | xargs -I {} kill -9 {} 2>/dev/null || true
    sleep 1
    pids=$(lsof -ti:${DEPLOY_RUN_PORT} 2>/dev/null || true)
    if [[ -n "${pids}" ]]; then
      echo "Warning: port ${DEPLOY_RUN_PORT} still busy after SIGKILL, PIDs: ${pids}"
    else
      echo "Port ${DEPLOY_RUN_PORT} cleared."
    fi
}

echo "Clearing port ${PORT} before start."
kill_port_if_listening
echo "Starting HTTP service on port ${PORT} for dev..."

npx next dev --webpack --port $PORT
