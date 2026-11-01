// Shared SVG drawing helpers: boats, wind arrows, labels, arrows, buoys, lights.
(() => {
'use strict';
const SA = window.SA = window.SA || {};
const D = SA.draw = {};
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rad = (a) => a * Math.PI / 180;

D.TACK = (h) => { h = ((h % 360) + 360) % 360; return h === 0 || h === 180 ? 0 : (h < 180 ? -1 : 1); }; // -1 port tack, +1 starboard
D.twaOf = (h) => { h = ((h % 360) + 360) % 360; return h > 180 ? 360 - h : h; };
D.optBoom = (awa) => Math.max(4, Math.min(88, (awa - 15) * 0.55));

// Sailing yacht seen from above, bow up before rotation. Wind is assumed from the top of the drawing.
D.boat = (x, y, h, o = {}) => {
  const s = o.s || 1, twa = D.twaOf(h), tk = o.tack != null ? o.tack : D.TACK(h);
  const boomA = o.boom != null ? o.boom : (twa < 40 ? 0 : D.optBoom(twa));
  const r = tk === -1 ? -boomA : tk === 1 ? boomA : 0;
  const luff = o.luff || (o.boom == null && twa < 40);
  const mx = 0, my = -6, ex = mx - 30 * Math.sin(rad(r)), ey = my + 30 * Math.cos(rad(r));
  const bulge = luff ? 0 : (tk === -1 ? 1 : -1) * 6;
  const nx = (ey - my) / 30, ny = -(ex - mx) / 30;
  const cx = (mx + ex) / 2 - nx * bulge, cy = (my + ey) / 2 - ny * bulge;
  const edge = tk === -1 ? 'var(--port)' : tk === 1 ? 'var(--stbd)' : 'var(--muted)';
  const sail = o.nosail ? '' : `<path d="M${mx},${my} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="var(--ink)" stroke-width="${2.6 / s}" ${luff ? 'stroke-dasharray="3 3"' : ''}/><circle cx="0" cy="-6" r="${2.4 / s + 1}" fill="var(--ink)"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${h}) scale(${s})" ${o.attr || ''}>
    <path d="M0,-30 C12,-15 13,6 9,28 L-9,28 C-13,6 -12,-15 0,-30Z" fill="${o.fill || 'var(--surface)'}" stroke="var(--ink)" stroke-width="${1.6 / s}"/>
    ${o.edge !== false && tk ? `<path d="${tk === -1 ? 'M0,-30 C-12,-15 -13,6 -9,28' : 'M0,-30 C12,-15 13,6 9,28'}" fill="none" stroke="${edge}" stroke-width="${3.2 / s}"/>` : ''}
    ${sail}
  </g>`;
};
// Motor vessel / ship seen from above.
D.ship = (x, y, h, o = {}) => {
  const s = o.s || 1, L = o.len || 1;
  return `<g transform="translate(${x} ${y}) rotate(${h}) scale(${s})" ${o.attr || ''}>
    <path d="M0,${-34 * L} C10,${-22 * L} 11,${-6 * L} 11,${20 * L} L-11,${20 * L} C-11,${-6 * L} -10,${-22 * L} 0,${-34 * L}Z" fill="${o.fill || 'var(--surface)'}" stroke="var(--ink)" stroke-width="${1.6 / s}"/>
    <rect x="-7" y="${6 * L}" width="14" height="${10 * L}" rx="2" fill="var(--ink)" opacity=".75"/>
  </g>`;
};
D.windArrows = (xs, y0, len = 34) => xs.map((x) => `<g stroke="var(--wind)" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M${x},${y0} v${len}"/><path d="M${x - 6},${y0 + len - 8} L${x},${y0 + len} L${x + 6},${y0 + len - 8}"/></g>`).join('');
D.txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-family="var(--f-display)" font-size="${o.fs || 15}" font-weight="${o.w || 600}" fill="${o.fill || 'var(--ink)'}" letter-spacing=".02em">${esc(s)}</text>`;
D.arrow = (x1, y1, x2, y2, c, w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 11;
  const p1 = [x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4)], p2 = [x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4)];
  return `<g stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M${x1},${y1} L${x2},${y2}"/><path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${x2},${y2} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}"/></g>`;
};
D.polar = (a, r) => [r * Math.sin(rad(a)), -r * Math.cos(rad(a))];

// Navigation light colours (fixed real-world colours, readable on both themes).
D.LC = { red: '#E5322D', green: '#19B35A', white: '#FFFFFF', yellow: '#F2C230', blue: '#2F7BEA' };
D.light = (x, y, c, r = 7) => `<circle cx="${x}" cy="${y}" r="${r + 5}" fill="${D.LC[c]}" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="${D.LC[c]}" stroke="#0008" stroke-width="1"/>`;

// IALA buoy, side view. kind: port | stbd | north | south | east | west | danger | safe | special
D.buoy = (x, y, kind, s = 1) => {
  const R = '#D3302A', G = '#1F9D4C', Y = '#F2C230', B = '#151B22', W = '#FFFFFF';
  const g = (inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}<path d="M-26,34 Q0,26 26,34" stroke="var(--wind)" stroke-width="2" fill="none" opacity=".6"/></g>`;
  const cone = (up, c) => up ? `<path d="M0,-74 L-9,-58 L9,-58Z" fill="${c}"/>` : `<path d="M0,-58 L-9,-74 L9,-74Z" fill="${c}"/>`;
  const body = (bands) => { const h = 60 / bands.length; return bands.map((c, i) => `<rect x="-14" y="${-28 + i * h}" width="28" height="${h}" fill="${c}"/>`).join('') + `<rect x="-14" y="-28" width="28" height="60" fill="none" stroke="#0007"/>`; };
  const mast = `<rect x="-2" y="-52" width="4" height="26" fill="${B}"/>`;
  switch (kind) {
    case 'port': return g(`<rect x="-15" y="-34" width="30" height="62" fill="${R}" stroke="#0007"/>`);
    case 'stbd': return g(`<path d="M0,-42 L18,28 L-18,28Z" fill="${G}" stroke="#0007"/>`);
    case 'north': return g(body([B, Y]) + mast + cone(true, B) + `<path d="M0,-92 L-9,-76 L9,-76Z" fill="${B}"/>`);
    case 'south': return g(body([Y, B]) + mast + cone(false, B) + `<path d="M0,-76 L-9,-92 L9,-92Z" fill="${B}"/>`);
    case 'east': return g(body([B, Y, B]) + mast + `<path d="M0,-92 L-9,-76 L9,-76Z" fill="${B}"/><path d="M0,-58 L-9,-74 L9,-74Z" fill="${B}"/>`);
    case 'west': return g(body([Y, B, Y]) + mast + `<path d="M0,-74 L-9,-90 L9,-90Z" fill="${B}"/><path d="M0,-74 L-9,-58 L9,-58Z" fill="${B}"/>`);
    case 'danger': return g(body([B, R, B]) + mast + `<circle cx="0" cy="-62" r="7" fill="${B}"/><circle cx="0" cy="-80" r="7" fill="${B}"/>`);
    case 'safe': return g(`<rect x="-14" y="-28" width="28" height="60" fill="${W}" stroke="#0007"/>${[0, 1, 2].map((i) => `<rect x="${-14 + i * 10}" y="-28" width="5" height="60" fill="${R}"/>`).join('')}${mast}<circle cx="0" cy="-60" r="8" fill="${R}"/>`);
    case 'special': return g(body([Y]) + mast + `<path d="M-9,-68 L9,-52 M9,-68 L-9,-52" stroke="${Y}" stroke-width="4"/>`);
  }
  return '';
};
})();
