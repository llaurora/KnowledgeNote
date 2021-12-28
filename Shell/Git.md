# Git

---

### git 删除远程 Tag

```bash
git tag -d tag-name
git push origin :refs/tags/tag-name
```

### git 回退版本并提交到远程分支

```bash
git reset --hard commitId
git push -f origin branchName
```

### 使用 shell 批量修改 git 提交作者和邮箱

新建 rewrite.sh 脚本并运行

```bash
#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="your-old-email@example.com"
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="your-correct-email@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

强制推送修改的 git 记录到远程 Github

```bash
git push --force --tags origin 'refs/heads/*'
```

### git 修改账户信息

```bash
// 查看 Git 配置
git config --list

// 修改全局仓库账户信息
git config --global user.name "Author Name"
git config --global user.email "Author Email"

// 修改本地项目仓库账户信息
git config user.name "Author Name"
git config user.email "Author Email"
```