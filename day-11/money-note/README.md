# Money Note

一個人用的記帳小工具。資料只存在自己的瀏覽器（`localStorage`），不上傳伺服器。

- 規格：[SPEC.md](./SPEC.md)
- 技術選型評估：[TECH_CHOICE.md](./TECH_CHOICE.md)

## 開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 產出 dist/
npm run preview  # 本機預覽 build 結果
```

手機實機測試（同一個 Wi-Fi 下用手機開）：

```bash
npm run dev -- --host
```

## 技術

| 項目 | 選擇 |
|---|---|
| 框架 | Vue 3（`<script setup>` Composition API） |
| 建置 | Vite |
| 樣式 | Tailwind CSS v4（`@tailwindcss/vite` plugin） |
| 路由 / 狀態管理 / 圖表 / 日期函式庫 | 都不裝，見 SPEC 第 6 節 |

## 目錄結構

```
src/
├─ App.vue                    # 版面組裝
├─ main.js
├─ style.css                  # 只有 @import "tailwindcss"
├─ constants/
│  └─ categories.js           # 分類清單（唯一真實來源）
├─ composables/
│  └─ useRecords.js           # 讀寫 localStorage、CRUD、月份篩選、統計
└─ components/
   ├─ MonthSwitcher.vue       # 月份切換 + 本月總額
   ├─ CategoryChart.vue       # 分類佔比橫條
   ├─ RecordList.vue          # 流水清單
   └─ RecordForm.vue          # 新增 / 編輯 bottom sheet
```

`useRecords.js` 是唯一碰 `localStorage` 的地方，元件不直接讀寫。

> 目前 `constants/`、`composables/`、`components/` 是空目錄，功能尚未實作。
