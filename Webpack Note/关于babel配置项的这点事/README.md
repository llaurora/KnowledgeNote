# 关于 babel 配置项的这点事

[TOC]

## 说明

1. babel是什么
2. babel的plugins有什么作用
3. babel的presets有什么作用
4. babel/polyfill做什么用，现在有什么变化
5. 什么是transform-runtime
6. core-js是什么，它是怎么与babel集成使用的，core-js@3与core-js@2有什么变化
7. 什么是babel/register
8. 如何选择babel的配置方式？各个配置方式的应用场景是怎样的
9. babel的配置options中各个选项的含义和作用
10. 常见的babel使用方式都有哪些
11. 如何升级babel7.x，目前其它与babel结合使用的工具，如webpack，对babel7.x的支持情况咋样？
12. babel的api能做什么

看看 [babel 官网](https://babeljs.io/docs/en/)，看看这些这位 [流云诸葛](http://blog.liuyunzhuge.com/) 老铁写的 [babel 系列]([http://blog.liuyunzhuge.com/2019/08/23/babel%E8%AF%A6%E8%A7%A3%EF%BC%88%E4%B8%80%EF%BC%89/](http://blog.liuyunzhuge.com/2019/08/23/babel详解（一）/))，应该是能解惑的！

以下所写内容仅为了记录梳理、实践如何去选择 babel 的配置方式、怎么去写 babel 的配置文件 。



## babel 是什么？

简单来说，babel 就是一个 JavaScript 的语法编译器，主要用于将 ECMAScript 2015+ 代码转换为向后兼容的 JavaScript 版本，以便能够运行在当前和旧版本的浏览器或其他环境中。

* 把 ES6 的代码转换为 ES5 代码，这样即使代码最终的运行环境（如浏览器）不支持 ES6，在开发期间也能使用最新语法提升开发效率和质量；
* 有些 ES6 最新 Api，目标运行环境还没有普遍提供实现，babel 借助 core-js 对可以自动给 js 代码添加polyfill，以便最终在浏览器运行的代码能够正常使用那些 api；babel 始终能提供对最新 ES 提案的支持；
* ......



## 最新 babel 相关的 npm 包前面的 @ 符号是什么含义

从 babel7.0 开始，babel 一系列的包都以`@babel`开头，这个跟 babel 没关系，是npm包的一种形式，详细介绍可参考 [npm-scope](https://docs.npmjs.com/misc/scope.html)。

简单来说，@ 符号开始的包，如`@babel/preset-env`，代表的是一类有 scope 限定的 npm 包。scope 通常的含义代表的就是一个公司或者一个机构、甚至个人，它的作用就是将同一个主体的相关包都集中在一个范围内来组织和管理，这个范围就是 scope。这类有 scope 的包，最大的好处就是只有 scope 的主体公司、机构和个人，才能往这个 scope 里面添加新的包，别人都不行。也就是说以 @ 开头的 npm 包，一般是官方自己推出或者官方认可推出的包，比较有权威性质。

这类包的安装，与普通的包安装没有太大区别，就是前面要加上 scope 限定而已`@myorg`

```shell
npm install @myorg/mypackage --save-dev
```

或者是 

```jso
{
    "devDependencies": {
      "@myorg/mypackage": "^1.3.0"
    }
}
```

没有 scope 限定的普通 npm 包，安装在`node_modules/packagename`这个文件夹下，而 scope包，则安装在`node_modules/@myorg/mypackage`这个文件夹下，相比之下，scope包多了一层`@myorg`的文件夹。所以引入scope 包的时候，也必须带上这个 scope 文件夹：

```json
require('@myorg/mypackage');
```

Node.js 并没有对 scope 进行特殊处理，之所以要写成`require('@myorg/mypackage')`，也仅仅是因为这个包放在`node_modules/@myorg`文件夹下而已。



## @babel/core

Babel 的核心功能包含在 `@babel/core` 模块中。看到 `core` 这个词了吧，意味着**核心**，没有它，在 `babel` 的世界里注定寸步难行。不安装 `@babel/core`，无法使用 `babel` 进行编译。



## @babel/cli

`babel` 提供的命令行工具，可以直接通过命令行对文件或文件夹进行转换；类似 `webpack-cli` 之于 `webpack`。

> * babel 也可以跟 webpack、gulp 等构建工具结合起来使用，当跟他们结合时，babel 将由构建工具自动调用，而且这也是目前前端开发中，babel 最常见的使用方式；
>
> * 在这儿介绍使用 @babel/cli，通过命令行对文件或文件夹进行转换，只是方便测试 babel 的特性；

@babel/cli可以在全局安装，但建议在项目中安装，主要原因有二：

1. 同一台电脑上的不同项目依赖 babel 版本可能并不相同，在项目中安装可以独立的去设置 babel 版本；
2. 对当前使用环境没有隐形依赖，方便项目设置；

`npm init`初始化项目并在项目中安装

```shell
npm install --save-dev @babel/core @babel/cli
```

完成安装之后，`package.json`会多出以下内容

```diff
{
  "devDependencies": {
+   "@babel/cli": "^7.0.0",
+   "@babel/core": "^7.0.0"
  }
}
```

这样就把 babel 的核心库以及 babel 的命令行管理工具，安装到项目的依赖里面了。



## babel 之 plugins

> Now, out of the box Babel doesn't do anything. It basically acts like `const babel = code => code;` by parsing the code and then generating the same code back out again.You will need to add plugins for Babel to do anything

不做任何配置开箱即用的 babel，是什么也不做的，输入什么输出就是什么，行为基本类似 `const babel = code => code`，需添加 plugins 或者 presets 配置才能起作用。

为便于测试代码，初始化一个项目，安装 babel 命令行工具，新建 babel 配置文件 `babelrc.config.js`，添加两子文件`src`和`dist`，为方便演示在`src`文件夹下再建一`index.js`，最终建好的项目文件夹结构如下：

```json
.
├── babel.config.js
├── dist
├── node_modules
├── package-lock.json
├── package.json
└── src
    └── index.js

```

```json
// package.json
{
  "name": "babel-note",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.7.4",
    "@babel/core": "^7.7.4"
  }
}
```

为了更加方便地使用 @babel/cli，在这儿配置 [npm-run-script](https://docs.npmjs.com/cli/run-script.html) 的方式运行，于是 `package.json`

> 当然除了这种方式，还可以使用 `npx` 或者 `./node_modules/.bin/babel`的命令方式，详情查看 [@babel/cli 之 Usage](https://babeljs.io/docs/en/babel-cli#docsNav)

```diff
{
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
+   "compiler": "babel src --out-dir dist"
  }
}
```

运行`npm run compiler`的时候，其实就是运行的`package.json`里面`scripts`下面的`compiler`命令，把`src`文件夹下的所有 js，全部输入到 `babel`，转换完成后，输出存储到`dist`文件夹。

在`src`下的`index.js`编写如下 ES 代码

```javascript
const func = () => {};
```

运行`npm run compiler`，转换完成后，查看`dist`目录下的`index.js`，会发现其实内容并没有任何变化，因为在开始也说了，不做任何配置的 babel，什么也不做，基本输入是什么输出就是什么（可能会有一些格式上的变化）。

### 开始使用

针对上面代码里面用到了 ES6 的 `const`命令以及`箭头函数`，需要相应的 plugin 来进行转换：

* @babel/plugin-transform-arrow-functions
* @babel/plugin-transform-block-scoping

安装相应的 npm 包，并在 `babelrc.config.js`中配置相应的 plugin

 ```diff
+ module.exports = {
+    plugins: [
+        '@babel/transform-arrow-functions',
+        '@babel/transform-block-scoping'
+    ]
+ };
 ```

`@babel/transform-arrow-functions` 其实是 `@babel/plugin-transform-arrow-functions` 的缩写，详情查看[Plugins 之 Plugin Shorthand](https://babeljs.io/docs/en/plugins)。

再次运行命令，并查看`dist`目录下的`index.js`，会发现内容被转换了

```javascript
var func = function () {};
```

### plugin 分类

1. syntax 语法类；
2. transform 转换类；
3. proposal 也是转换类，指代那些对 ES Proposal 进行转换的 plugin；

Babel 编译代码的过程可分为三个阶段：解析（parsing）、转换（transforming）、生成（generating），这三个阶段分别由 @babel/parser、@babel/core、@babel/generator 执行。

语法类插件作用于 @babel/parser，负责将代码解析为抽象语法树（AST）（官方的语法插件以 babel-plugin-syntax 开头）；转换插件作用于 @babel/core，负责转换 AST 的形态（官方的转换插件以 @babel/plugin-transform（正式）或 @babel/plugin-proposal（提案）开头）。

语法类插件虽名为插件，但其本身并不是用来转换代码的，而是用来对 ECMAScript 2015+ 新的语法特性进行解析的，如果直接使用 syntax plugin，代码不会有任何转换，要对新语法进行转换，就必须使用对应的 transform plugins，syntax plugin 会被 transform plugin 依赖，作用于 @babel/parser 用于语法解析。也就是说当使用某一个 transform 类或 proposal 类的插件时，如果需要做某个语法转换，则相应的 syntax 类插件，会自动启用，也因此在使用 babel 的时候，语法类插件，并不需要单独配置，比如说 `@babel/plugin-transform-typescript` 这个转换类插件，是用来转换 typescript 的，从它源码的 `package.json` 可以看到，它依赖了`@babel/plugin-syntax-typescript ` 这个 syntax 类的 plugin

```json
...
 "dependencies": {
    "@babel/helper-create-class-features-plugin": "^7.7.4",
    "@babel/helper-plugin-utils": "^7.0.0",
    "@babel/plugin-syntax-typescript": "^7.7.4"
  },
...
```



## babel 配置文件 `babel.config.js`

> babel 的配置文件还可以是 `.babelrc`、`.babelrc.js`以及`.babelrc.cjs`等，详情参考官方文档[Config Files](https://babeljs.io/docs/en/config-files)。

`babel.config.js` 常见配置结构如下

```javascript
const presets = [];
const plugins = [];

module.exports = {presets, plugins}
```

> `presets` 可以理解为 一组 `plugins`

其中 presets 数组用来配置 babel 的 presets，plugins 数组用来配置 babel 的 plugins。presets 和 plugins 都可以配置多个。

`plugins` 是一个数组，它的每个元素代表一个单独的 plugin（`presets` 同理）

```javascript
["pluginA", ["pluginA", {}]]
```

元素有两种类型：

1. 纯字符串，用来标识一个 plugin；
2. 另外一个数组，这个数组的第一个元素是字符串，用来标识一个 plugin，第二个元素，是一个对象字面量，可以往 plugin 传递 options 配置；

纯字符串形式的 plugins 元素，是数组形式的简化使用。因为 plugin 是可以配置 option 的，所以纯字符串的plugin 元素，相当于全部使用 options 的默认值，不单独配置。

### Plugin and Preset 启用顺序

如果有这么多个 plugin，对源代码进行解析，肯定要有一个处理的先后顺序，前一个 plugin 的处理结果，将作为下一个plugin的输入，所以 babel 规定了 plugin 的启用顺序。

* 配置中 plugins 内直接配置的 plugin ，先于 presets 中的 plugin；
* 配置中 plugins 数组内的 plugin，按照数组索引顺序启用；
* 配置中 presets 数组内的 presets，按照数组索引顺序倒序启用，也就是先应用后面的 presets，再应用前面的 preset；

```javascript
{
  "plugins": ["@babel/plugin-proposal-decorators", "@babel/plugin-proposal-class-properties"]
}
```

先启用 `@babel/plugin-proposal-decorators`，然后才是 `@babel/plugin-proposal-class-properties`

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

先启用 `@babel/preset-react`，然后才是 `@babel/preset-env`。

### Plugin and Preset options

babel 官方文档对 plugin 和preset 的配置有明确的声明，而且 plugin 和 preset 的配置方式是一致的，详情查看[Options 之 Plugin and Preset options](https://babeljs.io/docs/en/options)。

每个 plugin/ preset 的 options 其实都不一样，在此记录几个在 babel 官方文档中经常出现的 option：

* `loose`：启用松散式的代码转换

  假如某个插件支持这个 option，转换后的代码，会更加简单，代码量更少，但是不会严格遵循 ES 的规格，通常默认是 false。

* `spec`：启用更加符合 ES 规范的代码转换

  默认也是false，转换后的代码，会增加很多 helper 函数，代码量更大，但是代码质量更好。

* `legacy`：启用旧的实现来对代码做转换

  比如由于 ES6 的 decorators 语法有了新的编写方式，所以 babel7 把 `@babel/plugin-proposal-decorators`插件默认对ES6 decorators语法的转换，启用了新写法的转码，如果在编码时，还在使用旧的 ES6的 decorators 语法，则在使用这个插件的时候，应该启用`legacy`这个配置选项，以便这个插件，仍能对旧语法进行转码。

* `useBuiltIns`

  如果为 true，则在转换过程中，会尽可能地使用运行环境已经支持的实现，而不是引入 polyfill。

举例来说：`@babel/plugin-proposal-object-rest-spread`这个插件，在 babel7 里面，默认转换行为等同于`spec: true`，所以它不再提供 `spec` 这个 option，下面这段代码

```javascript
var obj = {a: 100, b: 200};
var copy = {...obj};
```

转换为

```javascript
function ownKeys(object, enumerableOnly) { ... }

function _objectSpread(target) { ... }

function _defineProperty(obj, key, value) { ... }

var obj = {
  a: 100,
  b: 200
};

var copy = _objectSpread({}, obj);
```

这个插件支持 `loose` 和 `useBuiltIns` 这两个 option 。

如果启用`loose`则代码会转换为

```javascript
function _extends() { ... }

var obj = {
  a: 100,
  b: 200
};

var copy = _extends({}, obj);
```

如果同时启用 `loose` 和 `useBuiltIns`，则代码会转换为

```javaScript
var obj = {
  a: 100,
  b: 200
};
var copy = Object.assign({}, obj);
```



## babel 之 Presets

上面例子在对

```javascript
const func = () => {};
```

进行代码转换的时候，需要去配置一个插件集 `@babel/plugin-transform-arrow-functions`和 `@babel/plugin-transform-block-scoping `来进行代码转换，而这也就要求我们对自己所需的插件非常清楚才行，可是 ES6 那么多新的语法，我们要一个个的去找对应的插件然后进行配置转换？所以官方推出了 presets 是用来简化 plugins 的使用的，可以理解为 presets 为一组 plugins。

目前官方推荐的 preset，有下面四个：

* [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
* [@babel/preset-flow](https://babeljs.io/docs/en/babel-preset-flow)
* [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)
* [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)

其它的 preset，如state-x, es2015 这些从 babel7 开始已经不推荐使用了。

而且还可以自定义一个 preset，preset 的启用顺序以及配置项 options，上面已有介绍。

关于 presets 的更多详情参考 [官网 Presets](https://babeljs.io/docs/en/presets)。



## @babel/preset-env

> 官网传送门：[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)

这应该是当前 babel 最重要的一个 preset了，它可以根据我们对 `browserslist` 的配置，在转码时自动根据我们对转码后代码的目标运行环境的最低版本要求，采用更加“聪明”的方式进行转码，如果我们设置的最低版本的环境，已经原生实现了要转码的 ES 特性，则会直接采用 ES 标准写法；如果最低版本环境，还不支持要转码的特性，则会自动注入对应的 polyfill（语法填充）。

`@babel/preset-env` 实现依赖于 [`browserslist`](https://github.com/browserslist/browserslist) 、[`compat-table `](https://github.com/kangax/compat-table) 和  [`electron-to-chromium`](https://github.com/Kilian/electron-to-chromium)等。

* `browserslist` 是在不同的前端工具之间共用目标浏览器和 node 版本的配置工具，在 [Autoprefixer](https://github.com/postcss/autoprefixer)、[eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat) 以及  [stylelint](https://stylelint.io/) 等当中都有用到它，更多详情查看 [browserslist 官网](https://github.com/browserslist/browserslist)。

  `@babel/preset-env` 默认使用`browserslist`的配置，除非手动设置 [targets](https://babeljs.io/docs/en/babel-preset-env#targets)  或者 [ignoreBrowserslistConfig](https://babeljs.io/docs/en/babel-preset-env#ignorebrowserslistconfig) 选项。

* `compat-table` 和 `electron-to-chromium` 帮助 `@babel/preset-env`，知道 ECMAScript 2015+ 的特性，在不同的平台、不同的运行环境中，都是从哪个版本开始原生支持的。

`@babel/preset-env` 已不再支持所有 stage-x 的 plugins，可以通过查看 `@babel/preset-env` 的 `package.json`文件，知道它需要哪些 plugins。

下面是 `@babel/preset-env 7.7.4 版本`的插件依赖

```json
"dependencies": {
    "@babel/helper-module-imports": "^7.7.4",
    "@babel/helper-plugin-utils": "^7.0.0",
    "@babel/plugin-proposal-async-generator-functions": "^7.7.4",
    "@babel/plugin-proposal-dynamic-import": "^7.7.4",
    "@babel/plugin-proposal-json-strings": "^7.7.4",
    "@babel/plugin-proposal-object-rest-spread": "^7.7.4",
    "@babel/plugin-proposal-optional-catch-binding": "^7.7.4",
    "@babel/plugin-proposal-unicode-property-regex": "^7.7.4",
    "@babel/plugin-syntax-async-generators": "^7.7.4",
    "@babel/plugin-syntax-dynamic-import": "^7.7.4",
    "@babel/plugin-syntax-json-strings": "^7.7.4",
    "@babel/plugin-syntax-object-rest-spread": "^7.7.4",
    "@babel/plugin-syntax-optional-catch-binding": "^7.7.4",
    "@babel/plugin-syntax-top-level-await": "^7.7.4",
    "@babel/plugin-transform-arrow-functions": "^7.7.4",
    "@babel/plugin-transform-async-to-generator": "^7.7.4",
  	...
    "@babel/plugin-transform-unicode-regex": "^7.7.4",
    "@babel/types": "^7.7.4",
    "browserslist": "^4.6.0",
    "core-js-compat": "^3.1.1",
    "invariant": "^2.2.2",
    "js-levenshtein": "^1.1.3",
    "semver": "^5.5.0"
  },
```

> babel7 把还处于 proposal 阶段的 plugin 都命名为了 `-proposal` 形式的plugin，非 proposal 的 plugin 都变为 `-transform`形式的 plugin 了（更多详情查看 [Upgrade to Babel 7](https://babeljs.io/docs/en/v7-migration#switch-to-proposal-for-tc39-proposals-blog-2017-12-27-nearing-the-70-releasehtml-renames-proposal)）。
>
> #### [Switch to  -proposal-  for TC39 Proposals](https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release.html#renames-proposal)
>
> This means any plugin that isn't in a yearly release (ES2015, ES2016, etc) should be renamed to `-proposal`. This is so we can better signify that a proposal isn't officially in JavaScript.
>
> Examples:
>
> * `@babel/plugin-transform-function-bind` is now `@babel/plugin-proposal-function-bind` (Stage 0)
> * `@babel/plugin-transform-class-properties` is now `@babel/plugin-proposal-class-properties` (Stage 3)
>
> This also means that when a proposal moves to Stage 4, we should rename the package.

而上面的 `package.json` 为什么还会包含几个`-proposal` 的plugin 呢？这是因为以上几个 `-proposal` 的 plugin 在阅读这篇文章的时候可能已经进展到 `stage-4`了，它变为`-trasform`的 plugin 是早晚的事，所以 `@babel/preset-env` 才会包含它们。

由于 proposal 会不断地变化，意味着 `@babel/preset-env` 也会跟着调整，所以保持`@babel/preset-env` 的更新，在平常的项目中也是比较重要的一项工作。**而也正是因为这一点，所以`@babel/preset-env`不是万能的。 如果我们用到某一个新的 ES 特性，还处于 proposal 阶段，而且 `@babel/preset-env` 不提供转码支持的话，就得自己单独配置 plugins 了。**

### @babel/preset-env 之 options

* `spec`：作用同前面所述，启用松散式的代码转换

  这个 option 会传递到 preset 内部的 plugin，如果 plugin 支持这个 option,  spec 就会传给它。

* `loose`：作用同前面所述，启用更加符合 ES 规范的代码转换

  这个 option 会传递到 preset 内部的 plugin，如果 plugin 支持这个 option, loose 就会传给它。

* `debug`：开启转码的调试，输出到 console.log

*  `targets`：用于配置项目支持的目标环境

  `string | Array | { [string]: string }`, defaults to `{}`.

  当设置为对象时，具有 `node`、`safari`、`browsers`等选项。当不进行任何设置的时候，`@babel/preset-env`会默认使用`browserslist`的配置。而如果不进行任何设置也没有`browserslist`的配置，`@babel/preset-env`默认会转换所有 ECMAScript 2015+ 代码，并不推荐这么做，这样的话没有利用到`@babel/preset-env`支持特定浏览器的能力。

* `modules`：用于配置是否启用将 ES6 模块转换其它规范的模块

  `"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`, defaults to `"auto"`.

  默认 "auto" 把 ES6 定义的模块转为 Commonjs 定义。但是结合 webpack 处理 import 时会做代码优化，把没用到的部分代码删除掉，所以一般 modules 设置为 "false" 而不启用此功能，在 [Vue CLI](https://cli.vuejs.org/zh/) 以及 [Create React App ](https://create-react-app.dev/) 创建的项目里，这个 option 被显示的配置为了 "false"。

  ```javaScript
  // 以下摘自 babel-preset-react-app 源码部分
  [
    // Latest stable ECMAScript features
    require('@babel/preset-env').default,
    {
      // Allow importing core-js in entrypoint and use browserlist to select polyfills
      useBuiltIns: 'entry',
      // Set the corejs version we are using to avoid warnings in console
      // This will need to change once we upgrade to corejs@3
      corejs: 3,
      // Do not transform modules to CJS
      modules: false,
      // Exclude transforms that make all code slower
      exclude: ['transform-typeof-symbol'],
    },
  ]
  ```

* `useBuiltIns`：用于配置`@babel/preset-env`如何处理 polyfills

  `"usage"` | `"entry"` | `false`, defaults to `false`.

  默认 "false"，不会为每个文件自动添加 polyfills，不转换`import "core-js"`和`import "@babel/polyfill" `为单独的语法填充；

  当设置 `useBuiltIns`为 “usage” 或者 “entry” 时，都会把 `core-js`  的 `modules` 注入到转换后的代码里面，充当 polyfills（什么是`core-js` 的 `module` ？请参考 [babel详解（四）: core-js]([http://blog.liuyunzhuge.com/2019/09/02/babel%E8%AF%A6%E8%A7%A3%EF%BC%88%E5%9B%9B%EF%BC%89-core-js/](http://blog.liuyunzhuge.com/2019/09/02/babel详解（四）-core-js/))），而从 babel 7.4.0 版本开始，`@babel/polyfill` 被废弃后，官方推荐直接添加 `core-js` 并设置`corejs`版本

  ```shell
  npm install core-js@3 --save
  # or
  npm install core-js@2 --save
  ```

  注意要安装到 `dependences`。

  > 为什么需要  polyfills ？
  >
  > Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。
  >
  > * 比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象；
  > * 比如一些定义在全局对象上的静态方法比如 Object.assign、Array.from 等；
  > * 比如一些实例上的方法比如 [].includses、[].flat 等；

* `corejs`：指定 `@babel/preset-env` 进行 polyfill 时，要使用的 corejs 版本

  `2`, `3` or `{ version: 2 | 3, proposals: boolean }`, defaults to `2`.

   `core-js` 是第三方写的用于让不支持 ECMAScript 2015+ 特性的浏览器得以支持的库，该作者称其为standard library。` core-js` 现在有 2 个版本在被人使用：v2 和 v3。 所以`@babel/preset-env` 的 `corejs` 这个配置项，可以支持配置 2 或者 3。 但是从以后的角度来看，可以不再关注 core-js v2了，它始终会被 v3 替代，慢慢地大家都会升级到 v3。 

  > `corejs: 2` VS `corejs: 3`： `corejs: 2` only supports global variables (e.g. `Promise`) and static properties (e.g. `Array.from`), while `corejs: 3` also supports instance properties (e.g. `[].flat`).

  如果仅考虑 core-js v3 的话，`@babel/preset-env` 的 `corejs` 这个option，有两种配置：
  
1. `corejs: 3`
  2. `corejs: {version: 3, proposals: boolean}`

  默认情况下，使用 `core-js` 进行 polyfill，只会注入那些 stabled 的 ES 特性，还处于 proposal 阶段的polyfill 则不会注入。 如果需要注入 proposals 阶段的 polyfill，则可以考虑将 `corejs` 配置为：`corejs: {version: 3, proposals: true}`。

  `corejs: {version: 3, proposals: true} `往往搭配`useBuiltIns: 'usage'`一起使用。

  > `corejs`，也可以指定次要版本，从而支持`core-js`次要版本发布的新的 polyfill。 比如现在`core-js`已经是 “3.4.7” 版本，那么就可以把`corejs`配置为`corejs: {version: '3.4}`

更多 options 配置详情查看 [@babel/preset-env 之 options ](https://babeljs.io/docs/en/babel-preset-env)

### @babel/preset-env 之配置实践示例

还是用之前的示例

```json
.
├── babel.config.js
├── dist
├── node_modules
├── package-lock.json
├── package.json
└── src
    └── index.js
```

`package.json`

```json
{
  "name": "babel-note",
  "version": "1.0.0",
  "description": "babel 配置项的这点事",
  "scripts": {
    "compiler": "babel src --out-dir dist"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.7.4",
    "@babel/core": "^7.7.4"
  }
}
```

 `src` 目录下 `index.js`

```javascript
// 新的 JavaScript 语法
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
    getX() {
        return this.x;
    }
}

// 新的内置全局对象
Promise.resolve(32).then(x => console.log(x));

// 实例上的新的方法
[1, [2, 3], [4, [5]]].flat(2);
```

安装`@babel/preset-env`

```diff
// package.json
 "devDependencies": {
+   "@babel/preset-env": "^7.7.4"
  }
```

将`@babel/preset-env`添加到 babel 配置文件的 presets 中

```javascript
// babel.config.js
module.exports = {
    presets: ["@babel/preset-env"]
};
```

1. 不再做任何配置，直接运行 `npm run compiler`，编译后的代码如下

   ```javascript
   "use strict";
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
   
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   }); 
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   ```

   就如前文所说，`@babel/preset-env`默认使用`browserslist`的配置。而如果不设置`target`也没有`browserslist`的配置，`@babel/preset-env`默认的方式会转换所有 ECMAScript 2015+ 代码（默认只转换新的 JavaScript 语法，而不转换新的 API，所以上面`Promise` 和 `[].flat `没有被转换，这儿暂且忽略）。项目有`browserslist`配置文件`.browserslistrc`但是配置为空或者设置`target`为 "{}"，本来此配置项默认也为 "{}"，和不设置`target`也没有`browserslist`的配置效果是一样的

2. 设置项目支持的目标环境

   使用`browserslist`的配置和设置 `@babel/preset-env` 的 `target` 所达到的效果是一样的，如果两者都存在，`browserslist`的配置会失效。在这儿建议使用`browserslist`的配置，此配置文件诸如 [Autoprefixer](https://github.com/postcss/autoprefixer) 之类的也可以使用，毕竟在项目里面对ECMAScript 2015+ 代码的向后兼容的目标环境应该和 [Autoprefixer](https://github.com/postcss/autoprefixer) 对 CSS 代码的向后兼容的目标环境应该一致吧，除非你去手动设置两者的配置项而使两者的目标运行环境一致。

   在项目目录下新建`.browserslistrc`，并设置目标环境，关于`browserslist`的更多详情参看 [官网 **browserslist**](https://github.com/browserslist/browserslist)

   ```json
   .
   ├── babel.config.js
   ├──.browserslistrc
   ├── dist
   ├── node_modules
   ├── package-lock.json
   ├── package.json
   └── src
       └── index.js
   ```

   `.browserslistrc`配置内容如下

   ```json
   last 1 chrome version
   ```

   关于"last 1 chrome version"、"not dead"、“> 0.2%”等含义什么的， [官网 **browserslist**](https://github.com/browserslist/browserslist)上面有具体的解释，[browserslist](https://github.com/browserslist/browserslist) 使用 [Can I Use](http://caniuse.com/) 网站的数据来查询浏览器版本范围。

   然后再次运行`npm run compiler`，编译后的代码如下

   ```javascript
   "use strict";
   
   // 新的 JavaScript 语法
   class Point {
     constructor(x, y) {
       this.x = x;
       this.y = y;
     }
   
     getX() {
       return this.x;
     }
   
   }
   
   // 新的内置全局对象
   Promise.resolve(32).then(x => console.log(x));
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   ```

   可以看到同样的代码，由于设置了较新版本的环境，该目标环境支持了`Class`、`Promose` 以及 `[].flat`，所以没有对代码进行转换（严格来说，是转了，只是转出来的由于目标环境已经支持，所以看起来没什么变化），最终转码的结果减少了

3. 设置`useBuiltIns`为 “entry”

   为便于测试，将目标环境设置为没那么新，且开启`debug`

   `.browserslistrc`：

   ```json
   > 0.2%
   maintained node versions
   not dead
   not op_mini all
   ```

   `babel.config.js`：

   ```javascript
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : "entry",
                   debug: true
               }
           ]
       ]
   };
   ```

   运行`npm run compiler`，会在控制台看到有如下输出

   ```she
   WARNING: We noticed you're using the `useBuiltIns` option without declaring a core-js version. Currently, we assume version 2.x when no version is passed. Since this default version will likely change in future versions of Babel, we recommend explicitly setting the core-js version you are using via the `corejs` option.
   
   You should also be sure that the version you pass to the `corejs` option matches the version specified in your `package.json`'s `dependencies` section. If it doesn't, you need to run one of the following commands:
   
     npm install --save core-js@2    npm install --save core-js@3
     yarn add core-js@2              yarn add core-js@3
     
   [/Users/DlLucky/Documents/babel-note/src/index.js] Import of @babel/polyfill was not found.
   Successfully compiled 1 file with Babel
   ```

   大致意思当启用`useBuiltIns`没有指定`core-js`的版本，如果没有指定，默认指定为 v2.x，而使用 v2.x 需要安装并在文件中引入`@babel/polyfill`。而前面也说过 `@babel/polyfill`自 babel 7.4.0 版开始被废弃了，而且`corejs `选项建议指定为 v3.x

   >  `@babel/polyfill` 这个库原本是 babel 提供 polyfill 的独立库，现在已被废弃，独立存在的价值不大，因为这个库本身等价于
   >
   > ```javascript
   > import "core-js/stable";
   > import "regenerator-runtime/runtime";
   > ```
   >
   > 还有 babel 提供的 polyfill，都是通过间接引用`core-js`的模块来实现的，`core-js@3`现在是一个完全模块化的标准库，每个 polyfill 都是一个单独的文件，所以除了全部引入，还可以考虑单独引入，这样能够减少浏览器等运行环境已经实现了的特性的 polyfill。`@babel/polyfill`是一个粗放的 polyfill 方式，它会无差别地引入所有的 `core-js` 的 stable 状态的特性，这是不符合未来浏览器等运行环境的。
   >
   > 然后`@babel/preset-env`这个 preset，现在提供了`useBuiltIns: "entry"`和`useBuiltIns: "usage"` 两种 polyfill 的方式，这两种方式可根据开发者设置的目标运行环境，自动引入`core-js`最小化的`polyfill modules`组合，更加符合实际需求

   ```diff
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : "entry",
   +               corejs: 3,
                   debug: true
               }
           ]
       ]
   };
   ```

   再次运行`npm run compiler`，会在控制台看到有如下输出

   ```shll
   Using polyfills with `entry` option:
   
   [/Users/DlLucky/Documents/babel-note/src/index.js] Import of core-js was not found.
   Successfully compiled 1 file with Babel.
   
   ```

   这提示我们安装`core-js`并在文件里引入

   ```diff
   // package.json
   + "dependencies": {
   +    "core-js": "^3.4.7"
   + }
   ```

   ```diff
   // src/index.js
   + import 'core-js';
   ```

   再次运行`npm run compiler`，此时不会再有`Import of core-js was not found`提示，可以看到编译后的代码如下

   ```javascript
   "use strict";
   
   require("core-js/modules/es.symbol");
   
   require("core-js/modules/es.symbol.description");
   
   require("core-js/modules/es.array.unscopables.flat");
   
   require("core-js/modules/es.array.unscopables.flat-map");
   
   ... // 中间省略几百个 require
   
   require("core-js/modules/es.promise");
   
   require("core-js/modules/es.promise.finally");
   
   require("core-js/modules/web.queue-microtask");
   
   require("core-js/modules/web.url");
   
   require("core-js/modules/web.url.to-json");
   
   require("core-js/modules/web.url-search-params");
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
   
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   ```

   >  可以看到上面对`Promise`以及`[].flat `都做了处理：`require("core-js/modules/es.promise");`，`require("core-js/modules/es.array.flat");`

   编译下来差不多有 600 多行代码，即使将目标环境设为较新的版本 "last 1 chrome version"，也还是有 180 多行代码。在`useBuiltIns: "entry"`模式下，代码中对 `core-js` 的 import：`import "core-js"`，会根据目标环境的配置，替换为 `core-js` 最底层的对 modules 的引用，如 `require("core-js/modules/es.symbol")`。`core-js` 有很多个 module，虽然源代码只有一行`import "core-js"`，转换后的代码却有 500 多行`require("core-js/modules/...")`。

   而这个方式有问题吗？有的，就是使用的 polyfill 太多了，有的可能整个项目的逻辑都不需要它，这个方式最后生成代码比较大，对前端性能肯定是有影响的；唯一的优点就是省心，不要去考虑哪个文件需要引入哪些`core-js` 的 modules 来 polyfill（语法填充）。

   如何改进呢？
   在开发人员对当前文件所用到的 ES 特性非常熟悉的情况下，可以选择手动地引入`core-js` 的 modules，来避免整体的引用，`src/index.js`变化如下

   ```diff
   // src/index.js
   - import 'core-js';
   + import 'core-js/es/object';
   + import 'core-js/es/promise';
   + import 'core-js/es/array';
   ```

   再次运行`npm run compiler`，编译后的代码如下

   ```javascript
   "use strict";
   
   require("core-js/modules/es.symbol");
   
   require("core-js/modules/es.array.concat");
   
   
   ... // 中间省略几十个 require
   
   require("core-js/modules/es.object.values");
   
   require("core-js/modules/es.promise");
   
   require("core-js/modules/es.promise.finally");
   
   require("core-js/modules/es.string.iterator");
   
   require("core-js/modules/web.dom-collections.iterator");
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
   
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   ```

   差不多有 150  多行代码，这个结果虽然还是不少，但是比直接 `import core-js`要少很多了。 它的机制也是类似的，就是把对`core-js` 的 import，转换为 `core-js`的最小单位 modules 的 import。

   ```javascript
   import 'core-js/es/object';
   import 'core-js/es/promise';
   import 'core-js/es/array';
   ```

   上面三个引用代表的是 `core-js` 的三个命名空间：object、promise 和 array，可能包含多个 modules， 所以转码后，还是有好几十个`require("core-js/modules/...")`

   虽然单独引用 `core-js`的某一部分，能够减少最终转码的大小，但是要求开发人员对 `core-js` 和 ES 特性特别熟悉，否则你怎么知道当前文件需不需要 polyfill，以及要哪些呢？ 所以这个做法，真正使用的时候，难度较大

4. 设置`useBuiltIns`为 “usage”

   "usage" 比起 "entry"，最大的好处就是，它会根据每个文件里面，用到了哪些 ES 的新特性，然后根据我们设置的目标环境判断是否需要 polyfill，如果目标的最低环境不支持某个 ES 特性，则 `core-js`会针对这个 ES 特性注入对应的 module，而且不需要在文件里去手动`import core-js`。

   > 设置为 `useBuiltIn` 为 “usage” 还手动`import core-js`话，控制台会有如下输出
   >
   > ```shell
   > When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
   > Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.
   > ```

   修改`useBuiltIns`配置 "entry" 为 “usage”，修改后的 babel 配置文件 `babel.config.js`内容如下

   ```javascript
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : "usage",
                   corejs: 3,
                   debug: true
               }
           ]
       ]
   };
   ```

   再次运行`npm run compiler`，编译后的代码如下

   ```javascript
   "use strict";
   
   require("core-js/modules/es.array.flat");
   
   require("core-js/modules/es.array.unscopables.flat");
   
   require("core-js/modules/es.object.define-property");
   
   require("core-js/modules/es.object.to-string");
   
   require("core-js/modules/es.promise");
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
    }
     }]);

     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
  return console.log(x);
   });

   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   ```
   
   总共也就差不多 40 行的样子，比使用 `entry` 简化了不少，而且很智能，不需要自己去操心需要哪些polyfill。 这也是为啥`usage`被推荐在项目中使用的原因
   
   目前这样的设置："corejs:  3"，是不会转换 proposal 阶段的代码的，可以在`src/index.js`下增加一个处于 proposal 阶段的特性 [globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 以获取全局对象进行测试
   
   ```diff
   + // proposal 阶段的内置对象
   + globalThis.test = {a: 100};
   ```
   
   再次运行`npm run compiler`，编译后的代码如下
   
   ```javascript
   "use strict";
   
   require("core-js/modules/es.array.flat");
   
   require("core-js/modules/es.array.unscopables.flat");
   
   require("core-js/modules/es.object.define-property");
   
   require("core-js/modules/es.object.to-string");
   
   require("core-js/modules/es.promise");
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
/*#__PURE__*/
   function () {
  function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
   
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
                                                                
   globalThis.test = {
     a: 100
   };
   ```
   
   对比编译后的代码可以发现，`globalThis` 并没有被转换，所以更改配置 "corejs:  3"为 "corejs:  {version: 3, proposals: true} "后 babel 的配置文件 `babel.config.js` 最后的内容如下
   
   ```javascript
   module.exports = {
     presets: [
       [
         "@babel/preset-env",
         {
           useBuiltIns : "usage",
           corejs: {version: 3, proposals: true},
           debug: true
         }
       ]
     ]
   };
   ```
   
      再次运行`npm run compiler`，编译后的代码如下
   
   ```javascript
   "use strict";
   
   require("core-js/modules/es.array.flat");
   
   require("core-js/modules/es.array.unscopables.flat");
   
   require("core-js/modules/es.object.define-property");
   
   require("core-js/modules/es.object.to-string");
   
   require("core-js/modules/es.promise");
   
   require("core-js/modules/esnext.global-this");
   
   function _classCallCheck(instance, Constructor) { ... }
   
   function _defineProperties(target, props) { ... }
   
   function _createClass(Constructor, protoProps, staticProps) { ... }
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       _classCallCheck(this, Point);
   
       this.x = x;
       this.y = y;
     }
   
     _createClass(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
   
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
                                                                
   globalThis.test = {
     a: 100
   };
   ```
   
   对比上面没开启 ”proposals“ 编译后的代码，可以发现多了一条`require("core-js/modules/esnext.global-this");`，这也就是处于 proposal 阶段的 `globalThis` 的 polyfill。



## babel 之 runtime

我们还是沿用上面的例子

```json
.
├── babel.config.js
├──.browserslistrc
├── dist
├── node_modules
├── package-lock.json
├── package.json
└── src
    └── index.js
```

`package.json`

```json
{
  "name": "babel-note",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "compiler": "babel src --out-dir dist"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.7.4",
    "@babel/core": "^7.7.4",
    "@babel/preset-env": "^7.7.4"
  },
  "dependencies": {
    "core-js": "^3.4.7"
  }
}
```

`src`目录下 `index.js`

```javascript
// 新的 JavaScript 语法
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
    getX() {
        return this.x;
    }
}

// 新的内置全局对象
Promise.resolve(32).then(x => console.log(x));

// 实例上的新的方法
[1, [2, 3], [4, [5]]].flat(2);

// proposal 阶段的内置对象
globalThis.test = {a: 100};
```

`.browserslistrc`

```json
> 0.2%
maintained node versions
not dead
not op_mini all
```

babel 配置文件 `babel.config.js`

```javascript
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns : "usage",
                corejs: {version: 3, proposals: true},
            }
        ]
    ]
};
```

运行`npm run compiler`，编译结果如下

`dist`目录下`index.js`

```javascript
"use strict";

require("core-js/modules/es.array.flat");

require("core-js/modules/es.array.unscopables.flat");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/esnext.global-this");

function _classCallCheck(instance, Constructor) { ... }

function _defineProperties(target, props) { ... }

function _createClass(Constructor, protoProps, staticProps) { ... }

// 新的 JavaScript 语法
var Point =
/*#__PURE__*/
function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "getX",
    value: function getX() {
      return this.x;
    }
  }]);

  return Point;
}();

// 新的内置全局对象
Promise.resolve(32).then(function (x) {
  return console.log(x);
});

// 实例上的新的方法
[1, [2, 3], [4, [5]]].flat(2);
                                                             
globalThis.test = {
  a: 100
};
```

其实可以看出两个问题

1. babel 在使用 比如 `@babel/preset-env` 进行转码过程中，会加入很多 babel 自己的 helper 函数（比如 ”_classCallCheck“），这些 helper 函数，在每个文件里可能都会重复存在；
2. 开发者在代码中如果使用了新的 ES API，比如 `Promise`、`generator` 全局对象、`Object.assign`、`[].flat`等，往往需要通过 `core-js` 和 `regenerator-runtime` 给全局环境注入 polyfill（比如 `require("core-js/modules/es.promise");`）。 这种做法，在应用型的开发中，是非常标准的做法。 但是如果在开发一个独立的工具库项目，不确定它将会被其它人用到什么运行环境里面，那么这种扩展全局环境的 polyfill 就不是一个很好的方式；

而这正是需要 `babel的runtime` 的原因，其包含两部分。其中一个部分就是 [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)，是一个可以重复使用 `Babel` 注入的帮助程序，以节省转码后文件大小的插件，它是一个开发环境的依赖（安装到 “devDependencies“）。而且可以帮助项目创建一个沙盒环境，即使在代码里用到了新的 ES API 而需要进行 polyfill，它能将其对应的全局变量，转换为对 `core-js` 和 `regenerator-runtime` 非全局变量版本的引用。这其实也应该看作是一种给代码提供 polyfill 的方式。而且`@babel/plugin-transform-runtime`还得搭配`babel`的一个内部库：[@babel/runtime 使用，它是这是一个生产环境的依赖（安装 ”dependencies“），在 `@babel/plugin-transform-runtime` 作用的过程中，会使用`@babel/runtime`内部的模块，来代替前面看到的重复的 helper 函数、对全局变量有污染的`core-js`和`regenerator-runtime`相关变量。

```she
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

默认情况下，`@babel/plugin-transform-runtime` 是不启用对`core-js`的 polyfill 处理的，所以安装`@babel/runtime`就够了。 但是如果想启用`transform-runtime`对`core-js`的 polyfill 的话，就得使用`@babel/runtime`另外的两个版本。 `core-js@2` 对应的`@babel/runtime`版本是 [`@babel/runtime-corejs2`](https://babeljs.io/docs/en/babel-runtime-corejs2)；`core-js@3`对应的 `@babel/runtime`版本是 [@babel/runtime-corejs3](https://www.npmjs.com/package/@babel/runtime-corejs3) 。

所以根据是否启用`core-js`的 polyfill，以及 `core-js` 的版本，实际使用`babel的runtime`，有三种安装类型：

```shell
# disable core-js polyfill
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime

# enable core-js@2 polyfill
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs2

# enable core-js@3 polyfill
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs3
```

开发者只需根据自己的项目需要，启用一种方式即可。

### babel 之 runtime 之 options

* `corejs`

  `false`, `2`, `3` or `{ version: 2 | 3, proposals: boolean }`, defaults to `false`.

  是否对`core-js`进行 polyfill，以及用哪个版本的`core-js`进行 polyfill。默认 "false"，不对新的 ES API 的进行 polyfill 处理的；

* `helpers`

  `boolean`, defaults to `true`.

  是否对 helpers 函数进行优化处理。默认为 "true"，如果为 "false"，`transform-runtime`就不会对 helpers 函数进行去重提取的处理了

* `regenerator`

  `boolean`, defaults to `true`.

  是否对`regenerator-runtime`进行 polyfill， 默认为 "true"

更多 options 配置详情查看 [@babel/plugin-transform-runtime 之 options](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

###  babel 之 runtime 配置实践战示例

依然沿用上面的例子，只是为了观察 `babel的runtime` 的作用，关闭 `@babel/preset-env` 的 polyfill 功能，`babel.config.js` 配置内容如下

```javaScript
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns : false, // 本来默认也为 false
            }
        ]
    ],
    plugins: [
        ["@babel/plugin-transform-runtime"]
    ]
};
```

并安装 `@babel/plugin-transform-runtime`

```she
npm install --save-dev @babel/plugin-transform-runtime
```

1. 安装 `@babel/runtime`

   ```shell
   npm install --save @babel/runtime
   ```

   运行 `npm run compiler `，编译结果如下

   ```javascript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       (0, _classCallCheck2.default)(this, Point);
       this.x = x;
       this.y = y;
     }
   
     (0, _createClass2.default)(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   
   // proposal 阶段的内置对象
   globalThis.test = {
     a: 100
   };
   ```

   其实从编译结果可以看出以下几点：

   * `babel的runtime ` 把 helper 函数（如在没使用 `babel的runtime` 时，编译后代码里的 “_classCallCheck” ），都转换成了对 `@babel/runtime` 内 modules 的引用；
   * 并没有对新的 ES API 进行 polyfill ，如上面的 `Promise`、`[].flat`以及 proposal 状态的 globalThis；

2. 也正如前面所提到的，`@babel/plugin-transform-runtime` 是不启用对`core-js`的 polyfill 处理的，要想启用的话得使用 `@babel/runtime` 的另外的两个版本，这儿直接选择 `core-js@3`对应的 `@babel/runtime`版本是 [@babel/runtime-corejs3](https://www.npmjs.com/package/@babel/runtime-corejs3) ，为什么不用`core-js@2` 以及 `proposals` 为什么设为 "true" ？前面已提过，这儿不再赘述

   安装 `@babel/runtime-corejs3`，并更改配置为

   ```javascript
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : false,
               }
           ]
       ],
       plugins: [
           [
               "@babel/plugin-transform-runtime",
               {
                   corejs: {version: 3, proposals: true}
               }
           ]
       ]
   };
   ```

   运行 `npm run compiler`，编译结果如下

   ```javascript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
   
   var _flat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/flat"));
   
   var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
   
   var _context;
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       (0, _classCallCheck2.default)(this, Point);
       this.x = x;
       this.y = y;
     }
   
     (0, _createClass2.default)(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
     return Point;
   }();
   
   // 新的内置全局对象
   _promise.default.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   (0, _flat.default)(_context = [1, [2, 3], [4, [5]]]).call(_context, 2);
   
   // proposal 阶段的内置对象
   globalThis.test = {
     a: 100
   };
   ```

   现在可以看到转换后的代码对 `Promise` 的处理引用了`@babel/runtime-corejs3`的内部模块，消除了`Promise` 这个全局变量，不会造成全局变量污染，而且也避免了在每个文件里去添加 helper 函数。

   > 为什么没有对 proposal 的 API 进行 polyfill，失效还是配置问题？

3. 看起来上面的配置是不是很棒棒？可`@babel/plugin-transform-runtime` 对新的 ES API 的 polyfill 的处理，会忽略`browserslist`的配置，将目标环境设为较新的版本 "last 1 chrome version"

   `.browserslistrc`配置内容如下

   ```json
   last 1 chrome version
   ```

   运行 `npm run compiler`，编译结果如下

   ```javascript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
   
   var _flat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/flat"));
   
   var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
   
   var _context;
   
   // 新的 JavaScript 语法
   class Point {
     constructor(x, y) {
       this.x = x;
       this.y = y;
     }
   
     getX() {
       return this.x;
     }
   
   }
   
   // 新的内置全局对象
   _promise.default.resolve(32).then(x => console.log(x));
   
   // 实例上的新的方法
   (0, _flat.default)(_context = [1, [2, 3], [4, [5]]]).call(_context, 2); 
   
   // proposal 阶段的内置对象
   globalThis.test = {
     a: 100
   };
   ```

   可以看到还是有对 `Promise` 、`flat` 的处理，可能唯一的变化是没有 helper 函数了，那是 `@babel/preset-env` 的功能，是不是尴尬了？！但是对代码里面的 generator 函数又能识别，`browserslist`的配置又能生效

   `src`目录下`index.js`

   ```javaScript
   function func() {
       async function inner() {
           await 'Hi'
       }
   }
   ```

   `browserslist`不那么新时，编译结果如下

   ```javaScript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
   
   var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
   
   function func() {
     function inner() {
       return _regenerator.default.async(function inner$(_context) {
         while (1) {
           switch (_context.prev = _context.next) {
             case 0:
               _context.next = 2;
               return _regenerator.default.awrap('Hi');
   
             case 2:
             case "end":
               return _context.stop();
           }
         }
       });
     }
   }
   ```

   `browserslist`为 "last 1 chrome version"，很新的时候，编译结果如下

   ```javascript
   "use strict";
   
   function func() {
     async function inner() {
       await 'Hi';
     }
   }
   ```

   尴尬不尴尬？

4. 那同时启用 `@babel/preset-env` 和 `@babel/plugin-transform-runtime` 的 polyfill 处理，还原 `.browserslistrc`为不那么新的配置，在`src`目录下`index.js`添加 generator 函数 

   ```javascript
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : "usage",
                   corejs: {version: 3, proposals: true}
               }
           ]
       ],
       plugins: [
           [
               "@babel/plugin-transform-runtime",
               {
                   corejs: {version: 3, proposals: true}
               }
           ]
       ]
   };
   ```

   运行 `npm run compiler`，编译结果如下

   ```javascript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
   
   require("core-js/modules/es.object.to-string");
   
   require("core-js/modules/es.promise");
   
   require("core-js/modules/esnext.global-this");
   
   var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
   
   require("regenerator-runtime/runtime");
   
   var _flat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/flat"));
   
   var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
   
   var _context;
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       (0, _classCallCheck2.default)(this, Point);
       this.x = x;
       this.y = y;
     }
   
     (0, _createClass2.default)(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
     return Point;
   }(); 
   
   // 新的内置全局对象
   _promise.default.resolve(32).then(function (x) {
     return console.log(x);
   }); 
   
   // 实例上的新的方法
   (0, _flat.default)(_context = [1, [2, 3], [4, [5]]]).call(_context, 2); 
   
   // proposal 阶段的内置对象
   globalThis.test = {
     a: 100
   };
   
   function func() {
     function inner() {
       return _regenerator.default.async(function inner$(_context2) {
         while (1) {
           switch (_context2.prev = _context2.next) {
             case 0:
               _context2.next = 2;
               return _regenerator.default.awrap('Hi');
   
             case 2:
             case "end":
               return _context2.stop();
           }
         }
       });
     }
   }
   ```

   可以看到对 `Promise` 、`flat` 、`generator`的处理，重复了有没有，是不是尴尬？

5. 讲真，目前的实践看来，只能使用 `@babel/plugin-transform-runtime` 对 helper 函数的处理，至于对新 ES API 的 polyfill 处理还是交给 `@babel/preset-env` 来处理，尽管这样的难免会污染全局变量，而且`@babel/preset-env`  并没有 "regenerator" 选项，为避免重复处理，`@babel/plugin-transform-runtime`选项里将 "regenerator" 设置为 ”false“

   ```javascript
   module.exports = {
       presets: [
           [
               "@babel/preset-env",
               {
                   useBuiltIns : "usage",
                   corejs: {version: 3, proposals: true},
               }
           ]
       ],
       plugins: [
           [
               "@babel/plugin-transform-runtime",
               {
                   regenerator: false
               }
           ]
       ]
   };
   ```

   运行 `npm run compiler`，编译结果如下

   ```javascript
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
   
   require("core-js/modules/es.array.flat");
   
   require("core-js/modules/es.array.unscopables.flat");
   
   require("core-js/modules/es.object.to-string");
   
   require("core-js/modules/es.promise");
   
   require("core-js/modules/esnext.global-this");
   
   require("regenerator-runtime/runtime");
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
   
   // 新的 JavaScript 语法
   var Point =
   /*#__PURE__*/
   function () {
     function Point(x, y) {
       (0, _classCallCheck2.default)(this, Point);
       this.x = x;
       this.y = y;
     }
   
     (0, _createClass2.default)(Point, [{
       key: "getX",
       value: function getX() {
         return this.x;
       }
     }]);
     return Point;
   }();
   
   // 新的内置全局对象
   Promise.resolve(32).then(function (x) {
     return console.log(x);
   });
   
   // 实例上的新的方法
   [1, [2, 3], [4, [5]]].flat(2);
   
   // proposal 阶段的内置对象
   globalThis.test = {
     a: 100
   };
   
   function func() {
     function inner() {
       return regeneratorRuntime.async(function inner$(_context) {
         while (1) {
           switch (_context.prev = _context.next) {
             case 0:
               _context.next = 2;
               return regeneratorRuntime.awrap('Hi');
   
             case 2:
             case "end":
               return _context.stop();
           }
         }
       });
     }
   }
   ```



## 小小总结

如果你问我现在怎么在项目里面去配置 babel，本以为`@babel/plugin-transform-runtime` 可以消除使用`@babel/preset-env` 引起的副作用，奈何实践下来，两者各有千秋，而且 `@babel/plugin-transform-runtime` 在启用 polyfill 处理时处理不了 proposal 的 API，只能选择用`@babel/plugin-transform-runtime` 去处理`@babel/preset-env` 转换代码过程中多余的 helper 函数，其他的都交给 `@babel/preset-env`  处理吧

```javascript
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns : "usage",
                corejs: {version: 3, proposals: true},
            }
        ]
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                regenerator: false
            }
        ]
    ]
};
```



## 参考链接

* [babel 官网](https://babeljs.io/)
* [流云诸葛 babel 系列]([http://blog.liuyunzhuge.com/2019/08/23/babel%E8%AF%A6%E8%A7%A3%EF%BC%88%E4%B8%80%EF%BC%89/](http://blog.liuyunzhuge.com/2019/08/23/babel详解（一）/))
* [不容错过的 Babel 7 知识汇总](https://mp.weixin.qq.com/s/xTfjMG2graIrfGGqhue_Jg)
* [Babel 插件有啥用](https://zhuanlan.zhihu.com/p/61780633)

