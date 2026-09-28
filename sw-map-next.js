// SustainWater hub: UK water testing map: your next step. Wix custom element.
// Tag name: sw-map-next  |  Source: public/custom-elements/sw-map-next.js
// Built 27 Sep 2026 from hub_build (hub-kit + content/mapnext.js). Do not edit by hand: rebuild instead.
(function () {
'use strict';
/* SustainWater hub kit: shared renderer and behaviours for every hub custom element.
   Content comes from a per-hub content object (see content/*.js). Output is plain HTML in a
   shadow root, so search engines that render JavaScript (Google) see the full page, and page
   code sets the same words as SEO markup for the rest. */

const ICON = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  rain: '<path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4 4 0 1 1 17 15z"/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17v.5"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  box: '<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  circleCheck: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>'
};
const icon = (name, sw = 1.8) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name] || ''}</svg>`;

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SHOP = /^\/(product-page|category)\//;
const isShop = (href) => SHOP.test(href || '');
/* Shop links open a new tab (keeps the guide open); every other link stays in the same tab. */
const a = (href, inner, cls = '', extra = '') => `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''}${isShop(href) ? ' target="_blank" rel="noopener"' : ''}${extra ? ' ' + extra : ''}>${inner}</a>`;
const btn = (href, label, kind = 'primary', arrow = false, extra = '') => a(href, `${esc(label)}${arrow ? icon('arrow', 2) : ''}`, `btn btn--${kind}`, extra);
/* Source chip: small linked label after a sourced statement. */
const src = (label, url) => `<a class="src" href="${esc(url)}" target="_blank" rel="noopener">${icon('doc', 2)}${esc(label)}</a>`;
/* Member actions (email me this, reminders). Hidden until page code sets the host attribute "members";
   clicking one sends a "sw-member-action" event that page code answers with the sign-up flow. */
const memberBtn = (action, label, kind = 'secondary') => `<button type="button" class="btn btn--${kind} btn--sm member-only" data-member="${action}">${esc(label)}</button>`;
const money = (n) => '£' + (Number.isInteger(n) ? String(n) : n.toFixed(2));

function priceHtml(p, big) {
  if (!p) return '';
  const was = p.was ? `<span class="was" data-was="${p.key}">${money(p.was)}</span>` : '';
  return `<span>${was}<span class="price" data-price="${p.key}">${money(p.price)}</span></span>`;
}

/* ---------- section renderers ---------- */
function rAlert(c) {
  if (!c) return '';
  return `<div class="alert" role="note"><div class="wrap">${icon(c.icon || 'rain')}<span>${c.html}</span>${c.link ? (c.link.go ? `<button type="button" class="linkbtn" data-go="${c.link.go}">${esc(c.link.label)}</button>` : a(c.link.href, esc(c.link.label))) : ''}</div></div>`;
}

function rHero(h, P) {
  const crumbs = h.crumbs.map((x, i) => i === h.crumbs.length - 1 ? `<span aria-current="page">${esc(x.label)}</span>` : `${a(x.href, esc(x.label))}<span aria-hidden="true">›</span>`).join(' ');
  const kit = P[h.floatKit];
  return `<header class="hero"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
  <div class="hero-grid">
    <div class="hero-copy">
      <span class="pill">${esc(h.pill)}</span>
      <h1 class="h1">${h.h1}</h1>
      <p class="lead">${h.answer}</p>
      <div class="meta-row">${h.sources.map(s => src(s[0], s[1])).join('')}<span class="checked">${icon('cal', 2)}Last checked ${esc(h.checked)}</span></div>
      <div class="btn-row">${btn(kit.url, `Get the ${kit.short} · ${money(kit.price)}`, 'primary', true, `data-price-label="${kit.key}"`)}<button class="btn btn--secondary" type="button" data-go="${h.secondary.target}">${esc(h.secondary.label)}</button></div>
      <ul class="ticks">${h.ticks.map(t => `<li>${icon('check', 2.2)}${esc(t)}</li>`).join('')}</ul>
    </div>
    <div class="fig-panel">
      <span class="fig-label">${esc(h.figure.label)}</span>
      <div class="fig">${h.figure.svg}${h.figure.hotspots.map(s => `<button class="hot" type="button" style="left:${s.x}%;top:${s.y}%" data-hot="${s.n}" aria-label="${esc(s.label)}">${s.n}</button>`).join('')}</div>
      <div class="float float--tr"><div class="k">${esc(h.floatNote.k)}</div><div class="v">${esc(h.floatNote.v)}</div></div>
      ${a(kit.url, `<div><div class="k">${esc(h.floatKitLabel)}</div><div class="v" style="color:var(--ink)">${esc(kit.short)} · ${esc(kit.tests)}</div></div><span class="price" data-price="${kit.key}">${money(kit.price)}</span>`, 'float float--bl')}
    </div>
  </div></div></header>`;
}

function rJump(items, P, kitKey) {
  const kit = P[kitKey];
  return `<nav class="jump" aria-label="On this page"><div class="wrap"><span class="lbl">On this page</span>${items.map((x, i) => `<button class="j" type="button" data-go="${x[0]}"${i === 0 ? ' aria-current="true"' : ''}>${esc(x[1])}</button>`).join('')}${btn(kit.url, `${kit.short} · ${money(kit.price)}`, 'primary btn--sm', false, `data-price-label="${kit.key}"`)}</div></nav>`;
}

function rKit(k, P, hero) {
  const p = P[k.key];
  const tags = (hero ? (k.tags || p.contents) : [k.tag || p.tests]).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  return `${a(p.url, `
    ${hero ? `<span class="kit-badge">${esc(k.badge)}</span>` : ''}
    <div class="kit-img"><span class="fig-label">${esc(k.fig)}</span>${k.svg}</div>
    <div class="kit-body">
      <h3 class="h3">${esc(p.name)}</h3>
      <p>${esc(k.chooseIf)}</p>
      <div class="tags">${tags}</div>
      ${hero && k.note ? `<p style="font-size:13px;color:rgba(255,255,255,.78)">${esc(k.note)}</p>` : ''}
      <div class="kit-foot">${priceHtml(p, hero)}<span class="${hero ? 'btn btn--white btn--sm' : 'go'}">${hero ? 'View kit' : 'View kit'}${icon('arrow', 2)}</span></div>
    </div>`, `kit${hero ? ' kit--hero' : ''}`)}`;
}

function rLadder(L, P) {
  return `<section class="sect sect--paper" id="kits" aria-labelledby="kits-h"><div class="wrap">
  <div class="sect-head"><div><p class="eyebrow">${esc(L.eyebrow)}</p><h2 class="h2" id="kits-h">${esc(L.title)}</h2></div>${a(L.compare.href, `${esc(L.compare.label)} ${icon('arrow', 2)}`, 'go', 'style="font-weight:600;display:inline-flex;gap:8px;align-items:center"')}</div>
  <div class="ladder">${L.kits.map((k, i) => rKit(k, P, i === 0)).join('')}</div>
  <div class="infobar"><span class="ico">${icon('flask', 2)}</span><span>${L.limits}</span><button class="linkbtn" type="button" data-go="${L.limitsTarget}" style="margin-left:auto;color:var(--accent)">${esc(L.limitsLabel || 'What to test ↓')}</button></div>
  </div></section>`;
}

/* One "Is this you?" card: jumps within the page (go), or links (href; ext opens a new tab). */
function sitCard(s) {
  const cls = s.style === 'pop' ? 'sit sit--pop' : s.style === 'ink' ? 'sit sit--ink' : 'sit';
  const inner = `${s.flag ? `<span class="flag">${esc(s.flag)}</span>` : ''}<span class="ic">${icon(s.icon)}</span><span class="t">${esc(s.title)}</span><span class="b">${esc(s.body)}</span><span class="cta">${esc(s.cta)} ${s.ext ? '↗' : '→'}</span>`;
  if (s.go) return `<button type="button" class="${cls}" data-go="${s.go}">${inner}</button>`;
  return a(s.href, inner, cls, s.ext ? 'target="_blank" rel="noopener"' : '');
}

function rSits(S) {
  return `<section class="sect" id="${S.id || 'situations'}" aria-labelledby="sits-h"><div class="wrap">
  <div class="sect-head"><div><p class="eyebrow">${esc(S.eyebrow || 'Is this you?')}</p><h2 class="h2" id="sits-h">${esc(S.title)}</h2></div><p>${esc(S.intro)}</p></div>
  <div class="sits">${S.cards.map(sitCard).join('')}</div></div></section>`;
}

function rTool(T) {
  return `<section class="sect sect--band" id="tool" aria-labelledby="tool-h"><div class="wrap"><div class="tool-grid">
  <div class="tool-copy"><p class="eyebrow">${esc(T.eyebrow)}</p><h2 class="h2" id="tool-h">${esc(T.title)}</h2><p>${esc(T.intro)}</p><p style="font-size:13px;color:rgba(255,255,255,.72)">${esc(T.small)}</p></div>
  <div class="tool-card" data-tool="${T.id}" aria-live="polite"></div>
  </div></div></section>`;
}

function rChapters(C, P) {
  const rail = `<nav class="rail" aria-label="The full guide"><span class="lbl">The full guide</span>${C.list.map((ch, i) => `<button type="button" data-go="${ch.id}"${i === 0 ? ' aria-current="true"' : ''}>${String(i + 1).padStart(2, '0')} · ${esc(ch.nav)}</button>`).join('')}
  </nav>`;
  const open = C.list.filter(ch => !ch.collapsed);
  const closed = C.list.filter(ch => ch.collapsed);
  const body = open.map((ch) => `<section class="chap" id="${ch.id}" aria-labelledby="${ch.id}-h"><span class="num">${String(C.list.indexOf(ch) + 1).padStart(2, '0')}</span><h2 class="h2" id="${ch.id}-h">${ch.title}</h2>${ch.html}</section>`).join('');
  const acc = closed.length ? `<div class="acc-list">${closed.map(ch => `<details class="acc chap" id="${ch.id}"><summary><span><span class="n">${String(C.list.indexOf(ch) + 1).padStart(2, '0')}</span>${esc(ch.nav)}</span></summary><div class="acc-body">${ch.html}</div></details>`).join('')}</div>` : '';
  return `<section class="sect" id="guide" aria-label="The full guide"><div class="wrap"><div class="chap-grid">${rail}<div class="chapters">${body}${acc}</div></div></div></section>`;
}

function rMap(M) {
  const pins = [];
  return `<section class="sect sect--paper" id="near-you" aria-labelledby="map-h"><div class="wrap"><div class="map-grid">
  <div style="display:flex;flex-direction:column;gap:16px">
    <p class="eyebrow" style="margin:0">${esc(M.eyebrow)}</p><h2 class="h2" id="map-h">${esc(M.title)}</h2>
    <p class="read">${esc(M.intro)}</p>
    ${M.formAt ? `<div class="pc-result" data-area-summary>${esc(M.summaryEmpty || 'Check your postcode once and your area summary appears here.')}</div><div class="btn-row"><button type="button" class="btn btn--primary" data-go="${M.formAt}">${esc(M.formAtLabel || 'Check my postcode')}</button></div>` : `<form class="pc-form" data-pc="map" novalidate><label style="position:absolute;left:-9999px" for="pc-map">Postcode</label><input id="pc-map" name="pc" autocomplete="postal-code" placeholder="e.g. SY23 or SY23 1AB" maxlength="8"><button class="btn btn--primary" type="submit">Check</button></form>
    <div class="pc-result" data-pc-out="map" hidden></div>`}
    <div class="btn-row">${btn(M.mapUrl, 'Open the UK testing map', 'secondary', true)}${btn(M.uploadUrl, 'Add my result', 'secondary')}</div>
    <p class="note">${icon('info', 2)}<span>${esc(M.note)}</span></p>
  </div>
  ${a(M.mapUrl, `<svg viewBox="0 0 620 380" preserveAspectRatio="none" aria-hidden="true"><g stroke="#ECEFEA"><path d="M0 60H620M0 130H620M0 200H620M0 270H620M0 340H620M80 0V380M190 0V380M300 0V380M410 0V380M520 0V380"/></g><path d="M120 250 C180 190 260 230 320 170 S450 120 560 150" stroke="#0057E1" stroke-opacity=".18" stroke-width="30" fill="none" stroke-linecap="round"/></svg><div class="chips"><span class="on">${esc(M.chipOn)}</span><span>${esc(M.chipOff)}</span></div>${pins.map(p => `<span class="pin${p[2] ? ' w' : ''}" style="left:${p[0]}%;top:${p[1]}%"></span>`).join('')}`, 'map-art', `aria-label="Open the UK water testing map"`)}
  </div></div></section>`;
}

function rFaq(F) {
  return `<section class="sect" id="faq" aria-labelledby="faq-h"><div class="wrap"><div class="faq-grid">
  <div style="display:flex;flex-direction:column;gap:14px"><p class="eyebrow" style="margin:0">Questions people ask</p><h2 class="h2" id="faq-h">${esc(F.title)}</h2><p class="small" style="font-size:15px">${esc(F.intro)}</p></div>
  <div class="faq acc-list">${F.items.map((q, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(q.q)}</summary><div class="acc-body">${q.a}</div></details>`).join('')}</div>
  </div></div></section>`;
}

function rReads(R, sources, checked) {
  const card = (r) => a(r.href, `<span class="im">${r.svg}</span><span class="tt">${esc(r.title)}</span>`, 'read-card');
  return `<section class="sect" style="padding-top:0" aria-labelledby="reads-h"><div class="wrap" style="display:flex;flex-direction:column;gap:28px">
  <div class="sect-head" style="margin:0"><h2 class="h3" id="reads-h" style="font-size:28px">Keep reading</h2>${a('/blog', 'All guidance →', '', 'style="font-weight:600"')}</div>
  <div class="reads">${R.map(card).join('')}</div>
  <details class="acc sources" style="border:1px solid var(--line);border-radius:14px;padding:0 20px"><summary><span style="display:inline-flex;gap:10px;align-items:center;text-align:left">${icon('doc', 1.8)}<span>Sources and how we write these pages · ${sources.length} sources · last checked ${esc(checked)}</span></span></summary><div class="acc-body">
    <ul>${sources.map(s => `<li>${a(s[1], esc(s[0]), '', 'target="_blank" rel="noopener"')}<span>checked ${esc(s[2] || checked)}</span></li>`).join('')}</ul>
    <p class="small" style="font-size:13px;background:var(--paper);border-radius:12px;padding:14px;margin:0"><b style="color:var(--ink)">How we write these pages.</b> Health and safety lines are quoted word for word from the source and linked, with the date we last checked them. Home screening is a first check, not lab certification. Last reviewed ${esc(checked)}.</p>
  </div></details>
  </div></section>`;
}

function rRouting(R, P) {
  const kit = P[R.kit];
  return `<section class="sect sect--ink" id="next" aria-labelledby="next-h"><div class="wrap">
  <div class="sect-head"><div><p class="eyebrow">Where to next?</p><h2 class="h2" id="next-h" style="max-width:820px;color:#fff">${esc(R.title)}</h2></div></div>
  <div class="routes">
    <div class="route route--kit"><span class="k">${esc(R.kitLabel)}</span><span class="t">${esc(kit.name)}</span><p>${esc(kit.tests)} · ${esc(R.kitNote)}</p><div class="kit-foot" style="margin-top:auto">${priceHtml(kit, true)}${btn(kit.url, 'View kit', 'white btn--sm')}</div></div>
    <div class="route"><span class="k">Not sure which test?</span><span class="t">${esc(R.choose.title)}</span><p>${esc(R.choose.body)}</p><div class="btn-row">${R.choose.buttons.map((b, i) => b.go ? `<button type="button" class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'} btn--sm" data-go="${b.go}">${esc(b.label)}</button>` : btn(b.href, b.label, i === 0 ? 'primary btn--sm' : 'ghost btn--sm')).join('')}</div></div>
    <div class="route"><span class="k">Your area</span><span class="t">What we know near you</span><div class="pc-result" data-area-summary>${R.areaEmpty || 'Check your postcode once in <b>Near you</b> and your area summary appears here.'}</div><div class="btn-row"><button type="button" class="btn btn--primary btn--sm" data-go="${esc(R.areaGo || 'near-you')}">Check my postcode</button>${btn(R.mapUrl, 'Open the map', 'ghost btn--sm')}</div><span class="small">${esc(R.mapNote)}</span></div>
    <div class="route"><span class="k">Already tested?</span><span class="t">${esc(R.result.title || 'Understand your result')}</span><p>${esc(R.result.body)}</p><div class="btn-row">${btn(R.result.decoder, R.result.decoderLabel || 'Result Centre', 'white btn--sm')}${btn(R.result.upload, 'Add my result', 'ghost btn--sm')}</div></div>
    <div class="route"><span class="k">Related guides</span><span class="t">Other water concerns</span><div class="chipset">${R.related.map(r => a(r[1], esc(r[0]))).join('')}</div></div>
    <div class="route"><span class="k">Stay informed</span><span class="t">Results alerts for your area</span><p>${esc(R.updates.body)}</p><div class="btn-row">${btn(R.updates.href, R.updates.label, 'white btn--sm', true)}</div></div>
  </div>
  <ul class="route-ticks">${R.ticks.map(t => `<li>✓ ${esc(t)}</li>`).join('')}</ul>
  </div></section>`;
}

function rBuybar(P, key) {
  const k = P[key];
  return `<div class="buybar" aria-hidden="true"><div><div class="n">${esc(k.short)}</div><div class="p">${esc(k.tests)} · <b style="color:var(--deep)" data-price="${key}">${money(k.price)}</b></div></div>${btn(k.url, 'View kit', 'primary btn--sm')}</div>`;
}

function renderHub(c) {
  const P = c.products;
  /* section order can be changed per hub (e.g. tool first on the Result Centre) */
  const S = {
    ladder: () => rLadder(c.ladder, P), situations: () => rSits(c.situations), tool: () => rTool(c.tool),
    chapters: () => rChapters(c.chapters, P), map: () => rMap(c.map), faq: () => rFaq(c.faq),
    reads: () => rReads(c.reads, c.sources, c.checked), routing: () => rRouting(c.routing, P)
  };
  const order = c.order || ['ladder', 'situations', 'tool', 'chapters', 'map', 'faq', 'reads', 'routing'];
  return `<div class="page">
  ${rAlert(c.alert)}
  ${rHero(c.hero, P)}
  ${rJump(c.jump, P, c.hero.floatKit)}
  ${order.map(k => S[k]()).join('\n  ')}
  ${rBuybar(P, c.hero.floatKit)}
  </div>`;
}

/* ---------- postcode housing age (same data and wording as the UK testing map) ---------- */
const HOUSING_CSV = 'https://raw.githubusercontent.com/SWMAP/Map/main/data/csv/property_age_by_district.csv';
let housingPromise = null;
function loadHousing() {
  if (!housingPromise) {
    housingPromise = fetch(HOUSING_CSV).then(r => { if (!r.ok) throw new Error('csv ' + r.status); return r.text(); }).then(t => {
      const map = new Map();
      const lines = t.trim().split(/\r?\n/);
      const head = lines.shift().split(',');
      const iD = head.indexOf('postcode_district');
      const iP = head.findIndex(h => /percentage/.test(h));
      for (const line of lines) { const f = line.split(','); if (f[iD]) map.set(f[iD].trim().toUpperCase(), parseFloat(f[iP])); }
      return map;
    }).catch(err => { housingPromise = null; throw err; });
  }
  return housingPromise;
}
function districtOf(raw) {
  const s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const full = s.match(/^([A-Z]{1,2}[0-9][A-Z0-9]?)([0-9][A-Z]{2})$/);
  if (full) return full[1];
  if (/^[A-Z]{1,2}[0-9][A-Z0-9]?$/.test(s)) return s;
  return null;
}
const HOUSING_TEMPLATE = 'Approximately --% of Energy Performance Certificate records in this postcode district relate to properties built before 1967.';

/* District facts: one small file built from the same public data as the UK testing map (housing age, water company,
   DWI hardness and fluoride areas), one row per postcode district, taken at the centre of the district. */
const FACTS_URL = 'https://cdn.jsdelivr.net/gh/benaled/sustainwater-elements@main/data/district-facts.json';
let factsPromise = null;
function loadFacts() {
  if (!factsPromise) {
    factsPromise = fetch(FACTS_URL).then(r => { if (!r.ok) throw new Error('facts ' + r.status); return r.json(); })
      .catch(err => { factsPromise = null; throw err; });
  }
  return factsPromise;
}
/* Labels as the UK testing map words them; ranges from the DWI overlays. */
const HARDNESS = { soft: ['Soft water area', '0-50 mg/l CaCO3'], moderately_soft: ['Moderately soft water area', '51-100 mg/l CaCO3'], slightly_hard: ['Slightly hard water area', '101-150 mg/l CaCO3'], moderately_hard: ['Moderately hard water area', '151-200 mg/l CaCO3'], hard: ['Hard water area', '201-300 mg/l CaCO3'], very_hard: ['Very hard water area', 'Over 300 mg/l CaCO3'], no_public_supply: ['No public water supply', 'N/A'] };
const FLUORIDE = { low: ['Low fluoride area', '0 to 0.49 mg/l'], moderate: ['Moderate fluoride area', '0.5 to 0.99 mg/l'], high: ['High fluoride area', '1 to 1.5 mg/l'] };
const SCOTLAND = /^(AB|DD|DG|EH|FK|G|HS|IV|KA|KW|KY|ML|PA|PH|TD|ZE)[0-9]/;

/* Everything we know about a postcode district. Never throws: missing data just means fewer lines. */
async function areaFacts(raw) {
  const d = districtOf(raw);
  if (!d) return { ok: false, html: 'Enter a UK postcode or postcode district, for example SY23.' };
  const f = { ok: true, district: d, pct: null, company: null, hardness: null, fluoride: null, nation: null };
  let row = null, facts = null;
  try { facts = await loadFacts(); row = facts.rows[d] || null; } catch (e) { /* fall back to the housing file */ }
  if (row) {
    const [pct, ci, fl, fa, hd, nat] = row;
    f.pct = pct; f.nation = nat || null;
    if (ci != null && facts.companies[ci]) f.company = { name: facts.companies[ci][0], url: facts.companies[ci][1] || null };
    if (hd != null && HARDNESS[facts.hardness[hd]]) f.hardness = HARDNESS[facts.hardness[hd]];
    if (fl != null && FLUORIDE[facts.fluoride[fl]]) f.fluoride = { label: FLUORIDE[facts.fluoride[fl]][0], range: FLUORIDE[facts.fluoride[fl]][1], artificial: fa === 1 };
  } else {
    try { const v = (await loadHousing()).get(d); if (v != null && Number.isFinite(v)) f.pct = v; } catch (e) { if (!facts) f.offline = true; }
  }
  if (!f.nation) f.nation = /^BT[0-9]/.test(d) ? 'N' : SCOTLAND.test(d) ? 'S' : null;
  if (!f.company && f.nation === 'S') f.company = { name: 'Scottish Water', url: null };
  if (!f.company && f.nation === 'N') f.company = { name: 'NI Water', url: null };
  f.housingText = f.pct != null ? HOUSING_TEMPLATE.replace('--', Number(f.pct).toFixed(1)) : null;
  return f;
}

/* The "Your area" report. fields: which lines this hub shows, in its order. */
function areaHtml(f, fields) {
  if (!f.ok) return f.html;
  if (f.offline) return 'Area data is unavailable right now. Try the UK testing map instead.';
  const ext = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  const line = {
    housing: () => f.housingText ? ['Housing age', esc(f.housingText)] : ['Housing age', 'No estimate for this district. The data covers England and Wales.'],
    company: () => f.company ? ['Water company', `${esc(f.company.name)}${f.company.url ? ' · ' + ext(f.company.url, 'Check your water quality ↗') : ''}`] : null,
    hardness: () => f.hardness ? ['Hardness', `${esc(f.hardness[0])} (${esc(f.hardness[1])})`] : null,
    fluoride: () => f.fluoride ? ['Fluoride', `${esc(f.fluoride.label)} (${esc(f.fluoride.range)}). ${f.fluoride.artificial ? 'This area is artificially fluoridated.' : 'This area reflects naturally occurring fluoride levels.'}`] : null
  };
  const rows = (fields || ['housing', 'company', 'hardness', 'fluoride']).map(k => line[k] && line[k]()).filter(Boolean);
  return `<b>Your area: ${esc(f.district)}</b><ul class="area-list">${rows.map(r => `<li><span class="k">${r[0]}</span><span>${r[1]}</span></li>`).join('')}</ul><span class="area-note">Approximate, for the centre of ${esc(f.district)}, from public data. Your water company’s checker has the official figures for your address.</span>`;
}

/* One postcode lookup for the whole page: fills the result box it was asked from, every area summary,
   remembers the district, and tells page code (for alerts sign-up in step 3). */
async function runPostcode(root, c, raw, out) {
  const r = await areaFacts(raw);
  r.html = areaHtml(r, c.map.area);
  const q = r.district ? '?postcode=' + encodeURIComponent(r.district) : '';
  const next = r.district && c.map.mapUrl ? `<span class="pc-next">${a(c.map.mapUrl + q, 'See results on the UK testing map →')}${c.map.alertsUrl ? a(c.map.alertsUrl + q, 'Get alerts for ' + esc(r.district) + ' →') : ''}</span>` : '';
  if (out) out.innerHTML = r.html + next;
  root.querySelectorAll('[data-area-summary]').forEach(el => { el.innerHTML = r.html; });
  if (r.district) root.host._district = r.district;
  if (typeof c.onArea === 'function') c.onArea(root, r);
  root.dispatchEvent(new CustomEvent('sw-postcode', { bubbles: true, composed: true, detail: { district: r.district || null, nation: r.nation || null, company: r.company ? r.company.name : null } }));
  return r;
}

/* ---------- behaviours ---------- */
function wire(root, c) {
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const go = (id) => {
    const el = root.getElementById(id);
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go]');
    if (t) { e.preventDefault(); go(t.getAttribute('data-go')); return; }
    const h = e.target.closest('[data-hot]');
    if (h) {
      const n = h.getAttribute('data-hot');
      const p = root.getElementById('point-' + n);
      if (p) {
        $$('.point').forEach(x => x.classList.remove('is-lit'));
        p.classList.add('is-lit');
        p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
  // tabs
  $$('[role="tablist"]').forEach(list => {
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    const select = (tab) => {
      tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; const p = root.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; select(n); n.focus(); } });
    });
  });
  // postcode forms
  $$('form[data-pc]').forEach(f => {
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const out = root.querySelector(`[data-pc-out="${f.getAttribute('data-pc')}"]`);
      out.hidden = false; out.textContent = 'Checking…';
      await runPostcode(root, c, f.pc.value, out);
    });
  });
  // member actions: page code answers with the sign-up flow (step 3)
  root.addEventListener('click', (e) => {
    const m = e.target.closest('[data-member]');
    if (!m) return;
    const tool = m.closest('[data-tool]');
    root.dispatchEvent(new CustomEvent('sw-member-action', { bubbles: true, composed: true, detail: { action: m.getAttribute('data-member'), hub: root.host.localName, district: root.host._district || null, text: tool && tool._planText ? tool._planText : null } }));
  });
  // scroll-linked states
  if ('IntersectionObserver' in window) {
    const railBtns = $$('.rail button');
    const chapObs = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) railBtns.forEach(b => b.setAttribute('aria-current', b.getAttribute('data-go') === en.target.id)); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.chap').forEach(ch => chapObs.observe(ch));
    const jumpBtns = $$('.jump .j');
    const sectObs = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) jumpBtns.forEach(b => b.setAttribute('aria-current', b.getAttribute('data-go') === en.target.id)); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    jumpBtns.forEach(b => { const s = root.getElementById(b.getAttribute('data-go')); if (s) sectObs.observe(s); });
    const bar = $('.buybar');
    const hero = $('.hero');
    const next = root.getElementById('next');
    let heroGone = false, nextIn = false;
    const upd = () => bar && bar.classList.toggle('show', heroGone && !nextIn);
    if (hero) new IntersectionObserver(([en]) => { heroGone = !en.isIntersecting; upd(); }).observe(hero);
    if (next) new IntersectionObserver(([en]) => { nextIn = en.isIntersecting; upd(); }).observe(next);
  }
  // tools
  $$('[data-tool]').forEach(el => { const t = TOOLS[el.getAttribute('data-tool')]; if (t) t(el, c); });
}

/* ---------- live prices from page code (attribute "prices": {"complete": {"price": 45, "was": 55}, ...}) ---------- */
function applyPrices(root, prices) {
  if (!prices) return;
  root.querySelectorAll('[data-tool]').forEach(t => { t._prices = prices; });
  Object.keys(prices).forEach(key => {
    const p = prices[key];
    if (!p || !Number.isFinite(p.price)) return;
    root.querySelectorAll(`[data-price="${key}"]`).forEach(el => { el.textContent = money(p.price); });
    root.querySelectorAll(`[data-was="${key}"]`).forEach(el => { if (p.was && p.was > p.price) { el.textContent = money(p.was); el.hidden = false; } else { el.hidden = true; } });
    root.querySelectorAll(`[data-price-label="${key}"]`).forEach(el => { el.innerHTML = el.innerHTML.replace(/£[0-9]+(\.[0-9]{2})?/, money(p.price)); });
  });
}

const TOOLS = {};

/* Shared tap-through tool (planner, risk checks, finders, decoders). Runs in the browser; answers are not stored or sent.
   cfg: { id, name, steps: [{ q, o: [options], hint?, postcode? }], result(ans, ctx) -> { title, band?, rows, extra?, kit, lines },
          resultMeta, footnote, copyLabel, memberLabel }
   A step with postcode: true shows the page's one postcode box (housing-age estimate), and can be skipped. */
function quiz(el, c, cfg) {
  const P = c.products;
  const root = el.getRootNode();
  const Q = cfg.steps;
  const qid = cfg.id + '-q';
  let step = 0;
  const ans = {};
  const ctx = { housing: null };

  function renderQ() {
    const raw = Q[step];
    /* a step's question and options can depend on earlier answers */
    const cur = { ...raw, q: typeof raw.q === 'function' ? raw.q(ans) : raw.q, o: typeof raw.o === 'function' ? raw.o(ans) : raw.o, hint: typeof raw.hint === 'function' ? raw.hint(ans) : raw.hint };
    const chosen = ans[step];
    const shown = Q.map((_, i) => i).filter(i => !skipped(i));
    const head = `<div class="step-meta"><span>Step ${shown.indexOf(step) + 1} of ${shown.length}</span><span>${esc(cfg.name)}</span></div>
      <div class="progress" aria-hidden="true"><i style="width:${Math.round((shown.indexOf(step) / shown.length) * 100)}%"></i></div>
      <h3 class="q-title" id="${qid}" tabindex="-1">${esc(cur.q)}</h3>${cur.hint ? `<p class="small" style="margin:0">${cur.hint}</p>` : ''}`;
    if (cur.postcode) {
      el.innerHTML = `${head}
      <form class="pc-form" data-pc-tool novalidate><label style="position:absolute;left:-9999px" for="${cfg.id}-pc">Postcode</label><input id="${cfg.id}-pc" name="pc" autocomplete="postal-code" placeholder="e.g. SY23 or SY23 1AB" maxlength="8" value="${esc(ctx.raw || '')}"><button class="btn btn--primary" type="submit">Check</button></form>
      <div class="pc-result" data-pc-out="tool"${ctx.housing ? '' : ' hidden'}>${ctx.housing ? ctx.housing.html : ''}</div>
      <div class="tool-nav"><button type="button" class="linkbtn" data-act="skip">Skip this step</button><button type="button" class="btn btn--primary btn--sm" data-act="next"${ctx.housing ? '' : ' disabled'}>Next</button></div>`;
      return;
    }
    el.innerHTML = `${head}
      <div class="opts" role="group" aria-labelledby="${qid}">${cur.o.map((o, i) => `<button type="button" class="opt" data-opt="${i}" aria-pressed="${chosen === i}">${esc(o)}</button>`).join('')}</div>
      <div class="tool-nav">${step > 0 ? '<button type="button" class="linkbtn" data-act="back">← Back</button>' : '<span></span>'}<button type="button" class="btn btn--primary btn--sm" data-act="next"${chosen === undefined ? ' disabled' : ''}>${step === Q.length - 1 ? esc(cfg.finalLabel || 'See my result') : 'Next'}</button></div>`;
  }

  function renderResult() {
    const r = cfg.result(ans, ctx);
    const k = r.kit ? P[r.kit] : null;
    el.innerHTML = `
      <div class="step-meta"><span>${esc(cfg.resultMeta)}</span><span>${esc(cfg.name)}</span></div>
      <div class="progress" aria-hidden="true"><i style="width:100%"></i></div>
      ${r.band ? `<span class="band band--${r.band[0]}" style="align-self:flex-start">${icon(r.band[0] === 'clear' ? 'circleCheck' : r.band[0] === 'check' ? 'info' : 'alert', 2)}${esc(r.band[1])}</span>` : ''}
      <h3 class="q-title" id="${qid}" tabindex="-1">${esc(r.title)}</h3>
      <div class="plan">${r.rows.map(x => `<div class="plan-row${x[2] ? ' ' + x[2] : ''}"><span class="when">${esc(x[0])}</span><span>${x[1]}</span></div>`).join('')}</div>
      ${r.extra || ''}
      ${k ? a(k.url, `<div><div class="n">${esc(k.name)}</div><div class="p">${esc(k.tests)}</div></div><span class="price" data-price="${k.key}">${money(k.price)}</span>${icon('arrow', 2)}`, 'plan-kit') : ''}
      <p class="small" style="margin:0">${esc(cfg.footnote)}</p>
      <div class="tool-nav"><button type="button" class="linkbtn" data-act="restart">Start again</button><span class="btn-row" style="gap:8px">${memberBtn('email-result', cfg.memberLabel || 'Email me this')}<button type="button" class="btn btn--secondary btn--sm member-off" data-act="copy">${esc(cfg.copyLabel || 'Copy my result')}</button></span></div>`;
    const strip = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.replace(/\s+/g, ' ').trim(); };
    el._planText = [cfg.textTitle || cfg.name].concat(r.lines || r.rows.map(x => x[0] + ': ' + strip(x[1]))).concat(k ? ['Kit: ' + k.name + ' ' + location.origin + k.url] : []).join('\n');
    if (el._prices) applyPrices(el, el._prices);
  }

  /* a step with skip(ans, ctx) returning true is passed over (e.g. the nation question when the postcode answered it) */
  const skipped = (i) => Q[i] && typeof Q[i].skip === 'function' && Q[i].skip(ans, ctx);
  function render(focus, dir = 1) {
    while (step < Q.length && step >= 0 && skipped(step)) step += dir;
    if (step < 0) step = 0;
    if (step >= Q.length) renderResult(); else renderQ();
    if (focus) { const h = el.querySelector('#' + qid); if (h) h.focus({ preventScroll: true }); }
  }

  /* a postcode from the page address (?postcode=SY23) fills the tool's postcode step */
  if (Q.some(x => x.postcode)) el._prefillPostcode = async (raw) => {
    ctx.raw = raw;
    const r = await runPostcode(root, c, raw, null);
    ctx.housing = r.ok ? r : null;
    if (step === 0) render(false);
  };
  el.addEventListener('submit', async (e) => {
    const f = e.target.closest('form[data-pc-tool]');
    if (!f) return;
    e.preventDefault();
    const out = el.querySelector('[data-pc-out="tool"]');
    out.hidden = false; out.textContent = 'Checking…';
    ctx.raw = f.pc.value;
    const r = await runPostcode(root, c, f.pc.value, out);
    ctx.housing = r.ok ? r : null;
    const nx = el.querySelector('[data-act="next"]'); if (nx && ctx.housing) nx.disabled = false;
  });
  el.addEventListener('click', (e) => {
    const o = e.target.closest('[data-opt]');
    if (o) {
      ans[step] = Number(o.getAttribute('data-opt'));
      el.querySelectorAll('[data-opt]').forEach(b => b.setAttribute('aria-pressed', b === o));
      const nx = el.querySelector('[data-act="next"]'); if (nx) nx.disabled = false;
      clearTimeout(el._t);
      el._t = setTimeout(() => { step++; render(true); }, 220);
      return;
    }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const w = act.getAttribute('data-act');
    if (w === 'next' && (Q[step].postcode || ans[step] !== undefined)) { clearTimeout(el._t); step++; render(true); }
    if (w === 'skip') { ctx.housing = null; step++; render(true); }
    if (w === 'back') { clearTimeout(el._t); step = Math.max(0, step - 1); render(true, -1); }
    if (w === 'back' || w === 'restart') { /* later answers may no longer fit changed options */ Object.keys(ans).forEach(k => { if (Number(k) > step) delete ans[k]; }); }
    if (w === 'restart') { step = 0; Object.keys(ans).forEach(k => delete ans[k]); render(true); }
    if (w === 'copy') {
      const label = act.textContent;
      const done = () => { act.textContent = 'Copied'; setTimeout(() => { act.textContent = label; }, 1800); };
      const fallback = () => { const t = document.createElement('textarea'); t.value = el._planText; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (err) { /* ignore */ } t.remove(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el._planText).then(done, fallback); else fallback();
    }
  });
  render(false);
}

/* Links from other pages can carry ?postcode=SY23 (fills the area report) and ?go=tool (scrolls to a section). */
function fromUrl(root, c) {
  let q;
  try { q = new URLSearchParams(location.search); } catch (e) { return; }
  const raw = q.get('postcode');
  if (raw && districtOf(raw)) {
    const tool = Array.from(root.querySelectorAll('[data-tool]')).find(t => t._prefillPostcode);
    if (tool) tool._prefillPostcode(raw);
    else {
      const f = root.querySelector('form[data-pc]');
      if (f) { f.pc.value = raw; const out = root.querySelector(`[data-pc-out="${f.getAttribute('data-pc')}"]`); if (out) out.hidden = false; runPostcode(root, c, raw, out); }
      else runPostcode(root, c, raw, null);
    }
  }
  const go = q.get('go');
  if (go && /^[a-z0-9-]+$/.test(go)) {
    const el = root.getElementById(go);
    if (el) setTimeout(() => { if (el.tagName === 'DETAILS') el.open = true; el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
  }
}

/* opts: render (page renderer), attrs (extra attributes to watch), onAttr(name, value, root) */
function defineHub(tag, content, css, opts = {}) {
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
  const render = opts.render || renderHub;
  class SwHub extends HTMLElement {
    static get observedAttributes() { return ['prices'].concat(opts.attrs || []); }
    connectedCallback() {
      if (this.shadowRoot) return;
      if (!document.querySelector('link[data-sw-fonts]')) {
        const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_URL; l.setAttribute('data-sw-fonts', ''); document.head.appendChild(l);
      }
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${css}</style>${render(content)}`;
      wire(root, content);
      this._ready = true;
      this.constructor.observedAttributes.forEach(n => { if (this.getAttribute(n) != null) this.attributeChangedCallback(n, null, this.getAttribute(n)); });
      fromUrl(root, content);
    }
    attributeChangedCallback(name, _old, val) {
      if (!this._ready || val == null) return;
      if (name === 'prices') { try { applyPrices(this.shadowRoot, JSON.parse(val)); } catch (e) { /* keep the built-in prices */ } return; }
      if (opts.onAttr) opts.onAttr(name, val, this.shadowRoot);
    }
  }
  if (!customElements.get(tag)) customElements.define(tag, SwHub);
}

