/**
 * IPL Pressure Performance Analytics - Production Sports Analytics Engine
 * Midnight Pink × Premium Sports Intelligence Design System
 * Dynamic CSV Integration, Pure React Icons SVGs, Tabular JetBrains Mono Numerals
 */

document.addEventListener('DOMContentLoaded', async () => {
  const icon = window.renderReactIcon || ((n, c, s) => '');

  // Franchise Affiliations for Top 10 Ranked Players
  const PLAYER_TEAMS = {
    'Shashank Singh': 'Punjab Kings',
    'Jos Buttler': 'Rajasthan Royals',
    'Dinesh Karthik': 'Royal Challengers Bengaluru',
    'Suryakumar Yadav': 'Mumbai Indians',
    'Naman Dhir': 'Mumbai Indians',
    'Tim David': 'Mumbai Indians',
    'Tristan Stubbs': 'Delhi Capitals',
    'Nicholas Pooran': 'Lucknow Super Giants',
    'Namboori Tilak Varma': 'Mumbai Indians',
    'Shreyas Iyer': 'Kolkata Knight Riders',
    'Sunil Narine': 'Kolkata Knight Riders',
    'Jasprit Bumrah': 'Mumbai Indians',
    'Abrar Ahmed': 'Pakistan',
    'Sufiyan Muqeem': 'Pakistan',
    'Matheesha Pathirana': 'Chennai Super Kings',
    'Kuldeep Yadav': 'Delhi Capitals',
    'Varun Chakravarthy': 'Kolkata Knight Riders',
    'Akeal Hosein': 'Sunrisers Hyderabad',
    'Mohammad Nawaz': 'Pakistan',
    'Mitchell Santner': 'Chennai Super Kings'
  };

  // State Management
  let battersData = [];
  let bowlersData = [];

  let batterSortKey = 'rank';
  let batterSortAsc = true;
  let batterSearchQuery = '';

  let bowlerSortKey = 'rank';
  let bowlerSortAsc = true;
  let bowlerSearchQuery = '';

  // DOM Containers
  const battersTbody = document.getElementById('batters-table-tbody');
  const bowlersTbody = document.getElementById('bowlers-table-tbody');
  const batterSearchInput = document.getElementById('batter-search-input');
  const bowlerSearchInput = document.getElementById('bowler-search-input');
  const playerModal = document.getElementById('player-dossier-modal');
  const modalCloseBtn = document.getElementById('modal-close-trigger');

  // KPI Elements
  const kpiTotalPlayers = document.getElementById('kpi-total-players');
  const kpiRankedBatters = document.getElementById('kpi-ranked-batters');
  const kpiRankedBowlers = document.getElementById('kpi-ranked-bowlers');
  const kpiHighestRating = document.getElementById('kpi-highest-rating');
  const kpiHighestPlayer = document.getElementById('kpi-highest-player');

  // Count-up helper function
  function animateValue(elem, start, end, duration, decimals = 0) {
    if (!elem) return;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const val = start + progress * (end - start);
      elem.innerText = val.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        elem.innerText = end.toFixed(decimals);
      }
    }
    requestAnimationFrame(step);
  }

  // CSV Parser
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = [];
      let insideQuote = false;
      let current = '';
      for (let char of line) {
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const obj = {};
      headers.forEach((h, idx) => {
        let val = values[idx];
        if (val !== undefined && val !== '') {
          const num = Number(val);
          obj[h] = isNaN(num) ? val : num;
        } else {
          obj[h] = val;
        }
      });
      rows.push(obj);
    }
    return rows;
  }

  // Load CSV with Fallback
  async function fetchCSV(url, fallbackData) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      if (parsed && parsed.length > 0) return parsed;
      return fallbackData || [];
    } catch (err) {
      console.warn(`Local fetch for ${url} failed, using local fallback:`, err);
      return fallbackData || [];
    }
  }

  // Load datasets dynamically
  const fallbackBatters = (window.RR_DATA && window.RR_DATA.batters) ? window.RR_DATA.batters.slice(0, 10) : [];
  const fallbackBowlers = (window.RR_DATA && window.RR_DATA.bowlers) ? window.RR_DATA.bowlers.slice(0, 10) : [];

  battersData = await fetchCSV('top_10_batters_under_pressure.csv', fallbackBatters);
  bowlersData = await fetchCSV('top_10_bowlers_under_pressure.csv', fallbackBowlers);

  // Attach Teams and Normalized Numeric Fields
  battersData.forEach(b => {
    b.team = PLAYER_TEAMS[b.striker_name] || 'IPL / T20';
    b.pressure_rating = parseFloat(b.pressure_rating);
    b.p_sr = parseFloat(b.p_sr);
    b.n_sr = parseFloat(b.n_sr);
    b.sr_delta = parseFloat(b.sr_delta);
    b.p_bdry_pct = parseFloat(b.p_bdry_pct);
    b.p_dot_pct = parseFloat(b.p_dot_pct);
    b.p_bpd = parseFloat(b.p_bpd);
    b.p_ctx_val_100 = parseFloat(b.p_ctx_val_100);
  });

  bowlersData.forEach(w => {
    w.team = PLAYER_TEAMS[w.bowler_name] || 'IPL / T20';
    w.pressure_rating = parseFloat(w.pressure_rating);
    w.p_econ = parseFloat(w.p_econ);
    w.n_econ = parseFloat(w.n_econ);
    w.econ_diff = parseFloat(w.econ_diff);
    w.p_dot_pct = parseFloat(w.p_dot_pct);
    w.p_tier_wkt_pct = parseFloat(w.p_tier_wkt_pct);
    w.p_ctx_rs_24 = parseFloat(w.p_ctx_rs_24);
  });

  // Calculate & Display Overview KPIs with Count-up Animation
  const totalCount = battersData.length + bowlersData.length;
  animateValue(kpiTotalPlayers, 0, totalCount, 1200, 0);
  animateValue(kpiRankedBatters, 0, battersData.length, 1200, 0);
  animateValue(kpiRankedBowlers, 0, bowlersData.length, 1200, 0);

  // Find overall highest rating
  let topRating = 0;
  let topPlayerName = '';
  [...battersData, ...bowlersData].forEach(p => {
    if (p.pressure_rating > topRating) {
      topRating = p.pressure_rating;
      topPlayerName = p.striker_name || p.bowler_name;
    }
  });

  animateValue(kpiHighestRating, 50, topRating, 1400, 1);
  if (kpiHighestPlayer) kpiHighestPlayer.innerText = `${topPlayerName} (Rating: ${topRating.toFixed(1)})`;

  // Render Batters Table
  function renderBatters() {
    if (!battersTbody) return;

    let list = [...battersData];

    // Search filter
    if (batterSearchQuery) {
      list = list.filter(b => 
        (b.striker_name || '').toLowerCase().includes(batterSearchQuery) ||
        (b.team || '').toLowerCase().includes(batterSearchQuery)
      );
    }

    // Sort
    list.sort((a, b) => {
      let vA = a[batterSortKey];
      let vB = b[batterSortKey];
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return batterSortAsc ? -1 : 1;
      if (vA > vB) return batterSortAsc ? 1 : -1;
      return 0;
    });

    battersTbody.innerHTML = '';
    if (list.length === 0) {
      battersTbody.innerHTML = `<tr><td colspan="13" style="text-align:center; padding:2rem; color:var(--text-muted);">No batters found matching "${batterSearchQuery}".</td></tr>`;
      return;
    }

    list.forEach(b => {
      const tr = document.createElement('tr');
      const rank = b.rank;
      let rankModifier = '';
      let rankRowClass = '';
      if (rank === 1) { rankModifier = 'first'; rankRowClass = 'rank-row-1'; }
      else if (rank === 2) { rankModifier = 'second'; rankRowClass = 'rank-row-2'; }
      else if (rank === 3) { rankModifier = 'third'; rankRowClass = 'rank-row-3'; }

      tr.className = rankRowClass;

      const delta = b.sr_delta || 0;
      const deltaSign = delta >= 0 ? '+' : '';
      const deltaClass = delta >= 0 ? 'positive-val' : 'negative-val';

      tr.innerHTML = `
        <td><span class="rank-badge-item ${rankModifier}">#${rank}</span></td>
        <td class="player-name-cell">${b.striker_name}</td>
        <td><span class="team-badge-cell">${b.team}</span></td>
        <td class="rating-cell tabular-nums">${b.pressure_rating.toFixed(1)}</td>
        <td class="tabular-nums" style="font-weight:700; color:var(--text-primary); text-align:right;">${b.p_sr.toFixed(1)}</td>
        <td class="tabular-nums" style="color:var(--text-muted); text-align:right;">${b.n_sr.toFixed(1)}</td>
        <td class="tabular-nums ${deltaClass}" style="text-align:right;">${deltaSign}${delta.toFixed(1)}</td>
        <td class="tabular-nums" style="text-align:right;">${b.p_runs} / ${b.p_balls}</td>
        <td class="tabular-nums" style="text-align:right;">${b.p_bdry_pct.toFixed(1)}%</td>
        <td class="tabular-nums" style="text-align:right;">${b.p_dot_pct.toFixed(1)}%</td>
        <td class="tabular-nums" style="text-align:right;">${b.p_bpd.toFixed(1)}</td>
        <td class="tabular-nums" style="color:var(--bright-pink); font-weight:700; text-align:right;">+${b.p_ctx_val_100.toFixed(1)}</td>
        <td style="text-align:center;"><button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.75rem;">Inspect</button></td>
      `;

      tr.querySelector('.btn-secondary').addEventListener('click', (e) => {
        e.stopPropagation();
        openDossier(b, true);
      });

      tr.addEventListener('click', () => {
        openDossier(b, true);
      });

      battersTbody.appendChild(tr);
    });

    updateSortHeaders('top10-batters-table', batterSortKey, batterSortAsc);
  }

  // Render Bowlers Table
  function renderBowlers() {
    if (!bowlersTbody) return;

    let list = [...bowlersData];

    // Search filter
    if (bowlerSearchQuery) {
      list = list.filter(w => 
        (w.bowler_name || '').toLowerCase().includes(bowlerSearchQuery) ||
        (w.team || '').toLowerCase().includes(bowlerSearchQuery)
      );
    }

    // Sort
    list.sort((a, b) => {
      let vA = a[bowlerSortKey];
      let vB = b[bowlerSortKey];
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return bowlerSortAsc ? -1 : 1;
      if (vA > vB) return bowlerSortAsc ? 1 : -1;
      return 0;
    });

    bowlersTbody.innerHTML = '';
    if (list.length === 0) {
      bowlersTbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:2rem; color:var(--text-muted);">No bowlers found matching "${bowlerSearchQuery}".</td></tr>`;
      return;
    }

    list.forEach(w => {
      const tr = document.createElement('tr');
      const rank = w.rank;
      let rankModifier = '';
      let rankRowClass = '';
      if (rank === 1) { rankModifier = 'first'; rankRowClass = 'rank-row-1'; }
      else if (rank === 2) { rankModifier = 'second'; rankRowClass = 'rank-row-2'; }
      else if (rank === 3) { rankModifier = 'third'; rankRowClass = 'rank-row-3'; }

      tr.className = rankRowClass;

      const econGain = w.econ_diff || 0;
      const gainSign = econGain >= 0 ? '+' : '';
      const gainClass = econGain >= 0 ? 'positive-val' : 'negative-val';

      tr.innerHTML = `
        <td><span class="rank-badge-item ${rankModifier}">#${rank}</span></td>
        <td class="player-name-cell">${w.bowler_name}</td>
        <td><span class="team-badge-cell">${w.team}</span></td>
        <td class="rating-cell tabular-nums">${w.pressure_rating.toFixed(1)}</td>
        <td class="tabular-nums" style="font-weight:700; color:var(--text-primary); text-align:right;">${w.p_econ.toFixed(2)}</td>
        <td class="tabular-nums" style="color:var(--text-muted); text-align:right;">${w.n_econ.toFixed(2)}</td>
        <td class="tabular-nums ${gainClass}" style="text-align:right;">${gainSign}${econGain.toFixed(2)}</td>
        <td class="tabular-nums" style="text-align:right;">${w.p_wkts} / ${w.p_legal_balls}</td>
        <td class="tabular-nums" style="text-align:right;">${w.p_dot_pct.toFixed(1)}%</td>
        <td class="tabular-nums" style="text-align:right;">${w.p_tier_wkt_pct.toFixed(1)}%</td>
        <td class="tabular-nums positive-val" style="text-align:right;">+${w.p_ctx_rs_24.toFixed(2)}</td>
        <td style="text-align:center;"><button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.75rem;">Inspect</button></td>
      `;

      tr.querySelector('.btn-secondary').addEventListener('click', (e) => {
        e.stopPropagation();
        openDossier(w, false);
      });

      tr.addEventListener('click', () => {
        openDossier(w, false);
      });

      bowlersTbody.appendChild(tr);
    });

    updateSortHeaders('top10-bowlers-table', bowlerSortKey, bowlerSortAsc);
  }

  // Update Sort indicators on table headers
  function updateSortHeaders(tableId, activeKey, isAsc) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const ths = table.querySelectorAll('th[data-sort]');
    ths.forEach(th => {
      const key = th.getAttribute('data-sort');
      const sortIcon = th.querySelector('.sort-icon');
      if (key === activeKey) {
        th.style.color = 'var(--bright-pink)';
        if (sortIcon) sortIcon.innerHTML = isAsc ? icon('sortUp', '', 11) : icon('sortDown', '', 11);
      } else {
        th.style.color = '';
        if (sortIcon) sortIcon.innerHTML = icon('sort', '', 10);
      }
    });
  }

  // Table Sort Click Handlers
  document.querySelectorAll('#top10-batters-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');
      if (batterSortKey === key) {
        batterSortAsc = !batterSortAsc;
      } else {
        batterSortKey = key;
        batterSortAsc = (key === 'rank' || key === 'striker_name');
      }
      renderBatters();
    });
  });

  document.querySelectorAll('#top10-bowlers-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');
      if (bowlerSortKey === key) {
        bowlerSortAsc = !bowlerSortAsc;
      } else {
        bowlerSortKey = key;
        bowlerSortAsc = (key === 'rank' || key === 'bowler_name' || key === 'p_econ');
      }
      renderBowlers();
    });
  });

  // Search input listeners
  if (batterSearchInput) {
    batterSearchInput.addEventListener('input', (e) => {
      batterSearchQuery = e.target.value.toLowerCase().trim();
      renderBatters();
    });
  }

  if (bowlerSearchInput) {
    bowlerSearchInput.addEventListener('input', (e) => {
      bowlerSearchQuery = e.target.value.toLowerCase().trim();
      renderBowlers();
    });
  }

  // Player Dossier Modal Function
  function openDossier(player, isBat) {
    const name = isBat ? player.striker_name : player.bowler_name;
    const rating = player.pressure_rating ? player.pressure_rating.toFixed(1) : '-';

    document.getElementById('modal-name-target').innerText = name;
    document.getElementById('modal-rank-target').innerText = `#${player.rank || '-'}`;
    document.getElementById('modal-team-target').innerText = player.team || 'IPL Franchise';
    document.getElementById('modal-rating-target').innerText = rating;

    const metricsGrid = document.getElementById('modal-stats-grid');
    if (isBat) {
      metricsGrid.innerHTML = `
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Pressure Strike Rate</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;">
            ${player.p_sr.toFixed(1)} <span style="font-size:0.8rem; color:var(--text-secondary); font-family:var(--font-body);">(Normal: ${player.n_sr.toFixed(1)})</span>
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Strike Rate Delta</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--perf-positive); margin-top:0.25rem;">
            +${player.sr_delta.toFixed(1)} SR
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Pressure Boundary %</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--bright-pink); margin-top:0.25rem;">
            ${player.p_bdry_pct.toFixed(1)}%
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Dot Ball Resistance</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;">
            ${(100 - player.p_dot_pct).toFixed(1)}%
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Balls Per Dismissal</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;">
            ${player.p_bpd.toFixed(1)} balls
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Context Value / 100b</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--bright-pink); margin-top:0.25rem;">
            +${player.p_ctx_val_100.toFixed(1)}
          </div>
        </div>
      `;
    } else {
      metricsGrid.innerHTML = `
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Pressure Economy</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;">
            ${player.p_econ.toFixed(2)} <span style="font-size:0.8rem; color:var(--text-secondary); font-family:var(--font-body);">(Normal: ${player.n_econ.toFixed(2)})</span>
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Economy Gain</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--perf-positive); margin-top:0.25rem;">
            +${player.econ_diff.toFixed(2)} rpo tighter
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Dot Ball %</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--bright-pink); margin-top:0.25rem;">
            ${player.p_dot_pct.toFixed(1)}%
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Top-Tier Wicket %</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;">
            ${player.p_tier_wkt_pct.toFixed(1)}%
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Context Runs Saved / 24b</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--perf-positive); margin-top:0.25rem;">
            +${player.p_ctx_rs_24.toFixed(2)} runs
          </div>
        </div>
        <div class="method-block" style="padding:1rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Wickets / Legal Balls</div>
          <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--bright-pink); margin-top:0.25rem;">
            ${player.p_wkts} / ${player.p_legal_balls}
          </div>
        </div>
      `;
    }

    // Radar Chart
    renderRadar(player, isBat);

    if (playerModal) playerModal.style.display = 'flex';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (playerModal) playerModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === playerModal) {
      playerModal.style.display = 'none';
    }
  });

  // Canvas Radar Polygon with Midnight Pink Styling
  function renderRadar(player, isBat) {
    const canvas = document.getElementById('modal-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 35;

    let axes, values;
    if (isBat) {
      axes = ['Rating', 'Pressure SR', 'SR Delta', 'Bdry %', 'Dot Resist', 'Balls/Out'];
      values = [
        Math.min(100, (player.pressure_rating / 85) * 100),
        Math.min(100, (player.p_sr / 215) * 100),
        Math.min(100, (player.sr_delta / 45) * 100),
        Math.min(100, (player.p_bdry_pct / 32) * 100),
        Math.min(100, ((100 - player.p_dot_pct) / 75) * 100),
        Math.min(100, (player.p_bpd / 25) * 100)
      ];
    } else {
      axes = ['Rating', 'Econ Suppr', 'Gain', 'Dot %', 'Top-Tier Wkt', 'Runs Saved'];
      values = [
        Math.min(100, (player.pressure_rating / 100) * 100),
        Math.min(100, (12 - player.p_econ) * 12),
        Math.min(100, (player.econ_diff / 4.0) * 100),
        Math.min(100, (player.p_dot_pct / 55) * 100),
        Math.min(100, (player.p_tier_wkt_pct / 75) * 100),
        Math.min(100, (player.p_ctx_rs_24 / 5.5) * 100)
      ];
    }

    const sides = axes.length;
    const step = (Math.PI * 2) / sides;

    // Web Rings
    for (let level = 1; level <= 4; level++) {
      const r = radius * (level / 4);
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const ang = i * step - Math.PI / 2;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(242, 10, 145, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes and Axis Labels
    ctx.font = '600 10px "Inter", sans-serif';
    ctx.fillStyle = '#A1A1AA';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < sides; i++) {
      const ang = i * step - Math.PI / 2;
      const x = cx + Math.cos(ang) * radius;
      const y = cy + Math.sin(ang) * radius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(242, 10, 145, 0.25)';
      ctx.stroke();

      const lx = cx + Math.cos(ang) * (radius + 20);
      const ly = cy + Math.sin(ang) * (radius + 20);
      ctx.fillText(axes[i], lx, ly);
    }

    // Filled Polygon in Midnight Pink & Violet
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const ang = i * step - Math.PI / 2;
      const r = radius * (values[i] / 100);
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(242, 10, 145, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#F20A91';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertices
    for (let i = 0; i < sides; i++) {
      const ang = i * step - Math.PI / 2;
      const r = radius * (values[i] / 100);
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF4DB8';
      ctx.shadowColor = '#FF4DB8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ==========================================
  // PERFORMANCE VISUALIZATIONS (4 DARK CHARTS)
  // ==========================================
  function renderAllCharts() {
    renderBarComparisonChart('chart-batters-rating', battersData, 'striker_name', 'pressure_rating', 'Batters Pressure Rating', '#F20A91', '#FF4DB8');
    renderBarComparisonChart('chart-bowlers-rating', bowlersData, 'bowler_name', 'pressure_rating', 'Bowlers Pressure Rating', '#A855F7', '#FF4DB8');
    renderDeltaComparisonChart('chart-batters-delta', battersData, 'striker_name', 'n_sr', 'p_sr', 'Normal SR', 'Pressure SR');
    renderEconComparisonChart('chart-bowlers-delta', bowlersData, 'bowler_name', 'n_econ', 'p_econ', 'Normal Econ', 'Pressure Econ');
  }

  // Horizontal Rating Bar Chart with Midnight Pink Gradients
  function renderBarComparisonChart(canvasId, items, nameKey, valKey, label, baseColor, endColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 145;
    const padRight = 60;
    const padTop = 15;
    const padBottom = 25;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const rowH = plotH / items.length;

    const maxVal = Math.max(...items.map(i => i[valKey])) * 1.05;

    items.forEach((item, idx) => {
      const y = padTop + idx * rowH + rowH * 0.15;
      const barHeight = rowH * 0.7;
      const barWidth = (item[valKey] / maxVal) * plotW;

      // Player Label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const name = item[nameKey];
      ctx.fillText(`#${item.rank} ${name}`, padLeft - 10, y + barHeight / 2);

      // Bar fill color
      let barFill;
      if (item.rank === 1) {
        barFill = '#FACC15';
      } else if (item.rank === 2) {
        barFill = '#CBD5E1';
      } else if (item.rank === 3) {
        barFill = '#CD7F32';
      } else {
        const grad = ctx.createLinearGradient(padLeft, 0, padLeft + barWidth, 0);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(1, endColor);
        barFill = grad;
      }

      ctx.fillStyle = barFill;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(padLeft, y, barWidth, barHeight, 4);
      } else {
        ctx.fillRect(padLeft, y, barWidth, barHeight);
      }
      ctx.fill();

      // Numerical Value
      ctx.fillStyle = '#A1A1AA';
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item[valKey].toFixed(1), padLeft + barWidth + 8, y + barHeight / 2);
    });
  }

  // Delta Batting SR Chart: Normal (Slate) vs Pressure (Vibrant Pink)
  function renderDeltaComparisonChart(canvasId, items, nameKey, normalKey, pressureKey, normLabel, pressLabel) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 135;
    const padRight = 55;
    const padTop = 15;
    const padBottom = 25;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const rowH = plotH / items.length;
    const maxVal = 220;

    items.forEach((item, idx) => {
      const y = padTop + idx * rowH + rowH * 0.12;
      const barH = rowH * 0.35;

      const normW = (item[normalKey] / maxVal) * plotW;
      const pressW = (item[pressureKey] / maxVal) * plotW;

      // Label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item[nameKey].split(' ').pop(), padLeft - 10, y + rowH * 0.35);

      // Normal Bar (Slate Violet)
      ctx.fillStyle = '#312C45';
      ctx.fillRect(padLeft, y, normW, barH);

      // Pressure Bar (Primary Pink)
      ctx.fillStyle = '#F20A91';
      ctx.fillRect(padLeft, y + barH + 2, pressW, barH);

      // Delta text
      ctx.fillStyle = '#10B981';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`+${item.sr_delta.toFixed(1)}`, padLeft + Math.max(normW, pressW) + 6, y + barH);
    });
  }

  // Economy Suppression Chart: Normal (Slate) vs Pressure (Bright Pink)
  function renderEconComparisonChart(canvasId, items, nameKey, normalKey, pressureKey, normLabel, pressLabel) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 135;
    const padRight = 55;
    const padTop = 15;
    const padBottom = 25;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const rowH = plotH / items.length;
    const maxVal = 11.5;

    items.forEach((item, idx) => {
      const y = padTop + idx * rowH + rowH * 0.12;
      const barH = rowH * 0.35;

      const normW = (item[normalKey] / maxVal) * plotW;
      const pressW = (item[pressureKey] / maxVal) * plotW;

      // Label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item[nameKey].split(' ').pop(), padLeft - 10, y + rowH * 0.35);

      // Normal Econ Bar (Slate)
      ctx.fillStyle = '#312C45';
      ctx.fillRect(padLeft, y, normW, barH);

      // Pressure Econ Bar (Bright Pink)
      ctx.fillStyle = '#FF4DB8';
      ctx.fillRect(padLeft, y + barH + 2, pressW, barH);

      // Gain text
      ctx.fillStyle = '#10B981';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`+${item.econ_diff.toFixed(2)}`, padLeft + Math.max(normW, pressW) + 6, y + barH);
    });
  }

  // Initial Table & Chart Renders
  renderBatters();
  renderBowlers();
  renderAllCharts();

  // Initialize Pitch Telemetry Visualizer
  if (typeof window.SupeRRPitch3D !== 'undefined') {
    new window.SupeRRPitch3D('hero-pitch-container');
  }

  window.addEventListener('resize', () => {
    renderAllCharts();
  });
});
