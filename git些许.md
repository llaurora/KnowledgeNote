# Git相关(Windows)
>**声明**：我基本是Fork了阮一峰老师的Git教程，仅记录下学习，原文https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000

# 目录
#### &sect; [创建版本库](#create-rep)
#### &sect; [时光机穿梭](#time-shuttle)
* [版本回退](#version-rollback)
* [工作区和暂存区](#workspace-workstore)
* [管理修改](#manage-modify)
* [撤销修改](#cancel-modify)
* [删除文件](#delete-file)
#### &sect; [远程仓库](#remote-rep)
* [添加远程仓库](#add-rep)
* [上传本地已有项目到远程仓库](#upload-rep)
* [从远程库克隆](#clone-rep)
#### &sect; [分支管理](#branch-manage)
* [创建与合并分支](#create-merge)
* [解决冲突](#solve-conflict)
* [分支管理策略](#branch-strategy)
* [Bug分支](#bug-branch)
* [Feature分支](#feature-branch)
* [多人协作](#peo-cooperate)
#### &sect; [标签管理](#tags-manage)
* [创建标签](#create-tags)
* [操作标签](#cooperate-tags)

## § <a name="create-rep">创建版本库</a>
>版本库又名仓库，英文名repository，可以理解成一个目录，这目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。
### ⊙ 创建版本库
创建一个版本库非常简单
**⊙** 第一步：首先，选择一个合适的地方，创建一个空目录：
>为了避免遇到各种莫名其妙的问题，请确保目录名（包括父目录）不包含中文

![](http://i.imgur.com/sQGY2bZ.png)
```js
$ cd F://打开命令窗口指定到目录下
$ F:
$ mkdir git-test //在F盘新建目录git-test
$ cd git-test //指定到创建的目录下
```
>对于这一步还可以直接在相应目录下新建目录`git-test`，然后空白地方右键点击`Git Bash Here`(前提是电脑上装有git)

**⊙** 第二步：通过`git init`命令把这个目录变成Git可以管理的仓库
```js
$ git init
Initialized empty Git repository in /Users/michael/learngit/.git/
```
瞬间Git就把仓库建好了，而且告诉你是一个空的仓库（empty Git repository），而且当前目录下多了一个`.git`的目录，这个目录是Git来跟踪管理版本库的，没事千万不要手动修改这个目录里面的文件，不然改乱了，就把Git仓库给破坏了。

没有看到`.git`目录，那是因为这个目录默认是隐藏的，用`ls -ah`命令就可以看见。
> 也不一定必须在空目录下创建Git仓库，选择一个已经有东西的目录也是可以的

### ⊙ 把文件添加到版本库
>所有的版本控制系统，其实只能跟踪文本文件的改动，比如TXT文件，网页，所有的程序代码等等，Git也不例外。版本控制系统可以告诉你每次的改动，比如在第5行加了一个单词“Linux”，在第8行删了一个单词“Windows”。而图片、视频这些二进制文件，虽然也能由版本控制系统管理，但没法跟踪文件的变化，只能把二进制文件每次改动串起来，也就是只知道图片从100KB改成了120KB，但到底改了啥，版本控制系统不知道，也没法知道，其次Microsoft的Word格式是二进制格式，因此，版本控制系统是没法跟踪Word文件的改动的。

现在编写一个在目录`git-test`下的文件`testText.txt`
>一定要放到git-test目录下（子目录也行），因为这是一个Git仓库，放到其他地方Git找不到这个文件

把一个文件放到Git仓库只需要两步:

![](http://i.imgur.com/nRLrDpQ.png)


**⊙** 第一步：用命令`git add`告诉`Git`，把文件添加到仓库:
```js
$ git add testText.txt
```
**⊙** 第二步，用命令`git commit`告诉`Git`，把文件提交到仓库：
>* `git commit`命令，`-m`后面输入的是本次提交的说明，可以输入任意内容，当然最好是有意义的
>* `git commit`的时候若不加`-m`会提示你编辑提交说明(`Shift+i`变插入状态可编辑，编辑完成后`Esc`退出，`Shift+;`退出编辑跳到命令行，输入`wq`保存退出编辑)

```js
$ git commit -m "first commit a file"
[master (root-commit) 635a515] first commit a file
 1 file changed, 1 insertion(+)
 create mode 100644 testText.txt
```
>在提交的时候可以更改一些配置信息，比如提交的用户名和邮箱
>```js
>git config --global user.name "Your Name" 
>git config --global user.email "email@example.com"
>```
>用`git config --list`可以查看配置信息

**⊙** 小结
>* 初始化一个Git仓库，使用`git init`命令
>* 添加文件到Git仓库，分两步:
>第一步，使用命令`git add`，注意，可反复多次使用，添加多个文件；
>第二步，使用命令`git commit`，完成

## § <a name="time-shuttle">时光机穿梭</a>
在已经成功添加并提交了一个`testText.txt`文件后，再继续修改`readme.txt`文件,运行`git status`命令看看结果:
```js
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   testText.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
`git status`命令可以让我们时刻掌握仓库当前的状态，上面的命令告诉我们，`testText.txt`被修改过了，但还没有准备提交修改。

`git diff`命令用于查看具体被修改了什么内容，显示的格式正是Unix通用的diff格式
```js
$ git diff testText.txt
diff --git a/testText.txt b/testText.txt
index e6ee93f..d5ec117 100644
--- a/testText.txt
+++ b/testText.txt
@@ -1 +1,2 @@
-测试文件里的内容15:02
\ No newline at end of file
+测试文件里的内容15:02
+修改点儿东西15:25
\ No newline at end of file
```
知道对`testText.txt`作了什么修改后，再把它提交到仓库就放心多了，提交修改和提交新文件是一样的两步，第一步是`git add`
```js
$ git add testText.txt
```
运行`git add`后没输出说明OK。在执行第二步`git commit`之前，我们再运行`git status`看看当前仓库的状态:
```js
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   testText.txt

```
`git status`告诉我们，将要被提交的修改包括`testText.txt`，下一步放心地提交了。
```js
$ git commit -m 'second add line'
[master 37c24f4] second add line
 1 file changed, 2 insertions(+), 1 deletion(-)
```
提交后，我们再用`git status`命令看看仓库的当前状态：
```js
$ git status
On branch master
nothing to commit, working tree clean

```
Git告诉我们当前没有需要提交的修改，而且工作目录是干净（working directory clean）的。

**⊙** 小结
>* 使用`git status`命令可随时掌握仓库状态；
>* 如果`git status`告诉你有文件被修改过，用`git diff`可查看修改了什么

## § <a name="version-rollback">版本回退</a>

Git中，我们用`git log`命令查看历史记录：
```js
$ git log
commit 148453f45b9f014893d0390eea236dc83eacee60 (HEAD -> master)
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 16:19:18 2017 +0800

    third commit

commit b777c70d3ee5172d9776e97807ac2013b0519f10
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:49:58 2017 +0800

    first line add word

commit 37c24f4a2856ad3cda7ba382a60bcc1cb9ac1a88
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:42:11 2017 +0800

    second add line

commit c75d0642271f621f2f7766ee643b406a507a543c
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:03:39 2017 +0800

    first commit a file
```
>* `git log`命令显示从最近到最远的提交日志，可以看到最近一次提交是`third commit`，最早一次提交是`first commit a file`

`git log`加上`--pretty=oneline`参数，可让显示的信息只有每个历史记录的第一行：

![](http://i.imgur.com/92CZLN6.png)
```js
$ git log --pretty=oneline
148453f45b9f014893d0390eea236dc83eacee60 (HEAD -> master) third commit
b777c70d3ee5172d9776e97807ac2013b0519f10 first line add word
37c24f4a2856ad3cda7ba382a60bcc1cb9ac1a88 second add line
c75d0642271f621f2f7766ee643b406a507a543c first commit a file
```
看到的一大串类似148453f4...cee60的是`commit id`（版本号），和SVN不一样，Git的`commit id`不是1，2，3……递增的数字，而是一个`SHA1`计算出来的一个非常大的数字，用十六进制表示，每提交一个新版本，实际上Git就会把它们自动串成一条时间线。

现在我要回退到上一个版本，就是`first line add word`的那个版本怎么做呢？
>首先在Git中，用`HEAD`表示当前版本，也就是最新的提交148453f4...cee60，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100

使用`git reset`命令回退版本
```js
$ git reset --hard HEAD^
HEAD is now at b777c70 first line add word
```
然后查看`testText.txt`，已经被回退到上一个版本的状态了。

这时用`git log`再看看现在版本库的状态:
```js
$ git log
commit b777c70d3ee5172d9776e97807ac2013b0519f10 (HEAD -> master)
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:49:58 2017 +0800

    first line add word

commit 37c24f4a2856ad3cda7ba382a60bcc1cb9ac1a88
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:42:11 2017 +0800

    second add line

commit c75d0642271f621f2f7766ee643b406a507a543c
Author: DxLucky <flovekind@163.com>
Date:   Fri Aug 25 15:03:39 2017 +0800

    first commit a file
```
![](http://i.imgur.com/mQlQt11.png)

发现最新的那个版本`third commit`已经看不到了,想回去怎么办？

办法其实还是有的，只要上面的命令行窗口还没有被关掉，你就可以顺着往上找啊找啊，找到那个`third commit`的`commit id`是148453f...，于是就可以指定回到未来的某个版本:
```js
$ git reset --hard 148453f
HEAD is now at 148453f third commit
```
>版本号没必要写全，前几位就可以了，Git会自动去找,当然也不能只写前一两位，因为Git可能会找到多个版本号，就无法确定是哪一个了。

这时再查看`testText.txt`，里面的内容也回到这个版本对应的状态了。

当关闭了命令行又想回到之前最新的那个`third commit`版本怎么办？
要想再恢复到`third commit`，就必须找到`third commit`的`commit id`
Git提供了一个命令`git reflog`用来记录你的每一次命令:
```js
$ git reflog
b777c70 (HEAD -> master) HEAD@{0}: reset: moving to HEAD^
148453f HEAD@{1}: reset: moving to 148453
37c24f4 HEAD@{2}: reset: moving to HEAD^^
148453f HEAD@{3}: reset: moving to 148453f
b777c70 (HEAD -> master) HEAD@{4}: reset: moving to HEAD^
148453f HEAD@{5}: commit: third commit
b777c70 (HEAD -> master) HEAD@{6}: commit: first line add word
37c24f4 HEAD@{7}: commit: second add line
c75d064 HEAD@{8}: commit (initial): first commit a file
```
现在可以找到`third commit`的`commit id`是148453f，现在再用`git reset`命令就可以回到那个版本了
```js
$ git reset --hard 148453f
HEAD is now at 148453f third commit
```
![](http://i.imgur.com/c4YLFE1.png)

## § <a name="workspace-workstore">工作区和暂存区</a>
>Git和其他版本控制系统如SVN的一个不同之处就是有暂存区的概念

### ⊙ 工作区
就是在电脑里新建项目的目录，比如我的`git-test`文件夹就是一个工作区：

![](http://i.imgur.com/ZnRl5lN.png)

### ⊙ 版本库
工作区有一个隐藏目录`.git`，这个不算工作区，而是`Git`的版本库。

`Git`的版本库里存了很多东西，其中最重要的就是称为`stage`（或者叫`index`）的暂存区，还有`Git`为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`
![](http://i.imgur.com/rZomwJF.jpg)

前面讲了我们把文件往`Git`版本库里添加的时候，是分两步执行的：

第一步是用`git add`把文件添加进去，实际上就是把文件修改添加到暂存区；

第二步是用`git commit`提交更改，实际上就是把暂存区的所有内容提交到当前分支。

因为我们创建`Git`版本库时，`Git`自动为我们创建了唯一一个`master`分支，所以，现在，`git commit`就是往`master`分支上提交更改。

你可以简单理解为，需要提交的文件修改通通放到暂存区，然后，一次性提交暂存区的所有修改。

现在先对`testText.txt`做个修改，增加一行内容，然后在工作区新增一个`LICENSE`文本文件(内容随便写)
先用`git status`查看一下状态:
```js
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   testText.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        LICENSE.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
`Git`非常清楚地告诉我们，`testText.txt`被修改了，而`LICENSE`还从来没有被添加过，所以它的状态是`Untracked`

现在，使用两次命令`git add`，把`readme.txt`和`LICENSE`都添加后，用`git status`再查看一下:
```js
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   LICENSE.txt
        modified:   testText.txt

```
现在，暂存区的状态就变成这样了:
![](http://i.imgur.com/UCyeRnm.jpg)

所以，`git add`命令实际上就是把要提交的所有修改放到暂存区（`Stage`），然后，执行`git commit`就可以一次性把暂存区的所有修改提交到分支
```js
$ git commit -m 'understand how stage works'
[master 8dc9f1f] understand how stage works
 2 files changed, 3 insertions(+), 1 deletion(-)
 create mode 100644 LICENSE.txt
```
一旦提交后，如果你又没有对工作区做任何修改，那么工作区就是“干净”的：
```js
$ git status
On branch master
nothing to commit, working tree clean
```
现在版本库变成了这样，暂存区就没有任何内容了：
![](http://i.imgur.com/rzmimBH.jpg)

![](http://i.imgur.com/ye5LDc2.png)

## § <a name="manage-modify">管理修改</a>
当掌握了暂存区的概念，下面说为什么Git比其他版本控制系统设计得优秀，因为Git跟踪并管理的是修改，而非文件。

你会问，什么是修改？比如你新增了一行，这就是一个修改，删除了一行，也是一个修改，更改了某些字符，也是一个修改，删了一些又加了一些，也是一个修改，甚至创建一个新文件，也算一个修改。

为什么说`Git`管理的是修改，而不是文件呢？我们还是做实验。第一步，对`testText.txt`做一个修改，比如加一行内容。

然后，添加：

![](http://i.imgur.com/dcUATTp.png)

然后，再修改`testText.txt`，比如再增加一行内容。
```js
$ cat testText.txt
测试文件里的内容在第一行加了点儿文字15:02
修改点儿东西15:25
再来修改点儿东西看版本回退操作如何16:18
再加上一行内容2017-8-28 10:31
管理修改增加第一行内容11:00
```
提交：
```js
$ git commit -m 'git tracks changes'
[master 46dad85] git tracks changes
 1 file changed, 2 insertions(+), 1 deletion(-)
```
提交后再查看下状态：
```js
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   testText.txt

no changes added to commit (use "git add" and/or "git commit -a")

```
怎么第二次的修改没有被提交？

别激动，我们回顾一下操作过程：

`第一次修改` -> `git add` -> `第二次修改` -> `git commit`

可以看到，`Git`管理的是修改，当你用`git add`命令后，在工作区的第一次修改被放入暂存区，准备提交，但是，在工作区的第二次修改并没有放入暂存区，所以，`git commit`只负责把暂存区的修改提交了，也就是第一次的修改被提交了，第二次的修改不会被提交。

提交后，用`git diff HEAD -- testText.txt`命令可以查看工作区和版本库里面最新版本的区别：
```js
$ git diff HEAD -- testText.txt
diff --git a/testText.txt b/testText.txt
index c69e375..d1f1e92 100644
--- a/testText.txt
+++ b/testText.txt
@@ -2,4 +2,5 @@
 修改点儿东西15:25
 再来修改点儿东西看版本回退操作如何16:18
 再加上一行内容2017-8-28 10:31
-管理修改增加第一行内容11:00
\ No newline at end of file
+管理修改增加第一行内容11:00
+管理修改增加第二行内容11:20
\ No newline at end of file
```
可见，第二次修改确实没有被提交

那怎么提交第二次修改呢？你可以继续`git add`再`git commit`，也可以别着急提交第一次修改，先`git add`第二次修改，再`git commit`，就相当于把两次修改合并后一块提交了：

`第一次修改` -> `git add` -> `第二次修改` -> `git add` -> `git commit`

**⊙** 小结
现在理解了Git是如何跟踪修改的，每次修改，如果不`add`到暂存区，那就不会加入到`commit`中

## § <a name="cancel-modify">撤销修改</a>
当在工作区对文件作了修改，准备提交的时候却发现修改错了，除了手动的恢复到之前没修改之前的状态,恢复到之前的状态有两种情况：
* 一种是`testText.txt`自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；
* 一种是`testText.txt`已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态

### ⊙ 在工作区作了修改但还没有用`git add`添加到暂存区

可以用`git checkout -- file`丢弃工作区的修改
>`git checkout -- file`命令中的--很重要，没有`--`，就变成了“切换到另一个分支”的命令

现在我在`testText.txt`作了修改，用`git status`查看一下，再用`git checkout -- testText.txt`，再用`git status`查看或者打开`testText.txt`的内容可以发现有复原了。

![](http://i.imgur.com/GP7C6n5.png)

### ⊙ 在工作区作了修改已经用`git add`添加到暂存区
用命令`git reset HEAD file`可以把暂存区的修改撤销掉（unstage），重新放回工作区

现在在`testText.txt`作了修改，并用`git add`添加到了暂存区，用`git status`查看一下：
```js
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   testText.txt


```

`Git`告诉我们，用命令`git reset HEAD file`可以把暂存区的修改撤销掉（unstage），重新放回工作区:
```js
$ git reset HEAD testText.txt
Unstaged changes after reset:
M       testText.txt

```
`git reset`命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用HEAD时，表示最新的版本。

再用`git status`查看一下，现在暂存区是干净的，工作区有修改:
```js
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   testText.txt

no changes added to commit (use "git add" and/or "git commit -a")

```
这时再用`git checkout -- file`丢弃工作区的修改吗？
```js
$ git checkout -- testText.txt
```
这时再查看文件，可以发现已复原：
```js
$ git status
On branch master
nothing to commit, working tree clean
```
### ⊙ 小结
> * 场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令`git checkout -- file`。
> * 场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令`git reset HEAD file`，就回到了场景1，第二步按场景1操作。
> * 场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考`版本回退`，不过前提是没有推送到远程库

## § <a name="delete-file">删除文件</a>
在Git中，删除也是一个修改操作，我们实战一下，先添加一个新文件`add.txt`到Git并且提交：
```js
$ git add add.txt
```
```js
$ git commit -m 'add add.txt'
[master 458103e] add add.txt
 1 file changed, 1 insertion(+)
 create mode 100644 add.txt
```
一般情况下，你通常直接在文件目录中把没用的文件删了，或者用rm命令删了：
```js
$ rm add.txt
```
这个时候，`Git`知道你删除了文件，因此，工作区和版本库就不一致了，`git status`命令会立刻告诉你哪些文件被删除了
```js
$ git status
On branch master
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    add.txt

no changes added to commit (use "git add" and/or "git commit -a")

```
现在你有两个选择，一是确实要从版本库中删除该文件，那就用命令git rm删掉，并且git commit：
```js
$ git rm add.txt
rm 'add.txt'
```
```js
$ git commit -m 'remove add.txt'
[master dcdb242] remove add.txt
 1 file changed, 1 deletion(-)
 delete mode 100644 add.txt

```
现在，文件就从版本库中被删除了。

另一种情况是删错了，因为版本库里还有呢，所以可以很轻松地把误删的文件恢复到最新版本
```js
$ git checkout -- add.txt
```
`git checkout`其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”

### ⊙ 小结
>命令`git rm`用于删除一个文件。如果一个文件已经被提交到版本库，那么你永远不用担心误删，但是要小心，你只能恢复文件到最新版本，你会丢失**最近一次提交后你修改的内容**

## § <a name="remote-rep">远程仓库</a>
`Git`是分布式版本控制系统，同一个`Git`仓库，可以分布到不同的机器上。怎么分布呢？最早，肯定只有一台机器有一个原始版本库，此后，别的机器可以“克隆”这个原始版本库，而且每台机器的版本库其实都是一样的，并没有主次之分。

其实一台电脑上也是可以克隆多个版本库的，只要不在同一个目录下。不过，现实生活中是不会有人这么傻的在一台电脑上搞几个远程库玩，因为一台电脑上搞几个远程库完全没有意义，而且硬盘挂了会导致所有库都挂掉。

实际情况往往是这样，找一台电脑充当服务器的角色，每天24小时开机，其他每个人都从这个“服务器”仓库克隆一份到自己的电脑上，并且各自把各自的提交推送到服务器仓库里，也从服务器仓库中拉取别人的提交。

完全可以自己搭建一台运行`Git`的服务器，不过现阶段，为了学`Git`先搭个服务器绝对是小题大作。好在这个世界上有个叫`GitHub`的神奇的网站，这个网站就是提供Git仓库托管服务的，所以，只要注册一个`GitHub`账号，就可以免费获得Git远程仓库。

在注册`GitHub`账号后。由于本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以，需要一点设置:

第1步：创建`SSH Key`。在用户主目录下，看看有没有`.ssh`目录，如果有，再看看这个目录下有没有`id_rsa`和`id_rsa.pub`这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：
```js
$ ssh-keygen -t rsa -C "youremail@example.com"
```
你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个Key也不是用于军事目的，所以也无需设置密码。

如果一切顺利的话，可以在用户主目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是`SSH Key`的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

第2步：登陆`GitHub`，打开“Account settings”，“SSH Keys”页面：

然后，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴`id_rsa.pub`文件的内容：

![](http://i.imgur.com/BJtFvdW.png)

点“Add Key”，你就应该看到已经添加的Key：

![](http://i.imgur.com/PfqqfHW.png)

为什么`GitHub`需要`SSH Key`呢？因为`GitHub`需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而`Git`支持`SSH协议`，所以，`GitHub`只要知道了你的公钥，就可以确认只有你自己才能推送。

当然，`GitHub`允许你添加多个`Key`。假定你有若干电脑，你一会儿在公司提交，一会儿在家里提交，只要把每台电脑的`Key`都添加到`GitHub`，就可以在每台电脑上往`GitHub`推送了。

最后友情提示，在`GitHub`上免费托管的Git仓库，任何人都可以看到喔（但只有你自己才能改）。所以，不要把敏感信息放进去。

如果你不想让别人看到`Git`库，有两个办法，一个是交点保护费，让GitHub把公开的仓库变成私有的，这样别人就看不见了（不可读更不可写）。另一个办法是自己动手，搭一个`Git`服务器，因为是你自己的`Git`服务器，所以别人也是看不见的。这个方法我们后面会讲到的，相当简单，公司内部开发必备。

## § <a name="add-rep">添加远程仓库</a>
现在的情景是，你已经在本地创建了一个`Git`仓库后，又想在`GitHub`创建一个`Git`仓库，并且让这两个仓库进行远程同步，这样，`GitHub`上的仓库既可以作为备份，又可以让其他人通过该仓库来协作。

首先，登陆`GitHub`，然后，在右上角找到“Create a new repo”按钮，创建一个新的仓库：

![](http://i.imgur.com/wXMdwyX.png)

在`Repository name`填入你想创建的仓库名称如`git-test`，其他保持默认设置，点击“Create repository”按钮，就成功地创建了一个新的Git仓库：

![](http://i.imgur.com/t6vJOdu.png)

目前，在`GitHub`上的这个`git-test`仓库还是空的，`GitHub`告诉我们，可以从这个仓库克隆出新的仓库，也可以把一个已有的本地仓库与之关联，然后，把本地仓库的内容推送到`GitHub`仓库。

现在，我们根据`GitHub`的提示，在本地的`git-test`仓库下运行命令：
```js
$ git remote add origin https://github.com/DxLucky/git-test.git
```
> `origin`后面跟的是自己的远程仓库，不然就关联到别人的远程仓库去了，但是你以后推送是推不上去的，因为你的`SSH Key`公钥不在别人的账户列表中。

添加后，远程库的名字就是`origin`，这是`Git`默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库。

下一步，就可以把本地库的所有内容推送到远程库上：
```js
$ git push -u origin master
Username for 'https://github.com': DxLucky
Counting objects: 29, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (21/21), done.
Writing objects: 100% (29/29), 2.65 KiB | 0 bytes/s, done.
Total 29 (delta 4), reused 0 (delta 0)
remote: Resolving deltas: 100% (4/4), done.
To https://github.com/DxLucky/git-test.git
 * [new branch]      master -> master
Branch master set up to track remote branch master from origin.
```
> 输入`git push -u origin master`命令后会让输入`GitHub`的用户名和密码

把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`master`推送到远程。

由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，`Git`不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令

推送成功后，可以立刻在`GitHub`页面中看到远程库的内容已经和本地一模一样：

![](http://i.imgur.com/o4cpkwg.png)

从现在起，只要本地作了提交，就可以通过命令：
```js
$ git push origin master
```
可以看到最新的修改已经推送上去了：

![](http://i.imgur.com/xTJpcSm.png)

![](http://i.imgur.com/1AtjqVv.png)

### ⊙小结

>要关联一个远程库，使用命令`git remote add origin git@server-name:path/repo-name.git`；

>关联后，使用命令`git push -u origin master`第一次推送`master`分支的所有内容；

>此后，每次本地提交后，只要有必要，就可以使用命令`git push origin master`推送最新修改；

>分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，而SVN在没有联网的时候是拒绝干活的！当有网络的时候，再把本地提交推送一下就完成了同步，真是太方便了！


## § <a name="upload-rep">上传本地已有项目(并没有创建本地git仓库的项目)到远程仓库</a>

### ⊙1、首先在github上面创建自己的代码仓

![](http://i.imgur.com/MmwJ0Ht.png)

### ⊙2、点击下面的create repository之后，出现这个仓库的连接地址，和上传代码的路径

![](http://i.imgur.com/tyT6BQb.png)

### ⊙3、进入本地电脑的将要上传的项目的目录下面
* 1、`git  init`
初始化一个git
* 2、`vim .gitignore` 新增以及编写这个文件`node_modules/`
意思就是上传的时候忽略这个文件夹以及里面的内容，因为我上传的是nodejs项目文件，所以不用把node_modules上传上去
>[Git 的 .gitignore 配置](http://www.cnblogs.com/haiq/archive/2012/12/26/2833746.html)
* 3、`git add .`    添加代码到git
* 4、`git commit -m '第一个版本'`
版本的备注信息
* 5、`git remote add origin https://github.com/jasonzhangdong/auth2.0test.git`
将代码关联到`github`上面，后面的`url`就是第二部拷贝下来的那个路径
* 6、`git push -u origin master`
     将代码推送上去

### ⊙4、完成代码的上传
这一切步骤的前提是，你有一个`github`账户，同时把这个`github`账户和你的电脑已经关联起来，配置好秘钥的前提下。

## § <a name="clone-rep">从远程库克隆</a>

假设我们从零开发，那么最好的方式是先创建远程库，然后，从远程库克隆。

首先，登陆GitHub，创建一个新的仓库，名字叫`git-clone-test`：

![](http://i.imgur.com/ZZd5QOg.png)
    
勾选`Initialize this repository with a README`，这样GitHub会自动为我们创建一个README.md文件。创建完毕后，可以看到README.md文件：

![](http://i.imgur.com/XqOuIHy.png)

现在，远程库已经准备好了，下一步是用命令git clone克隆一个本地库：

在想要克隆项目的目录下，右键`Git Bash Here`打开命令窗口，输入`git clone https://github.com/DxLucky/git-clone-test.git`即可：
```js
$ git clone https://github.com/DxLucky/git-clone-test.git
Cloning into 'git-clone-test'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), done.
```
进入`git-clone-test`目录看看，已经有`README.md`文件了。
![](http://i.imgur.com/cAT6hTB.png)

* 如果有多个人协作开发，那么每个人各自从远程克隆一份就可以了。

* 你也许还注意到，`GitHub`给出的地址不止一个，还可以用`git@github.com:DxLucky/git-clone-test.git`这样的地址。实际上，Git支持多种协议，默认的git://使用ssh，但也可以使用https等其他协议。
![](http://i.imgur.com/e9BFegX.png)

* 使用https除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用ssh协议而只能用https。

### ⊙ 小结
>要克隆一个仓库，首先必须知道仓库的地址，然后使用git clone命令克隆。

>Git支持多种协议，包括https，但通过ssh支持的原生git协议速度最快

## § <a name="branch-manage">分支管理</a>
![](http://i.imgur.com/XXIWiFi.png)
分支在实际中有什么用呢？假设你准备开发一个新功能，但是需要两周才能完成，第一周你写了50%的代码，如果立刻提交，由于代码还没写完，不完整的代码库会导致别人不能干活了。如果等代码全部写完再一次提交，又存在丢失每天进度的巨大风险。

现在有了分支，就不用怕了。你创建了一个属于你自己的分支，别人看不到，还继续在原来的分支上正常工作，而你在自己的分支上干活，想提交就提交，直到开发完毕后，再一次性合并到原来的分支上，这样，既安全，又不影响别人工作。

其他版本控制系统如SVN等都有分支管理，但是用过之后你会发现，这些版本控制系统创建和切换分支比蜗牛还慢，简直让人无法忍受，结果分支功能成了摆设，大家都不去用。

但Git的分支是与众不同的，无论创建、切换和删除分支，Git在1秒钟之内就能完成！无论你的版本库是1个文件还是1万个文件。

## § <a name="create-merge">创建与合并分支</a>
在`版本回退`里，你已经知道，每次提交，`Git`都把它们串成一条时间线，这条时间线就是一个分支。截止到目前，只有一条时间线，在`Git`里，这个分支叫主分支，即`master`分支。`HEAD`严格来说不是指向提交，而是指向`master`，`master`才是指向提交的，所以，`HEAD`指向的就是当前分支。

一开始的时候，`master`分支是一条线，`Git`用`master`指向最新的提交，再用`HEAD`指向`master`，就能确定当前分支，以及当前分支的提交点：
![](http://i.imgur.com/uWhb9Xy.png)

每次提交，`master`分支都会向前移动一步，这样，随着你不断提交，`master`分支的线也越来越长。

我们创建新的分支，例如`dev`时，Git新建了一个指针叫`dev`，指向`master`相同的提交，再把`HEAD`指向`dev`，就表示当前分支在dev上：
![](http://i.imgur.com/dnDOYmP.png)

你看，`Git`创建一个分支很快，因为除了增加一个`dev`指针，改改`HEAD`的指向，工作区的文件都没有任何变化！

不过，从现在开始，对工作区的修改和提交就是针对`dev`分支了，比如新提交一次后，`dev`指针往前移动一步，而`master`指针不变：
![](http://i.imgur.com/f77eI2q.png)

假如我们在`dev`上的工作完成了，就可以把`dev`合并到`master`上。Git怎么合并呢？最简单的方法，就是直接把`master`指向`dev`的当前提交，就完成了合并：
![](http://i.imgur.com/JCG8SrE.png)

所以`Git`合并分支也很快！就改改指针，工作区内容也不变！

合并完分支后，甚至可以删除`dev`分支。删除`dev`分支就是把`dev`指针给删掉，删掉后，我们就剩下了一条`master`分支：
![](http://i.imgur.com/ZpveXbX.png)

### ⊙下面开始实战

首先，我们创建`dev`分支，然后切换到`dev`分支：
```js
$ git checkout -b dev
Switched to a new branch 'dev'
```
`git checkout`命令加上`-b`参数表示创建并切换，相当于以下两条命令：
```js
$ git branch dev
$ git checkout dev
Switched to branch 'dev'
```
然后，用`git branch`命令查看当前分支：
```js
$ git branch
* dev
  master

```
`git branch`命令会列出所有分支，当前分支前面会标一个`*`号。

然后，我们就可以在`dev`分支上正常提交，比如对`readme.txt`做个修改，加上一行：
```js
分支dev增加的这行内容16:47

```
然后提交：
```js
$ git add master.txt
```
```js
$ git commit -m 'dev branch first commit'
[dev 6a9a9aa] dev branch first commit
 1 file changed, 2 insertions(+), 1 deletion(-)

```
现在，`dev`分支的工作完成，我们就可以切换回`master`分支：
```js
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.

```
切换回`master`分支后，再查看一个`master.txt`文件，刚才添加的内容不见了！因为那个提交是在`dev`分支上，而`master`分支此刻的提交点并没有变：
![](http://i.imgur.com/tcsgt7c.png)

现在，我们把`dev`分支的工作成果合并到`master`分支上：
```js
$ git merge dev
Updating 7339480..6a9a9aa
Fast-forward
 master.txt | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)

```
`git merge`命令用于合并指定分支到当前分支。合并后，再查看`master.txt`的内容，就可以看到，和`dev`分支的最新提交是完全一样的。

注意到上面的`Fast-forward`信息，`Git`告诉我们，这次合并是“快进模式”，也就是直接把`master`指向`dev`的当前提交，所以合并速度非常快。

当然，也不是每次合并都能`Fast-forward`，还有其他方式的合并。

合并完成后，就可以放心地删除`dev`分支了：
```js
$ git branch -d dev
Deleted branch dev (was 6a9a9aa).

```
删除后，查看`branch`，就只剩下`master`分支了：
```js
$ git branch
* master
```
因为创建、合并和删除分支非常快，所以`Git`鼓励你使用分支完成某个任务，合并后再删掉分支，这和直接在`master`分支上工作效果是一样的，但过程更安全。

### ⊙ 小结

Git鼓励大量使用分支：

>查看分支：`git branch`
>创建分支：`git branch <name>`
>切换分支：`git checkout <name>`
>创建+切换分支：`git checkout -b <name>`
>合并某分支到当前分支：`git merge <name>`
>删除分支：`git branch -d <name>`
![](http://i.imgur.com/558sZQv.png)

## § <a name="solve-conflict">解决冲突</a>
人生不如意之事十之八九，合并分支往往也不是一帆风顺的。

准备新的`feature1`分支，继续我们的新分支开发：
```js
$ git checkout -b featurel
Switched to a new branch 'featurel'
```
在`master.txt`最后一行增加内容：
```js
分支featurel上增加这行文字
```
在`feature1`分支上提交：
```js
$ git add master.txt
```
```js
$ git commit -m 'featurel branch first commit'
[featurel 9a897e3] featurel branch first commit
 1 file changed, 1 insertion(+)
```
切换到`master`分支：
```js
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
```
`Git`还会自动提示我们当前`master`分支比远程的`master`分支要超前1个提交。

在`master`分支上在`master.txt`最后一行增加内容：
```js
主分支master最后一行增加这行文字
```
提交：
```js
$ git add master.txt
```
```js
$ git commit -m 'master branch add a line text'
[master 5e81fd0] master branch add a line text
 1 file changed, 1 insertion(+), 1 deletion(-)
```
现在，`master`分支和`feature1`分支各自都分别有新的提交，变成了这样：

![](http://i.imgur.com/uLi4vUf.png)

这种情况下，Git无法执行“快速合并”，只能试图把各自的修改合并起来，但这种合并就可能会有冲突，我们试试看：
```js
$ git merge featurel
Auto-merging master.txt
CONFLICT (content): Merge conflict in master.txt
Automatic merge failed; fix conflicts and then commit the result.
```
果然冲突了！`Git`告诉我们，`master.txt`文件存在冲突，必须手动解决冲突后再提交。`git status`也可以告诉我们冲突的文件：
```js
$ git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)

        both modified:   master.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
我们可以直接查看`master.txt`的内容：
```js
$ cat master.txt
主分支master 16:41
分支dev增加的这行内容16:47
<<<<<<< HEAD
主分支master最后一行增加这行文字
=======
分支featurel上增加这行文字

>>>>>>> featurel
```
Git用`<<<<<<<`，`=======`，`>>>>>>>`标记出不同分支的内容，手动删除符号并保存后查看：
```js
$ cat master.txt
主分支master 16:41
分支dev增加的这行内容16:47
主分支master最后一行增加这行文字
分支featurel上增加这行文字
```
再提交：
```js
$ git add master.txt
```
```js
$ git commit -m 'merge branch featurel'
[master e9669f9] merge branch featurel
```
现在，`master`分支和`feature1`分支变成了下图所示：

![](http://i.imgur.com/q0ETHHA.png)

用带参数的`git log`也可以看到分支的合并情况：
```js
$ git log --graph --pretty=oneline --abbrev-commit
*   e9669f9 (HEAD -> master) merge branch featurel
|\
| * 9a897e3 (featurel) featurel branch first commit
* | 5e81fd0 master branch add a line text
|/
* cd7548e (origin/master, origin/HEAD) return original state
...
```
最后，删除`feature1`分支：
```js
$ git branch -d featurel
Deleted branch featurel (was 9a897e3).
```
工作完成。

### ⊙ 小结
>当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。
>用`git log --graph`命令可以看到分支合并图

![](http://i.imgur.com/gzH9mHq.png)


## § <a name="branch-strategy">分支管理策略</a>
通常，合并分支时，如果可能，`Git`会用`Fast forward`模式，但这种模式下，删除分支后，会丢掉分支信息。

如果要强制禁用`Fast forward`模式，`Git`就会在`merge`时生成一个新的`commit`，这样，从分支历史上就可以看出分支信息。

下面试着用一下`--no-ff`方式的`git merge`：

首先，仍然创建并切换dev分支：
```js
$ git checkout -b dev
Switched to a new branch 'dev'
```
修改`master.txt`文件，并提交一个新的commit：
```js
$ git add master.txt
```
```js
$ git commit -m 'test --no-ff'
[dev 2ab9b4a] test --no-ff
 1 file changed, 1 insertion(+), 1 deletion(-)
```
再切换回master：
```js
$ git checkout master
Switched to branch 'master'
```
准备合并`dev`分支，请注意`--no-ff`参数，表示禁用`Fast forward`：
```js
$ git merge --no-ff -m 'merge with no-ff' dev
Merge made by the 'recursive' strategy.
 master.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```
因为本次合并要创建一个新的commit，所以加上`-m`参数，把`commit`描述写进去。

合并后，用git log看看分支历史：
```js
$ git log --graph --pretty=oneline --abbrev-commit
*   4e7d1dc (HEAD -> master) merge with no-ff
|\
| * 2ab9b4a (dev) test --no-ff
|/
* 82bf29e (origin/master, origin/HEAD) merge branch dev delete
```
可以看到，不使用`Fast forward`模式，`merge`后就像这样：

![](https://i.imgur.com/ZqJEE3U.png)

### ⊙ 分支策略

在实际开发中，我们应该按照几个基本原则进行分支管理：

首先，`master`分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

那在哪干活呢？干活都在`dev`分支上，也就是说，`dev`分支是不稳定的，到某个时候，比如1.0版本发布时，再把`dev`分支合并到`master`上，在`master`分支发布1.0版本；

你和你的小伙伴们每个人都在`dev`分支上干活，每个人都有自己的分支，时不时地往`dev`分支上合并就可以了。

所以，团队合作的分支看起来就像这样：

![](https://i.imgur.com/kxieZ5d.png)

### ⊙ 小结
>* Git分支十分强大，在团队开发中应该充分应用。
>* 合并分支时，加上`--no-ff`参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而`Fast forward`合并就看不出来曾经做过合并。

## § <a name="bug-branch">Bug分支</a>
软件开发中，`bug`就像家常便饭一样。有了`bug`就需要修复，在`Git`中，由于分支是如此的强大，所以，每个`bug`都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除。

当你接到一个修复一个代号`101`的`bug`的任务时，很自然地，你想创建一个分支`issue-101`来修复它，但是，等等，当前正在`dev`上进行的工作还没有提交：
```js
$ git status
On branch dev
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   master.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
并不是你不想提交，而是工作只进行到一半，还没法提交，预计完成还需1天时间。但是，必须在两个小时内修复该`bug`，怎么办？

幸好，`Git`还提供了一个`stash`功能，可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作：
```js
$ git stash
Saved working directory and index state WIP on dev: 2ab9b4a test --no-ff
```
现在，用`git status`查看工作区，就是干净的（除非有没有被Git管理的文件），因此可以放心地创建分支来修复`bug`。
```js
$ git status
On branch dev
nothing to commit, working tree clean
```
首先确定要在哪个分支上修复`bug`，假定需要在`master`分支上修复，就从`master`创建临时分支：
```js
$ git checkout master
Switched to branch 'master'
Your branch is ahead of 'origin/master' by 2 commits.
  (use "git push" to publish your local commits)
```
```js
$ git checkout -b issue-101
Switched to a new branch 'issue-101'
```
现在修复`bug`，比如需要在每行内容后面加上时间，然后提交：
```js
$ git add master.txt
```
```js
$ git commit -m 'fix bug 101'
[issue-101 a13fafc] fix bug 101
 1 file changed, 2 insertions(+), 2 deletions(-)
```
修复完成后，切换到`master`分支，并完成合并，最后删除`issue-101`分支：
```js
$ git checkout master
Switched to branch 'master'
Your branch is ahead of 'origin/master' by 2 commits.
  (use "git push" to publish your local commits)
```
```js
$ git merge --no-ff -m 'merge bug fix 101' issue-101
Merge made by the 'recursive' strategy.
 master.txt | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```
```js
$ git branch -d issue-101
Deleted branch issue-101 (was a13fafc).
```
太棒了，原计划两个小时的`bug`修复只花了5分钟！现在，是时候接着回到`dev`分支干活了！
```js
$ git checkout dev
Switched to branch 'dev'
```
```js
$ git status
On branch dev
nothing to commit, working tree clean
```
工作区是干净的，刚才的工作现场存到哪去了？用`git stash list`命令看看：
```js
$ git stash list
stash@{0}: WIP on dev: 2ab9b4a test --no-ff
```
一是用`git stash apply`恢复，但是恢复后，`stash`内容并不删除，你需要用`git stash drop`来删除；

另一种方式是用`git stash pop`，恢复的同时把`stash`内容也删了：
```js
$ git stash pop
On branch dev
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   master.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (cb527b515d00a720c94fcad8bbbdbb4deaeb7e46)
```
再用`git stash list`查看，就看不到任何`stash`内容了：
```js
$ git stash list
```
你可以多次`stash`，恢复的时候，先用`git stash list`查看，然后恢复指定的`stash`，用命令：
```js
$ git stash apply stash@{0}
```
### ⊙ 小结

>* 修复bug时，我们会通过创建新的bug分支进行修复，然后合并，最后删除；
>* 当手头工作没有完成时，先把工作现场git stash一下，然后去修复bug，修复后，再git stash pop，回到工作现场

## § <a name="feature-branch">Feature分支</a>
软件开发中，总有无穷无尽的新的功能要不断添加进来。

添加一个新功能时，你肯定不希望因为一些实验性质的代码，把主分支搞乱了，所以，每添加一个新功能，最好新建一个`feature`分支，在上面开发，完成后，合并，最后，删除该`feature`分支。

现在，你终于接到了一个新任务：开发代号为Vulcan的新功能。

于是准备开发：
```js
$ git checkout -b featurel-vulcan
Switched to a new branch 'featurel-vulcan'
```
开发完毕后做一次commit：
```js
$ git add valcan.txt
```
```js
$ git commit -m 'add featrue valcan'
[featurel-vulcan 1740ae1] add featrue valcan
 1 file changed, 1 insertion(+)
 create mode 100644 valcan.txt
```
切回`dev`，准备合并：
```js
$ git checkout dev
Switched to branch 'dev'
```
一切顺利的话，`feature`分支和`bug`分支是类似的，合并，然后删除。

但是，

就在此时，接到上级命令，因经费不足，新功能必须取消！

虽然白干了，但是这个分支还是必须就地销毁：
```js
$ git branch -d featurel-vulcan
error: The branch 'featurel-vulcan' is not fully merged.
If you are sure you want to delete it, run 'git branch -D featurel-vulcan'.
```
销毁失败。`Git`友情提醒，`featurel-vulca`分支还没有被合并，如果删除，将丢失掉修改，如果要强行删除，需要使用命令`git branch -D featurel-vulca`。

现在进行强行删除：
```js
$ git branch -D featurel-vulcan
Deleted branch featurel-vulcan (was 1740ae1).
```
删除成功!

### ⊙ 小结
>* 开发一个新feature，最好新建一个分支；
>* 如果要丢弃一个没有被合并过的分支，可以通过git branch -D <name>强行删除。

## § <a name="peo-cooperate">多人协作</a>
当你从远程仓库克隆时，实际上`Git`自动把本地的`master`分支和远程的`master`分支对应起来了，并且，远程仓库的默认名称是`origin`。

要查看远程库的信息，用`git remote`：
```js
$ git remote
origin
```
或者，用`git remote -v`显示更详细的信息：
```js
$ git remote -v
origin  https://github.com/DxLucky/git-clone-test.git (fetch)
origin  https://github.com/DxLucky/git-clone-test.git (push)
```
上面显示了可以抓取和推送的`origin`的地址。如果没有推送权限，就看不到`push`的地址。

### ⊙ 推送分支
推送分支，就是把该分支上的所有本地提交推送到远程库。推送时，要指定本地分支，这样，`Git`就会把该分支推送到远程库对应的远程分支上：
```js
$ git push origin master
```
如果要推送其他分支，比如`dev`，就改成：
```js
$ git push origin dev
```
但是，并不是一定要把本地分支往远程推送，那么，哪些分支需要推送，哪些不需要呢？

* `master`分支是主分支，因此要时刻与远程同步；

* `dev`分支是开发分支，团队所有成员都需要在上面工作，所以也需要与远程同步；

* `bug`分支只用于在本地修复`bug`，就没必要推到远程了，除非老板要看看你每周到底修复了几个`bug`；

* `feature`分支是否推到远程，取决于你是否和你的小伙伴合作在上面开发。

总之，就是在`Git`中，分支完全可以在本地自己藏着玩，是否推送，视你的心情而定！

### ⊙ 抓取分支
多人协作时，大家都会往`master`和`dev`分支上推送各自的修改。

现在，模拟一个你的小伙伴，可以在另一台电脑（注意要把SSH Key添加到GitHub）或者同一台电脑的另一个目录下克隆：
```js
$ git clone https://github.com/DxLucky/git-clone-test.git
Cloning into 'git-clone-test'...
remote: Counting objects: 128, done.
remote: Compressing objects: 100% (97/97), done.
remote: Total 128 (delta 32), reused 116 (delta 23), pack-reused 0
Receiving objects: 100% (128/128), 11.78 KiB | 0 bytes/s, done.
Resolving deltas: 100% (32/32), done.
```
当其他小伙伴从远程库clone时，默认情况下，其他小伙伴只能看到本地的`master`分支。不信可以用`git branch`命令看看：
```js
$ git branch
* master
```
现在，其他小伙伴要在`dev`分支上开发，就必须创建远程`origin`的`dev`分支到本地，于是他用这个命令创建本地`dev`分支：
```js
$ git checkout -b dev origin/dev
Switched to a new branch 'dev'
Branch dev set up to track remote branch dev from origin.
```
现在，他就可以在`dev`上继续修改，然后，时不时地把`dev`分支`push`到远程：
```js
$ git add master.txt
```
```js
$ git commit -m 'clone dev branch and push'
[dev 240ae2e] clone dev branch and push
 1 file changed, 1 insertion(+), 1 deletion(-)
```
```js
$ git push origin dev
Username for 'https://github.com': DxLucky
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 337 bytes | 0 bytes/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/DxLucky/git-clone-test.git
   6475b16..240ae2e  dev -> dev
```
其他小伙伴已经向`origin/dev`分支推送了他的提交，而碰巧你也对同样的文件作了修改，并试图推送：
```js
$ git add master.txt
```
```js
$ git commit -m 'dev branch push modify'
[dev 6bfccbd] dev branch push modify
 1 file changed, 1 insertion(+), 1 deletion(-)
```
```js
$ git push origin dev
Username for 'https://github.com': DxLucky
To https://github.com/DxLucky/git-clone-test.git
 ! [rejected]        dev -> dev (fetch first)
error: failed to push some refs to 'https://github.com/DxLucky/git-clone-test.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```
推送失败，因为你的小伙伴的最新提交和你试图推送的提交有冲突，解决办法也很简单，`Git`已经提示我们，先用`git pull`把最新的提交从`origin/dev`抓下来，然后，在本地合并，解决冲突，再推送：
```js
$ git pull
remote: Counting objects: 3, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 3 (delta 1), pack-reused 0
Unpacking objects: 100% (3/3), done.
From https://github.com/DxLucky/git-clone-test
   6475b16..240ae2e  dev        -> origin/dev
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> dev
```
`git pull`也失败了，原因是没有指定本地`dev`分支与远程`origin/dev`分支的链接，根据提示，设置`dev和origin/dev`的链接：
```js
$ git branch --set-upstream-to=origin/dev dev
Branch dev set up to track remote branch dev from origin.
```
再`git pull`
```js
$ git pull
Auto-merging master.txt
CONFLICT (content): Merge conflict in master.txt
Automatic merge failed; fix conflicts and then commit the result.
```
这回`git pull`成功，但是合并有冲突，需要手动解决，解决的方法和分支管理中的解决冲突完全一样。解决后，提交，再`push`：
```js
$ git add master.txt
```
```js
$ git commit -m 'f pan modify dev'
[dev 4e8ac09] f pan modify dev
 1 file changed, 1 insertion(+), 1 deletion(-)
```
```js
$ git push origin dev
Username for 'https://github.com': DxLucky
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (6/6), 621 bytes | 0 bytes/s, done.
Total 6 (delta 0), reused 0 (delta 0)
To https://github.com/DxLucky/git-clone-test.git
   ae02940..2d9fd5e  dev -> dev
```
因此，多人协作的工作模式通常是这样：

* 1、首先，可以试图用`git push origin branch-name`推送自己的修改；

* 2、如果推送失败，则因为远程分支比你的本地更新，需要先用`git pull`试图合并；

* 3、如果合并有冲突，则解决冲突，并在本地提交；

* 4、没有冲突或者解决掉冲突后，再用`git push origin branch-name`推送就能成功！

如果`git pull`提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to=origin/branch-name branch-name`。

这就是多人协作的工作模式，一旦熟悉了，就非常简单。

### ⊙ 小结

>* 查看远程库信息，使用`git remote -v`；
>* 本地新建的分支如果不推送到远程，对其他人就是不可见的；
>* 从本地推送分支，使用`git push origin branch-name`，如果推送失败，先用`git pull`抓取远程的新提交；
>* 在本地创建和远程分支对应的分支，使用`git checkout -b branch-name origin/branch-name`，本地和远程分支的名称最好一致；
>* 建立本地分支和远程分支的关联，使用`git branch --set-upstream-to=origin/branch-name branch-name`；
>* 从远程抓取分支，使用git pull，如果有冲突，要先处理冲突。

## § <a name="tags-manage">标签管理</a>
发布一个版本时，我们通常先在版本库中打一个标签（tag），这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。

`Git`的标签虽然是版本库的快照，但其实它就是指向某个commit的指针（跟分支很像对不对？但是分支可以移动，标签不能移动），所以，创建和删除标签都是瞬间完成的。

`Git`有`commit`，为什么还要引入`tag`？

“请把上周一的那个版本打包发布，commit号是6a5819e...”

“一串乱七八糟的数字不好找！”

如果换一个办法：

“请把上周一的那个版本打包发布，版本号是v1.2”

“好的，按照tag v1.2查找commit就行！”

所以，`tag`就是一个让人容易记住的有意义的名字，它跟某个`commit`绑在一起。

## § <a name="create-tags">创建标签</a>
在`Git`中打标签非常简单，首先，切换到需要打标签的分支上：
```js
$ git branch
* dev
  master
```
```js
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
```
然后，敲命令`git tag <name>`就可以打一个新标签：
```js
$ git tag v1.0
```
可以用命令`git tag`查看所有标签：
```js
$ git tag
v1.0
```
默认标签是打在最新提交的`commit`上的。有时候，如果忘了打标签，比如，现在已经是周五了，但应该在周一打的标签没有打，怎么办？

方法是找到历史提交的`commit id`，然后打上就可以了：
```js
$ git log --pretty=oneline --abbrev-commit
c9a802d (HEAD -> master, tag: v1.0, origin/master, origin/HEAD) return
cdbe10f m
84be394 merge bug fix 101
a13fafc fix bug 101
4e7d1dc merge with no-ff
2ab9b4a test --no-ff
82bf29e merge branch dev delete
bf5bdce branch dev delete word
aa67912 dev branch add word
...
```
比方说要对`merge bug fix 101`这次提交打标签，它对应的`commit id`是`84be394`，敲入命令：
```js
$ git tag v0.9 84be394
```
再用命令`git tag`查看标签：
```js
$ git tag
v0.9
v1.0
```
注意，标签不是按时间顺序列出，而是按字母排序的。可以用`git show <tagname>`查看标签信息：
```js
$ git show v0.9
commit 84be394a6d781180326208c370f73c6e9a576ab7 (tag: v0.9)
Merge: 4e7d1dc a13fafc
Author: DxLucky <flovekind@163.com>
Date:   Mon Sep 4 15:30:46 2017 +0800

    merge bug fix 101
```
可以看到，`v0.9`确实打在`merge bug fix 101`这次提交上。

还可以创建带有说明的标签，用`-a`指定标签名，`-m`指定说明文字：
```js
$ git tag -a v0.8 -m 'version 0.8 released' a13fafc
```
```js
$ git show v0.8
tag v0.8
Tagger: DxLucky <flovekind@163.com>
Date:   Tue Sep 5 15:22:15 2017 +0800

version 0.8 released

commit a13fafca1b37581f62aa6f470e8a28fced7c7f14 (tag: v0.8)
Author: DxLucky <flovekind@163.com>
Date:   Mon Sep 4 15:27:50 2017 +0800

    fix bug 101
...
```
### ⊙ 小结
>* 命令`git tag <name>`用于新建一个标签，默认为`HEAD`，也可以指定一个`commit id`；
>* `git tag -a <tagname> -m "blablabla..."`可以指定标签信息；

## § <a name="cooperate-tags">操作标签</a>
如果标签打错了，也可以删除：
```js
$ git tag -d v1.0
Deleted tag 'v1.0' (was c9a802d)
```
因为创建的标签都只存储在本地，不会自动推送到远程。所以，打错的标签可以在本地安全删除。

如果要推送某个标签到远程，使用命令`git push origin <tagname>`：
```js
$ git push origin v0.8
Username for 'https://github.com': DxLucky
Counting objects: 1, done.
Writing objects: 100% (1/1), 168 bytes | 0 bytes/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To https://github.com/DxLucky/git-clone-test.git
 * [new tag]         v0.8 -> v0.8
```
或者，一次性推送全部尚未推送到远程的本地标签：
```js
$ git push origin --tags
Username for 'https://github.com': DxLucky
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/DxLucky/git-clone-test.git
 * [new tag]         v0.9 -> v0.9
```
如果标签已经推送到远程，要删除远程标签就麻烦一点，先从本地删除：
```js
$ git tag -d v0.8
Deleted tag 'v0.8' (was de0d381)
```
然后，从远程删除。删除命令也是`push`，但是格式如下：
```js
$ git push origin :refs/tags/v0.8
Username for 'https://github.com': DxLucky
To https://github.com/DxLucky/git-clone-test.git
 - [deleted]         v0.8
```
登陆GitHub查看，可以发现已经从删除了对应标签。

### ⊙ 小结
>* 命令`git push origin <tagname>`可以推送一个本地标签；
>* 命令`git push origin --tags`可以推送全部未推送过的本地标签；
>* 命令`git tag -d <tagname>`可以删除一个本地标签；
>* 命令`git push origin :refs/tags/<tagname>`可以删除一个远程标签。










