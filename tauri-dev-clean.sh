#!/bin/bash
# Clean snap-polluted environment variables before running tauri dev

# Unset snap-specific GTK/GIO variables
unset GTK_PATH
unset GTK_EXE_PREFIX  
unset GTK_IM_MODULE_FILE
unset GIO_MODULE_DIR
unset GSETTINGS_SCHEMA_DIR
unset LOCPATH

# Restore original XDG variables if they exist
if [ -n "$XDG_DATA_DIRS_VSCODE_SNAP_ORIG" ]; then
    export XDG_DATA_DIRS="$XDG_DATA_DIRS_VSCODE_SNAP_ORIG"
fi

if [ -n "$XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG" ]; then
    export XDG_CONFIG_DIRS="$XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG"
fi

# Remove snap paths from PATH if needed (optional, usually not necessary)
# export PATH=$(echo "$PATH" | tr ':' '\n' | grep -v '/snap/' | tr '\n' ':' | sed 's/:$//')

echo "Cleaned environment variables:"
echo "GTK_PATH: ${GTK_PATH:-<unset>}"
echo "GIO_MODULE_DIR: ${GIO_MODULE_DIR:-<unset>}"
echo ""

# Run tauri dev with Node.js from fnm
fnm use 22 && pnpm tauri dev
