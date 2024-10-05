#!/bin/bash

wget https://nodejs.org/dist/v22.9.0/node-v22.9.0-linux-x64.tar.xz
tar -Jxvf ./node-v19.8.1-linux-x64.tar.xz
export PATH=$(pwd)/node-v19.8.1-linux-x64/bin:$PATH
npm install pnpm -g

rustup target add "$INPUT_TARGET"
rustup toolchain install --force-non-host "$INPUT_TOOLCHAIN"

if [ "$INPUT_TARGET" = "x86_64-unknown-linux-gnu" ]; then
    apt-get update
    apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libayatana-appindicator3-dev librsvg2-dev patchelf libxdo-dev libxcb1 libxrandr2 libdbus-1-3
elif [ "$INPUT_TARGET" = "aarch64-unknown-linux-gnu" ]; then
    dpkg --add-architecture arm64
    apt-get update
    apt-get install -y libncurses6:arm64 libtinfo6:arm64 linux-libc-dev:arm64 libncursesw6:arm64 libcups2:arm64
    apt-get install -y --no-install-recommends g++-aarch64-linux-gnu libc6-dev-arm64-cross libssl-dev:arm64 libwebkit2gtk-4.0-dev:arm64 libgtk-3-dev:arm64 patchelf:arm64 librsvg2-dev:arm64 libxdo-dev:arm64 libxcb1:arm64 libxrandr2:arm64 libdbus-1-3:arm64 libayatana-appindicator3-dev:arm64
    export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc
    export CC_aarch64_unknown_linux_gnu=aarch64-linux-gnu-gcc
    export CXX_aarch64_unknown_linux_gnu=aarch64-linux-gnu-g++
    export PKG_CONFIG_PATH=/usr/lib/aarch64-linux-gnu/pkgconfig
    export PKG_CONFIG_ALLOW_CROSS=1
else
    echo "Unknown target: $INPUT_TARGET" && exit 1
fi

bash .github/actions/build.sh