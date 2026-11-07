/* =====================================================================
 * 四角辯論模板｜共用程式（一般不需要修改）
 * 內容：設定檢查、文字跳脫、手繪圖示庫、吉祥物、飄浮圖樣、辯題顯示
 * 想新增手繪圖示：在下面 ICONS 裡加一個 名稱: `<svg ...>` 即可在 config.js 使用。
 * ===================================================================== */

/* ---------- 設定檔沒載入時的保底（讓畫面能顯示錯誤提示） ---------- */
if (!window.DEBATE_CONFIG) {
  window.DEBATE_CONFIG = {
    __missing: true,
    SUPABASE_URL: '請替換', SUPABASE_KEY: '請替換', TOPIC_ID: 'missing',
    TOPIC: { before: '（找不到 config.js）', highlight: '', after: '' },
    ISLANDS: [
      { key: '非常贊成', emoji: '🥰', accent: '#7CCBA2', ink: '#2F8F63', hint: '' },
      { key: '大部分贊成', emoji: '🙂', accent: '#7DB7E8', ink: '#2E78B5', hint: '' },
      { key: '大部分反對', emoji: '🤔', accent: '#F5A25D', ink: '#B8620F', hint: '' },
      { key: '非常反對', emoji: '😤', accent: '#EF8FA6', ink: '#C2506B', hint: '' },
    ],
    VOTE: { question: '終極投票', agree: '贊成', agreeEmoji: '👍', disagree: '反對', disagreeEmoji: '👎' },
    MIN_REASON: 1, MAX_REASON: 120, MASCOT: 'bulb', FLOATERS: { teacher: [], student: [] },
    TEST_REASON: '壓力測試 {seat}',
  };
}

/* ---------- 檢查設定，回傳問題清單（空陣列 = 沒問題） ---------- */
function validateConfig(c) {
  const p = [];
  if (c.__missing) { p.push('找不到 config.js，請確認它和網頁放在同一個資料夾'); return p; }
  if (!c.SUPABASE_URL || c.SUPABASE_URL.includes('請替換')) p.push('尚未填寫 SUPABASE_URL');
  if (!c.SUPABASE_KEY || c.SUPABASE_KEY.includes('請替換')) p.push('尚未填寫 SUPABASE_KEY');
  if (!/^[A-Za-z0-9_-]{1,60}$/.test(c.TOPIC_ID || '')) p.push('TOPIC_ID 只能用英文、數字、- 或 _');
  if (!Array.isArray(c.ISLANDS) || c.ISLANDS.length !== 4) p.push('ISLANDS 必須剛好 4 個');
  else if (new Set(c.ISLANDS.map((i) => i.key)).size !== 4) p.push('ISLANDS 的 4 個 key 不能重複');
  if (!c.VOTE || !c.VOTE.agree || !c.VOTE.disagree || c.VOTE.agree === c.VOTE.disagree) p.push('VOTE 的 agree / disagree 要填，而且不能一樣');
  return p;
}

function showConfigProblems(problems) {
  const el = document.getElementById('configWarn');
  if (!el || !problems.length) return;
  el.textContent = '⚠️ 設定有問題（請編輯 config.js）：' + problems.join('；');
  el.classList.remove('hidden');
  el.hidden = false;
}

/* ---------- 小工具 ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function topicText() {
  const t = window.DEBATE_CONFIG.TOPIC || {};
  return (t.before || '') + (t.highlight || '') + (t.after || '');
}

/* 把辯題放進元素（highlight 那段加上 .hl 樣式） */
function renderTopicInto(el) {
  if (!el) return;
  const t = window.DEBATE_CONFIG.TOPIC || {};
  el.textContent = '';
  el.append(document.createTextNode(t.before || ''));
  if (t.highlight) {
    const s = document.createElement('span');
    s.className = 'hl';
    s.textContent = t.highlight;
    el.append(s);
  }
  el.append(document.createTextNode(t.after || ''));
}

/* 錯誤訊息補充說明：最常見的是資料庫還沒升級 */
function explainErr(e) {
  const m = String((e && (e.message || e)) || '');
  if (/topic/i.test(m) || /no unique or exclusion constraint/i.test(m) || /permission denied/i.test(m)) {
    return m + '（請到 Supabase → SQL Editor 執行新版 schema.sql）';
  }
  return m;
}

