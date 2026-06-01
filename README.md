# GPT Image 2 Matrix Benchmark

**语言 / Language:** 中文 | [English](README.en.md)

GPT Image 2 生图矩阵测试与统计看板，包含 CSV 测试数据、压缩预览图片和可直接打开的 HTML 统计页面。

AI 测试站点：[qiuqiutoken.com](https://qiuqiutoken.com)

## 这个项目是什么

这是一个用于评估 GPT Image 2 同步生图表现的矩阵测试项目。项目围绕三组固定提示词，对不同图片比例、分辨率、图片尺寸和质量参数进行批量测试，并把结果整理成可浏览的静态统计看板。

每条记录包含输入 Token、输出 Token、预计花费、控制台实际花费、Quota、请求时长、原始图片大小、压缩预览大小和压缩节省比例。

## 项目用途

- 对比不同尺寸和质量参数下的图像生成成本
- 观察不同提示词复杂度对输出 Token、费用和请求时长的影响
- 快速浏览 252 条生图测试结果
- 展示 GPT Image 2 矩阵测试结果的数据记录方式
- 作为 AI 生图模型成本分析和可视化看板的参考实现

## 关于 qiuqiutoken.com

本测试使用 [qiuqiutoken.com](https://qiuqiutoken.com) 作为 AI 测试站点和控制台数据来源，用于记录模型调用过程中的 Token、花费、Quota 和请求时长等信息。

公开仓库中只保留整理后的统计数据、压缩图片和展示页面，不包含 API Key、用户令牌、环境变量、原始请求日志或私密控制台日志。

## 测试提示词

| 测试组 | 提示词 |
| --- | --- |
| Red Apple | A single red apple on a white table, soft natural light, plain background, realistic photo style. |
| Reading Corner | A cozy reading corner in a small apartment, with a wooden bookshelf, warm floor lamp, green armchair, patterned rug, rainy window view, several open books on a side table, realistic interior photography, soft shadows, inviting atmosphere. |
| Floating City | A cinematic wide-angle view of a futuristic floating city above a calm ocean at sunset, with layered glass towers, suspended gardens, small transport pods moving between buildings, people walking across transparent sky bridges, reflections shimmering on the water below, orange and violet clouds in the sky, intricate architectural details, realistic lighting, atmospheric haze, and a balanced composition. |

## 数据概览

| 测试组 | 说明 | 记录数 |
| --- | --- | ---: |
| Red Apple | 单个红苹果静物图 | 84 |
| Reading Corner | 小公寓阅读角落室内摄影 | 84 |
| Floating City | 未来漂浮城市电影感大场景 | 84 |
| Total | 全部测试记录 | 252 |

## 完整测试维度

每个测试组都会运行下面 21 个比例/分辨率/尺寸组合；每个组合都会测试 4 个质量参数：`自动`、`低`、`中`、`高`。因此每组 `21 x 4 = 84` 条记录，三组共 `252` 条记录。

| 图片比例 | 分辨率 | 图片尺寸 | 质量参数 |
| --- | --- | --- | --- |
| 1:1 | 1K | 1024x1024 | 自动 / 低 / 中 / 高 |
| 1:1 | 2K | 2048x2048 | 自动 / 低 / 中 / 高 |
| 1:1 | 4K | 2880x2880 | 自动 / 低 / 中 / 高 |
| 3:2 | 1K | 1536x1024 | 自动 / 低 / 中 / 高 |
| 3:2 | 2K | 2048x1360 | 自动 / 低 / 中 / 高 |
| 3:2 | 4K | 3520x2336 | 自动 / 低 / 中 / 高 |
| 2:3 | 1K | 1024x1536 | 自动 / 低 / 中 / 高 |
| 2:3 | 2K | 1360x2048 | 自动 / 低 / 中 / 高 |
| 2:3 | 4K | 2336x3520 | 自动 / 低 / 中 / 高 |
| 4:3 | 1K | 1024x768 | 自动 / 低 / 中 / 高 |
| 4:3 | 2K | 2048x1536 | 自动 / 低 / 中 / 高 |
| 4:3 | 4K | 3312x2480 | 自动 / 低 / 中 / 高 |
| 3:4 | 1K | 768x1024 | 自动 / 低 / 中 / 高 |
| 3:4 | 2K | 1536x2048 | 自动 / 低 / 中 / 高 |
| 3:4 | 4K | 2480x3312 | 自动 / 低 / 中 / 高 |
| 5:4 | 1K | 1280x1024 | 自动 / 低 / 中 / 高 |
| 5:4 | 2K | 2560x2048 | 自动 / 低 / 中 / 高 |
| 5:4 | 4K | 3216x2576 | 自动 / 低 / 中 / 高 |
| 4:5 | 1K | 1024x1280 | 自动 / 低 / 中 / 高 |
| 4:5 | 2K | 2048x2560 | 自动 / 低 / 中 / 高 |
| 4:5 | 4K | 2576x3216 | 自动 / 低 / 中 / 高 |

## 仓库结构

```text
.
├── assets/
│   └── compressed/              # 压缩后的缩略图和弹框预览图
├── data/
│   ├── apple/
│   │   ├── images/              # 可选原始 PNG，本仓库默认不提交
│   │   └── results.csv
│   ├── reading-corner/
│   │   ├── images/
│   │   └── results.csv
│   └── floating-city/
│       ├── images/
│       └── results.csv
├── scripts/
│   ├── build-test-stats-page.mjs
│   └── compress-statistics-images.py
├── index.html                   # 中文压缩版统计页
├── index.en.html                # English compressed dashboard
├── original.html                # 中文原图版统计页，需要本地补充原始 PNG
├── original.en.html             # English original-image dashboard
├── package.json
├── README.md                    # 中文说明
└── README.en.md                 # English README
```

## 如何查看

可以直接打开 `index.html`，或启动本地静态服务：

```bash
npm run serve
```

然后访问：

```text
http://localhost:8765/
```

英文压缩版入口：

```text
http://localhost:8765/index.en.html
```

## 如何重新生成统计页

当 CSV 或压缩图片资源更新后，运行：

```bash
npm run build
```

脚本会重新生成：

- `index.html`
- `index.en.html`
- `original.html`
- `original.en.html`

## 关于原始 PNG

完整原始 PNG 文件体积超过 3GB，因此默认不纳入 Git 仓库。压缩版页面 `index.html` 不依赖原图，可以直接正常浏览。

如果需要让 `original.html` 加载原图，请把 PNG 放到：

```text
data/apple/images/
data/reading-corner/images/
data/floating-city/images/
```

如果要公开发布原始 PNG，建议使用 Git LFS 或 GitHub Release 附件，而不是直接提交到主仓库。
