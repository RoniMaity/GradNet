git commit -m "fix(build): resolve lightningcss missing binary error on macOS arm64
- Perform clean reinstall of dependencies to ensure platform-specific binaries are correctly fetched.
- Fixes 'Cannot find module ../lightningcss.darwin-arm64.node' build error.
"


git commit -m "fix(build): resolve lightningcss missing binary error on macOS arm64

- Configure Next.js Webpack to treat 'lightningcss' as an external dependency.
- This prevents Webpack from attempting to bundle the native binary, allowing the Node.js runtime to resolve it correctly.
- Fixes 'Cannot find module ../lightningcss.darwin-arm64.node' build error.
"