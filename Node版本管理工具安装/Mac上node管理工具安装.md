# Mac上node版本控制工具安装

## § Mac上nvm安装及使用

目前主流的node版本管理工具有两种，nvm和n。
两者差异挺大的，具体分析可以参考一下淘宝FED团队的一篇文章：

[管理 node 版本，选择 nvm 还是 n？](http://taobaofed.org/blog/2015/11/17/nvm-or-n/)

总的来说，nvm有点类似于 Python 的 virtualenv 或者 Ruby 的 rvm，每个node版本的模块都会被安装在各自版本的沙箱里面（因此切换版本后模块需重新安装），因此考虑到需要时常对node版本进行切换测试兼容性和一些模块对node版本的限制，下面选择使用nvm作为管理工具，Mac下nvm安装和使用参考如下链接：

 [node版本管理工具nvm-Mac下安装及使用](https://segmentfault.com/a/1190000004404505)

## § Mac上Yarn安装

> 按如上在Mac安装`nvm`很ok，这儿谈点儿额外的，主要是在安装和使用过程中和在Windows上使用`nvm-windows`有点儿不同

当在Windows上安装完`nvm-windows`后，比如输入`nvm install v6.10.3`安装node版本6.10.3之后，输入`nvm use 6.10.3`切换为node当前使用版本（在每个版本的nodejs中，都会自带npm，之前为了统一起见，我们会安装一个全局的npm工具，当我们需要安装一些全局的其他包，不会因为切换node版本造成原来下载过的包不可用，比如全局安装了`nrm`之后，用nvm命令切换了node版本到其他之后，nrm还是可以正常使用），在Windows上的具体操作可以参考文章[window上node版本控制工具安装](https://github.com/DxLucky/know-how/blob/master/Windows%E4%B8%8Anode%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85.md);而在Mac上我们如果采取同样方式全局安装nrm之后（大致为安装好nvm之后用`nvm install v6.10.3` 再`npm use 6.10.3`再` npm install -g npm`再`npm install -g nrm`），用nvm命令切换node版本到其他之后，使用nrm命令会报错，如下图

![WechatIMG2](/Users/dinghongbin/Documents/Joker/know-how/Node版本管理工具安装/assets/WechatIMG2.jpeg)

之所以会出现这个问题，是因为在全局安装的各种 node 模块们全都需要重新安装，因为全局模块被安装在了每个 node 版本自己的沙箱中，切换或者升级node版本会找不到之前全局安装的模块；尝试了一些办法后还是**放弃了在Mac下用npm去安装这些全局包，改用了yarn，尴尬**；

Mac下的安装参见链接：[Yarn安装](https://yarnpkg.com/en/docs/install#mac-rc)

> github[yarn](https://github.com/yarnpkg/yarn)引导的[安装页面](https://yarnpkg.com/en/docs/install#mac-stable)上提供的`brew install yarn --ignore-dependencies`命令安装会报`invalid option: --without-node`的错误，而原因是Homebrew正在取消所有核心公式中的选项而删除了Yarn推荐的Homebrew安装方法而又还没更新github的文档链接致使用了不匹配的安装命令;现在Mac上正确的Yarn安装方式是使用curl的方式（`curl -o- -L https://yarnpkg.com/install.sh | bash -s -- —rc`），curl方式有效，且正确的与nvm切换的node版本想关联；参考相关[Issues](https://github.com/yarnpkg/website/issues/913)
>
> ![WechatIMG5](/Users/dinghongbin/Documents/Joker/know-how/Node版本管理工具安装/assets/WechatIMG5.png)

**安装Yarn后用[Yarn去全局安装模块](https://yarnpkg.com/lang/zh-hans/docs/cli/global/)（`yarn global add [--prefix]`）比如`yarn global add nrm`之后用nvm切换node版本之后可正常使用nrm命令**

> 注意`yarn global`是一个命令前缀不同于npm的`—global`标志，global 是一个必须跟在 yarn 后面的命令。 输入 `yarn add global package-name` 会把名为 global 和 package-name 的包添加到本地，而非全局添加 package-name。


 参考地址：

 * [node版本管理工具nvm-Mac下安装及使用](https://segmentfault.com/a/1190000004404505)]
 * [管理 node 版本，选择 nvm 还是 n？](http://taobaofed.org/blog/2015/11/17/nvm-or-n/)
 * [使用yarn安装全局包](https://zju.date/install-global-packages-using-yarn/)
 * [yarnpkg/website Issues](https://github.com/yarnpkg/website/issues/913)
 * [yarn global](https://yarnpkg.com/lang/zh-hans/docs/cli/global/)

