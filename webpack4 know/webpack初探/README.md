## webpack初探

### 目录

##### &sect;[1.webpack是什么？](#what-webpack)

在这儿我们先用原始的方式去做我们的网页开发，大致代码：

```html
---------------------index.html---------------------
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>原始网页开发</title>
</head>
<body>
    <h3>这是我们的网页内容</h3>
    <div id="root"></div>
<script src="./index.js"></script>
</body>
</html>
```



```javascript
---------------------index.js---------------------
var dom = document.getElementById('root');

var header = document.createElement('div');
header.innerText = 'Header';
dom.append(header);

var content = document.createElement('div');
content.innerText = 'Content';
dom.append(content);
```