/* ---------- 手繪 SVG 圖示庫 ---------- */
const ICON_ATTR = 'viewBox="0 0 64 64" style="width:100%;height:100%;overflow:visible" fill="none" stroke="#6B5A73" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  /* 發電廠：兩座冷卻水塔 + 白煙 */
  plant: `<svg ${ICON_ATTR}>
    <circle cx="22" cy="12" r="5" fill="#fff"/><circle cx="29" cy="7" r="4" fill="#fff"/><circle cx="44" cy="17" r="4.5" fill="#fff"/>
    <path d="M12 56Q17 40 14 22H32Q29 40 34 56Z" fill="#EDE7F3"/>
    <path d="M36 56Q40 44 38 30H52Q50 44 54 56Z" fill="#F7D9BD"/>
    <path d="M6 56H60"/>
    <circle cx="19.5" cy="38" r="1.7" fill="#4A3F55" stroke="none"/><circle cx="27" cy="38" r="1.7" fill="#4A3F55" stroke="none"/>
    <path d="M21 43q2.5 3 5 0" stroke-width="2"/>
    <ellipse cx="16.5" cy="42" rx="2.4" ry="1.6" fill="#F8B4C4" stroke="none"/><ellipse cx="30" cy="42" rx="2.4" ry="1.6" fill="#F8B4C4" stroke="none"/>
  </svg>`,

  /* 冷氣機：掛壁式 + 涼風 */
  ac: `<svg ${ICON_ATTR}>
    <rect x="6" y="12" width="52" height="26" rx="9" fill="#fff"/>
    <path d="M13 32H51" stroke-width="2"/>
    <circle cx="23" cy="21" r="1.9" fill="#4A3F55" stroke="none"/><circle cx="41" cy="21" r="1.9" fill="#4A3F55" stroke="none"/>
    <path d="M29 23.5q3 3 6 0" stroke-width="2"/>
    <ellipse cx="16" cy="25" rx="3" ry="2" fill="#F8B4C4" stroke="none"/><ellipse cx="48" cy="25" rx="3" ry="2" fill="#F8B4C4" stroke="none"/>
    <path d="M18 43q-4 5 0 11" stroke="#7DB7E8"/><path d="M32 43q-4 5 0 11" stroke="#7DB7E8"/><path d="M46 43q-4 5 0 11" stroke="#7DB7E8"/>
  </svg>`,

  /* 晶圓：圓盤 + 方格晶粒 + 反光 */
  wafer: `<svg ${ICON_ATTR}>
    <defs>
      <linearGradient id="wfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9C9F2"/><stop offset=".5" stop-color="#BFE0F5"/><stop offset="1" stop-color="#C9F0DA"/></linearGradient>
      <clipPath id="wfc"><circle cx="32" cy="32" r="25"/></clipPath>
    </defs>
    <circle cx="32" cy="32" r="25" fill="url(#wfg)"/>
    <g clip-path="url(#wfc)" stroke="#8FA6C9" stroke-width="1.2">
      <path d="M13 6V58M19 6V58M25 6V58M31 6V58M37 6V58M43 6V58M49 6V58"/>
      <path d="M6 13H58M6 19H58M6 25H58M6 31H58M6 37H58M6 43H58M6 49H58"/>
    </g>
    <circle cx="32" cy="32" r="25"/>
    <path d="M16 22Q20 14 29 11" stroke="#fff" stroke-width="3.2"/>
    <path d="M27 57h10" stroke-width="2"/>
  </svg>`,

  /* 手機：笑臉螢幕 */
  phone: `<svg ${ICON_ATTR}>
    <rect x="18" y="5" width="28" height="54" rx="8" fill="#fff"/>
    <rect x="22" y="12" width="20" height="38" rx="3" fill="#BFE1F7" stroke-width="1.6"/>
    <path d="M28 8.5H36" stroke-width="2"/>
    <circle cx="28" cy="28" r="1.8" fill="#4A3F55" stroke="none"/><circle cx="36" cy="28" r="1.8" fill="#4A3F55" stroke="none"/>
    <path d="M29 33q3 3 6 0" stroke-width="1.8"/>
    <ellipse cx="25.5" cy="32" rx="2" ry="1.4" fill="#F8B4C4" stroke="none"/><ellipse cx="38.5" cy="32" rx="2" ry="1.4" fill="#F8B4C4" stroke="none"/>
    <circle cx="32" cy="54.5" r="1.6" fill="#6B5A73" stroke="none"/>
  </svg>`,

  /* 電動機車：薄荷綠車身 + 閃電 */
  scooter: `<svg ${ICON_ATTR}>
    <path d="M44 38L47 17H55" />
    <circle cx="53" cy="22" r="2.2" fill="#FFD86B" stroke-width="1.6"/>
    <path d="M16 44Q15 33 25 33H38Q44 33 46 40L48 44Z" fill="#8FD6B1"/>
    <path d="M19 31H33" stroke="#4A3F55" stroke-width="4"/>
    <circle cx="14" cy="47" r="8" fill="#4A3F55"/><circle cx="14" cy="47" r="3" fill="#E6DDEC" stroke="none"/>
    <circle cx="50" cy="47" r="8" fill="#4A3F55"/><circle cx="50" cy="47" r="3" fill="#E6DDEC" stroke="none"/>
    <path d="M33 34L27 41H32L30 47L37 39H32Z" fill="#FFD86B" stroke-width="1.8"/>
  </svg>`,

  /* 樹木：圓圓的樹冠 + 笑臉 */
  tree: `<svg ${ICON_ATTR}>
    <rect x="28" y="40" width="8" height="18" rx="3" fill="#D2A77C"/>
    <circle cx="32" cy="21" r="15" fill="#9ADBB5"/>
    <circle cx="19" cy="34" r="11" fill="#9ADBB5"/>
    <circle cx="45" cy="34" r="11" fill="#9ADBB5"/>
    <circle cx="32" cy="33" r="14" fill="#9ADBB5" stroke="none"/>
    <circle cx="27" cy="30" r="1.8" fill="#4A3F55" stroke="none"/><circle cx="37" cy="30" r="1.8" fill="#4A3F55" stroke="none"/>
    <path d="M29 35q3 3 6 0" stroke-width="2"/>
    <ellipse cx="23.5" cy="34" rx="2.5" ry="1.7" fill="#F8B4C4" stroke="none"/><ellipse cx="40.5" cy="34" rx="2.5" ry="1.7" fill="#F8B4C4" stroke="none"/>
    <path d="M18 58H46"/>
  </svg>`,

  /* 石虎：圓耳、額頭兩道深色縱紋、斑點 */
  leopardcat: `<svg ${ICON_ATTR}>
    <circle cx="15" cy="17" r="8" fill="#D9A66C"/><circle cx="49" cy="17" r="8" fill="#D9A66C"/>
    <circle cx="15" cy="18" r="4" fill="#F8D3C0" stroke="none"/><circle cx="49" cy="18" r="4" fill="#F8D3C0" stroke="none"/>
    <ellipse cx="32" cy="37" rx="23" ry="19" fill="#D9A66C"/>
    <path d="M26 20Q27 26 25 31" stroke="#5A3E2B" stroke-width="3"/><path d="M38 20Q37 26 39 31" stroke="#5A3E2B" stroke-width="3"/>
    <path d="M21 32Q24 28 26.500 29" stroke="#FFF4E6" stroke-width="2"/><path d="M43 32Q40 28 37.500 29" stroke="#FFF4E6" stroke-width="2"/>
    <g fill="#7A4E2D" stroke="none"><circle cx="13" cy="36" r="1.8"/><circle cx="51" cy="36" r="1.8"/><circle cx="17" cy="45" r="1.8"/><circle cx="47" cy="45" r="1.8"/><circle cx="32" cy="22" r="1.5"/></g>
    <circle cx="24" cy="36" r="3.2" fill="#3F3447" stroke="none"/><circle cx="40" cy="36" r="3.2" fill="#3F3447" stroke="none"/>
    <circle cx="25" cy="35" r="1" fill="#fff" stroke="none"/><circle cx="41" cy="35" r="1" fill="#fff" stroke="none"/>
    <ellipse cx="32" cy="46" rx="9" ry="7" fill="#FFF4E6" stroke="none"/>
    <path d="M30 42H34L32 45Z" fill="#E88FA5" stroke-width="1.4"/>
    <path d="M32 45V47M32 47q-3 3-6 0M32 47q3 3 6 0" stroke-width="1.8"/>
  </svg>`,

  /* 雲豹：雲朵狀斑塊、額頭短紋 */
  cloudedleopard: `<svg ${ICON_ATTR}>
    <circle cx="16" cy="18" r="7" fill="#D9C79E"/><circle cx="48" cy="18" r="7" fill="#D9C79E"/>
    <circle cx="16" cy="19" r="3.500" fill="#8B7A5E" stroke="none"/><circle cx="48" cy="19" r="3.500" fill="#8B7A5E" stroke="none"/>
    <ellipse cx="32" cy="37" rx="23" ry="18" fill="#D9C79E"/>
    <g transform="translate(8 8) scale(.75)"><path d="M7 38a4 4 0 0 1 3-6a5 5 0 0 1 9-1a4 4 0 0 1 3 6q-7 3-15 1z" fill="#B59F76" stroke="#5A4A3A" stroke-width="1.8"/></g>
    <g transform="translate(64 0) scale(-1 1)"><g transform="translate(8 8) scale(.75)"><path d="M7 38a4 4 0 0 1 3-6a5 5 0 0 1 9-1a4 4 0 0 1 3 6q-7 3-15 1z" fill="#B59F76" stroke="#5A4A3A" stroke-width="1.8"/></g></g>
    <path d="M28 21V27M36 21V27" stroke="#5A4A3A" stroke-width="2.4"/>
    <circle cx="27" cy="37" r="3.200" fill="#3F3447" stroke="none"/><circle cx="37" cy="37" r="3.200" fill="#3F3447" stroke="none"/>
    <circle cx="28" cy="36" r="1" fill="#fff" stroke="none"/><circle cx="38" cy="36" r="1" fill="#fff" stroke="none"/>
    <ellipse cx="32" cy="46.500" rx="8" ry="5.500" fill="#F4EBD5" stroke="none"/>
    <path d="M30 42.500H34L32 45Z" fill="#D88AA0" stroke-width="1.4"/>
    <path d="M32 45V47M32 47q-3 3-6 0M32 47q3 3 6 0" stroke-width="1.8"/>
  </svg>`,

  /* 小燈泡（預設吉祥物） */
  bulb: `<svg viewBox="0 0 140 160" style="width:100%;height:100%;overflow:visible" aria-hidden="true">
    <g stroke="#F5C04A" stroke-width="5" stroke-linecap="round">
      <path d="M70 6v12"/><path d="M22 28l9 8"/><path d="M118 28l-9 8"/><path d="M8 70h12"/><path d="M132 70h-12"/>
    </g>
    <circle cx="70" cy="74" r="44" fill="#FFE08A" stroke="#F5C04A" stroke-width="4"/>
    <rect x="50" y="114" width="40" height="26" rx="8" fill="#E3DBEC" stroke="#B9AECB" stroke-width="3"/>
    <path d="M55 124h30M55 132h30" stroke="#B9AECB" stroke-width="3" stroke-linecap="round"/>
    <circle cx="54" cy="70" r="5.5" fill="#4A3F55"/><circle cx="86" cy="70" r="5.5" fill="#4A3F55"/>
    <circle cx="55.8" cy="68" r="1.8" fill="#fff"/><circle cx="87.8" cy="68" r="1.8" fill="#fff"/>
    <ellipse cx="44" cy="84" rx="7" ry="4.5" fill="#F8A5B8" opacity=".85"/>
    <ellipse cx="96" cy="84" rx="7" ry="4.5" fill="#F8A5B8" opacity=".85"/>
    <path d="M60 84q10 11 20 0" stroke="#4A3F55" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,
};

/* 把 emoji 或圖示轉成 HTML（px = emoji 字級） */
function artHTML(name, px) {
  if (name && ICONS[name]) return ICONS[name];
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:${px}px;line-height:1">${esc(name || '')}</div>`;
}

