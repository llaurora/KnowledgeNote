## webpack初探

### webpack究竟是什么？

原始的网页开发：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>原始网页开发</title>
</head>
<body>
  <div id="root"></div>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
// index.js

var root = document.getElementById('root');

var header = document.createElement('div');
header.innerText='header';
root.append(header);

var content = document.createElement('div');
content.innerText='content';
root.append(content);
```

如上采用`面向过程`的方式来写代码，所有的Js逻辑都堆在一个文件里，这个文件会堆得越来越长，最终变得难以维护。

后我们采用`面向对象`的方式来写代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>原始网页开发</title>
</head>
<body>
  <div id="root"></div>
  <script src="./header.js"></script>
  <script src="./content.js"></script>
  <script src="./index.js"></script>
</body>
</html>
```

```javascript
// header.js
function Header() {
  var header = document.createElement('div');
  header.innerText='header';
  root.append(header);
}

// content.js
function Content() {
  var content = document.createElement('div');
  content.innerText='content';
  root.append(content);
}

// index.js
var root = document.getElementById('root');

new Header();
new Content();

```

使用如上面向对象的方式确实在一定程度上提高了代码的可维护性，但同时也存在如下问题：

* http请求增加；
* 从代码中看不出js文件之间的依赖关系；

* 对引入js文件的顺序有要求；

我们再来改造一下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack-learn</title>
</head>
<body>
  <div id="root"></div>
  <script src="./index.js"></script>
</body>
```

```javascript
// index.js
//ES Moudle 模块引入方式
import Header from './header.js';
import Content from './content.js';

new Header();
new Content();

// header.js
function Header() {
  var root = document.getElementById('root');
  var header = document.createElement('div');
  header.innerText='header';
  root.append(header);
}

// content.js
function Content() {
  var root = document.getElementById('root');
  var content = document.createElement('div');
  content.innerText='content';
  root.append(content);
}

```

但这样直接运行的话，会报错`Uncaught SyntaxError: Unexpected identifier`，因为浏览器压根就不认识`ES Module 模块引入方式`。这个时候 `webpack` 就派上用场了，虽然浏览器不认识，但经`webpack`"翻译”之后就能识别了。

在上面代码基础之上，在当前目录下运行`npm init`并安装`webpack`和`webpack-cli`；运行`npx webpack index.js`(用`webpack`去翻译`index.js`文件)；

![image-20190609174259183](assets/image-20190609174259183.png)

这个时候会发现在目录下多了个`dist`文件夹，`dist`文件夹下多了一个`main.js`文件；

```
.
├── dist
│   └── main.js
├── node_modules
├── index.html
├── index.js
├── header.js
├── content.js
├── package.json
```

现在我们在`index.html`引入经`webpack`"翻译"过后的文件:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack-learn</title>
</head>
<body>
  <div id="root"></div>
  <script src="./dist/main.js"></script>
</body>
</html>
```

现在浏览器里打开`index.html`还是会报错（因为使用了`ES Module`模块引入方式，但`header.js`今儿`content.js`并没有采用`ES Module`模块导出方式），再修改下代码：

```javascript
// index.js
//ES Moudle 模块引入方式
import Header from './header.js';
import Content from './content.js';

new Header();
new Content();

// header.js
function Header() {
  var root = document.getElementById('root');
  var header = document.createElement('div');
  header.innerText='header';
  root.append(header);
}

export default Header


// content.js
function Content() {
  var root = document.getElementById('root');
  var content = document.createElement('div');
  content.innerText='content';
  root.append(content);
}

export default Content
```

再运行`npx webpack index.js`重新"翻译“`index.js`，就能正常打开了。那**webpack就是一个Js代码的翻译器？**



