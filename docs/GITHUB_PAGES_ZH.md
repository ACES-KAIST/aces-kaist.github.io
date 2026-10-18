# 将 ACES Lab 网站托管到 GitHub Pages

这份项目已经配置静态导出和 GitHub Actions。网站源码在 `stanfordasl.github.io` 文件夹内；文件夹名称可以保留，不影响网址。

## 1. 新建自己的 GitHub 仓库

登录你的 GitHub 账号，点击右上角 **+ → New repository**。

- Owner：选择你的账号或实验室组织。
- Repository name：推荐先用 `aces-lab`。
- Visibility：若使用 GitHub Free，选择 Public。
- 不勾选 README、.gitignore 和 License，保持远端仓库为空。当前本地项目已经包含这些文件。
- 点击 Create repository，复制 HTTPS 仓库地址。

普通项目仓库 `aces-lab` 的网址是 `https://你的账号.github.io/aces-lab/`。如果需要根网址 `https://你的账号.github.io/`，仓库名称必须为 `你的账号.github.io`。本项目的工作流会读取 Pages 的实际路径，两种方式都支持。

## 2. 将本地项目连接到自己的仓库

在终端中运行：

```bash
cd '/Users/jingguang/Library/CloudStorage/GoogleDrive-zhangwenqin1972@gmail.com/My Drive/CodeField/Project_LabPage/stanfordasl.github.io'
git remote -v
```

初始 `origin` 是 StanfordASL 的仓库。第一次配置时，将它改名为 `upstream`，再添加你自己的仓库：

```bash
git remote rename origin upstream
git remote add origin https://github.com/YOUR_ACCOUNT/aces-lab.git
git remote -v
```

将 `YOUR_ACCOUNT` 替换为你的 GitHub 用户名。确认 `origin` 指向自己的仓库，`upstream` 指向 StanfordASL。这两条配置命令只需要执行一次；若已经有 `upstream` 或 `origin`，先用 `git remote -v` 查看，不要重复添加。

## 3. 提交并上传

```bash
git status
git add .
git commit -m "Adapt website for ACES Lab"
git branch -M main
git push -u origin main
```

GitHub 不接受账号密码作为 HTTPS Git 密码。可通过 GitHub Desktop 登录后推送，或运行 `gh auth login` 完成 GitHub CLI 登录。也可以使用有该仓库写入权限的个人访问令牌；不要把令牌写进仓库文件或远端 URL。

## 4. 开启 GitHub Pages

进入你自己的仓库：

1. 点击 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 点击 **Actions → Deploy to GitHub Pages → Run workflow → main → Run workflow**。
4. 等待 `build` 和 `deploy` 都显示绿色勾。
5. 回到 **Settings → Pages**，点击 **Visit site**。

首次 push 如果早于 Pages 设置，工作流可能失败；完成设置后重新运行即可。无需创建 `gh-pages` 分支，也无需手工上传 `out`。

工作流文件为 `.github/workflows/deploy.yml`，每次向 `main` 推送修改都会重新部署。

## 5. 后续更新

改完内容后，可以先本地检查：

```bash
npm ci
npm run dev
```

打开终端显示的本地网址，通常为 `http://localhost:3000`。检查后按 Control+C 停止预览，再运行：

```bash
npm run build
git add .
git commit -m "Update lab website"
git push
```

`npm run build` 会生成 `out`。构建包含 TypeScript 和 Next.js 检查。原模板的历史会议网页、旧成员档案和旧论文档案会从发布目录中排除，仍保留在本地克隆和 Git 历史中。

## 论文自动更新

已添加 `.github/workflows/update-publications.yml`，通过 SerpApi 读取 Heye Huang 的 Google Scholar，每周一韩国时间 **09:17** 检查更新。GitHub 定时任务可能稍有延迟。

- 读取完整论文列表，优先获取新增或有变化的论文详情，并逐步复核已有记录；每次最多获取 20 篇详情，超出的留待后续运行。保留已核实的代码链接、奖项和人工修正。
- 有更新时先构建验证，再由 GitHub Actions 提交至 `main`，随后触发网站部署。
- 密钥缺失、服务限流、额度用完或数据不完整时停止更新，现有网站和论文列表保持可用。

首次配置：

