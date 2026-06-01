import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPaths = {
  compressed: {
    zh: path.join(root, "index.html"),
    en: path.join(root, "index.en.html"),
  },
  original: {
    zh: path.join(root, "original.html"),
    en: path.join(root, "original.en.html"),
  },
};
const compressionManifestPath = path.join(root, "assets", "compressed", "manifest.json");
const qualityOrder = ["自动", "低", "中", "高"];
const resolutionOrder = ["1K", "2K", "4K"];
const ratioOrder = ["1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5"];

const locales = {
  zh: {
    code: "zh",
    htmlLang: "zh-CN",
    pageTitle: "GPT Image 2 矩阵测试统计",
    variantLabels: { compressed: "压缩版", original: "原图版" },
    variantNotes: {
      compressed: "缩略图和弹框默认加载压缩 JPEG，适合快速访问。",
      original: "缩略图使用压缩图，弹框按需加载 data/*/images 下的原始 PNG；公开仓库默认不包含原图。",
    },
    otherVariantLabels: { compressed: "切换到原图版", original: "切换到压缩版" },
    language: { label: "语言", current: "中文", other: "English" },
    intro: "三组提示词、84 个尺寸/质量组合维度的同步生图结果对比。",
    generatedAt: "生成时间",
    ad: {
      aria: "qiuqiutoken.com 广告",
      label: "广告",
      title: "QiuQiuToken AI 中转站：让团队把精力放回产品，而不是反复处理接入、稳定性和运维问题",
      desc: "为开发者、AI 应用团队和模型测试场景提供一层稳定可观测的调用基础设施：降低接入门槛，提升生图和模型调用成功率，让成本、响应速度、账号池、网络链路和售后支持都变得更可控。",
      values: [
        ["更快完成验证", "免费额度测试、异步生图、首字约 1 秒响应，适合快速跑通模型效果和成本评估。"],
        ["更稳支撑业务", "自建号池、缓存命中、高在线率和高可用集群，减少渠道波动、网络波动和扩容压力。"],
        ["更少维护负担", "自动安装与令牌配置工具、备份机制、开票和群内快速响应，让接入后的日常维护更省心。"],
      ],
      points: ["异步生图", "100% 缓存命中", "100% 自建号池", "首字 1 秒响应", "99.99% 在线率", "Kubernetes 弹性伸缩", "数据库高可用备份", "无需魔法 / CN2 GIA", "CodeX + CC Switch 工具", "支持开票", "免费额度测试", "群内 2 分钟响应"],
      cta: "访问 qiuqiutoken.com",
    },
    labels: {
      allDatasets: "全部测试组",
      allQuality: "全部质量",
      allResolution: "全部分辨率",
      allRatio: "全部比例",
      allDimensions: "全部尺寸",
      searchPlaceholder: "搜索比例、尺寸、提示词",
      filterPanel: "全部筛选条件",
      testPrompts: "测试提示词",
      testMatrix: "测试维度矩阵",
      costRank: "维度花费排行",
      resolutionCost: "分辨率花费",
      details: "结果明细",
      preview: "代表图片预览",
      paths: "本地路径",
      all: "全部",
      records: "记录",
      success: "成功",
      inputTokens: "输入 Token",
      inputTokensSub: "三组提示词总和",
      outputTokens: "输出 Token",
      outputTokensSub: "图片输出 token",
      estimatedCost: "预计花费",
      actualCost: "实际花费",
      avgQuota: "平均额度",
      quotaTotal: "Quota 总计",
      requestDuration: "请求时长",
      imageSize: "图片大小",
      imageSizeSub: "本地 PNG 总大小",
      compressedPreview: "压缩预览",
      saved: "节省",
      rowsSuffix: "条",
      avg: "平均",
      group: "组",
      sequence: "序号",
      ratio: "比例",
      resolution: "分辨率",
      dimensions: "尺寸",
      quality: "质量",
      prompt: "提示词",
      input: "输入",
      output: "输出",
      originalImage: "原图",
      previewImage: "预览图",
      status: "状态",
      imageInfo: "图片信息",
      matrixRatio: "图片比例",
      matrixDimensions: "图片尺寸",
      matrixQuality: "质量参数",
      totalRecords: "总记录",
      view: "查看",
      originalPrompt: "请求提示词",
      revisedPrompt: "修订提示词",
      noRevisedPrompt: "无修订提示词",
      imagePreview: "图片预览",
      closePreview: "关闭预览",
      closePrompt: "关闭提示词",
      promptTitleSuffix: "提示词",
      original: "原图",
      compressed: "压缩预览",
    },
    qualityLabels: { "自动": "自动", "低": "低", "中": "中", "高": "高" },
  },
  en: {
    code: "en",
    htmlLang: "en",
    pageTitle: "GPT Image 2 Matrix Test Statistics",
    variantLabels: { compressed: "Compressed", original: "Original" },
    variantNotes: {
      compressed: "Thumbnails and modals load compressed JPEG previews by default for fast browsing.",
      original: "Thumbnails use compressed images, while modals load original PNGs from data/*/images on demand. Original PNGs are not included by default.",
    },
    otherVariantLabels: { compressed: "Switch to original", original: "Switch to compressed" },
    language: { label: "Language", current: "English", other: "中文" },
    intro: "Comparison of three prompts across 84 size and quality combinations.",
    generatedAt: "Generated at",
    ad: {
      aria: "qiuqiutoken.com advertisement",
      label: "Ad",
      title: "QiuQiuToken AI Gateway: keep your team focused on product instead of access, stability, and operations work",
      desc: "A stable and observable invocation layer for developers, AI app teams, and model testing: lower integration friction, improve image-generation and model-call success rates, and make cost, latency, account pools, network paths, and support more controllable.",
      values: [
        ["Validate faster", "Free trial quota, async image generation, and about 1-second first-token response help teams test model quality and cost quickly."],
        ["Run more reliably", "Self-managed account pools, cache hits, high availability, and scalable clusters reduce channel, network, and capacity risks."],
        ["Maintain less", "Auto install and token configuration tools, backups, invoicing, and fast community support reduce day-to-day operational load."],
      ],
      points: ["Async image generation", "100% cache hit support", "100% self-managed account pool", "1-second first response", "99.99% uptime", "Kubernetes autoscaling", "HA database backups", "No proxy required / CN2 GIA", "CodeX + CC Switch tools", "Invoicing supported", "Free test quota", "2-minute group support"],
      cta: "Visit qiuqiutoken.com",
    },
    labels: {
      allDatasets: "All datasets",
      allQuality: "All quality settings",
      allResolution: "All resolutions",
      allRatio: "All ratios",
      allDimensions: "All dimensions",
      searchPlaceholder: "Search ratio, dimensions, or prompts",
      filterPanel: "All Filters",
      testPrompts: "Test Prompts",
      testMatrix: "Test Matrix",
      costRank: "Cost Ranking",
      resolutionCost: "Resolution Cost",
      details: "Result Details",
      preview: "Representative Images",
      paths: "Local Paths",
      all: "All",
      records: "Records",
      success: "success",
      inputTokens: "Input Tokens",
      inputTokensSub: "Total across three prompts",
      outputTokens: "Output Tokens",
      outputTokensSub: "Image output tokens",
      estimatedCost: "Estimated Cost",
      actualCost: "Actual Cost",
      avgQuota: "Average Quota",
      quotaTotal: "Quota total",
      requestDuration: "Request Duration",
      imageSize: "Image Size",
      imageSizeSub: "Total local PNG size",
      compressedPreview: "Compressed Preview",
      saved: "Saved",
      rowsSuffix: "records",
      avg: "Avg",
      group: "Group",
      sequence: "No.",
      ratio: "Ratio",
      resolution: "Resolution",
      dimensions: "Dimensions",
      quality: "Quality",
      prompt: "Prompt",
      input: "Input",
      output: "Output",
      originalImage: "Original",
      previewImage: "Preview",
      status: "Status",
      imageInfo: "Image Info",
      matrixRatio: "Aspect Ratio",
      matrixDimensions: "Image Dimensions",
      matrixQuality: "Quality Settings",
      totalRecords: "Total Records",
      view: "View",
      originalPrompt: "Request Prompt",
      revisedPrompt: "Revised Prompt",
      noRevisedPrompt: "No revised prompt",
      imagePreview: "Image Preview",
      closePreview: "Close preview",
      closePrompt: "Close prompt",
      promptTitleSuffix: "Prompt",
      original: "Original",
      compressed: "Compressed Preview",
    },
    qualityLabels: { "自动": "auto", "低": "low", "中": "medium", "高": "high" },
  },
};

