# 投資掃描時間線 / Invest Scan Timeline

手機版（mobile-first）單頁時間線，展示 Grok Bot 喺 **2026-10-26（Asia/Hong_Kong）** 搵到嘅未來科技同買方言論掃描摘要。

- 按 `found_at`（發現／匯報時間）由新到舊排序
- 分類篩選：全部 / 未來科技 / 買方
- 靜態站：`index.html` + `styles.css` + `app.js` + `data/scans.json`
- **非投資建議**

## 本地預覽

```bash
npx --yes serve .
# 或 python3 -m http.server 3000
```

打開瀏覽器，用手機寬度（約 430px）檢視效果最佳。

## 新增一則

編輯 `data/scans.json`，喺 `entries` 加一項：

```json
{
  "id": "ft-YYYYMMDD-HHMM",
  "found_at": "2026-10-26T13:00:00+08:00",
  "category": "future_tech",
  "title": "標題",
  "body": "繁體中文摘要…",
  "tickers": ["TICKER"],
  "companies": ["公司名"],
  "links": [{ "label": "來源", "url": "https://..." }],
  "verification": null
}
```

- `category`: `future_tech`（未來科技）或 `buy_side`（買方）
- `found_at`: ISO 8601，請用 `+08:00`
- 前端會自動再按時間排序；JSON 內建議維持由新到舊

Commit + push 到 `main` 後，Vercel 會由 GitHub 自動部署。

## Deploy

由 GitHub repo 連接 Vercel（Git integration）。Framework：Other / 靜態檔案，無需 build。