/* Shared content helpers for every hub: quote helpers, table helpers, kit drawings and the shop catalogue.
   Prices here are the built-in fallbacks; page code swaps in live shop prices. */

/* quote helpers: inline quote with a source chip, and a block quote */
const qi = (text, label, url) => `“${text}” ${src(label, url)}`;
const QB = (text, by, label, url) => `<figure class="quote" style="margin:0"><blockquote>“${text}”</blockquote><figcaption class="by">${esc(by)} ${src(label, url)}</figcaption></figure>`;
const bigIcon = (name) => `<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="#0046B8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name] || ''}</svg>`;

/* table and fact-list helpers */
const row = (k, why, home, lab, isLab) => `<div class="tbl-row${isLab ? ' lab' : ''}"><div class="k">${k}</div><div class="why"><span class="mlabel">Why:</span>${why}</div><div><span class="mlabel">Home screen:</span>${home}</div><div><span class="mlabel">Lab:</span>${lab}</div></div>`;
const yes = (href, label) => `<span class="yes">Yes</span> · ${a(href, esc(label))}`;
const no = '<span class="no">Not available</span>';
const facts = (rows) => `<dl class="facts">${rows.map(r => `<dt>${esc(r[0])}</dt><dd>${r[1]}</dd>`).join('')}</dl>`;