1. 在 [SerpApi](https://serpapi.com/) 注册账号，从账号页面取得 API key。
2. 打开[仓库的 Actions secrets 设置](https://github.com/ACES-KAIST/aces-kaist.github.io/settings/secrets/actions)，点击 **New repository secret**。
3. **Name** 填 `SERPAPI_API_KEY`，**Secret** 填 API key，然后保存。不要把密钥写进代码、提交到仓库或发到聊天中。
4. 打开 **Actions → Update publications → Run workflow → main → Run workflow**。成功后检查运行摘要和网站的 Publications 页面。

截至 2026-10-18，[SerpApi 免费计划](https://serpapi.com/pricing)提供每月 250 次查询、每小时 50 次。当前 93 条记录可用一次列表查询读完；加上最多 20 次详情查询，每次运行最多约 21 次，每月运行五次约 105 次。手动运行、其他项目共用密钥以及未来列表增长也会消耗额度。可以先使用免费计划，无需先购买订阅。

没有配置密钥时，自动更新任务会明确报错；添加 Secret 后按第 4 步运行即可。网站部署任务独立运行，不受该错误影响。具体同步规则和人工修正方法见 [PUBLICATIONS.md](PUBLICATIONS.md)。

## 常改内容的位置

| 内容                       | 文件                                             |
| -------------------------- | ------------------------------------------------ |
| 实验室名称、邮箱和导师链接 | `src/lib/site.ts`                                |
| 首页、新闻                 | `src/app/page.tsx`                               |
| 研究方向                   | `src/data/research.tsx`、`src/app/research/page.tsx` |
| Hardware                   | `src/app/hardware/page.tsx`                      |
| 成员资料                   | `content/people/*.markdown`                      |
| 访问学生、实习生和 RA      | `content/people/visiting.json`                   |
| 论文列表                   | `src/data/publications.json`                     |
| 加入实验室                 | `src/app/faq/page.tsx`                           |
| 联系方式                   | `src/app/contact/page.tsx`                       |
| 相册页面和图片清单         | `src/app/photo/page.tsx`、`src/data/photos.json` |
| 顶部导航                   | `src/components/navbar.tsx`                      |

### 替换 Unitree G1 照片

将你们的机器人照片放进 `public/hardware/`，例如 `unitree-g1.jpg`。打开 `src/app/hardware/page.tsx`，将图片路径改成 `/hardware/unitree-g1.jpg`，并根据新照片更新 `alt` 替代文字。网页不显示照片说明。保留 `assetPath(...)` 调用，以兼容 GitHub 项目路径。

### 更新 Photo

原图保留在项目外层的 `Photo` 文件夹中，网页使用 `public/photos` 中的压缩副本。筛选清单和更新方法见 `scripts/photo-assets.md`。页面没有图片 caption，也没有点击放大功能。更新网页副本后一起提交 `src/data/photos.json`、`public/photos` 和筛选清单。

## 内容来源与素材说明

实验室名称、研究方向、成员和招聘信息整理自 [Heye Huang 的主页](https://huangheye.github.io/)，读取日期为 2026-10-18。论文列表已结合 Google Scholar 和论文来源核对、去重，当前包含 60 篇已发表论文和 15 篇预印本；来源、排除规则和后续更新方法见 [PUBLICATIONS.md](PUBLICATIONS.md)。研究方向统一采用主页中的三个名称：

- Trustworthy safety-critical systems
- Generative AI and world models
- Foundation models and agents

Contact 页的实验室房间 F335 由实验室确认（2026-10-18）；Building F、193 Munji-ro 的校区地址来自 [学校地图页](https://mo.kaist.ac.kr/en/graduate-school-introduction/map/)，邮编 34051 可在 [KAIST ITVC 地址页](https://itvc.kaist.ac.kr/esub0104)核对。实验室位于 Building F 三楼 F335，访问前请通过邮件联系。

首页和 Research 共用 `src/data/research.tsx` 中的方向名称、顺序与介绍，内容依据实验室于 2026-10-18 提供的介绍海报。Research 1 使用导师主页的 [LEAD 视频](https://huangheye.github.io/assets/publications/thumbs/lead.mp4)，本地文件为 `public/aces/research/lead.mp4`；Research 2 使用与首页相同的 Risk-Controllable Multi-View Diffusion 图片；Research 3 使用保留动画逻辑的浅色智能体示意图。三个方向的区域背景均为白色。Research 标题区背景以及 G1、Go2 参考照片保留自 Stanford ASL 模板。Autonomous Vehicle 和 Driving Simulator 照片来自实验室本地文件。设备素材来源和描述范围见 [HARDWARE.md](HARDWARE.md)，页面不显示来源字幕。

原仓库的 `LICENSE.md` 是 Tailwind Plus 许可，不是 MIT 许可；已原样保留。公开发布前请确认你们具有使用该模板和保留素材的授权；来源标注不能替代授权。

## 官方文档

- [创建 GitHub Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [使用 GitHub Actions 部署 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)

Team 卡片的学历直接读取个人 Markdown 中的 Education 段，与详情页保持一致。Benwang Chen 暂仅显示已核实的清华硕士学历。News 中 AnyHand-Agent、CAPE-3D、XMind 暂不添加链接，待实验室提供论文或项目地址后再补充；Risk-Controllable Multi-View Diffusion 已链接至核实的 arXiv 论文。
