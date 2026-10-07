# zhuapai-app 工作說明（給 Claude Code 看）

這個儲存庫是 LIN YANG HAI 的彩券網站，用 GitHub Pages 發布：
https://redwinds542688-gif.github.io/zhuapai-app/
推上 `main` 分支後約 1～2 分鐘生效。

## 檔案

| 檔案 | 內容 | 注意 |
|---|---|---|
| `index.html` | 「抓539」（副程式；主程式是 Ai抓牌，不在這個儲存庫） | 很大，裡面有規格書、鐵則、修改紀錄。不要被 haoyun.html 覆蓋 |
| `haoyun.html` | 「好運旺旺進財來」推薦程式 | 從爬蟲閘道 lottery-data-gate 自動同步開獎資料 |
| `sw.js` | 離線背景程式 | 修改時把 `CACHE` 版本號加 1 |
| `manifest.json`、`icon-*.png`、`apple-touch-icon.png` | 抓539 的安裝設定與圖示 | 一般不動 |
| `上傳說明.txt` | 抓539 安裝說明 | 一般不動 |

## 上傳規則

1. 使用者說「把下載資料夾裡的 XXX 更新上去」時：從使用者電腦的「下載」資料夾找**最新**的那個檔案（檔名可能變成 `haoyun (1).html` 之類，以修改時間最新的為準），複製到儲存庫根目錄，用正確檔名覆蓋。
2. 只覆蓋使用者指定的檔案，**不要動其他檔案**，特別是 `index.html`。
3. 推送前先檢查：
   - HTML 檔裡 `<script>` 的 JavaScript 沒有語法錯誤（可用 `node --check`）。
   - `index.html`：`window.APP_BUILD` 的時間要比 GitHub 上舊版的新；不可以用比較舊的版本覆蓋比較新的版本。
4. commit 訊息用中文，寫清楚改了什麼，例如「好運旺旺進財來：關聯推薦固定 8 顆」。
5. 推上 `main` 後，告訴使用者 commit 編號，並提醒等 1～2 分鐘、Deployments 出現綠色勾勾後重新整理網站。

## 抓539（index.html）的既有規則

- 程式裡的規格書與「鐵則」是使用者定案的規則，改程式前先讀，不可自行更動鐵則。
- 每次修改：更新 `window.APP_BUILD` 為**台灣實際時間**（必須比上一版新），並在「修改紀錄」最上面新增一筆。
- 爬蟲資料庫 `redwinds542688-gif/Lottery-database` 是私人儲存庫，程式透過 lottery-data-gate 閘道讀取；公開的 `redwinds542688/Lottery-database` 已停用，不可使用。
