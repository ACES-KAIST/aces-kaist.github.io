# Photo 页面维护

页面读取 `src/data/photos.json`，显示 `public/photos/` 中的 WebP 图片。照片按原比例排成瀑布流，不提供点击或放大功能。

## 添加照片

1. 将原图放入仓库上一级的 `Photo/` 文件夹。可以放在子文件夹中。
2. 在仓库目录执行 `npm run photos:build`。也可以指定原图目录：`npm run photos:build -- /path/to/photos`。
3. 新照片会在终端提示一个编号，默认不加入网页。查看原图，与已有照片比较，只选择清晰、构图完整且不重复的照片。
4. 将入选照片的编号加入 `scripts/photo-selection.json`。网页顺序由原图日期自动决定。在 `scripts/photo-descriptions.json` 中为编号添加 `alt`（准确的英文画面描述，仅供无障碍阅读使用）。再次执行命令。
5. 提交更新后的 `public/photos/`、`src/data/photos.json`、`scripts/photo-selection.json` 和 `scripts/photo-descriptions.json`。

GitHub Actions 直接使用已经生成的网页图片，不需要上传 `Photo/` 原图文件夹。

## 图片处理

脚本递归读取 JPG、PNG、WebP、AVIF 和 TIFF 图片，只为入选清单中的照片生成 480 像素和 960 像素宽的 WebP 文件。小图不会被放大。图片会按 EXIF 方向旋转，网页副本不保留 EXIF 信息，原图不变。

网页文件名使用内容哈希，页面不会显示原始文件名或 caption。相同内容的重复文件只显示一次。移除入选清单中的编号后重新执行命令，会删除对应的网页副本；不删除原图。若入选原图缺失，脚本会停止并报告编号。

当前从74张原图中保留56张，只排除完全重复或非常相似的照片；同一活动中的不同动作、人员排列和明显不同构图均保留。详细取舍记录在 `scripts/photo-selection-review.md` 中，不在网页展示。替代文字均根据画面编写；更新照片后，请确认仍与画面一致。

## 日期与排序

网页按日期从新到旧排列。优先读取原图 EXIF 的 `DateTimeOriginal`，保留 `OffsetTimeOriginal` 中已有的时区；缺少拍摄时间时，使用文件名中的日期和时间，并将来源记录为 `filename`。不使用文件创建时间或复制、修改时间。

`src/data/photos.json` 中的 `capturedAt` 保存日期，`dateSource` 保存依据。文件名日期可能来自修图或导出，因此不把它当作经过独立确认的拍摄时间。当前43张使用EXIF，9张使用文件名，4张无法确定日期，保留在相册末尾，日期为 `null`。一张DJI原片没有记录时区，保留原始当地时间，不补写时区。具体核对记录见 `scripts/photo-date-review.md`。

布局保持清单顺序：第一排图片顶部对齐，随后按照片上边缘的位置从上到下、从左到右浏览。图片维持原始比例。
