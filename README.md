# 四角辯論模板（教師大螢幕 ＋ 學生平板 ＋ 壓力測試）

## 資料夾內容

| 檔案 | 用途 | 換議題要改嗎？ |
|---|---|---|
| `config.js` | **所有議題內容**：辯題、四個立場、投票選項、字數、吉祥物、飄浮圖樣、Supabase 連線 | ✅ **只改這個** |
| `index.html` | 教師大螢幕端（四角動態島、開放投票、匯出 Excel、清除資料） | ❌ |
| `student.html` | 學生端（登入、選立場寫理由、終極投票） | ❌ |
| `loadtest.html` | 壓力測試（模擬 1 位老師 ＋ 多位學生同時操作） | ❌ |
| `shared.js` | 共用程式與手繪圖示庫 | ❌ |
| `schema.sql` | Supabase 資料庫設定（每個 Supabase 專案只要執行一次） | ❌ |
| `examples/` | 換議題的設定範例（手機議題） | 參考用 |

> 這個版本支援「多議題」：同一個 Supabase 專案可以同時放很多議題，靠 `config.js` 裡的 `TOPIC_ID` 分開，互不干擾；同一個學生在不同議題都能各送出一次理由。

---

## 一、Supabase 設定（第一次使用才需要）

### 1. 建立專案（已經有電廠版專案的人，跳到第 2 步）
1. 到 <https://supabase.com> 用 GitHub 或 Email 註冊並登入。
2. 按 **New project**：
   - Name：例如 `four-corner-debate`
   - Database Password：自己設一組（請記下來，平常用不到）
   - Region：選離台灣近的（例如 Tokyo 或 Singapore）
3. 等 1～2 分鐘，專案建立完成。

### 2. 執行資料庫設定
1. 左側選單點 **SQL Editor** → **New query**。
2. 打開 `schema.sql`，**整份複製貼上** → 按右下角 **Run**。
3. 看到 `Success. No rows returned` 就完成。
   - 已經用過電廠版的專案也直接執行這一份即可：會自動升級，舊資料保留在 `power-plant` 議題下。
   - 這份可以重複執行，不會出錯。

### 3. 取得連線資訊
1. 點專案頁面上方的 **Connect**（或左下 **Project Settings → API Keys**）。
2. 複製兩個值，貼到 `config.js` 最上面：
   - **Project URL** → `SUPABASE_URL`（像 `https://xxxx.supabase.co`）
   - **Publishable key**（`sb_publishable_` 開頭）→ `SUPABASE_KEY`
     （舊版介面叫 `anon` `public` key，也可以用）
   - ⚠️ **不要**貼 `secret` / `service_role` key，那把鑰匙不能放在網頁裡。

### 4. 檢查即時同步（通常 schema.sql 已經處理好）
左側 **Database → Publications → supabase_realtime**，確認 `arguments`、`votes`、`system_status` 三張表都有打勾。

---

## 二、GitHub Pages 上線

### 1. 建立 Repository
1. 登入 <https://github.com> → 右上 **＋ → New repository**。
2. Repository name：例如 `debate`；選 **Public**（免費帳號的 GitHub Pages 需要公開）。
3. 按 **Create repository**。

### 2. 上傳檔案
1. 在新 repo 頁面點 **uploading an existing file**（或 **Add file → Upload files**）。
2. 把資料夾裡的檔案（`index.html`、`student.html`、`loadtest.html`、`config.js`、`shared.js`）**一起拖進去**。
   - `schema.sql`、`README.md`、`examples/` 上傳也沒關係，只是網頁用不到。
3. 下方按 **Commit changes**。

### 3. 開啟 GitHub Pages
1. Repo 上方 **Settings** → 左側 **Pages**。
2. **Source** 選 **Deploy from a branch**；Branch 選 **main**、資料夾選 **/ (root)** → **Save**。
3. 等 1～2 分鐘，重新整理頁面，上方會出現網址：
   `https://你的帳號.github.io/debate/`

### 4. 課堂網址
| 給誰 | 網址 |
|---|---|
| 老師大螢幕 | `https://你的帳號.github.io/debate/`（就是 index.html） |
| 學生平板 | `https://你的帳號.github.io/debate/student.html` |
| 課前壓力測試 | `https://你的帳號.github.io/debate/loadtest.html` |

💡 學生網址可以用任何 QR Code 產生器做成 QR Code 投影出來，學生掃描即可進入。

### 之後修改檔案
在 GitHub 點檔案 → 右上角 ✏️ 鉛筆圖示 → 修改 → **Commit changes**。約 1 分鐘後生效；網頁沒變的話按 **Ctrl + F5**（Mac：Cmd + Shift + R）強制重新整理。

