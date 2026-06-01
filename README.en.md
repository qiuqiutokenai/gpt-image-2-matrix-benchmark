# GPT Image 2 Matrix Benchmark

**Language / 语言:** [中文](README.md) | English

A GPT Image 2 generation matrix benchmark and statistics dashboard, including CSV benchmark data, compressed image previews, and directly openable static HTML pages.

AI testing site: [qiuqiutoken.com](https://qiuqiutoken.com)

## What This Project Is

This project evaluates synchronous GPT Image 2 generation across a structured test matrix. It uses three fixed prompts and tests different aspect ratios, resolutions, image dimensions, and quality settings, then presents the results in a browsable static dashboard.

Each record includes input tokens, output tokens, estimated cost, actual console cost, quota, request duration, original image size, compressed preview size, and compression savings ratio.

## What It Is Useful For

- Comparing image-generation cost across sizes and quality settings
- Understanding how prompt complexity affects output tokens, cost, and latency
- Browsing 252 image-generation benchmark records
- Demonstrating a practical data structure for image model benchmarking
- Serving as a reference dashboard for AI image-generation cost analysis

## About qiuqiutoken.com

This benchmark uses [qiuqiutoken.com](https://qiuqiutoken.com) as the AI testing site and console data source for token usage, cost, quota, and request duration tracking.

The public repository only contains sanitized CSV data, compressed image previews, and static dashboard pages. It does not include API keys, account tokens, environment files, raw request logs, or private console logs.

## Test Prompts

| Dataset | Prompt |
| --- | --- |
| Red Apple | A single red apple on a white table, soft natural light, plain background, realistic photo style. |
| Reading Corner | A cozy reading corner in a small apartment, with a wooden bookshelf, warm floor lamp, green armchair, patterned rug, rainy window view, several open books on a side table, realistic interior photography, soft shadows, inviting atmosphere. |
| Floating City | A cinematic wide-angle view of a futuristic floating city above a calm ocean at sunset, with layered glass towers, suspended gardens, small transport pods moving between buildings, people walking across transparent sky bridges, reflections shimmering on the water below, orange and violet clouds in the sky, intricate architectural details, realistic lighting, atmospheric haze, and a balanced composition. |

## Dataset Summary

| Dataset | Description | Records |
| --- | --- | ---: |
| Red Apple | A single red apple still-life prompt | 84 |
| Reading Corner | A cozy apartment reading-corner prompt | 84 |
| Floating City | A cinematic futuristic floating-city prompt | 84 |
| Total | All benchmark records | 252 |

## Full Test Matrix

Each dataset runs the following 21 aspect-ratio, resolution, and dimension combinations. Every combination is tested with 4 quality settings: `auto`, `low`, `medium`, and `high`. That gives `21 x 4 = 84` records per dataset, and `252` records in total.

| Aspect Ratio | Resolution | Image Dimensions | Quality Settings |
| --- | --- | --- | --- |
| 1:1 | 1K | 1024x1024 | auto / low / medium / high |
| 1:1 | 2K | 2048x2048 | auto / low / medium / high |
| 1:1 | 4K | 2880x2880 | auto / low / medium / high |
| 3:2 | 1K | 1536x1024 | auto / low / medium / high |
| 3:2 | 2K | 2048x1360 | auto / low / medium / high |
| 3:2 | 4K | 3520x2336 | auto / low / medium / high |
| 2:3 | 1K | 1024x1536 | auto / low / medium / high |
| 2:3 | 2K | 1360x2048 | auto / low / medium / high |
| 2:3 | 4K | 2336x3520 | auto / low / medium / high |
| 4:3 | 1K | 1024x768 | auto / low / medium / high |
| 4:3 | 2K | 2048x1536 | auto / low / medium / high |
| 4:3 | 4K | 3312x2480 | auto / low / medium / high |
| 3:4 | 1K | 768x1024 | auto / low / medium / high |
| 3:4 | 2K | 1536x2048 | auto / low / medium / high |
| 3:4 | 4K | 2480x3312 | auto / low / medium / high |
| 5:4 | 1K | 1280x1024 | auto / low / medium / high |
| 5:4 | 2K | 2560x2048 | auto / low / medium / high |
| 5:4 | 4K | 3216x2576 | auto / low / medium / high |
| 4:5 | 1K | 1024x1280 | auto / low / medium / high |
| 4:5 | 2K | 2048x2560 | auto / low / medium / high |
| 4:5 | 4K | 2576x3216 | auto / low / medium / high |

## Repository Layout

```text
.
├── assets/
│   └── compressed/              # Compressed thumbnails and modal previews
├── data/
│   ├── apple/
│   │   ├── images/              # Optional original PNGs, ignored by default
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
├── index.html                   # Chinese compressed dashboard
├── index.en.html                # English compressed dashboard
├── original.html                # Chinese original-image dashboard, requires local PNGs
├── original.en.html             # English original-image dashboard
├── package.json
├── README.md                    # Chinese README
└── README.en.md                 # English README
```

## How To View

Open `index.html` directly in a browser, or run a local static server:

```bash
npm run serve
```

Then visit:

```text
http://localhost:8765/
```

English compressed dashboard:

```text
http://localhost:8765/index.en.html
```

## How To Rebuild

After editing CSV data or compressed assets, run:

```bash
npm run build
```

This regenerates:

- `index.html`
- `index.en.html`
- `original.html`
- `original.en.html`

## Original PNG Images

The full original PNG set is over 3 GB, so it is not tracked by default. The compressed dashboard in `index.html` works without the original PNGs.

To make `original.html` load the original PNG outputs, place them in:

```text
data/apple/images/
data/reading-corner/images/
data/floating-city/images/
```

If you want to publish the original PNG outputs, use Git LFS or GitHub Release assets instead of committing them directly to the main repository.