const datasets = [
  {
    id: "apple",
    name: "Red Apple",
    label: "苹果静物",
    color: "#2f7d5c",
    dir: path.join(root, "data", "apple"),
    prompt: "A single red apple on a white table, soft natural light, plain background, realistic photo style.",
  },
  {
    id: "reading",
    name: "Reading Corner",
    label: "阅读角落",
    color: "#8a5a24",
    dir: path.join(root, "data", "reading-corner"),
  },
  {
    id: "city",
    name: "Floating City",
    label: "漂浮城市",
    color: "#5067b0",
    dir: path.join(root, "data", "floating-city"),
  },
];

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === "\"" && line[i + 1] === "\"") {
        cur += "\"";
        i += 1;
      } else if (ch === "\"") {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === "\"") {
      quoted = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function readCsv(file) {
  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function number(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatUsd(value) {
  return `$${value.toFixed(6)}`;
}

function formatInt(value) {
  return Math.round(value).toLocaleString("en-US");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDuration(seconds) {
  if (!seconds) return "";
  const rounded = Math.round(seconds);
  if (rounded < 60) return `${rounded}s`;
  const minutes = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

function readCompressionManifest() {
  if (!fs.existsSync(compressionManifestPath)) {
    return { summary: null, images: [] };
  }
  return JSON.parse(fs.readFileSync(compressionManifestPath, "utf8"));
}

const compressionManifest = readCompressionManifest();
const compressionByOriginal = new Map();
const compressionByRel = new Map();
for (const image of compressionManifest.images ?? []) {
  compressionByOriginal.set(image.originalPath, image);
  compressionByRel.set(image.originalRelPath, image);
}

const rows = datasets.flatMap((dataset) => {
  const csvPath = path.join(dataset.dir, "results.csv");
  return readCsv(csvPath).map((row) => {
    const rawImagePath = row["图片文件"];
    const imageAbsPath = path.isAbsolute(rawImagePath) ? rawImagePath : path.join(root, rawImagePath);
    const imageRelPath = path.relative(root, imageAbsPath);
    const compressed = compressionByOriginal.get(rawImagePath) ?? compressionByRel.get(imageRelPath) ?? {};
    const sequence = number(row["序号"]);
    const fileBytes = number(row["生成文件大小Bytes"]);
    const previewBytes = number(compressed.previewBytes);
    const savedBytes = Math.max(0, fileBytes - previewBytes);
    const savingsRatio = fileBytes && previewBytes ? savedBytes / fileBytes : 0;
    return {
      key: `${dataset.id}-${sequence}`,
      datasetId: dataset.id,
      datasetName: dataset.name,
      label: dataset.label,
      color: dataset.color,
      prompt: row["提示词"] || dataset.prompt || "",
      sequence,
      ratio: row["图片比例"],
      resolution: row["分辨率"],
      dimensions: row["图片尺寸"],
      quality: row["质量参数"],
      inputTokens: number(row["输入Token量"]),
      outputTokens: number(row["输出Token量"]),
      totalTokens: number(row["总Token量"]),
      estimatedUsd: number(row["估算金额USD"]),
      actualUsd: number(row["控制台实际花费"]),
      quota: number(row["控制台Quota"]),
      requestSeconds: number(row["请求时长秒"] || row["请求时长"]),
      requestDuration: row["请求时长"] || formatDuration(number(row["请求时长秒"])),
      fileBytes,
      fileSize: row["生成文件大小"] || formatBytes(fileBytes),
      imagePath: imageRelPath,
      imageRelPath,
      thumbRelPath: compressed.thumbRelPath || imageRelPath,
      previewRelPath: compressed.previewRelPath || imageRelPath,
      thumbBytes: number(compressed.thumbBytes),
      previewBytes,
      thumbSize: compressed.thumbSize || row["生成文件大小"] || formatBytes(fileBytes),
      previewSize: compressed.previewSize || row["生成文件大小"] || formatBytes(fileBytes),
      savedPreviewBytes: previewBytes ? savedBytes : 0,
      savingsRatio,
      savingsPercent: compressed.savingsPercent || `${(savingsRatio * 100).toFixed(1)}%`,
      revisedPrompt: row["修订提示词"],
      status: row["状态"],
      error: row["错误"],
    };
  });
});

function groupBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function summarize(list) {
  const maxFile = list.reduce((best, row) => (row.fileBytes > (best?.fileBytes ?? -1) ? row : best), null);
  const minFile = list.reduce((best, row) => (row.fileBytes < (best?.fileBytes ?? Infinity) ? row : best), null);
  return {
    count: list.length,
    ok: list.filter((row) => row.status === "ok").length,
    errors: list.filter((row) => row.status !== "ok").length,
    inputTokens: list.reduce((sum, row) => sum + row.inputTokens, 0),
    outputTokens: list.reduce((sum, row) => sum + row.outputTokens, 0),
    totalTokens: list.reduce((sum, row) => sum + row.totalTokens, 0),
    estimatedUsd: list.reduce((sum, row) => sum + row.estimatedUsd, 0),
    actualUsd: list.reduce((sum, row) => sum + row.actualUsd, 0),
    quota: list.reduce((sum, row) => sum + row.quota, 0),
    requestSeconds: list.reduce((sum, row) => sum + row.requestSeconds, 0),
    fileBytes: list.reduce((sum, row) => sum + row.fileBytes, 0),
    thumbBytes: list.reduce((sum, row) => sum + row.thumbBytes, 0),
    previewBytes: list.reduce((sum, row) => sum + row.previewBytes, 0),
    savedPreviewBytes: list.reduce((sum, row) => sum + row.savedPreviewBytes, 0),
    avgFileBytes: list.reduce((sum, row) => sum + row.fileBytes, 0) / Math.max(1, list.length),
    avgActualUsd: list.reduce((sum, row) => sum + row.actualUsd, 0) / Math.max(1, list.length),
    avgEstimatedUsd: list.reduce((sum, row) => sum + row.estimatedUsd, 0) / Math.max(1, list.length),
    avgQuota: list.reduce((sum, row) => sum + row.quota, 0) / Math.max(1, list.length),
    avgRequestSeconds: list.reduce((sum, row) => sum + row.requestSeconds, 0) / Math.max(1, list.length),
    maxFile,
    minFile,
  };
}

const summaries = Object.fromEntries([...groupBy(rows, (row) => row.datasetId)].map(([key, list]) => [key, summarize(list)]));
const overall = summarize(rows);

function aggregateBy(fields) {
  const grouped = groupBy(rows, (row) => fields.map((field) => row[field]).join(" / "));
  return [...grouped.entries()].map(([key, list]) => ({
    key,
    count: list.length,
    actualUsd: list.reduce((sum, row) => sum + row.actualUsd, 0),
    outputTokens: list.reduce((sum, row) => sum + row.outputTokens, 0),
    fileBytes: list.reduce((sum, row) => sum + row.fileBytes, 0),
  })).sort((a, b) => b.actualUsd - a.actualUsd);
}

function orderIndex(order, value) {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
}

function buildDimensionMatrix() {
  return [...groupBy(rows, (row) => `${row.ratio}|${row.resolution}|${row.dimensions}`).entries()]
    .map(([key, list]) => {
      const [ratio, resolution, dimensions] = key.split("|");
      return {
        ratio,
        resolution,
        dimensions,
        qualities: qualityOrder.filter((quality) => list.some((row) => row.quality === quality)),
        count: list.length,
      };
    })
    .sort((a, b) => (
      orderIndex(ratioOrder, a.ratio) - orderIndex(ratioOrder, b.ratio)
      || orderIndex(resolutionOrder, a.resolution) - orderIndex(resolutionOrder, b.resolution)
      || a.dimensions.localeCompare(b.dimensions)
    ));
}

const promptsByDataset = Object.fromEntries(
  [...groupBy(rows, (row) => row.datasetId)].map(([id, list]) => [id, list.find((row) => row.prompt)?.prompt ?? ""])
);

const basePageData = {
  generatedAt: new Date().toISOString(),
  compression: compressionManifest.summary,
  datasets: datasets.map((dataset) => ({
    id: dataset.id,
    name: dataset.name,
    label: dataset.label,
    color: dataset.color,
    prompt: promptsByDataset[dataset.id] || dataset.prompt || "",
    dir: path.relative(root, dataset.dir),
    imageDir: path.relative(root, path.join(dataset.dir, "images")),
    summary: summaries[dataset.id],
  })),
  rows,
  overall,
  byQuality: aggregateBy(["quality"]),
  byResolution: aggregateBy(["resolution"]),
  byRatio: aggregateBy(["ratio"]),
  dimensionMatrix: buildDimensionMatrix(),
};

function makePageData(variantId, localeId) {
  const originalMode = variantId === "original";
  const locale = locales[localeId];
  const otherVariant = originalMode ? "compressed" : "original";
  const otherLocale = localeId === "zh" ? "en" : "zh";
  return {
    ...basePageData,
    locale: localeId,
    ui: locale,
    variant: {
      id: variantId,
      label: locale.variantLabels[variantId],
      note: locale.variantNotes[variantId],
      outputPath: path.basename(outputPaths[variantId][localeId]),
      otherHref: path.basename(outputPaths[otherVariant][localeId]),
      otherLabel: locale.otherVariantLabels[variantId],
      languageHref: path.basename(outputPaths[variantId][otherLocale]),
      languageLabel: locale.language.other,
    },
    rows: rows.map((row) => ({
      ...row,
      modalRelPath: originalMode ? row.imageRelPath : row.previewRelPath,
      modalSize: originalMode ? row.fileSize : row.previewSize,
      modalVersionLabel: originalMode ? locale.labels.original : locale.labels.compressed,
    })),
  };
}

function renderHtml(pageData) {
  const ui = pageData.ui;
  return `<!doctype html>
<html lang="${ui.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${ui.pageTitle} - ${pageData.variant.label}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f7f4;
      --panel: #ffffff;
      --text: #1d2327;
      --muted: #6b7280;
      --line: #dadbd2;
      --accent: #2f7d5c;
      --accent-2: #5067b0;
      --warn: #a85518;
      --shadow: 0 14px 40px rgba(31, 35, 40, .08);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); }
    header { padding: 28px 32px 20px; border-bottom: 1px solid var(--line); background: #fbfbf8; }
    h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.15; letter-spacing: 0; }
    h2 { margin: 0 0 14px; font-size: 17px; letter-spacing: 0; }
    h3 { margin: 0; font-size: 14px; letter-spacing: 0; }
    p { margin: 0; color: var(--muted); line-height: 1.55; }
    .version-badge { display: inline-flex; margin-left: 8px; border: 1px solid var(--line); border-radius: 999px; padding: 4px 9px; font-size: 13px; vertical-align: middle; background: white; color: var(--accent); }
    .version-switch { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .version-link { border: 1px solid var(--line); border-radius: 6px; padding: 8px 11px; color: var(--text); background: white; text-decoration: none; font-size: 13px; }
    .version-link.active { background: #21342d; color: white; border-color: #21342d; }
    .ad-banner {
      margin-top: 16px; border: 1px solid #cbd8d1; border-radius: 8px; background: #ffffff;
      display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
      padding: 14px 16px; box-shadow: 0 10px 26px rgba(31, 35, 40, .06);
    }
    .ad-copy { display: grid; gap: 8px; min-width: 0; }
    .ad-label {
      width: fit-content; border: 1px solid #b9d2c6; border-radius: 999px; padding: 3px 8px;
      background: #eef7f2; color: #2f7d5c; font-size: 12px; font-weight: 700;
    }
    .ad-title { color: var(--text); font-weight: 800; font-size: 16px; }
    .ad-desc { color: var(--muted); font-size: 13px; line-height: 1.45; }
    .ad-value-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 2px; }
    .ad-value {
      border-left: 3px solid #2f7d5c; background: #fbfbf8; border-radius: 6px;
      padding: 8px 10px; display: grid; gap: 3px;
    }
    .ad-value strong { color: var(--text); font-size: 13px; }
    .ad-value span { color: var(--muted); font-size: 12px; line-height: 1.4; }
    .ad-points { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
    .ad-point {
      border: 1px solid #d9ded7; border-radius: 999px; padding: 4px 8px;
      background: #fbfbf8; color: #34403a; font-size: 12px; line-height: 1;
      white-space: nowrap;
    }
    .ad-link {
      border: 1px solid #21342d; border-radius: 6px; background: #21342d; color: #fff;
      padding: 9px 12px; text-decoration: none; font-size: 13px; font-weight: 700; white-space: nowrap;
    }
    .ad-link:hover { background: #2f7d5c; border-color: #2f7d5c; }
    main { padding: 24px 32px 40px; display: grid; gap: 22px; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 18px; }
    .filter-panel { display: grid; gap: 14px; }
    .filter-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
    .filter-group { display: grid; gap: 7px; align-content: start; }
    .filter-title { font-size: 12px; color: var(--muted); font-weight: 700; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip {
      border: 1px solid var(--line); background: #fbfbf8; color: var(--text);
      border-radius: 999px; padding: 5px 9px; font-size: 12px; line-height: 1;
      cursor: pointer; user-select: none;
    }
    .chip.active { background: #21342d; color: white; border-color: #21342d; }
    select, input {
      height: 38px; border: 1px solid var(--line); background: white; border-radius: 6px;
      padding: 0 12px; color: var(--text); min-width: 150px; font: inherit;
    }
    input { min-width: 260px; }
    .grid { display: grid; gap: 14px; }
    .stats { grid-template-columns: repeat(6, minmax(140px, 1fr)); }
    .three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .two { grid-template-columns: 1.1fr .9fr; }
    .panel, .card {
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
      box-shadow: var(--shadow);
    }
    .panel { padding: 18px; }
    .card { padding: 16px; }
    .metric-label { font-size: 12px; color: var(--muted); margin-bottom: 7px; }
    .metric-value { font-size: 24px; font-weight: 750; line-height: 1.1; }
    .metric-sub { margin-top: 6px; color: var(--muted); font-size: 12px; }
    .dataset-card { display: grid; gap: 14px; }
    .dataset-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
    .pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); border-radius: 999px; padding: 4px 9px; font-size: 12px; color: var(--muted); background: #fafaf7; }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); flex: 0 0 auto; }
    .mini { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
    .mini div { border-top: 1px solid var(--line); padding-top: 8px; font-size: 12px; color: var(--muted); }
    .mini strong { display: block; color: var(--text); font-size: 15px; margin-top: 3px; }
    .prompt-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .prompt-card { display: grid; gap: 10px; border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: #fff; }
    .prompt-card p { color: var(--text); font-size: 13px; line-height: 1.55; }
    .dimension-wrap { max-height: 360px; overflow: auto; border: 1px solid var(--line); border-radius: 8px; background: white; }
    .text-button {
      border: 1px solid var(--line); background: #fff; color: var(--text); border-radius: 6px;
      padding: 6px 9px; font: inherit; font-size: 12px; cursor: pointer; white-space: nowrap;
    }
    .text-button:hover { border-color: #21342d; }
    .bar-list { display: grid; gap: 10px; }
    .bar-row { display: grid; grid-template-columns: 88px 1fr 108px; gap: 12px; align-items: center; font-size: 13px; }
    .bar-track { height: 10px; background: #e9e9e2; border-radius: 99px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); border-radius: inherit; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 10px 9px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: middle; }
    th { color: var(--muted); font-weight: 650; background: #fbfbf8; position: sticky; top: 0; z-index: 1; }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
    .table-wrap { max-height: 560px; overflow: auto; border: 1px solid var(--line); border-radius: 8px; background: white; }
    .thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
    .thumb { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: white; }
    .thumb img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #ecece5; }
    .thumb div { padding: 8px; font-size: 12px; display: flex; justify-content: space-between; gap: 8px; color: var(--muted); }
    .row-image { display: flex; align-items: center; gap: 10px; min-width: 210px; }
    .row-image img { width: 74px; height: 54px; object-fit: cover; border-radius: 6px; border: 1px solid var(--line); background: #ecece5; flex: 0 0 auto; }
    .row-image strong { display: block; font-size: 12px; color: var(--text); margin-bottom: 3px; }
    .row-image span { display: block; font-size: 11px; color: var(--muted); line-height: 1.35; }
    .image-link { color: inherit; text-decoration: none; }
    .image-link, .thumb { cursor: zoom-in; }
    .modal {
      position: fixed; inset: 0; z-index: 20; display: none; align-items: center; justify-content: center;
      padding: 28px; background: rgba(24, 28, 25, .76);
    }
    .modal.open { display: flex; }
    .modal-dialog {
      width: min(1120px, 100%); height: min(90vh, 920px); max-height: calc(100vh - 56px); overflow: hidden;
      background: #fff; border-radius: 8px; box-shadow: 0 28px 80px rgba(0,0,0,.38);
      display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
    }
    .modal-head, .modal-foot { padding: 12px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; background: #fff; position: relative; z-index: 2; }
    .modal-foot { border-top: 1px solid var(--line); border-bottom: 0; color: var(--muted); font-size: 12px; max-height: 82px; overflow: auto; }
    .modal-head > div { min-width: 0; flex: 1; }
    .modal-title { font-weight: 750; }
    .modal-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; max-height: 76px; overflow: auto; padding-right: 4px; }
    .modal-meta .pill { white-space: nowrap; }
    .modal-body { min-height: 0; overflow: hidden; background: #f4f4ef; display: flex; align-items: center; justify-content: center; padding: 14px; }
    .modal-body img { display: block; width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; background: white; }
    .modal-close {
      width: 34px; height: 34px; flex: 0 0 auto; border: 1px solid var(--line); border-radius: 6px;
      background: #fff; color: var(--text); font-size: 22px; line-height: 1; cursor: pointer;
    }
    .modal-path { word-break: break-all; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .prompt-dialog { width: min(900px, 100%); height: auto; max-height: min(88vh, 780px); }
    .prompt-body { min-height: 0; overflow: auto; background: #fbfbf8; padding: 16px; display: grid; gap: 14px; }
    .prompt-block { display: grid; gap: 7px; }
    .prompt-block h3 { font-size: 13px; color: var(--muted); }
    .prompt-text { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 12px; color: var(--text); line-height: 1.55; font-size: 13px; }
    .path { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: var(--muted); word-break: break-all; }
    .status-ok { color: #26734d; font-weight: 700; }
    .status-error { color: #b42318; font-weight: 700; }
    @media (max-width: 1100px) {
      .stats, .three, .two, .filter-grid, .prompt-grid { grid-template-columns: 1fr; }
      header, main { padding-left: 18px; padding-right: 18px; }
      .bar-row { grid-template-columns: 72px 1fr 92px; }
      .ad-banner { grid-template-columns: 1fr; }
      .ad-value-grid { grid-template-columns: 1fr; }
      .ad-link { width: fit-content; }
      .ad-point { white-space: normal; }
      .modal { padding: 12px; }
      .modal-dialog { height: calc(100dvh - 24px); max-height: none; }
      .modal-meta { max-height: 92px; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${ui.pageTitle} <span class="version-badge">${pageData.variant.label}</span></h1>
    <p>${ui.intro} ${pageData.variant.note} ${ui.generatedAt}：<span id="generatedAt"></span></p>
    <div class="version-switch">
      <a class="version-link active" href="${path.basename(pageData.variant.outputPath)}">${pageData.variant.label}</a>
      <a class="version-link" href="${pageData.variant.otherHref}">${pageData.variant.otherLabel}</a>
      <a class="version-link" href="${pageData.variant.languageHref}">${ui.language.label}: ${pageData.variant.languageLabel}</a>
    </div>
    <aside class="ad-banner" aria-label="${ui.ad.aria}">
      <div class="ad-copy">
        <span class="ad-label">${ui.ad.label}</span>
        <div class="ad-title">${ui.ad.title}</div>
        <div class="ad-desc">${ui.ad.desc}</div>
        <div class="ad-value-grid">
          ${ui.ad.values.map(([title, desc]) => `<div class="ad-value"><strong>${title}</strong><span>${desc}</span></div>`).join("")}
        </div>
        <div class="ad-points">
          ${ui.ad.points.map((point) => `<span class="ad-point">${point}</span>`).join("")}
        </div>
      </div>
      <a class="ad-link" href="https://qiuqiutoken.com" target="_blank" rel="noopener noreferrer">${ui.ad.cta}</a>
    </aside>
    <div class="toolbar">
      <select id="datasetFilter" aria-label="${ui.labels.allDatasets}"></select>
      <select id="qualityFilter" aria-label="${ui.labels.allQuality}"></select>
      <select id="resolutionFilter" aria-label="${ui.labels.allResolution}"></select>
      <select id="ratioFilter" aria-label="${ui.labels.allRatio}"></select>
      <select id="dimensionFilter" aria-label="${ui.labels.allDimensions}"></select>
      <input id="searchInput" aria-label="Search" placeholder="${ui.labels.searchPlaceholder}">
    </div>
  </header>
  <main>
    <section class="grid stats" id="overallStats"></section>
    <section class="panel filter-panel">
      <h2>${ui.labels.filterPanel}</h2>
      <div class="filter-grid" id="filterChips"></div>
    </section>
    <section class="grid three" id="datasetCards"></section>
    <section class="panel">
      <h2>${ui.labels.testPrompts}</h2>
      <div class="prompt-grid" id="promptCards"></div>
    </section>
    <section class="panel">
      <h2>${ui.labels.testMatrix}</h2>
      <div class="dimension-wrap">
        <table>
          <thead>
            <tr>
              <th>${ui.labels.matrixRatio}</th><th>${ui.labels.resolution}</th><th>${ui.labels.matrixDimensions}</th><th>${ui.labels.matrixQuality}</th><th class="num">${ui.labels.totalRecords}</th>
            </tr>
          </thead>
          <tbody id="dimensionRows"></tbody>
        </table>
      </div>
    </section>
    <section class="grid two">
      <div class="panel">
        <h2>${ui.labels.costRank}</h2>
        <div class="bar-list" id="qualityBars"></div>
      </div>
      <div class="panel">
        <h2>${ui.labels.resolutionCost}</h2>
        <div class="bar-list" id="resolutionBars"></div>
      </div>
    </section>
    <section class="panel">
      <h2>${ui.labels.details}</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${ui.labels.imageInfo}</th><th>${ui.labels.group}</th><th>${ui.labels.sequence}</th><th>${ui.labels.ratio}</th><th>${ui.labels.resolution}</th><th>${ui.labels.dimensions}</th><th>${ui.labels.quality}</th>
              <th>${ui.labels.prompt}</th><th class="num">${ui.labels.input}</th><th class="num">${ui.labels.output}</th><th class="num">${ui.labels.estimatedCost}</th><th class="num">${ui.labels.actualCost}</th><th class="num">${ui.labels.avgQuota}</th><th class="num">${ui.labels.requestDuration}</th><th class="num">${ui.labels.originalImage}</th><th class="num">${ui.labels.previewImage}</th><th class="num">${ui.labels.saved}</th><th>${ui.labels.status}</th>
            </tr>
          </thead>
          <tbody id="detailRows"></tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <h2>${ui.labels.preview}</h2>
      <div class="thumbs" id="thumbs"></div>
    </section>
    <section class="panel">
      <h2>${ui.labels.paths}</h2>
      <div id="paths"></div>
    </section>
  </main>
  <div class="modal" id="imageModal" aria-hidden="true">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-head">
        <div>
          <div class="modal-title" id="modalTitle">${ui.labels.imagePreview}</div>
          <div class="modal-meta" id="modalMeta"></div>
        </div>
        <button class="modal-close" id="modalClose" aria-label="${ui.labels.closePreview}">×</button>
      </div>
      <div class="modal-body">
        <img id="modalImage" alt="">
      </div>
      <div class="modal-foot">
        <div class="modal-path" id="modalPath"></div>
      </div>
    </div>
  </div>
  <div class="modal" id="promptModal" aria-hidden="true">
    <div class="modal-dialog prompt-dialog" role="dialog" aria-modal="true" aria-labelledby="promptModalTitle">
      <div class="modal-head">
        <div>
          <div class="modal-title" id="promptModalTitle">${ui.labels.prompt}</div>
          <div class="modal-meta" id="promptModalMeta"></div>
        </div>
        <button class="modal-close" id="promptModalClose" aria-label="${ui.labels.closePrompt}">×</button>
      </div>
      <div class="prompt-body">
        <div class="prompt-block">
          <h3>${ui.labels.originalPrompt}</h3>
          <pre class="prompt-text" id="promptOriginal"></pre>
        </div>
        <div class="prompt-block">
          <h3>${ui.labels.revisedPrompt}</h3>
          <pre class="prompt-text" id="promptRevised"></pre>
        </div>
      </div>
    </div>
  </div>
  <script id="stats-data" type="application/json">${JSON.stringify(pageData).replaceAll("</", "<\\/")}</script>
  <script>
    const data = JSON.parse(document.getElementById("stats-data").textContent);
    const ui = data.ui;
    const $ = (id) => document.getElementById(id);
    const fmtInt = (v) => Math.round(v).toLocaleString("en-US");
    const fmtUsd = (v) => "$" + Number(v).toFixed(6);
    const fmtBytes = (bytes) => bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) + " KB" : (bytes / 1024 / 1024).toFixed(2) + " MB";
    const fmtDuration = (seconds) => {
      const rounded = Math.round(Number(seconds) || 0);
      if (!rounded) return "";
      if (rounded < 60) return rounded + "s";
      const minutes = Math.floor(rounded / 60);
      const rest = rounded % 60;
      return rest ? minutes + "m " + rest + "s" : minutes + "m";
    };
    const unique = (items) => [...new Set(items)].filter(Boolean);
    const qualityOrder = ["自动", "低", "中", "高"];
    const resolutionOrder = ["1K", "2K", "4K"];
    const ratioOrder = ["1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5"];
    const rowByKey = new Map(data.rows.map((row) => [row.key, row]));
    const qualityLabel = (value) => ui.qualityLabels[value] || value;
    const datasetLabel = (dataset) => data.locale === "zh" ? dataset.label : dataset.name;
    const rowDatasetLabel = (row) => data.locale === "zh" ? row.label : row.datasetName;

    function assetUrl(path) {
      return path.split("/").map(encodeURIComponent).join("/");
    }

    function attr(value) {
      return String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    function metric(label, value, sub = "") {
      return '<div class="card"><div class="metric-label">' + label + '</div><div class="metric-value">' + value + '</div><div class="metric-sub">' + sub + '</div></div>';
    }

    function fillSelect(el, label, values) {
      el.innerHTML = '<option value="">' + label + '</option>' + values.map((item) => {
        const value = typeof item === "string" ? item : item.value;
        const text = typeof item === "string" ? item : item.label;
        return '<option value="' + value + '">' + text + '</option>';
      }).join("");
    }

    fillSelect($("datasetFilter"), ui.labels.allDatasets, data.datasets.map((dataset) => ({ value: dataset.name, label: datasetLabel(dataset) })));
    fillSelect($("qualityFilter"), ui.labels.allQuality, qualityOrder.filter((value) => data.rows.some((row) => row.quality === value)).map((value) => ({ value, label: qualityLabel(value) })));
    fillSelect($("resolutionFilter"), ui.labels.allResolution, resolutionOrder.filter((value) => data.rows.some((row) => row.resolution === value)));
    fillSelect($("ratioFilter"), ui.labels.allRatio, ratioOrder.filter((value) => data.rows.some((row) => row.ratio === value)));
    fillSelect($("dimensionFilter"), ui.labels.allDimensions, unique(data.rows.map((r) => r.dimensions)));
    $("generatedAt").textContent = new Date(data.generatedAt).toLocaleString(data.locale === "en" ? "en-US" : "zh-CN");

    function currentRows() {
      const dataset = $("datasetFilter").value;
      const quality = $("qualityFilter").value;
      const resolution = $("resolutionFilter").value;
      const ratio = $("ratioFilter").value;
      const dimensions = $("dimensionFilter").value;
      const query = $("searchInput").value.trim().toLowerCase();
      return data.rows.filter((row) => {
        if (dataset && row.datasetName !== dataset) return false;
        if (quality && row.quality !== quality) return false;
        if (resolution && row.resolution !== resolution) return false;
        if (ratio && row.ratio !== ratio) return false;
        if (dimensions && row.dimensions !== dimensions) return false;
        if (query) {
          const haystack = [row.datasetName, row.ratio, row.resolution, row.dimensions, row.quality, row.prompt, row.revisedPrompt].join(" ").toLowerCase();
          if (!haystack.includes(query)) return false;
        }
        return true;
      });
    }

    function summarize(rows) {
      return {
        count: rows.length,
        ok: rows.filter((r) => r.status === "ok").length,
        inputTokens: rows.reduce((s, r) => s + r.inputTokens, 0),
        outputTokens: rows.reduce((s, r) => s + r.outputTokens, 0),
        actualUsd: rows.reduce((s, r) => s + r.actualUsd, 0),
        estimatedUsd: rows.reduce((s, r) => s + r.estimatedUsd, 0),
        quota: rows.reduce((s, r) => s + r.quota, 0),
        requestSeconds: rows.reduce((s, r) => s + r.requestSeconds, 0),
        fileBytes: rows.reduce((s, r) => s + r.fileBytes, 0),
        previewBytes: rows.reduce((s, r) => s + r.previewBytes, 0),
        savedPreviewBytes: rows.reduce((s, r) => s + r.savedPreviewBytes, 0),
      };
    }

    function avg(value, count) {
      return count ? value / count : 0;
    }

    function aggregate(rows, key) {
      const map = new Map();
      rows.forEach((row) => {
        const k = row[key];
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(row);
      });
      return [...map.entries()].map(([name, list]) => ({ name, ...summarize(list) })).sort((a, b) => b.actualUsd - a.actualUsd);
    }

    function renderBars(target, rows, key) {
      const items = aggregate(rows, key);
      const max = Math.max(...items.map((item) => item.actualUsd), 1);
      target.innerHTML = items.map((item) => (
        '<div class="bar-row"><span>' + (key === "quality" ? qualityLabel(item.name) : item.name) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + (item.actualUsd / max * 100).toFixed(1) + '%"></div></div><strong>' + fmtUsd(item.actualUsd) + '</strong></div>'
      )).join("");
    }

    function renderStaticSections() {
      $("promptCards").innerHTML = data.datasets.map((dataset) => (
        '<article class="prompt-card"><div class="dataset-top"><div><h3>' + datasetLabel(dataset) + '</h3><p>' + dataset.name + '</p></div><span class="pill"><i class="dot" style="background:' + dataset.color + '"></i>84 ' + ui.labels.rowsSuffix + '</span></div><p>' + attr(dataset.prompt) + '</p></article>'
      )).join("");
      $("dimensionRows").innerHTML = data.dimensionMatrix.map((item) => (
        '<tr><td>' + item.ratio + '</td><td>' + item.resolution + '</td><td>' + item.dimensions + '</td><td>' + item.qualities.map(qualityLabel).join(" / ") + '</td><td class="num">' + fmtInt(item.count) + '</td></tr>'
      )).join("");
    }

    function render() {
      const rows = currentRows();
      const summary = summarize(rows);
      $("overallStats").innerHTML = [
        metric(ui.labels.records, fmtInt(summary.count), ui.labels.success + " " + fmtInt(summary.ok) + " " + ui.labels.rowsSuffix),
        metric(ui.labels.inputTokens, fmtInt(summary.inputTokens), ui.labels.inputTokensSub),
        metric(ui.labels.outputTokens, fmtInt(summary.outputTokens), ui.labels.outputTokensSub),
        metric(ui.labels.estimatedCost, fmtUsd(summary.estimatedUsd), ui.labels.avg + " " + fmtUsd(avg(summary.estimatedUsd, summary.count))),
        metric(ui.labels.actualCost, fmtUsd(summary.actualUsd), ui.labels.avg + " " + fmtUsd(avg(summary.actualUsd, summary.count))),
        metric(ui.labels.avgQuota, fmtInt(avg(summary.quota, summary.count)), ui.labels.quotaTotal + " " + fmtInt(summary.quota)),
        metric(ui.labels.requestDuration, fmtDuration(summary.requestSeconds), ui.labels.avg + " " + fmtDuration(avg(summary.requestSeconds, summary.count))),
        metric(ui.labels.imageSize, fmtBytes(summary.fileBytes), ui.labels.imageSizeSub),
        metric(ui.labels.compressedPreview, fmtBytes(summary.previewBytes), ui.labels.saved + " " + fmtBytes(summary.savedPreviewBytes)),
      ].join("");

      $("datasetCards").innerHTML = data.datasets.map((dataset) => {
        const list = rows.filter((row) => row.datasetId === dataset.id);
        const s = summarize(list);
        return '<article class="dataset-card card"><div class="dataset-top"><div><h3>' + datasetLabel(dataset) + '</h3><p>' + dataset.name + '</p></div><span class="pill"><i class="dot" style="background:' + dataset.color + '"></i>' + fmtInt(s.count) + ' ' + ui.labels.rowsSuffix + '</span></div><div class="mini"><div>' + ui.labels.estimatedCost + '<strong>' + fmtUsd(s.estimatedUsd) + '</strong></div><div>' + ui.labels.actualCost + '<strong>' + fmtUsd(s.actualUsd) + '</strong></div><div>' + ui.labels.avg + ' ' + ui.labels.actualCost + '<strong>' + fmtUsd(avg(s.actualUsd, s.count)) + '</strong></div><div>' + ui.labels.avgQuota + '<strong>' + fmtInt(avg(s.quota, s.count)) + '</strong></div><div>' + ui.labels.avg + ' ' + ui.labels.requestDuration + '<strong>' + fmtDuration(avg(s.requestSeconds, s.count)) + '</strong></div><div>' + ui.labels.compressedPreview + '<strong>' + fmtBytes(s.previewBytes) + '</strong></div></div></article>';
      }).join("");

      const chipSets = [
        [ui.labels.group, "datasetFilter", data.datasets.map((dataset) => ({ value: dataset.name, label: datasetLabel(dataset) }))],
        [ui.labels.quality, "qualityFilter", qualityOrder.filter((value) => data.rows.some((row) => row.quality === value)).map((value) => ({ value, label: qualityLabel(value) }))],
        [ui.labels.resolution, "resolutionFilter", resolutionOrder.filter((value) => data.rows.some((row) => row.resolution === value)).map((value) => ({ value, label: value }))],
        [ui.labels.ratio, "ratioFilter", ratioOrder.filter((value) => data.rows.some((row) => row.ratio === value)).map((value) => ({ value, label: value }))],
        [ui.labels.dimensions, "dimensionFilter", unique(data.rows.map((r) => r.dimensions)).map((value) => ({ value, label: value }))],
      ];
      $("filterChips").innerHTML = chipSets.map(([title, selectId, values]) => (
        '<div class="filter-group"><div class="filter-title">' + title + '</div><div class="chips"><button class="chip' + ($(selectId).value === "" ? " active" : "") + '" data-filter="' + selectId + '" data-value="">' + ui.labels.all + '</button>' + values.map((item) => '<button class="chip' + ($(selectId).value === item.value ? " active" : "") + '" data-filter="' + selectId + '" data-value="' + item.value + '">' + item.label + '</button>').join("") + '</div></div>'
      )).join("");
      document.querySelectorAll(".chip").forEach((chip) => chip.addEventListener("click", () => {
        $(chip.dataset.filter).value = chip.dataset.value;
        render();
      }));

      renderBars($("qualityBars"), rows, "quality");
      renderBars($("resolutionBars"), rows, "resolution");

      $("detailRows").innerHTML = rows.map((row) => (
        '<tr><td><a class="row-image image-link" href="' + assetUrl(row.modalRelPath) + '" title="' + attr(row.imagePath) + '" data-title="' + attr(rowDatasetLabel(row) + ' #' + row.sequence) + '" data-meta="' + attr(row.ratio + ' / ' + row.resolution + ' / ' + row.dimensions + ' / ' + qualityLabel(row.quality) + ' / ' + ui.labels.requestDuration + ' ' + row.requestDuration + ' / ' + row.modalVersionLabel + ' ' + row.modalSize) + '" data-path="' + attr(row.modalRelPath) + '"><img src="' + assetUrl(row.thumbRelPath) + '" alt="' + attr(rowDatasetLabel(row) + ' #' + row.sequence) + '" loading="lazy" decoding="async"><span><strong>#' + row.sequence + ' ' + row.dimensions + '</strong><span>' + ui.labels.originalImage + ' ' + row.fileSize + ' / ' + ui.labels.previewImage + ' ' + row.previewSize + '</span><span>' + ui.labels.requestDuration + ' ' + row.requestDuration + ' / ' + ui.labels.saved + ' ' + row.savingsPercent + '</span><span>' + row.imageRelPath + '</span></span></a></td><td>' + rowDatasetLabel(row) + '</td><td>' + row.sequence + '</td><td>' + row.ratio + '</td><td>' + row.resolution + '</td><td>' + row.dimensions + '</td><td>' + qualityLabel(row.quality) + '</td><td><button class="text-button prompt-button" data-row-key="' + attr(row.key) + '">' + ui.labels.view + '</button></td><td class="num">' + fmtInt(row.inputTokens) + '</td><td class="num">' + fmtInt(row.outputTokens) + '</td><td class="num">' + fmtUsd(row.estimatedUsd) + '</td><td class="num">' + fmtUsd(row.actualUsd) + '</td><td class="num">' + fmtInt(row.quota) + '</td><td class="num">' + row.requestDuration + '</td><td class="num">' + row.fileSize + '</td><td class="num">' + row.previewSize + '</td><td class="num">' + row.savingsPercent + '</td><td class="' + (row.status === "ok" ? "status-ok" : "status-error") + '">' + row.status + '</td></tr>'
      )).join("");

      const preview = rows.filter((row) => row.status === "ok" && ["1", "24", "60", "84"].includes(String(row.sequence))).slice(0, 18);
      $("thumbs").innerHTML = preview.map((row) => (
        '<a class="thumb" href="' + assetUrl(row.modalRelPath) + '" data-title="' + attr(rowDatasetLabel(row) + ' #' + row.sequence) + '" data-meta="' + attr(row.ratio + ' / ' + row.resolution + ' / ' + row.dimensions + ' / ' + qualityLabel(row.quality) + ' / ' + ui.labels.requestDuration + ' ' + row.requestDuration + ' / ' + row.modalVersionLabel + ' ' + row.modalSize) + '" data-path="' + attr(row.modalRelPath) + '"><img src="' + assetUrl(row.thumbRelPath) + '" alt="' + attr(rowDatasetLabel(row) + ' ' + row.sequence) + '" loading="lazy" decoding="async"><div><span>' + rowDatasetLabel(row) + ' #' + row.sequence + '</span><span>' + row.modalVersionLabel + ' ' + row.modalSize + '</span></div></a>'
      )).join("");
    }

    function openImageModal(link) {
      $("modalTitle").textContent = link.dataset.title || "图片预览";
      $("modalMeta").innerHTML = (link.dataset.meta || "").split(" / ").filter(Boolean).map((item) => '<span class="pill">' + item + '</span>').join("");
      $("modalPath").textContent = link.dataset.path || link.getAttribute("href");
      $("modalImage").src = link.getAttribute("href");
      $("modalImage").alt = link.dataset.title || "图片预览";
      $("imageModal").classList.add("open");
      $("imageModal").setAttribute("aria-hidden", "false");
      $("modalClose").focus();
    }

    function closeImageModal() {
      $("imageModal").classList.remove("open");
      $("imageModal").setAttribute("aria-hidden", "true");
      $("modalImage").removeAttribute("src");
    }

    function openPromptModal(rowKey) {
      const row = rowByKey.get(rowKey);
      if (!row) return;
      $("promptModalTitle").textContent = rowDatasetLabel(row) + " #" + row.sequence + " " + ui.labels.promptTitleSuffix;
      $("promptModalMeta").innerHTML = [row.ratio, row.resolution, row.dimensions, qualityLabel(row.quality)].map((item) => '<span class="pill">' + item + '</span>').join("");
      $("promptOriginal").textContent = row.prompt || "";
      $("promptRevised").textContent = row.revisedPrompt || ui.labels.noRevisedPrompt;
      $("promptModal").classList.add("open");
      $("promptModal").setAttribute("aria-hidden", "false");
      $("promptModalClose").focus();
    }

    function closePromptModal() {
      $("promptModal").classList.remove("open");
      $("promptModal").setAttribute("aria-hidden", "true");
    }

    $("paths").innerHTML = data.datasets.map((dataset) => '<p><strong>' + datasetLabel(dataset) + '</strong></p><p class="path">' + dataset.dir + '</p>').join('<br>');
    ["datasetFilter", "qualityFilter", "resolutionFilter", "ratioFilter", "dimensionFilter", "searchInput"].forEach((id) => $(id).addEventListener("input", render));
    document.addEventListener("click", (event) => {
      const promptButton = event.target.closest(".prompt-button");
      if (promptButton) {
        openPromptModal(promptButton.dataset.rowKey);
        return;
      }
      const link = event.target.closest(".image-link, .thumb");
      if (link) {
        event.preventDefault();
        openImageModal(link);
      }
      if (event.target === $("imageModal") || event.target === $("modalClose")) closeImageModal();
      if (event.target === $("promptModal") || event.target === $("promptModalClose")) closePromptModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && $("imageModal").classList.contains("open")) closeImageModal();
      if (event.key === "Escape" && $("promptModal").classList.contains("open")) closePromptModal();
    });
    renderStaticSections();
    render();
  </script>
</body>
</html>`;
}

for (const variant of ["compressed", "original"]) {
  for (const locale of ["zh", "en"]) {
    const pageData = makePageData(variant, locale);
    fs.writeFileSync(outputPaths[variant][locale], renderHtml(pageData));
    console.log(outputPaths[variant][locale]);
  }
}