/* kit drawings */
const KIT_BOX_SVG = `<svg viewBox="0 0 220 150" width="200" height="136" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" aria-hidden="true"><path d="M40 70 L110 46 L180 70 L110 94 Z"/><path d="M40 70 V118 L110 142 V94 M180 70 V118 L110 142"/><rect x="78" y="14" width="12" height="44" rx="6"/><rect x="98" y="8" width="12" height="44" rx="6"/><rect x="118" y="14" width="12" height="44" rx="6"/><rect x="138" y="22" width="12" height="40" rx="6"/><path d="M62 104 l28 10 M62 114 l20 7" opacity="0.6"/></svg>`;
const KIT_TRIO_SVG = `<svg viewBox="0 0 150 110" width="150" height="110" fill="none" stroke="#0046B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="30" y="20" width="16" height="70" rx="8"/><rect x="66" y="14" width="16" height="76" rx="8"/><rect x="102" y="20" width="16" height="70" rx="8"/><path d="M20 96 H130"/><path d="M30 56 H46 M66 50 H82 M102 56 H118" opacity="0.5"/></svg>`;
const KIT_DUO_SVG = `<svg viewBox="0 0 150 110" width="150" height="110" fill="none" stroke="#0046B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="48" y="16" width="16" height="74" rx="8"/><rect x="86" y="16" width="16" height="74" rx="8"/><path d="M28 96 H122"/><path d="M48 52 H64 M86 52 H102" opacity="0.5"/></svg>`;
const KIT_ONE_SVG = `<svg viewBox="0 0 150 110" width="150" height="110" fill="none" stroke="#0046B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="66" y="14" width="16" height="76" rx="8"/><path d="M40 96 H110"/><path d="M66 50 H82" opacity="0.5"/><path d="M104 30 c-4 6 -4 10 0 11 c4 -1 4 -5 0 -11z"/></svg>`;
const KIT_STRIPS_SVG = `<svg viewBox="0 0 150 110" width="150" height="110" fill="none" stroke="#0046B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="34" y="18" width="10" height="72" rx="3"/><rect x="52" y="18" width="10" height="72" rx="3"/><rect x="70" y="18" width="10" height="72" rx="3"/><rect x="88" y="18" width="10" height="72" rx="3"/><rect x="106" y="18" width="10" height="72" rx="3"/><path d="M34 30 H44 M52 30 H62 M70 30 H80 M88 30 H98 M106 30 H116" opacity="0.5"/><path d="M24 96 H126"/></svg>`;

