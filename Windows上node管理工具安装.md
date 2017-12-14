# window上node版本控制工具安装

> nvm 是 Mac 下的 node 管理工具，有点类似管理 Ruby 的 rvm，如果是需要管理 Windows 下的 node，官方推荐是使用 nvmw 或 nvm-windows

# 目录
#### &sect; [nvm-windows安装](#nvm-windows)
#### &sect; [nvmw安装](#nvmw)

# <a name="nvm-windows">nvm-windows安装</a>

## § 下载
下载地址: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

![](https://i.imgur.com/0AYyEjl.png)

我这儿选的 `nvm-setup.zip`包下载并解压出 `nvm-setup.exe`安装

## § 安装
点击 `nvm-setup.exe`自定义路径安装，至安装完成
> 注意：这儿的路径名最好不要有**中文**或者**空格**（以避免后面`nvm use node版本号`报错）
> 
![](https://i.imgur.com/1NIUxh8.png)

![](https://i.imgur.com/4i6F5LB.png)

到这儿不用手动去配什么环境变量，安装完成后已自动配置部分环境变量

![](https://i.imgur.com/3IRQHSV.png)

打开 `cmd` 窗口，输入`nvm`不报错，说明安装成功

![](https://i.imgur.com/rjt1TUj.png)

## § 完善配置

#### ⊙ 去安装路径下找到 `settings.txt`文件

![](https://i.imgur.com/2yVWIc0.png)

并修改
```js
root: E:\Nvm\nvm  //和安装时的路径对应
path: E:\Nvm\nodejs  //和安装时的路径对应
arch: 64
proxy: none
node_mirror: http://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

![](https://i.imgur.com/hweC4pX.png)

然后进入 `cmd` 命令窗口，输入 `nvm install 6.10.3` ("6.10.3"是node版本号)安装你所需要的node版本

![](https://i.imgur.com/VuOslNE.png)

>这时`node`的安装路径下，是没有安装nvm时定义的 `nodejs`文件夹的

![](https://i.imgur.com/qqEd8e5.png)

待 `nvm install 6.10.3(node版本号)`之后，输入`nvm use 6.10.3(node版本号)`，之后再去安装路径下，就可以看到`nodejs`文件夹了

![](https://i.imgur.com/mrJbuMN.png)

![](https://i.imgur.com/xltFHVP.png)

#### ⊙ npm的安装
> npm有两层含义
>  第一是npm这个开源的模块登记和管理系统，也就是这个站点：[https://www.npmjs.com](https://www.npmjs.com)。 
第二个指的是 nodejs package manager 也就是nodejs的包管理工具。我们主要说的就是这一个。 
在每个版本的nodejs中，都会自带npm，为了统一起见，我们安装一个全局的npm工具，这个操作很有必要，因为我们需要安装一些全局的其他包，不会因为切换node版本造成原来下载过的包不可用。

1、进入 `cmd` 窗口，输入`npm config set prefix "E:\Nvm\npm-global"`
>`"E:\Nvm\npm-global"`是自定义的文件路径和文件夹名

这是在配置npm的全局安装路径，然后在用户文件夹下会生成一个`.npmrc`的文件，用记事本打开后可以看到如下内容：
```js
prefix=E:\Nvm\npm-global
```
2、继续在命令中输入 `npm install npm -g` 回车后会发现正在下载npm包，在 `E:\Nvm\npm-global` 目录中可以看到下载中的文件，以后我们只要用npm安装包的时候加上 -g 就可以把包安装在我们刚刚配置的全局路径下了

![](https://i.imgur.com/D82ZoU4.png)

3、我们为这个npm配置环境变量： 变量名为：`NPM_HOME`，变量值为 ：`E:\Nvm\npm-global`；在环境变量Path的最前面添加 `%NPM_HOME%`，注意了，这个一定要添加在 `%NVM_SYMLINK%`之前

![](https://i.imgur.com/hVVyQJI.png)

5、最后我们新打开一个命令窗口，输入 `npm -v` ,此时我们使用的就是我们统一下载的npm包了

![](https://i.imgur.com/7Dya1sX.png)

同样的我们还可以安装cnpm工具，它是中国版的npm镜像库，地址在这里：[https://cnpmjs.org/](https://cnpmjs.org/)，也是npm官方的一个拷贝，因为我们和外界有一堵墙隔着，所以用这个国内的比较快，淘宝也弄了一个和npm一样的镜像库，[http://npm.taobao.org/](http://npm.taobao.org/)，它和官方的npm每隔10分钟同步一次。
安装方式：
> * `npm install -g cnpm`
> * 或者用淘宝的 `npm install -g cnpm --registry=https://registry.npm.taoba.org`
> * 安装好了cnpm后，直接执行 `cnpm install 包名` 比如：`cnpm install yarn -g `就可以了。-g只是为了把包安装在全局路径下。如果不全局安装，也可以在当前目录中安装，不用-g就可以了

#### ⊙ nrm 的安装
>什么是nrm？ 
nrm就是 `npm registry manager` 也就是npm的镜像源管理工具，有时候国外资源太慢，那么我们可以用这个来切换镜像源。 
我们只要通过这个命令: `npm install -g nrm` 就可以实现安装。 
注意-g可以直接放到install的后面，我们以后也最好这样用，因为这样用，我们可以在cmd中上下箭头切换最近命令的时候，容易修改，更方便操作。安装完成后，我们就可以使用了。

* 命令：`nrm ls` 用于展示所有可切换的镜像地址
* 命令：nrm use taobao 我们这样就可以直接切换到taobao源上了。当然也可以按照上面罗列的其他内容进行切换

![](https://i.imgur.com/mh1TGTY.png)

参考地址：[http://blog.csdn.net/tyro_java/article/details/51232458](http://blog.csdn.net/tyro_java/article/details/51232458)

# <a name="nvmw">nvmw安装</a>

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