/* 吉祥物：頁面上寫 <div data-mascot="字級"></div> 就會放入 */
function renderMascots() {
  const m = window.DEBATE_CONFIG.MASCOT || 'bulb';
  document.querySelectorAll('[data-mascot]').forEach((el) => {
    el.innerHTML = artHTML(m, parseInt(el.dataset.mascot, 10) || 90);
  });
}

/* 飄浮小圖樣。list: [{ icon 或 emoji, pos, size, op }] */
function renderFloaters(list) {
  const host = document.getElementById('floatHost');
  if (!host) return;
  host.innerHTML = (list || []).map((f, i) =>
    `<div class="absolute animate-float" style="${f.pos};width:${f.size}px;height:${f.size}px;opacity:${f.op == null ? .9 : f.op};animation-delay:-${(i * 0.9).toFixed(1)}s;filter:drop-shadow(0 4px 4px rgba(90,60,70,.2))">${artHTML(f.icon || f.emoji, Math.round(f.size * 0.8))}</div>`
  ).join('');
}

/* 班級下拉建議：一年一班 ~ 六年十班 */
function classOptionsHTML() {
  const g = ['一', '二', '三', '四', '五', '六'];
  const n = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const out = [];
  g.forEach((a) => n.forEach((b) => out.push(`<option value="${a}年${b}班"></option>`)));
  return out.join('');
}