/* the shop catalogue (Stores V1). Filters are out of stock, so they are not listed. */
const CATALOG = {
  complete: { key: 'complete', name: 'Complete Drinking Water Test Kit', short: 'Complete Kit', tests: '13 tests', price: 45, was: 55, url: '/product-page/complete-drinking-water-test-kit', contents: ['1 × E. coli', '1 × lead', '1 × arsenic', '5 × chlorine', '5 × fluoride'] },
  trio: { key: 'trio', name: 'Lead, E. coli and Arsenic Test Kit', short: '3x Safety Kit', tests: '3 tests', contents: ['1 × E. coli', '1 × lead', '1 × arsenic'], price: 35, url: '/product-page/drinking-water-contaminant-multi-test-lead-e-coli-arsenic-test-kit-3x' },
  duo: { key: 'duo', name: 'Lead and E. coli Test Kit', short: '2x Lead + E. coli', tests: '2 tests', contents: ['1 × lead', '1 × E. coli'], price: 25, url: '/product-page/drinking-water-contaminant-multi-test-lead-e-coli-test-kit-2x' },
  ecoli: { key: 'ecoli', name: 'E. coli Test', short: 'E. coli Test', tests: '1 test', price: 15.95, url: '/product-page/e-coli-test' },
  lead: { key: 'lead', name: 'Lead Test', short: 'Lead Test', tests: '1 test', price: 15.95, url: '/product-page/lead-test' },
  arsenic: { key: 'arsenic', name: 'Arsenic Test', short: 'Arsenic Test', tests: '1 test', price: 17.95, url: '/product-page/arsenic-test' },
  chlorine: { key: 'chlorine', name: 'Chlorine Test Kit (5x)', short: 'Chlorine 5x', tests: '5 tests', contents: ['5 × chlorine strips, 0 to 1 ppm'], price: 12.45, was: 14.95, url: '/product-page/drinking-water-additive-test-chlorine-testing-kit-5x' },
  fluoride: { key: 'fluoride', name: 'Fluoride Test Kit (5x)', short: 'Fluoride 5x', tests: '5 tests', contents: ['5 × fluoride strips, 0 to 1.5 ppm'], price: 14.45, was: 16.95, url: '/product-page/drinking-water-additive-test-fluoride-testing-kit-5x' },
  clfl: { key: 'clfl', name: 'Chlorine and Fluoride Test Kit (10x)', short: 'Chlorine + Fluoride 10x', tests: '10 tests', contents: ['5 × chlorine', '5 × fluoride'], price: 22.5, was: 25, url: '/product-page/drinking-water-additive-multi-test-chlorine-fluoride-testing-kit-10xx' }
};
const pick = (...keys) => Object.fromEntries(keys.map(k => [k, CATALOG[k]]));