---

## 三、換新議題（每次只需要 5 分鐘）

### 方法 A：一個議題一個資料夾（推薦，舊議題網址保留）
1. 在 GitHub repo 裡建立新資料夾，例如 `phone/`（**Add file → Upload files** 時，把整個資料夾拖進去即可）。
2. 放入同一套 5 個檔案，並修改其中的 `config.js`（見下方清單）。
3. 新網址：
   - 老師：`https://你的帳號.github.io/debate/phone/`
   - 學生：`https://你的帳號.github.io/debate/phone/student.html`

### 方法 B：直接改原本的 config.js
適合不需要保留舊議題網址的情況。舊議題的資料仍在資料庫，改回原本的 `TOPIC_ID` 就看得到。

### config.js 修改清單
| 編號 | 項目 | 一定要改？ | 說明 |
|---|---|---|---|
| ② | `TOPIC_ID` | ✅ **一定要改** | 英文、數字、`-`、`_`，例如 `phone-2026`。不改的話會跟舊議題的資料混在一起 |
| ③ | `TOPIC` | ✅ | 辯題分成三段：`before` + `highlight`（螢光筆）+ `after` |
| ⑤ | `VOTE` | 視需要 | 終極投票的問句與兩個選項（例如「支持／不支持」） |
| ④ | `ISLANDS` 的 `hint` | 視需要 | 四個立場的提示句；`key` 立場名稱也可以改，但上課開始後就不要再動 |
| ⑦ | `MASCOT` | 選用 | `'bulb'` 小燈泡，或直接填一個 emoji，例如 `'📱'` |
| ⑧ | `FLOATERS` | 選用 | 飄浮圖樣，**用 emoji 最省事**：`{ emoji: '📚', pos: 'left:13%;top:38%', size: 80, op: .9 }` |
| ⑥ | `MIN_REASON` / `MAX_REASON` | 選用 | 理由最少／最多字數 |
| ⑨ | `TEST_REASON` | 選用 | 壓力測試的假理由 |
| ① | `SUPABASE_URL` / `KEY` | ❌ | 同一個 Supabase 專案不用改 |

> `examples/config-手機議題範例.js` 是完整的範例（國中生應該可以帶手機到學校嗎？），可以直接對照修改。

**不需要**重新執行 `schema.sql`，也**不需要**改 3 個 html。

### 改完後的檢查
1. 打開 `loadtest.html` → 確認上方顯示的「目前議題」正確 → 按 **開始測試**（測試班級用預設的「壓測班」，不要填真實班級）。
2. 全部 ✅ 就可以上課。
3. 如果畫面最上方出現黃色「⚠️ 設定有問題」，照著提示修改 `config.js`（常見原因：少了引號或逗號、TOPIC_ID 用了中文或空白、ISLANDS 不是 4 個）。

---

## 四、上課流程

1. 老師開大螢幕網址 → 輸入班級（例如「一年一班」）→ **設定**。
2. 學生開學生網址 → 輸入班級、座號、姓名 → 選一個立場寫理由 → 送出（每人一次）。
3. 理由會即時出現在大螢幕四個角落。
4. 討論後，老師按 **開放終極投票** → 學生畫面的灰色膠囊展開，投下贊成／反對。
5. 下課前按 **📊 匯出 Excel成果**（含論點、投票明細、圓餅圖、議題資訊）。
6. 需要重來時按 **🧹 清除本班資料**（只會清除「本議題＋本班」，不影響其他議題和班級）。

---

## 五、常見問題

**Q：畫面顯示「請到 Supabase → SQL Editor 執行新版 schema.sql」？**
資料庫還是舊版結構。執行一次 `schema.sql` 即可。

**Q：學生送出了，但大螢幕沒出現？**
看大螢幕左下角是否顯示「即時連線中」；若沒有，檢查第一章第 4 步的 Realtime 設定，或重新整理大螢幕（資料不會遺失）。

**Q：上課前一天要做什麼？**
Supabase 免費專案如果長時間沒有使用會被自動暫停。上課前先登入 Supabase 看一下專案狀態，若顯示 Paused 就按 **Restore**，再跑一次 `loadtest.html`。

**Q：安全性？**
`publishable key` 本來就設計成可以放在網頁裡。但這套系統為了課堂方便，任何知道網址的人都能送出與清除資料，請不要用來收集敏感資料，課程結束後記得匯出備份。

**Q：想新增自己畫的圖示？**
在 `shared.js` 的 `ICONS` 裡加一個 `名稱: \`<svg viewBox="0 0 64 64" ...>...</svg>\``，就能在 `config.js` 用 `{ icon: '名稱', ... }`。
