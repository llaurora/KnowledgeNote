# Package Manager

| Name                           | Pnpm                              | Yarn                              | Npm                                |
| ------------------------------ | --------------------------------- | --------------------------------- | ---------------------------------- |
| 项目初始化                     | pnpm init                         | yarn init                         | npm init                           |
| 安装依赖                       | pnpm install                      | yarn install 或者 yarn            | npm install                        |
| 添加生产环境依赖               | pnpm add [package]                | yarn add [package]                | npm install [package] —save        |
| 添加开发环境依赖               | pnpm add -D [package]             | yarn add [package] -D             | npm install [package] --save-dev   |
| 卸载依赖                       | pnpm remove [package]             | yarn remove [package]             | npm uninstall [package]            |
| 清除缓存                       |                                   | yarn cache clean [package]        | npm cache clean                    |
| 添加全局依赖                   | pnpm add [package] --global       | yarn global add [package]         | npm install [package] --global     |
| 删除全局安装的依赖             | pnpm remove [package] --global    | yarn global remove [package]      | npm uninstall -g [package]         |
| 更新全局安装的依赖             | pnpm update [package] —global     | yarn global upgrade [package]     | npm update [package] --global      |
| 更新全局所有依赖               | pnpm update —global               | yarn global upgrade               | npm update --global                |
| 更新当前目录下的所有依赖       | pnpm update                       | yarn upgrade                      | rm -rf node_modules && npm install |
| 手动更新当前目录下的依赖       | pnpm update --interactive -latest | yarn upgrade-interactive --latest |                                    |
| 查看依赖的历史版本             | pnpm view [package] versions      |                                   | npm view [package] versions        |
| 运行 package.json 中预定义脚本 | pnpm                              | yarn run                          | npm run                            |
| 查看配置信息                   | pnpm config list                  | yarn config list                  | npm config list                    |
| 更换仓库地址                   |                                   | yarn config set registry 仓库地址 | npm config set registry 仓库地址   |
| 将包发布到 npm                 |                                   | yarn publish                      | npm publish                        |
| 删除 store 中未被引用的依赖    | pnpm store prune                  |                                   |                                    |