/* Regulator and health pages quoted across hubs (every quote is checked word for word against these pages). */
const SU = {
  dwiStd: 'https://www.dwi.gov.uk/drinking-water-standards-and-regulations-2/',
  dwiBoil: 'https://www.dwi.gov.uk/receiving-a-boil-water-notice/',
  dwiIll: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/illness/',
  dwiTanks: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/water-storage-tanks-and-cisterns/',
  dwiTaste: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/taste-and-odour-in-drinking-water/',
  dwiChlorine: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/chlorine/',
  dwiFluoride: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/fluoridation-of-drinking-water/',
  dwiHard: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/water-hardness-hard-water/',
  dwiCloudy: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/white-or-cloudy-water/',
  dwiBrown: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/brown-black-or-orange-water/',
  dwiBlue: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/blue-or-brightly-coloured-water/',
  dwiFilters: 'https://www.dwi.gov.uk/consumers/learn-more-about-your-water/domestic-water-filters-and-softeners/',
  dwiLead: 'https://www.dwi.gov.uk/lead-in-drinking-water/',
  dwiProtect: 'https://www.dwi.gov.uk/private-water-supplies/customers-receiving-pws/protecting-your-private-water-supply/',
  dwiSingle: 'https://www.dwi.gov.uk/private-water-supplies/customers-receiving-pws/single-dwelling-supplies-2/',
  dwiGuide: 'https://www.dwi.gov.uk/private-water-supplies/technical-information-notes/pws-regulations/guide-for-private-supply-owners-users/',
  dwqrLead: 'https://dwqr.scot/information/lead-in-drinking-water/',
  dwqrArsenic: 'https://dwqr.scot/private-water-supplies/technical-guidance-on-chemical-contaminants/arsenic/',
  dwqrPws: 'https://dwqr.scot/private-water-supplies/',
  nnMicro: 'https://www.north-norfolk.gov.uk/info/private-water-supplies/private-water-supplies-microbiological-failure/',
  fss: 'https://www.foodstandards.gov.scot/business-guidance/running-a-food-business/tools-and-training/fresh-produce-tool/fresh-produce-tool-resources/water-sources-and-storage',
  nhsFormula: 'https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/bottle-feeding/making-up-baby-formula/',
  stec: 'https://www.nhsinform.scot/illnesses-and-conditions/infections-and-poisoning/shiga-toxin-producing-e-coli-stec/',
  ohfFluoride: 'https://www.dentalhealth.org/fluoride'
};

/* Every hub, for "Related guides" chips. */
const HUB_LINKS = [['Private water supplies', '/private-water-supplies'], ['Lead', '/lead-in-uk-drinking-water'], ['Bacteria and E. coli', '/bacteria-e-coli-in-drinking-water'], ['Arsenic', '/arsenic-in-drinking-water'], ['Taste and smell', '/taste-smell-problems'], ['Fluoride', '/fluoride-in-uk-water'], ['Chlorine', '/chlorine-in-uk-tap-water'], ['Which test do I need?', '/which-water-test-do-i-need'], ['Result Centre', '/result-interpretation-centre']];
const relatedFor = (path) => HUB_LINKS.filter(h => h[1] !== path);

/* Shared defaults for the "Near you" and "Where to next?" sections; each hub overrides what differs. */
const mapBlock = (o) => Object.assign({
  eyebrow: 'Near you', title: 'Check your postcode',
  mapUrl: '/water-testing-map/uk', alertsUrl: '/water-testing-map/uk', uploadUrl: '/test-result-form',
  note: 'The map shows community results and public data. It is not official monitoring. Area facts are taken at the centre of your postcode district.',
  chipOn: 'Community results', chipOff: 'Housing age'
}, o);
const routingBlock = (o) => Object.assign({
  mapUrl: '/water-testing-map/uk',
  mapNote: 'Area facts come from the same public data as the UK testing map.',
  result: { body: 'See what your result means and what to do next, then add it to the community map.', decoder: '/result-interpretation-centre', upload: '/test-result-form' },
  updates: { body: 'Be told when a new community result is added in your area. Sign up on the UK testing map.', href: '/water-testing-map/uk', label: 'Get area alerts' },
  ticks: ['Quotes from UK regulators, linked and dated', 'Home screens, not lab certificates', 'Shop links open in a new tab, so this guide stays open']
}, o);

/* UK water testing map: "Your next step" section, placed under the map.
   It shows the area report for the postcode searched on the map (the page passes it in as the "postcode" attribute,
   or a link carries ?postcode=SY23), then routes to the right hub tool. Community results are not official monitoring. */

const MN_PRODUCTS = pick('complete', 'trio', 'lead', 'ecoli');
const pq = (d) => d ? '?postcode=' + encodeURIComponent(d) : '';

/* Cards that follow from the area facts. */
function mapNextCards(r) {
  const d = r && r.district;
  const cards = [];
  if (r && r.pct != null && r.pct >= 40) cards.push({ icon: 'home', title: `Older homes in ${d}`, body: 'Many homes here were built before 1967, when lead pipes were common. Check your home’s lead risk.', cta: 'Lead Risk Check', href: '/lead-in-uk-drinking-water' + pq(d) + '&go=tool', style: 'pop', flag: 'FOR YOUR AREA' });
  if (r && r.hardness && /hard/i.test(r.hardness[0]) && !/No public/.test(r.hardness[0])) cards.push({ icon: 'drop', title: r.hardness[0], body: 'Hard water changes the taste and leaves scale. What it means, and when a taste is worth checking.', cta: 'Hard water and taste', href: '/taste-smell-problems?go=hardness' });
  if (r && r.fluoride) cards.push({ icon: 'info', title: r.fluoride.label, body: `${r.fluoride.artificial ? 'This area is fluoridated.' : 'Natural fluoride levels.'} See what that means, and how your tap compares with the limit.`, cta: 'Fluoride Checker', href: '/fluoride-in-uk-water' + pq(d) + '&go=tool' });
  if (r && r.company && r.company.url) cards.push({ icon: 'compass', title: r.company.name, body: 'Your water company publishes water quality results for your supply. Check your exact address.', cta: 'Their water quality checker', href: r.company.url, ext: true });
  cards.push({ icon: 'clipboard', title: 'Well, borehole or spring?', body: 'Private supplies need regular testing. Build a plan for yours.', cta: 'Private Supply Planner', href: '/private-water-supplies' + pq(d) + (d ? '&' : '?') + 'go=tool' });
  cards.push({ icon: 'circleCheck', title: 'Already tested?', body: 'What your result means against the UK standard, and what to do next.', cta: 'Result Decoder', href: '/result-interpretation-centre?go=tool', style: 'ink' });
  return cards.slice(0, 6);
}

const CONTENT_MAPNEXT = {
  products: MN_PRODUCTS,
  checked: '28 Sep 2026',
  map: { mapUrl: null, area: ['housing', 'company', 'hardness', 'fluoride'] },
  onArea(root, r) {
    const box = root.querySelector('[data-next]');
    if (box && r && r.ok) box.innerHTML = mapNextCards(r).map(sitCard).join('');
    const title = root.getElementById('area-h');
    if (title && r && r.district) title.textContent = `What we know about ${r.district}`;
  },
  concerns: {
    id: 'concerns',
    eyebrow: 'Start from your concern',
    title: 'Every guide has a tool that gives you an answer',
    intro: 'Pick your worry. Each guide explains it with the regulator’s own words, and its tool tells you what to do next.',
    cards: [
      { icon: 'help', title: 'Not sure what to test', body: 'Four taps to the right kit, and what it won’t cover.', cta: 'Test Finder', href: '/which-water-test-do-i-need?go=tool', style: 'pop', flag: 'START HERE' },
      { icon: 'home', title: 'Lead and old pipes', body: 'How likely lead pipes are in your home, and what to do today.', cta: 'Lead Risk Check', href: '/lead-in-uk-drinking-water?go=tool' },
      { icon: 'rain', title: 'Bacteria and E. coli', body: 'After rain, a tank or a positive test: what to do and who to tell.', cta: 'Bacteria Next Steps', href: '/bacteria-e-coli-in-drinking-water?go=tool' },
      { icon: 'drop', title: 'Taste, smell or colour', body: 'The likely cause, what to try, and when to call your water company.', cta: 'Symptom Checker', href: '/taste-smell-problems?go=tool' },
      { icon: 'compass', title: 'Wells, boreholes, springs', body: 'A testing plan for your supply, and the rules where you live.', cta: 'Private Supply Planner', href: '/private-water-supplies?go=tool' },
      { icon: 'flask', title: 'Chlorine', body: 'What a strip reading means, and how to cut the taste.', cta: 'Chlorine Reading Check', href: '/chlorine-in-uk-tap-water?go=tool' },
      { icon: 'info', title: 'Fluoride', body: 'Your area’s typical level, and how your tap compares.', cta: 'Fluoride Checker', href: '/fluoride-in-uk-water?go=tool' },
      { icon: 'alert', title: 'Arsenic', body: 'Who is at risk, and what to do about a high result.', cta: 'Arsenic Risk Check', href: '/arsenic-in-drinking-water?go=tool', style: 'ink' }
    ]
  },
  ladder: {
    eyebrow: 'Ready to test?',
    title: 'The kits most people start with',
    compare: { label: 'All water tests', href: '/category/all-products' },
    kits: [
      { key: 'complete', badge: 'Best first screen', fig: '13 tests', svg: KIT_BOX_SVG, chooseIf: 'Not sure what to test, just moved in, or want a first look at everything.', note: 'E. coli, lead and arsenic, plus chlorine and fluoride.' },
      { key: 'trio', fig: '3 tests', svg: KIT_TRIO_SVG, chooseIf: 'The yearly safety screen for a private supply.', tag: 'E. coli · lead · arsenic' },
      { key: 'lead', fig: '1 test', svg: KIT_ONE_SVG, chooseIf: 'Mains water in a home built before 1970.', tag: 'Lead' }
    ],
    limits: '<b>What a home screen doesn\'t cover:</b> nitrate, pH, iron, manganese and enterococci need a lab.',
    limitsTarget: 'concerns',
    limitsLabel: 'Find your test ↑'
  }
};

function renderMapNext(c) {
  const P = c.products;
  return `<div class="page">
  <section class="sect sect--paper" id="your-area" aria-labelledby="area-h"><div class="wrap">
    <div class="sect-head"><div><p class="eyebrow">Your next step</p><h2 class="h2" id="area-h">What your postcode tells you</h2></div><p>Search a postcode on the map above. We add what public data says about your area, and the tools that fit it.</p></div>
    <div class="map-next-grid">
      <div class="pc-result" data-area-summary>Search your postcode on the map above and your area appears here: housing age, water company, hardness and fluoride.</div>
      <div class="sits sits--3" data-next>${mapNextCards(null).map(sitCard).join('')}</div>
    </div>
    <div class="btn-row" style="margin-top:18px">${memberBtn('email-area', 'Email me this area report', 'primary')}</div>
    <p class="note" style="margin-top:18px">${icon('info', 2)}<span>Area facts are approximate, for the centre of the postcode district, from public data (EPC records, Ofwat boundaries, DWI hardness and fluoride maps). Community results are local context, not official monitoring. Your water company’s checker has the official figures for your address.</span></p>
  </div></section>
  ${rSits(c.concerns)}
  ${rLadder(c.ladder, P)}
  <section class="sect sect--ink" id="add-result" aria-labelledby="add-h"><div class="wrap"><div class="routes routes--2">
    <div class="route route--kit"><span class="k">Already tested your water?</span><span class="t" id="add-h">Add your result to the map</span><p>Help build a clearer local picture, and get 10% off your next order.*</p><div class="btn-row" style="margin-top:auto">${btn('/test-result-form', 'Add my result', 'white btn--sm', true)}</div><span class="small" style="color:rgba(255,255,255,.7)">*Available when you upload a valid result from a SustainWater test.</span></div>
    <div class="route"><span class="k">Stay informed</span><span class="t">Alerts for your area</span><p>Be told when new test results are added near you. Add your postcode to the mailing list form below.</p><div class="btn-row">${btn('/result-interpretation-centre', 'Understand a result', 'ghost btn--sm')}</div></div>
  </div></div></section>
  </div>`;
}

