# 研享社后台管理系统

> 终端命令需在项目内运行

#### 依赖安装
```
//
npm i           // 项目依赖安装
// 自动安装全局依赖以及项目依赖
// 如果全局依赖有权限问题可手动执行 sudo npm i -g pm2 commitizen
```

#### 开发
```
npm run wds     // 前端 hot load 开发和 Node 开发
npm run local   // Node 开发
```

#### 部署
```
npm run build   // 打包前端代码
npm run dev     // 开发环境部署
npm run qa      // 测试环境部署
npm run prod    // 正式环境部署

文件权限
asset: 前端代码构建创建，读写权限
log: 日志文件，读写权限
upload: 文件上传临时存放，读写权限
```

#### 代码提交
```
git pull        // 开发新功能之前拉取最新代码
git status      // 查看状态
git add xx/xx   // 添加需要提交的代码文件,禁止使用 git add . 提交所有
git cz          // 按照模板选择 commit message
或者
npm run cz      // 同 git cz 在没有全局安装 commitizen 时使用
git push        // 提交代码
```
> 注意:
> 确保依赖包都安装完成，否则会报错

#### 相关阅读:
[Git commit message 规范工具](https://github.com/pigcan/blog/issues/15)
