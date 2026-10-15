#!/usr/bin/env bash
# 《你在他心里是什么位置？》阿里云服务器一键部署脚本
# 用法：把代码上传到服务器 /opt/love-test 后，在服务器上执行：
#   sudo bash deploy.sh
# 适用于 CentOS / Ubuntu / Alibaba Cloud Linux（二进制安装 Node，不依赖包管理器）
set -e

NODE_VERSION=v20.18.1
APP_DIR=/opt/love-test
PORT=8080

if [ "$(id -u)" -ne 0 ]; then echo "请用 root 或 sudo 运行"; exit 1; fi

echo "==> 1/3 安装 Node ${NODE_VERSION}（阿里云镜像）"
if command -v node >/dev/null 2>&1 && [ "$(node -v | cut -c2- | cut -d. -f1)" -ge 18 ]; then
  echo "    已有 Node $(node -v)，跳过安装"
else
  curl -fsSLO "https://mirrors.aliyun.com/nodejs-release/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz"
  tar -xf "node-${NODE_VERSION}-linux-x64.tar.xz" -C /usr/local --strip-components=1
  rm -f "node-${NODE_VERSION}-linux-x64.tar.xz"
  echo "    已安装 $(/usr/local/bin/node -v)"
fi

echo "==> 2/3 配置 systemd 服务（端口 ${PORT}，开机自启，崩溃自动拉起）"
cat > /etc/systemd/system/love-test.service <<UNIT
[Unit]
Description=Love Position Test H5
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
Environment=PORT=${PORT}
ExecStart=/usr/local/bin/node server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

echo "==> 3/3 启动服务"
systemctl daemon-reload
systemctl enable --now love-test
sleep 1
systemctl status love-test --no-pager | head -6

echo
echo "部署完成。自测：curl http://127.0.0.1:${PORT}"
echo "别忘了：阿里云控制台 → 安全组 → 放行 TCP ${PORT} 端口"
