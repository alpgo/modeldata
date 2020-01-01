# modeldata

## Describe

- 开发简单易用的HTTP数据层, 结合Typescript的装饰器, 简化VIEW视图层的数据处理.

- 同一份HTTP数据层,应用于不同的VIEW视图层, 展示了同时开发多个应用程序的方法.

## Introduce develop utils 

- lerna     `分包拆分管理项目`
- rollup    `灵活打包项目`
- brower-sync `自动刷新浏览器`
- yarn       `多包管理时,应用了yarn的workspaces`       
- Typescript `展示了多包开发时, Typescript如何查找其他包的智能提示`
- gulp       `前端自动化开发流程`
- mocha      `测试`   

## Build
```
    $ yarn install # 安装依赖包

    $ npm run json # 启动服务器

    $ npm run watch # 自动编译项目

    $ gulp # 浏览器自动打开项目, 并且和自动编译程序配合, 代码自动编译然后及时看到效果
```