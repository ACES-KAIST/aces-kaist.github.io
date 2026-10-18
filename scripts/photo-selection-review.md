# 照片筛选记录（内部维护）

依据：逐张查看 74 张照片的联系表，并放大比较人物表情、清晰度、画面完整度和构图。相似连拍和跨文件夹的相近副本只保留一张，不仅依赖文件哈希。

结果：保留 32 张，排除 42 张。原图全部保留；本文件不在网页展示，网页不显示 caption。

## 相似照片组

| 保留照片                                                  | 排除照片                                                                                                                                                                                                                                           | 取舍理由                                                           |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `ACES Lab-Heye/IMG_20260831_181156.jpg`                   | ACES Lab-Heye/IMG_20260831_191657.jpg                                                                                                                                                                                                              | 举杯特写构图更集中，光线更均匀。                                   |
| `ACES Lab-Heye/IMG_20260831_184833.jpg`                   | ACES Lab-Heye/IMG_20260831_184811.jpg<br>ACES Lab-Heye/IMG_20260831_184831.jpg                                                                                                                                                                     | 五人均完整入镜，表情自然，保留笑容更好的版本。                     |
| `ACES Lab-Heye/IMG_20260831_202105.jpg`                   | ACES Lab-Heye/IMG_20260831_202100.jpg<br>ACES Lab-Heye/IMG_20260831_202250.jpg<br>ACES Lab-Heye/IMG_20260831_203515.jpg<br>ACES Lab-Heye/IMG_20260831_203517.jpg<br>ACES Lab-Heye/IMG_20260831_203518.jpg<br>ACES Lab-Heye/IMG_20260831_203519.jpg | 同一生日人物的连续照片，保留表情最自然、蛋糕和双手完整的照片。     |
| `ACES Lab-Heye/IMG_20260909_222754.jpg`                   | ACES Lab-Heye/IMG_20260909_194829.jpg<br>ACES Lab-Heye/IMG_20260909_194845.jpg                                                                                                                                                                     | 保留人物更清楚、画面更紧凑的集体照。                               |
| `ACES Lab-Heye/IMG_20260909_222638.jpg`                   | ACES Lab-Heye/IMG_20260909_222652.jpg                                                                                                                                                                                                              | 人物面部更自然，避免另一张中较明显的闭眼。                         |
| `ACES Lab-Heye/IMG_20260912_200252.jpg`                   | ACES Lab-Heye/IMG_20260912_200203.jpg<br>ACES Lab-Heye/IMG_20260912_200204.jpg<br>ACES Lab-Heye/IMG_20260912_200210.jpg                                                                                                                            | 同一室内活动保留人数最完整的集体照。                               |
| `ACES Lab-Heye/IMG_20260927_202034.jpg`                   | ACES Lab-Heye/IMG_20260927_202029.jpg                                                                                                                                                                                                              | 保留视野更完整的游戏机旁合照。                                     |
| `ACES Lab-Heye/IMG_20260927_203634.jpg`                   | ACES Lab-Heye/IMG_20260927_203636.jpg                                                                                                                                                                                                              | 保留正在操作游戏机、动作更清楚的一张。                             |
| `ACES Lab-Heye/IMG_20261012_181610.jpg`                   | ACES Lab-Heye/IMG_20261012_181610_2.jpg                                                                                                                                                                                                            | 相同餐桌的近重复照片，保留表情更自然的版本。                       |
| `ACES Lab-Heye/IMG_20261014_141130_1792303043951edit.jpg` | ACES Lab-Heye/IMG_20261014_141135_1.jpg                                                                                                                                                                                                            | 保留人物和海报更集中、空白更少的交流场景。                         |
| `ACES Lab-Heye/IMG_20261015_123910.jpg`                   | ACES Lab-Heye/IMG_20261015_123909.jpg<br>xianjie/31cd3d6f4d72733437eb1d7577363f3a.jpg                                                                                                                                                              | 同一人物和会议背景，保留正面表情清楚的一张。                       |
| `ACES Lab-Heye/IMG_20261015_123944.jpg`                   | ACES Lab-Heye/IMG_20261015_123948.jpg<br>jingguang/1504.jpg                                                                                                                                                                                        | 同一人物和会议背景，保留人物比例更大、空白更少的横幅照片。         |
| `ACES Lab-Heye/IMG_20261015_124006.jpg`                   | ACES Lab-Heye/IMG_20261015_123957.jpg                                                                                                                                                                                                              | 同一人物和会议背景，保留人物更清楚的近景。                         |
| `ACES Lab-Heye/IMG_20261015_124017.jpg`                   | ACES Lab-Heye/IMG_20261015_124016.jpg<br>jingguang/Photo_1074821440_DJI_20261015124020_0485_D_JPG_16744448_0_20261015124024_photo_original.jpg                                                                                                     | 保留人物居中、面部清楚的静态照片，排除构图相近和较远的版本。       |
| `ACES Lab-Heye/IMG_20261015_124622_1.jpg`                 | ACES Lab-Heye/IMG_20261015_124621.jpg                                                                                                                                                                                                              | 保留人物正面、姿态自然的照片。                                     |
| `ACES Lab-Heye/IMG_20261015_171951.jpg`                   | ACES Lab-Heye/IMG_20261015_171955.jpg<br>xianjie/24944e807df95ae9ff1b706878bb73e9.jpg                                                                                                                                                              | 同一两人合影及跨文件夹副本，保留清楚、构图紧凑的原始横幅照片。     |
| `ACES Lab-Heye/IMG_20261015_172533.jpg`                   | ACES Lab-Heye/IMG_20261015_172535.jpg<br>xianjie/af2f4501cf218bf4a4839914c7695735.jpg                                                                                                                                                              | 同一两人合影及跨文件夹副本，保留清楚、背景完整的横幅照片。         |
| `ACES Lab-Heye/MEITU_20260831_211447646.jpg`              | ACES Lab-Heye/MEITU_20260831_211424663.jpg                                                                                                                                                                                                         | 生日合影中人物面部更清楚、表情更自然。                             |
| `ACES Lab-Heye/MEITU_20260912_105146181.jpg`              | ACES Lab-Heye/MEITU_20260912_105022534.jpg<br>jingguang/612.jpg                                                                                                                                                                                    | 相同餐桌合影及跨文件夹副本，保留构图更均衡的照片。                 |
| `ACES Lab-Heye/MEITU_20261015_143524533.jpg`              | ACES Lab-Heye/MEITU_20261015_143805341.jpg<br>jingguang/1008.jpg                                                                                                                                                                                   | 六人完整入镜，边缘人物和脚部未被裁切。                             |
| `ACES Lab-Heye/MEITU_20261016_104135495.jpg`              | ACES Lab-Heye/MEITU_20261016_103943869.jpg<br>ACES Lab-Heye/MEITU_20261016_104240326.jpg<br>jingguang/1053.jpg<br>jingguang/1054.jpg                                                                                                               | 同组会议合影及跨文件夹副本，保留面部更清楚、前后排安排完整的一张。 |
| `ACES Lab-Heye/MVIMG_20260918_185832.jpg`                 | ACES Lab-Heye/MVIMG_20260918_185816.jpg<br>ACES Lab-Heye/MVIMG_20260918_185835.jpg                                                                                                                                                                 | 同一餐桌自拍，保留前排姿态和表情更自然的一张。                     |

## 独立场景

以下照片未发现相同场景的相似版本，予以保留：

- `ACES Lab-Heye/IMG_20260831_181810.jpg`
- `ACES Lab-Heye/IMG_20260831_210418_1.jpg`
- `ACES Lab-Heye/IMG_20260909_203558.jpg`
- `ACES Lab-Heye/IMG_20260909_205943.jpg`
- `ACES Lab-Heye/IMG_20260927_202100.jpg`
- `jingguang/IDG_20261015_134318_887.jpg`
- `xianjie/7eee13c428c2ce0983d3349db0f5bcad.jpg`
- `xianjie/a25e398aaa65c095400d49a5d319adf0.jpg`
- `xianjie/a67a74f4bd5d2b41df760970f842a14e.jpg`
- `xianjie/be07cf76efa3a435882b343185cc8609.jpg`

## 后续更新

`scripts/photo-selection.json` 是唯一的入选清单，只控制照片是否展示。网页按照 `capturedAt` 从新到旧排序，日期缺失的照片排在末尾。生成脚本只处理清单内的图片。新增照片先查看原图，再把入选照片的哈希加入清单；同时更新 `scripts/photo-descriptions.json` 中供无障碍阅读使用的替代文字。
