# Development Environment Fix

## Problem
Running `pnpm tauri dev` failed with WebKit2GTK errors when launched from VS Code:

```
/usr/lib/x86_64-linux-gnu/webkit2gtk-4.1/WebKitNetworkProcess: symbol lookup error: 
/snap/core20/current/lib/x86_64-linux-gnu/libpthread.so.0: undefined symbol: 
__libc_pthread_init, version GLIBC_PRIVATE
```

## Root Cause
VS Code (snap version) sets environment variables that point to snap directories:
- `GTK_PATH=/snap/code/215/usr/lib/x86_64-linux-gnu/gtk-3.0`
- `GTK_EXE_PREFIX=/snap/code/215/usr`
- `GIO_MODULE_DIR=/home/carl/snap/code/common/.cache/gio-modules`
- `GSETTINGS_SCHEMA_DIR=/home/carl/snap/code/215/.local/share/glib-2.0/schemas`

When webkit2gtk subprocess launches, it inherits these variables and loads GTK/GIO modules from snap, which then loads snap's incompatible libpthread library instead of the system one.

## Solution
Created `tauri-dev-clean.sh` script that:
1. Unsets snap-polluted GTK/GIO environment variables
2. Restores original XDG paths from `*_VSCODE_SNAP_ORIG` variables
3. Runs `pnpm tauri dev` in the cleaned environment

## Usage

### Run dev mode with clean environment:
```bash
./tauri-dev-clean.sh
```

### Or add to package.json:
```json
"scripts": {
  "tauri:dev": "./tauri-dev-clean.sh"
}
```

Then run:
```bash
pnpm tauri:dev
```

## Notes
- Production builds (AppImage) work fine because they bundle their own libraries
- This issue only affects dev mode when running from snap-based VS Code
- The fix does not modify system configuration, only the runtime environment
- Hot reload and all dev features work normally after applying this fix

## Related Issues
- https://github.com/tauri-apps/tauri/issues/8665
- https://github.com/tauri-apps/tauri/issues/6430
- https://bugs.launchpad.net/ubuntu/+source/snapd/+bug/1951491
