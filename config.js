/* =====================================================================
 * 四角辯論模板｜設定檔：AI 立法議題（換議題時，通常只要改這一個檔案）
 * ---------------------------------------------------------------------
 * 改完存檔 → 上傳到 GitHub → 等約 1 分鐘 → 網頁按 Ctrl+F5 重新整理。
 * 文字請保留前後的引號 '...'，每一行結尾的逗號也不要刪掉。
 * ===================================================================== */
window.DEBATE_CONFIG = {

  /* ① Supabase 連線資訊（Supabase 專案 → 上方「Connect」或 Project Settings → API Keys）
       同一個 Supabase 專案可以放很多議題，不用每次換議題都重建。 */
  SUPABASE_URL: 'https://qtabbosbrdoblhecssrd.supabase.co',
  SUPABASE_KEY: 'sb_publishable_xBePEbyZJ7gGhbONOuAizg_mWMH2X-t',

  /* ② 議題代號：每個議題一定要不一樣！只能用英文、數字、- 或 _
       資料庫靠它把不同議題的理由與投票分開。例：'phone-2026'、'school-uniform' */
  TOPIC_ID: 'ai-regulation',

  /* ③ 辯題：before + highlight + after 會接成一句，highlight 那段會加上螢光筆底線 */
  TOPIC: {
    before:    'AI人工智慧的開發應該要由',
    highlight: '政府立法',
    after:     '監控管理嗎？',
  },

  /* ④ 四個角落（順序：左上、右上、左下、右下）
       key    ：立場名稱（會存進資料庫，同一議題上課期間不要改）
       emoji  ：表情符號
       accent ：主色（淺）／ ink：文字色（深）
       hint   ：學生輸入框的提示文字 */
  ISLANDS: [
    { key: '非常贊成',   emoji: '🥰', accent: '#7CCBA2', ink: '#2F8F63', hint: '我非常贊成政府立法管理 AI，因為……' },
    { key: '大部分贊成', emoji: '🙂', accent: '#7DB7E8', ink: '#2E78B5', hint: '我大致贊成立法，不過要注意……' },
    { key: '大部分反對', emoji: '🤔', accent: '#F5A25D', ink: '#B8620F', hint: '我大致反對，因為……（可以怎麼做比較好？）' },
    { key: '非常反對',   emoji: '😤', accent: '#EF8FA6', ink: '#C2506B', hint: '我強烈反對政府立法管理 AI，因為……' },
  ],

  /* ⑤ 終極投票（兩個選項） */
  VOTE: {
    question:      '🗳️ 終極投票：AI 開發應該由政府立法監管嗎？',
    agree:         '贊成',
    agreeEmoji:    '👍',
    disagree:      '反對',
    disagreeEmoji: '👎',
  },

  /* ⑥ 理由字數：最少幾字（不想限制改成 1）、最多幾字 */
  MIN_REASON: 20,
  MAX_REASON: 120,

  /* ⑦ 吉祥物：'bulb' = 內建小燈泡；也可以填 shared.js 裡的圖示名稱（如 'tree'），或直接填一個 emoji（如 '📱'） */
  MASCOT: '🤖',

  /* ⑧ 飄浮小圖樣：
       icon  ：內建手繪圖示 plant 發電廠、ac 冷氣、wafer 晶圓、phone 手機、scooter 電動機車、
               tree 樹、leopardcat 石虎、cloudedleopard 雲豹、bulb 燈泡
       emoji ：或直接用任何 emoji（換議題最省事），例如 { emoji: '📚', ... }
       pos   ：位置；size：大小（像素）；op：透明度 0~1
       不想要飄浮圖樣，把陣列清空成 [] 即可。 */
  FLOATERS: {
    teacher: [
      { emoji: '🤖', pos: 'left:30%;top:11%',     size: 80, op: .9 },
      { emoji: '⚖️', pos: 'right:30%;top:11%',    size: 80, op: .9 },
      { emoji: '🏛️', pos: 'left:13%;top:36%',     size: 80, op: .9 },
      { emoji: '💡', pos: 'right:13%;top:38%',    size: 80, op: .9 },
      { emoji: '🔒', pos: 'left:12%;top:55%',     size: 72, op: .9 },
      { emoji: '💻', pos: 'right:12%;top:55%',    size: 72, op: .9 },
      { emoji: '📜', pos: 'left:31%;bottom:22%',  size: 76, op: .9 },
      { emoji: '🧠', pos: 'right:31%;bottom:22%', size: 76, op: .9 },
    ],
    student: [
      { emoji: '🤖', pos: 'left:1%;top:12%',  size: 52, op: .8 },
      { emoji: '🏛️', pos: 'left:1%;top:34%',  size: 52, op: .8 },
      { emoji: '🔒', pos: 'left:1%;top:56%',  size: 52, op: .8 },
      { emoji: '📜', pos: 'left:1%;top:77%',  size: 52, op: .8 },
      { emoji: '⚖️', pos: 'right:1%;top:18%', size: 52, op: .8 },
      { emoji: '💡', pos: 'right:1%;top:40%', size: 52, op: .8 },
      { emoji: '💻', pos: 'right:1%;top:62%', size: 52, op: .8 },
      { emoji: '🧠', pos: 'right:1%;top:82%', size: 52, op: .8 },
    ],
  },



  /* ⑨ 壓力測試用的假理由（{seat} 會換成座號；長度要大於 MIN_REASON） */
  TEST_REASON: '這是壓力測試的理由，第 {seat} 號同學認為 AI 立法要同時考慮創新發展與安全保障。',
};
