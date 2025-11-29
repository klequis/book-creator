#!/bin/bash
# Wrapper to run Tauri without snap library conflicts

# Remove snap from library path
export LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"
# Filter out snap paths
export LD_LIBRARY_PATH=$(echo "$LD_LIBRARY_PATH" | tr ':' '\n' | grep -v snap | tr '\n' ':')

# Disable snap preload
unset LD_PRELOAD
unset SNAP_PRELOAD

# Clear GTK module warnings
export GTK_MODULES=

cd "$(dirname "$0")"
fnm use 22
source "$HOME/.cargo/env"

exec pnpm tauri dev