const CSS = ":host {\n  display: block; width: 100%;\n  --ink: #140A07; --ink2: #364048; --ink3: #5E6973;\n  --line: #E3E6E2; --line2: #ECEFEA;\n  --paper: #FAFAF7; --paper2: #F4F4EF; --white: #FFFFFF;\n  --accent: #0057E1; --deep: #0046B8; --mid: #116DFF; --soft: #F1FCFE; --warm: #966B54;\n  --warn: #B3640F; --warnText: #8F4E0A; --warnSoft: #F4ECE3;\n  --ok: #2D6A3F; --okSoft: #EEF5EF; --alert: #B42318; --alertSoft: #FDF0EE;\n  --footer: #0A1115;\n  --font: \"Montserrat\", system-ui, -apple-system, \"Segoe UI\", sans-serif;\n  --r-sm: 8px; --r: 14px; --r-md: 16px; --r-lg: 18px; --r-xl: 20px;\n  --shadow-sm: 0 1px 2px rgba(20, 10, 7, 0.06);\n  --shadow: 0 6px 20px -8px rgba(20, 10, 7, 0.18), 0 2px 4px rgba(20, 10, 7, 0.04);\n  --shadow-lg: 0 24px 50px -20px rgba(20, 10, 7, 0.28), 0 4px 8px rgba(20, 10, 7, 0.05);\n  --gutter: 80px;\n}\n*, *::before, *::after { box-sizing: border-box; }\n.page { container-type: inline-size; container-name: swhub; font-family: var(--font); color: var(--ink); background: var(--white); -webkit-font-smoothing: antialiased; line-height: 1.55; }\na { color: var(--accent); text-decoration: none; }\na:hover { color: var(--deep); }\na:focus-visible, button:focus-visible, summary:focus-visible, input:focus-visible { outline: 3px solid var(--mid); outline-offset: 2px; }\nimg, svg { max-width: 100%; }\nbutton { font-family: inherit; }\n.wrap { max-width: 1440px; margin: 0 auto; padding-inline: var(--gutter); }\n.sect { padding-block: 80px; }\n.sect--paper { background: var(--paper); }\n.sect--ink { background: var(--ink); color: var(--white); }\n.sect--band { background: linear-gradient(135deg, var(--deep) 0%, var(--accent) 100%); color: var(--white); }\n.sect-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 34px; }\n.sect-head p { margin: 0; max-width: 440px; color: var(--ink3); font-size: 15px; }\n.eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; }\n.sect--band .eyebrow, .sect--ink .eyebrow { color: rgba(255, 255, 255, 0.72); }\n.pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 8px; border-radius: 999px; background: var(--soft); color: var(--deep); font-size: 12px; font-weight: 600; letter-spacing: 0.05em; }\n.pill::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }\n.h1 { font-size: clamp(32px, 3.9cqi, 56px); font-weight: 600; letter-spacing: -0.035em; line-height: 1.05; margin: 0; }\n.h1 em, .h2 em { font-style: normal; color: var(--accent); }\n.h2 { font-size: clamp(26px, 2.8cqi, 40px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.1; margin: 0; }\n.h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; margin: 0; }\n.lead { font-size: 19px; line-height: 1.6; color: var(--ink2); margin: 0; max-width: 680px; }\n.read { font-size: 17px; line-height: 1.7; color: var(--ink2); max-width: 680px; margin: 0; }\n.read + .read { margin-top: 14px; }\n.small { font-size: 13px; color: var(--ink3); line-height: 1.5; }\nq, .q { quotes: \"\u201c\" \"\u201d\"; }\n.src { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--white); color: var(--deep); border: 1px solid var(--line); white-space: nowrap; vertical-align: 2px; }\n.src svg { width: 12px; height: 12px; }\n.checked { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink3); }\n.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 24px; border: 1.5px solid transparent; border-radius: 0; font-size: 15px; font-weight: 600; line-height: 1.2; cursor: pointer; transition: transform .15s, background .15s, color .15s, border-color .15s; text-align: center; }\n.btn:hover { transform: translateY(-1px); }\n.btn svg { width: 16px; height: 16px; flex-shrink: 0; }\n.btn--primary { background: var(--accent); border-color: var(--accent); color: var(--white); }\n.btn--primary:hover { background: var(--deep); border-color: var(--deep); color: var(--white); }\n.btn--secondary { background: var(--white); border-color: var(--ink); color: var(--ink); }\n.btn--secondary:hover { color: var(--ink); }\n.btn--white { background: var(--white); border-color: var(--white); color: var(--deep); }\n.btn--white:hover { color: var(--deep); }\n.btn--ghost { background: transparent; border-color: rgba(255, 255, 255, 0.5); color: var(--white); }\n.btn--ghost:hover { color: var(--white); border-color: var(--white); }\n.btn--sm { padding: 11px 16px; font-size: 14px; }\n.btn--ink { background: var(--ink); border-color: var(--ink); color: var(--white); }\n.btn--ink:hover { color: var(--white); }\n.btn--alert { background: var(--alert); border-color: var(--alert); color: var(--white); }\n.btn--alert:hover { color: var(--white); }\n.btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }\n.tag { display: inline-flex; font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 999px; background: var(--paper2); color: var(--ink2); border: 1px solid var(--line); }\n.tags { display: flex; flex-wrap: wrap; gap: 6px; }\n.band { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }\n.band svg { width: 13px; height: 13px; }\n.band--clear { background: var(--okSoft); color: var(--ok); }\n.band--check { background: var(--warnSoft); color: var(--warnText); }\n.band--act { background: var(--alertSoft); color: var(--alert); }\n.band--act.on-card { background: var(--white); }\n.alert { background: var(--soft); border-bottom: 1px solid rgba(0, 87, 225, 0.2); color: var(--deep); font-size: 14px; }\n.alert .wrap { display: flex; align-items: center; gap: 12px; padding-block: 11px; }\n.alert svg { width: 18px; height: 18px; flex-shrink: 0; }\n.alert a, .alert .linkbtn { margin-left: auto; font-weight: 600; white-space: nowrap; color: var(--accent); }\n.hero { padding-block: 34px 72px; }\n.crumbs { font-size: 13px; color: var(--ink3); margin: 0 0 24px; display: flex; gap: 6px; flex-wrap: wrap; }\n.crumbs a { color: var(--ink3); }\n.crumbs span[aria-current] { color: var(--ink); font-weight: 500; }\n.hero-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 40px; align-items: start; }\n.hero-copy { display: flex; flex-direction: column; gap: 20px; }\n.hero-copy .pill { align-self: flex-start; }\n.meta-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }\n.ticks { display: flex; gap: 22px; flex-wrap: wrap; padding-top: 22px; border-top: 1px solid var(--line); font-size: 14px; font-weight: 500; color: var(--ink2); list-style: none; margin: 4px 0 0; padding-left: 0; }\n.ticks li { display: inline-flex; gap: 8px; align-items: center; }\n.ticks svg { width: 16px; height: 16px; color: var(--accent); }\n.fig-panel { position: relative; background: var(--paper); border: 1px solid var(--line2); border-radius: var(--r-xl); margin-top: 40px; padding: 64px 4% 112px; }\n.fig-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--deep); }\n.fig-panel .fig-label { position: absolute; left: 24px; top: 20px; }\n.fig-panel .fig { position: relative; max-width: 560px; margin: 0 auto; }\n.fig-panel .fig svg { width: 100%; height: auto; display: block; }\n.float { position: absolute; background: var(--white); border: 1px solid var(--line); border-radius: var(--r-md); padding: 14px 18px; box-shadow: 0 12px 32px -12px rgba(20, 10, 7, 0.18); }\n.float .k { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }\n.float .v { font-size: 14px; font-weight: 600; margin-top: 4px; line-height: 1.35; }\n.float--tr { right: -14px; top: 28px; width: 250px; }\n.float--bl { left: -24px; bottom: 26px; width: 300px; display: flex; align-items: center; gap: 14px; }\n.float--bl .price { font-size: 20px; font-weight: 700; color: var(--deep); margin-left: auto; }\n.hot { position: absolute; transform: translate(-50%, -50%); width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: var(--white); font-size: 12px; font-weight: 700; display: grid; place-items: center; box-shadow: 0 0 0 5px rgba(0, 87, 225, 0.15); border: 0; cursor: pointer; padding: 0; }\n.hot:hover { background: var(--deep); }\n.btn[disabled] { opacity: 0.45; cursor: not-allowed; transform: none; }\n.plan-kit { color: var(--ink); }\n.plan-kit:hover { border-color: var(--accent); color: var(--ink); }\n.plan-kit .price { font-size: 18px; margin-left: auto; }\n.plan-kit svg { width: 16px; height: 16px; color: var(--accent); }\n.plan-row.lab .when { color: var(--warnText); }\n.cite { font-size: 12px; color: var(--ink3); }\n.q-list { margin: 0; padding-left: 20px; color: var(--ink2); font-size: 15px; line-height: 1.6; display: flex; flex-direction: column; gap: 6px; }\n.read ul, .acc-body ul { margin: 0; }\n.tabs-wrap { display: flex; flex-direction: column; gap: 14px; }\n.months { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4px; }\n.months span { font-size: 11px; font-weight: 600; text-align: center; padding: 8px 0; border-radius: 6px; background: var(--paper2); color: var(--ink3); }\n.months span.on { background: var(--accent); color: var(--white); }\n.jump { position: sticky; top: 0; z-index: 20; background: rgba(255, 255, 255, 0.97); border-block: 1px solid var(--line); box-shadow: var(--shadow-sm); }\n.jump .wrap { display: flex; align-items: center; gap: 6px; height: 58px; overflow-x: auto; scrollbar-width: none; }\n.jump .wrap::-webkit-scrollbar { display: none; }\n.jump .lbl { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink3); margin-right: 10px; white-space: nowrap; }\n.jump button.j { background: none; border: 0; padding: 8px 14px; border-radius: 999px; color: var(--ink2); font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; }\n.jump button.j[aria-current=\"true\"] { background: var(--ink); color: var(--white); font-weight: 600; }\n.jump .btn { margin-left: auto; white-space: nowrap; }\n.ladder { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 20px; }\n.kit { background: var(--white); border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; display: flex; flex-direction: column; color: inherit; transition: transform .2s, box-shadow .2s, border-color .2s; }\n.kit:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -22px rgba(20, 10, 7, 0.28); border-color: var(--accent); }\n.kit-img { height: 170px; background: var(--paper2); display: grid; place-items: center; position: relative; }\n.kit-img .fig-label { position: absolute; left: 18px; top: 16px; color: var(--ink3); }\n.kit-body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 12px; flex: 1; }\n.kit-body p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--ink3); }\n.kit-foot { margin-top: auto; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.price { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: var(--deep); }\n.was { font-size: 15px; font-weight: 600; color: var(--ink3); text-decoration: line-through; margin-right: 8px; }\n.kit--hero { background: linear-gradient(135deg, var(--deep) 0%, var(--accent) 100%); color: var(--white); border-color: var(--deep); position: relative; }\n.kit--hero .kit-img { background: rgba(255, 255, 255, 0.08); height: 210px; }\n.kit--hero .kit-img .fig-label { left: auto; right: 18px; top: 22px; color: rgba(255, 255, 255, 0.6); }\n.kit--hero .kit-body { padding: 26px 28px 28px; }\n.kit--hero .h3 { font-size: 26px; }\n.kit--hero .kit-body p { color: rgba(255, 255, 255, 0.82); font-size: 15px; }\n.kit--hero .tag { background: rgba(255, 255, 255, 0.12); color: var(--white); border-color: rgba(255, 255, 255, 0.2); }\n.kit--hero .price { color: var(--white); font-size: 30px; }\n.kit--hero .was { color: rgba(255, 255, 255, 0.6); font-size: 18px; }\n.kit-badge { position: absolute; top: 18px; left: 18px; padding: 6px 12px; border-radius: 999px; background: var(--white); color: var(--deep); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; z-index: 1; }\n.kit .go { font-size: 15px; font-weight: 600; color: var(--accent); display: inline-flex; gap: 6px; align-items: center; }\n.kit .go svg { width: 16px; height: 16px; }\n.infobar { margin-top: 20px; background: var(--white); border: 1px solid var(--line); border-radius: var(--r); padding: 18px 22px; display: flex; align-items: center; gap: 14px; font-size: 15px; color: var(--ink2); }\n.infobar .ico { width: 36px; height: 36px; border-radius: 10px; background: var(--warnSoft); color: var(--warn); display: grid; place-items: center; flex-shrink: 0; }\n.infobar .ico svg { width: 18px; height: 18px; }\n.infobar b { color: var(--ink); font-weight: 600; }\n.infobar a { margin-left: auto; font-weight: 600; white-space: nowrap; }\n.sits { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }\n.sit { background: var(--white); border: 1px solid var(--line); border-radius: var(--r-md); padding: 22px 20px 20px; display: flex; flex-direction: column; gap: 12px; color: var(--ink); min-height: 200px; position: relative; overflow: hidden; transition: border-color .2s, box-shadow .2s, transform .2s; text-align: left; font: inherit; cursor: pointer; }\n.sit::after { content: \"\"; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .25s; }\n.sit:hover { border-color: var(--accent); box-shadow: 0 12px 28px -16px rgba(20, 10, 7, 0.25); transform: translateY(-2px); color: var(--ink); }\n.sit:hover::after { transform: scaleX(1); }\n.sit .ic { width: 40px; height: 40px; border-radius: 10px; background: var(--paper2); color: var(--accent); display: grid; place-items: center; }\n.sit .ic svg { width: 20px; height: 20px; }\n.sit .t { font-size: 17px; font-weight: 600; line-height: 1.25; }\n.sit .b { font-size: 13px; color: var(--ink3); line-height: 1.5; flex: 1; }\n.sit .cta { font-size: 14px; font-weight: 600; color: var(--accent); }\n.sit--pop { background: var(--soft); border-color: rgba(0, 87, 225, 0.35); }\n.sit--pop .ic { background: var(--white); }\n.sit--pop .flag { position: absolute; right: 18px; top: 26px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: var(--deep); }\n.sit--ink { background: var(--ink); border-color: var(--ink); color: var(--white); }\n.sit--ink:hover { color: var(--white); }\n.sit--ink .ic { background: rgba(255, 255, 255, 0.1); color: var(--white); }\n.sit--ink .b { color: rgba(255, 255, 255, 0.72); }\n.sit--ink .cta { color: var(--white); }\n.tool-grid { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 48px; align-items: center; }\n.tool-copy { display: flex; flex-direction: column; gap: 18px; }\n.tool-copy .h2 { font-size: clamp(28px, 3cqi, 44px); }\n.tool-copy p { margin: 0; font-size: 17px; line-height: 1.6; color: rgba(255, 255, 255, 0.84); max-width: 560px; }\n.tool-card { background: var(--white); color: var(--ink); border-radius: var(--r-lg); padding: 26px; box-shadow: 0 24px 50px -20px rgba(20, 10, 7, 0.45); display: flex; flex-direction: column; gap: 16px; }\n.progress { height: 4px; background: var(--paper2); border-radius: 999px; overflow: hidden; }\n.progress i { display: block; height: 4px; background: var(--accent); border-radius: 999px; transition: width .25s; }\n.step-meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--ink3); }\n.q-title { font-size: 20px; font-weight: 600; letter-spacing: -0.015em; margin: 0; }\n.opts { display: flex; flex-direction: column; gap: 8px; }\n.opt { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; padding: 14px; border: 1px solid var(--line); background: var(--white); border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--ink); cursor: pointer; min-height: 48px; }\n.opt::before { content: \"\"; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #9AA3AB; flex-shrink: 0; }\n.opt[aria-pressed=\"true\"] { border: 1.5px solid var(--accent); background: var(--soft); font-weight: 600; }\n.opt[aria-pressed=\"true\"]::before { border: 6px solid var(--accent); }\n.tool-nav { display: flex; justify-content: space-between; align-items: center; gap: 10px; }\n.linkbtn { background: none; border: 0; padding: 10px 0; font-size: 14px; font-weight: 600; color: var(--ink2); cursor: pointer; }\n.plan { border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }\n.plan-row { display: flex; gap: 12px; padding: 14px; border-top: 1px solid var(--line); font-size: 14px; line-height: 1.45; }\n.plan-row:first-child { border-top: 0; }\n.plan-row .when { font-size: 12px; font-weight: 700; color: var(--accent); width: 58px; flex-shrink: 0; padding-top: 2px; }\n.plan-note { background: var(--soft); border: 1px solid rgba(0, 87, 225, 0.25); border-radius: 12px; padding: 12px 14px; font-size: 13px; line-height: 1.5; color: var(--deep); }\n.plan-kit { display: flex; align-items: center; gap: 12px; border: 1px solid var(--line); border-radius: var(--r); padding: 12px 14px; }\n.plan-kit .n { font-size: 14px; font-weight: 600; }\n.plan-kit .p { font-size: 12px; color: var(--ink3); }\n.chap-grid { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); gap: 32px; align-items: start; }\n.rail { position: sticky; top: 76px; display: flex; flex-direction: column; gap: 2px; }\n.rail .lbl { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink3); margin-bottom: 12px; }\n.rail button { text-align: left; background: none; border: 0; border-left: 2px solid var(--line); padding: 10px 14px; font-size: 14px; color: var(--ink2); cursor: pointer; font-family: inherit; }\n.rail button[aria-current=\"true\"] { border-left-color: var(--accent); background: var(--soft); color: var(--deep); font-weight: 600; }\n.rail-kit { margin-top: 22px; background: var(--paper); border: 1px solid var(--line2); border-radius: var(--r); padding: 16px; display: flex; flex-direction: column; gap: 10px; }\n.rail-kit .n { font-size: 13px; font-weight: 600; }\n.chapters { display: flex; flex-direction: column; gap: 72px; }\n.chap { display: flex; flex-direction: column; gap: 20px; scroll-margin-top: 80px; }\n.num { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: var(--accent); }\n.num::before { content: \"\"; width: 28px; height: 1.5px; background: var(--accent); }\n.chap .h2 { font-size: clamp(26px, 2.5cqi, 36px); }\n.points { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }\n.point { border: 1px solid var(--line); border-radius: var(--r); padding: 18px; display: flex; flex-direction: column; gap: 8px; scroll-margin-top: 90px; }\n.point.is-lit { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0, 87, 225, 0.15); }\n.point .dot { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); color: var(--white); font-size: 12px; font-weight: 700; display: grid; place-items: center; }\n.point .t { font-size: 16px; font-weight: 600; }\n.point .b { font-size: 13px; color: var(--ink2); line-height: 1.55; }\n.point .x { font-size: 12px; font-weight: 600; color: var(--deep); margin-top: auto; }\n.tbl { border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; font-size: 14px; }\n.tbl-row { display: grid; grid-template-columns: 1.1fr 1.8fr 1fr 0.8fr; border-top: 1px solid var(--line); align-items: start; }\n.tbl-row:first-child { border-top: 0; }\n.tbl-row > div { padding: 14px 16px; line-height: 1.5; }\n.tbl-row.head { background: var(--paper2); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink2); }\n.tbl-row.lab { background: var(--paper); }\n.tbl .k { font-weight: 600; color: var(--ink); }\n.tbl .yes { color: var(--ok); font-weight: 600; }\n.tbl .no { color: var(--ink3); }\n.tbl .why { color: var(--ink2); }\n.tbl .mlabel { display: none; }\n.inline-cta { display: flex; align-items: center; gap: 14px; background: var(--soft); border: 1px solid rgba(0, 87, 225, 0.25); border-radius: var(--r); padding: 14px 16px; flex-wrap: wrap; }\n.inline-cta span { font-size: 15px; color: var(--ink); flex: 1 1 320px; }\n.inline-cta b { font-weight: 600; }\n.quote { background: var(--paper); border: 1px solid var(--line2); border-radius: var(--r); padding: 20px 22px; display: flex; flex-direction: column; gap: 12px; }\n.quote blockquote { margin: 0; font-size: 17px; line-height: 1.55; font-weight: 500; color: var(--ink); }\n.quote .by { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--ink3); padding-top: 10px; border-top: 1px solid var(--line); flex-wrap: wrap; }\n.calendar { border: 1px solid var(--line); border-radius: var(--r-lg); padding: 24px; display: flex; flex-direction: column; gap: 18px; }\n.triggers { display: flex; gap: 10px; flex-wrap: wrap; font-size: 13px; list-style: none; padding: 0; margin: 0; }\n.triggers li { display: inline-flex; padding: 8px 12px; border-radius: 999px; background: var(--soft); color: var(--deep); font-weight: 600; border: 1px solid rgba(0, 87, 225, 0.25); }\n.triggers li.main { background: var(--accent); color: var(--white); border-color: var(--accent); }\n.triggers a, .triggers .linkbtn { color: inherit; font: inherit; padding: 0; text-decoration: underline; text-underline-offset: 3px; }\n.tabs { display: inline-flex; flex-wrap: wrap; padding: 4px; background: var(--paper2); border-radius: 999px; gap: 4px; align-self: flex-start; }\n.tabs button { border: 0; background: none; padding: 9px 18px; border-radius: 999px; font-size: 14px; font-weight: 600; color: var(--ink2); cursor: pointer; min-height: 40px; }\n.tabs button[aria-selected=\"true\"] { background: var(--white); color: var(--ink); box-shadow: 0 1px 2px rgba(20, 10, 7, 0.12); }\n.tabpanel { border: 1px solid var(--line); border-radius: var(--r); padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; }\n.tabpanel[hidden] { display: none; }\n.facts { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 0; font-size: 15px; }\n.facts dt { font-weight: 600; padding: 10px 0; border-top: 1px solid var(--line); }\n.facts dd { margin: 0; padding: 10px 0; border-top: 1px solid var(--line); color: var(--ink2); line-height: 1.55; }\n.ladder-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }\n.ladder-steps > div { padding: 20px; display: flex; flex-direction: column; gap: 8px; border-left: 1px solid var(--line); }\n.ladder-steps > div:first-child { border-left: 0; background: var(--soft); }\n.ladder-steps .s { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; color: var(--ink3); }\n.ladder-steps > div:first-child .s { color: var(--accent); }\n.ladder-steps .t { font-size: 16px; font-weight: 600; }\n.ladder-steps .b { font-size: 13px; color: var(--ink2); line-height: 1.5; }\n.urgent { border: 1.5px solid var(--alert); background: var(--alertSoft); border-radius: var(--r); padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; }\n.urgent .top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }\n.urgent .top .t { font-size: 18px; font-weight: 600; }\n.urgent ol { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }\n.urgent li { background: var(--white); border-radius: 10px; padding: 14px; font-size: 14px; line-height: 1.55; color: var(--ink2); }\n.urgent li b { color: var(--ink); font-weight: 600; }\ndetails.acc { border-bottom: 1px solid var(--line); }\ndetails.acc > summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0; cursor: pointer; font-size: 18px; font-weight: 600; }\ndetails.acc > summary::-webkit-details-marker { display: none; }\ndetails.acc > summary::after { content: \"+\"; font-size: 24px; font-weight: 400; line-height: 1; color: var(--ink); flex-shrink: 0; }\ndetails.acc[open] > summary::after { content: \"\u2013\"; color: var(--accent); }\ndetails.acc .acc-body { padding: 0 0 22px; display: flex; flex-direction: column; gap: 12px; }\ndetails.acc .n { color: var(--accent); font-size: 14px; font-weight: 700; letter-spacing: 0.12em; margin-right: 14px; }\n.acc-list { border-top: 1px solid var(--line); }\n.types { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }\n.types > div { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; font-size: 14px; line-height: 1.5; color: var(--ink2); }\n.types b { display: block; color: var(--ink); font-weight: 600; margin-bottom: 4px; }\n.map-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 48px; align-items: center; }\n.pc-form { display: flex; gap: 8px; }\n.pc-form input { flex: 1; min-width: 0; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--r-sm); font: 600 16px var(--font); color: var(--ink); background: var(--white); text-transform: uppercase; }\n.pc-result { border: 1px solid var(--line); background: var(--white); border-radius: 12px; padding: 14px 16px; font-size: 14px; line-height: 1.55; color: var(--ink2); }\n.pc-result[hidden] { display: none; }\n.pc-result b { color: var(--ink); font-weight: 600; }\n.pc-next { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; font-weight: 600; }\n.route .pc-next a { color: var(--white); }\n.note { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--ink2); background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; line-height: 1.5; }\n.note svg { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; margin-top: 2px; }\n.map-art { height: 380px; background: var(--white); border: 1px solid var(--line); border-radius: var(--r-xl); position: relative; overflow: hidden; box-shadow: var(--shadow); }\n.map-art svg { position: absolute; inset: 0; width: 100%; height: 100%; }\n.map-art .pin { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 6px rgba(0, 87, 225, 0.15); }\n.map-art .pin.w { background: var(--warn); box-shadow: 0 0 0 6px rgba(179, 100, 15, 0.15); }\n.map-art .chips { position: absolute; left: 20px; top: 18px; display: flex; gap: 6px; }\n.map-art .chips span { padding: 6px 12px; border-radius: 999px; background: var(--white); border: 1px solid var(--line); font-size: 12px; font-weight: 600; color: var(--ink2); }\n.map-art .chips span.on { background: var(--accent); border-color: var(--accent); color: var(--white); }\n.faq-grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 56px; align-items: start; }\n.faq details.acc > summary { font-size: 17px; }\n.faq .acc-body p { margin: 0; font-size: 15px; line-height: 1.65; color: var(--ink2); max-width: 640px; }\n.reads { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }\n.read-card { border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; color: var(--ink); display: flex; flex-direction: column; transition: border-color .2s; }\n.read-card:hover { border-color: var(--accent); color: var(--ink); }\n.read-card .im { height: 140px; background: var(--paper2); display: grid; place-items: center; }\n.read-card .tt { padding: 16px; font-size: 15px; font-weight: 600; line-height: 1.35; }\n.sources summary { font-size: 15px; }\n.sources summary svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--accent); }\n.sources ul { margin: 0; padding: 0; list-style: none; }\n.sources li { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); font-size: 13px; }\n.sources li span { color: var(--ink3); white-space: nowrap; }\n.routes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }\n.route { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: var(--r-lg); padding: 26px; display: flex; flex-direction: column; gap: 12px; min-height: 230px; color: var(--white); }\n.route .k { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.72); }\n.route .t { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }\n.route p { margin: 0; font-size: 14px; line-height: 1.55; color: rgba(255, 255, 255, 0.76); }\n.route .btn-row { margin-top: auto; }\n.route--kit { background: linear-gradient(135deg, var(--deep) 0%, var(--accent) 100%); border-color: var(--deep); }\n.route--kit .price { color: var(--white); font-size: 28px; }\n.route--kit .was { color: rgba(255, 255, 255, 0.6); font-size: 16px; }\n.route .pc-form input { border: 0; }\n.route .pc-result { background: rgba(255, 255, 255, 0.08); border: 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; }\n.route .pc-result b { color: var(--white); }\n.route .small { color: rgba(255, 255, 255, 0.62); font-size: 11px; }\n.route .chipset { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }\n.route .chipset a { padding: 9px 13px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.3); color: var(--white); font-size: 13px; font-weight: 600; }\n.route .chipset a:hover { border-color: var(--white); }\n.route .list a { display: flex; justify-content: space-between; gap: 10px; padding: 11px 0; border-top: 1px solid rgba(255, 255, 255, 0.14); color: var(--white); font-size: 14px; font-weight: 500; }\n.route-ticks { display: flex; gap: 26px; flex-wrap: wrap; padding-top: 22px; margin-top: 36px; border-top: 1px solid rgba(255, 255, 255, 0.14); font-size: 14px; color: rgba(255, 255, 255, 0.72); list-style: none; padding-left: 0; margin-bottom: 0; }\n.buybar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: var(--white); border-top: 1px solid var(--line); box-shadow: 0 -8px 24px -12px rgba(20, 10, 7, 0.25); padding: 12px 16px; display: none; align-items: center; gap: 12px; transform: translateY(110%); transition: transform .25s; }\n.buybar.show { transform: translateY(0); }\n.buybar .n { font-size: 14px; font-weight: 600; }\n.buybar .p { font-size: 12px; color: var(--ink3); }\n.buybar .btn { margin-left: auto; }\n@container swhub (max-width: 1180px) {\n  .page > * { --gutter: 48px; }\n  .float--bl { left: 12px; }\n  .float--tr { right: 12px; }\n  .sits { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .points { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .reads { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n@container swhub (max-width: 980px) {\n  .hero-grid, .tool-grid, .map-grid, .faq-grid { grid-template-columns: minmax(0, 1fr); }\n  .fig-panel { margin-top: 8px; }\n  .ladder { grid-template-columns: minmax(0, 1fr); }\n  .chap-grid { grid-template-columns: minmax(0, 1fr); }\n  .rail { display: none; }\n  .routes { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .ladder-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .ladder-steps > div:nth-child(3) { border-left: 0; }\n  .ladder-steps > div:nth-child(n+3) { border-top: 1px solid var(--line); }\n  .urgent ol { grid-template-columns: minmax(0, 1fr); }\n  .buybar { display: flex; }\n}\n@container swhub (max-width: 720px) {\n  .page > * { --gutter: 16px; }\n  .sect { padding-block: 48px; }\n  .hero { padding-block: 18px 40px; }\n  .lead { font-size: 17px; }\n  .read { font-size: 16px; }\n  .hero-copy .btn-row .btn { width: 100%; }\n  .ticks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; font-size: 13px; }\n  .fig-panel { padding: 52px 12px 104px; }\n  .float--tr { display: none; }\n  .float--bl { left: 12px; right: 12px; width: auto; bottom: 12px; }\n  .jump .lbl, .jump .btn { display: none; }\n  .jump .wrap { height: 52px; }\n  .sits { grid-template-columns: minmax(0, 1fr); gap: 10px; }\n  .sit { min-height: 0; flex-direction: row; align-items: center; padding: 14px; }\n  .sit .b { display: none; }\n  .sit .t { flex: 1; font-size: 16px; }\n  .sit .cta { font-size: 13px; }\n  .sit--pop .flag { display: none; }\n  .points { grid-template-columns: minmax(0, 1fr); }\n  .tbl-row.head { display: none; }\n  .tbl-row { grid-template-columns: minmax(0, 1fr); padding: 6px 0; }\n  .tbl-row > div { padding: 4px 16px; }\n  .tbl-row > div:first-child { padding-top: 12px; font-size: 16px; }\n  .tbl .mlabel { display: inline; font-weight: 600; color: var(--ink3); margin-right: 6px; }\n  .facts { grid-template-columns: minmax(0, 1fr); }\n  .facts dt { padding-bottom: 0; }\n  .facts dd { border-top: 0; padding-top: 4px; }\n  .ladder-steps { grid-template-columns: minmax(0, 1fr); }\n  .ladder-steps > div { border-left: 0; border-top: 1px solid var(--line); }\n  .ladder-steps > div:first-child { border-top: 0; }\n  .types { grid-template-columns: minmax(0, 1fr); }\n  .reads { grid-template-columns: minmax(0, 1fr); }\n  .routes { grid-template-columns: minmax(0, 1fr); gap: 12px; }\n  .route { min-height: 0; padding: 20px; }\n  .route .t { font-size: 18px; }\n  .infobar { flex-wrap: wrap; }\n  .infobar a { margin-left: 0; }\n  .tabs { border-radius: 14px; }\n  .tabs button { flex: 1 1 40%; }\n  .tool-card { padding: 20px; }\n  .map-art { height: 240px; }\n  .pc-form { flex-wrap: wrap; }\n  .pc-form .btn { width: 100%; }\n  .alert .wrap { flex-wrap: wrap; gap: 6px 10px; }\n  .alert .wrap > span { flex: 1 1 200px; }\n  .alert a, .alert .linkbtn { margin-left: 28px; }\n  .months { grid-template-columns: repeat(6, minmax(0, 1fr)); }\n  .read-card { flex-direction: row; align-items: center; }\n  .read-card .im { height: 72px; width: 72px; flex-shrink: 0; }\n  .read-card .im svg { width: 34px; height: 34px; }\n  .sources summary { font-size: 14px; }\n}\n@media (prefers-reduced-motion: reduce) { * { transition: none !important; scroll-behavior: auto !important; } }\n@media print { .jump, .buybar, .tool-grid .tool-copy .btn-row { display: none !important; } }\n:host(:not([members])) .member-only { display: none !important; }\n:host([members]) .member-off { display: none !important; }\n.area-list { list-style: none; margin: 8px 0 6px; padding: 0; display: flex; flex-direction: column; gap: 6px; }\n.area-list li { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 10px; }\n.area-list .k { font-size: 12px; font-weight: 700; letter-spacing: 0.02em; color: var(--ink3); padding-top: 2px; }\n.area-note { display: block; font-size: 12px; color: var(--ink3); }\n.route .area-list .k, .route .area-note { color: rgba(255, 255, 255, 0.65); }\n.route .pc-result a { color: var(--white); text-decoration: underline; text-underline-offset: 3px; }\n@container swhub (max-width: 520px) { .area-list li { grid-template-columns: minmax(0, 1fr); gap: 2px; } }\n.facts-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }\n.facts-grid > div { border: 1px solid var(--line); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }\n.facts-grid .k { font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink3); }\n.facts-grid .v { font-size: 24px; font-weight: 700; color: var(--deep); letter-spacing: -0.01em; }\n.facts-grid .s { font-size: 13px; color: var(--ink2); line-height: 1.45; }\n@container swhub (max-width: 720px) { .facts-grid { grid-template-columns: minmax(0, 1fr); } }\n.map-next-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 18px; align-items: start; }\n.sits.sits--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.routes.routes--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n@container swhub (max-width: 980px) { .map-next-grid { grid-template-columns: minmax(0, 1fr); } .sits.sits--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }\n@container swhub (max-width: 720px) { .sits.sits--3, .routes.routes--2 { grid-template-columns: minmax(0, 1fr); } }";
defineHub("sw-map-next", CONTENT_MAPNEXT, CSS, { render: renderMapNext, attrs: ['postcode'], onAttr: (n, v, root) => { if (n === 'postcode') runPostcode(root, CONTENT_MAPNEXT, v, null); } });
})();
