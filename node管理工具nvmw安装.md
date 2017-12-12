# nvmw安装，用于node版本控制

nvm 是 Mac 下的 node 管理工具，有点类似管理 Ruby 的 rvm，如果是需要管理 Windows 下的 node，官方推荐是使用 nvmw 或 nvm-windows

## § 下载
>自定义文件名定为`Nvmw`
>![](https://i.imgur.com/Y6EyTcl.png)


下载方法：
**⊙** 1、从[git上下载压缩包](https://github.com/hakobera/nvmw) `https://github.com/hakobera/nvmw`，然后解压到`Nvmw`文件下；
**⊙** 1、去到文件下`Nvmw`然后`git clone https://github.com/hakobera/nvmw.git`；

![](https://i.imgur.com/QcZ5PLW.png)

## § 配置环境变量
复制nvmw路径(`E:\Program Files\Nvmw\nvmw`)，我的电脑右键→属性→高级系统设置→高级→环境变量

![](https://i.imgur.com/G1vnYhI.png)

## § 配置完后打开CMD，输入nvmw
>如果正确配置的话可以查看帮助

![](https://i.imgur.com/2lcCCOm.png)

## § 不要高兴的太早，这才是刚刚开始

##### ⊙ 第一个坑
`nvmw`直接g国内是使用不了的，好在这个外国作者也知道中国的国情。提供了如何设置淘宝镜像的方式
```js
set "NVMW_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node"
set "NVMW_IOJS_ORG_MIRROR=http://npm.taobao.org/mirrors/iojs"
set "NVMW_NPM_MIRROR=http://npm.taobao.org/mirrors/npm"
```
>注：每次使用，都得重新在命令行中设置，或者可以这三个变量也设置到环境变量中，或改一下他的源码，把这三个变量写死

![](https://i.imgur.com/9JNySzu.png)

##### ⊙ 第二个坑
我是windows7系统，对应的是x64没错，但是在淘宝NPM镜像站和官方镜像站上对应的都是win-x64 ；
进入nvmw的程序目录：
1、修改nvmw.bat文件137行，x64改为win-x64；
2、修改fget.js文件47行，XMLHTTP 更改为ServerXMLHTTP;
3、修改get_npm.js文件44行
```js
  //  var pkgUri = util.format(NPM_PKG_JSON_URL, 'joyent/node',
  //  binVersion === 'latest' ? 'master' : binVersion);
  //  wget(pkgUri, function (filename, pkg) {
  //      if (filename === null) {
  //        return noNpmAndExit();
  //      }
  // downloadNpmZip(JSON.parse(pkg).version);
  //});

   var pkgUri = "https://npm.taobao.org/mirrors/node/index.json";
    wget(pkgUri, function (filename, pkg) {
        if (filename === null) {
            return noNpmAndExit();
        }
        var _pkg = JSON.parse(pkg);
        for(var i = 0,n=_pkg.length;i<n;i++){
            var obj = _pkg[i];
            if(obj.version == binVersion){
                downloadNpmZip(obj.npm);
            }
        }
    })
```

![](https://i.imgur.com/JNoMq2p.png)


![](https://i.imgur.com/JMhGS6B.png)

##### ⊙ 第三个坑
直接使用`nvmw install 6.10.3` 来安装新版本时提示

![](https://i.imgur.com/4oR1hmK.png)

**解决办法：** 这样的错误,原因是因为JS扩展名的文件被其他软件关联了，需要取消关联。 
如系统中安装了ULTRAEDIT或者E钻加密软件等，就需要去掉关联； 
或者如下解决方法：
在运行中输入“regedit”进入注册表，
只需要把[HKEY_CLASSES_ROOT\.js] 项下的那个默认值改成 "JSFile" 就可以正常运行JS 文件了;

![](https://i.imgur.com/J30eTPY.png)

##### ⊙ 第四个坑
更新node到4.0及以上的时候会出现安装失败 提示 `node v6.9.2 does not include npm`；

![](https://i.imgur.com/VknBopX.png)

**解决办法：**
1、自己下载npm压缩包（[GitHub - npm/npm: a package manager for javascript](GitHub - npm/npm: a package manager for javascript)），版本自己选择，在releases选择自己需要的版本下载（这个比较简单，不会的私聊吧），这块我下载的是最新的5.6.0版

![](https://i.imgur.com/XFpsmrs.png)

2、在.nvmw文件夹中创建 `v6.10.3` 文件夹，名字不能随便改，和你安装的node版本必须一致，否则就和上面刚出现的错误一样，并将刚刚下载npm压缩包放到这个文件夹中，将文件名中的版本号删除，改为npm.zip（必须的）

![](https://i.imgur.com/4wZUSOr.png)

3、现在用cmd命令 `nvmw install 6.10.3`,安装成功，并且自动切换到6.10.3版本，我们可以使用 `node -v` 和 `npm -v` 查看当前node和npm版本，文件夹也多了一些内容。（这其中要弹出防火墙警告，选择允许或是即可）;

![](https://i.imgur.com/BGxBwkr.png)

![](https://i.imgur.com/b6Mv4iA.png)

这样我们就可以控制nodejs的版本了

最后一步，我们可以使用  `npm install npm -g `来获得新版的npm了;







