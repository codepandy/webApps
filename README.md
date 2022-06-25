# 背景

开发一些自己的小功能网站

## 技术架构

create-react-app 于 2022 年 6 月创建。

## 打包路径变更

因为我是部署在 github pages 上，所以文件夹名要求是 docs，因此更改为了 docs。
更改位置在`config/paths.js`中
这里是对项目一些路径的定义

```js
const buildPath = process.env.BUILD_PATH || "docs";
```

## 项目部署子文件夹的配置

我的 github 有主要的部署项目，因此所有的其他项目部署都需要一个前缀来区分。
比如这个项目就是`webApps`，因此所有的资源路径都得加上`/webApps/`才行，比如：`/webApps/favicon.icon`
这个是 webpack 在打包的时候，是`output`的`publicPath`属性来决定的，因此直接配置这个属性就行了。

```js
output:{
    publicPath: paths.publicUrlOrPath,
}
```

但是 `create-react-app` 对路径都做了封装，在 paths.js 文件中，因此修改 paths 中的定义即可。

```js
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
);
```

从上面代码可以看出，这个路径读取的是 package.json 的 homepage 属性，因此直接配置 package.json 的 homepage 即可。

## 增加本地打包命令

配置了 homepage 后，虽然打包提交到 github 没问题，但是打本地包测试很麻烦，需要删除 homepage 的配置才能行，不然路径就不对。

因此我增加了一个打本地包的命令

```js
"scripts"{
    "build:locale": "cross-env BUILDFORLOCAL=true node scripts/build.js",
}
```

homepage 影响到两个地方：

1. 一个是 webpack 打包的时候用的，就是 output 的 publicpath
2. 一个是 public/index.html 文件中直接引用的资源路径

这个两个用的都是 paths.js 文件中的 publicUrlOrPath，因此修改 publicUrlOrPath 就行了。

```js
const tmpPublickPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
);
// 本地构建，这本地测试时就不需要改homepage的值了
const isBuildForLocal = process.env.BUILDFORLOCAL === "true";
const publicUrlOrPath = isBuildForLocal ? "" : tmpPublickPath;
```

如果是本地打包就用空路径，上线就用配置的路径，搞定。
同时把线上和本地的打包路径也做了区分，本地的打包还有 build，线上使用 docs
