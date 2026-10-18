# 照片日期核对记录（内部维护）

32 张入选照片中，23 张有 EXIF `DateTimeOriginal`，5 张使用文件名中的日期，4 张日期未知。排序不使用文件系统创建时间、复制时间或修改时间。

EXIF 中的 `DateTime` 是嵌入的文件修改时间，未用它代替 `DateTimeOriginal`。例如编辑版本 `IMG_20260909_222754.jpg` 的拍摄时间实际记录为 19:48:45，采用 EXIF 拍摄时间，不采用文件名的 22:27:54。

文件名日期仅表示可从名称中核实的日期，可能是修图或导出时间，不声称已经确认是实际拍摄时刻。该来源在每条 `dateSource` 中单独标注。当前所有有日期照片的原图还保留了 EXIF `OffsetTimeOriginal=+09:00`，因此没有推断时区。

## 有日期照片（网页顺序）

| 原图                                                      | 日期                            | 来源                  |
| --------------------------------------------------------- | ------------------------------- | --------------------- |
| `ACES Lab-Heye/MEITU_20261016_104135495.jpg`              | `2026-10-16T10:41:35.495+09:00` | 文件名                |
| `ACES Lab-Heye/IMG_20261015_172533.jpg`                   | `2026-10-15T17:25:34.134+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_171951.jpg`                   | `2026-10-15T17:19:52.007+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/MEITU_20261015_143524533.jpg`              | `2026-10-15T14:35:24.533+09:00` | 文件名                |
| `jingguang/IDG_20261015_134318_887.jpg`                   | `2026-10-15T13:43:18.887+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_124622_1.jpg`                 | `2026-10-15T12:46:22.954+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_124017.jpg`                   | `2026-10-15T12:40:17.591+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_124006.jpg`                   | `2026-10-15T12:40:06.441+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_123944.jpg`                   | `2026-10-15T12:39:44.291+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261015_123910.jpg`                   | `2026-10-15T12:39:10.480+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261014_141130_1792303043951edit.jpg` | `2026-10-14T14:11:30.551+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20261012_181610.jpg`                   | `2026-10-12T18:16:10.163+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260927_203634.jpg`                   | `2026-09-27T20:36:35.025+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260927_202100.jpg`                   | `2026-09-27T20:21:00.681+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260927_202034.jpg`                   | `2026-09-27T20:20:34.134+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/MVIMG_20260918_185832.jpg`                 | `2026-09-18T18:58:32.296+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260912_200252.jpg`                   | `2026-09-12T20:02:52.785+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/MEITU_20260912_105146181.jpg`              | `2026-09-12T10:51:46.181+09:00` | 文件名                |
| `ACES Lab-Heye/IMG_20260909_222638.jpg`                   | `2026-09-09T22:26:38+09:00`     | 文件名                |
| `ACES Lab-Heye/IMG_20260909_205943.jpg`                   | `2026-09-09T20:59:43.938+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260909_203558.jpg`                   | `2026-09-09T20:35:58.800+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260909_222754.jpg`                   | `2026-09-09T19:48:45.643+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/MEITU_20260831_211447646.jpg`              | `2026-08-31T21:14:47.646+09:00` | 文件名                |
| `ACES Lab-Heye/IMG_20260831_210418_1.jpg`                 | `2026-08-31T21:04:18.868+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260831_202105.jpg`                   | `2026-08-31T20:21:05.498+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260831_184833.jpg`                   | `2026-08-31T18:48:33.802+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260831_181810.jpg`                   | `2026-08-31T18:18:10.326+09:00` | EXIF DateTimeOriginal |
| `ACES Lab-Heye/IMG_20260831_181156.jpg`                   | `2026-08-31T18:11:56.443+09:00` | EXIF DateTimeOriginal |

## 日期未知的照片

以下 4 张旅行照片没有 `DateTimeOriginal`；未发现可用的 XMP、IPTC 或 GPS 日期，文件名没有日期。部分照片仍有时区字段，但时区不能据以恢复拍摄日期。检查全部 74 张原图后，没有发现可核实拍摄日期的同一场景版本，因此未从人物、地点、季节或相邻文件推测日期。

这 4 张保留在最后，`capturedAt=null`，`dateSource.kind=unknown`；内部顺序仅用内容哈希稳定排序，不表示它们之间的时间先后。

- `xianjie/7eee13c428c2ce0983d3349db0f5bcad.jpg`（编号 `1f6900e7cc3b3b90`）
- `xianjie/a25e398aaa65c095400d49a5d319adf0.jpg`（编号 `65ba4fcdb2ff23b4`）
- `xianjie/be07cf76efa3a435882b343185cc8609.jpg`（编号 `704e04e39408b927`）
- `xianjie/a67a74f4bd5d2b41df760970f842a14e.jpg`（编号 `fb99f6d88d388f8d`）
