(function () {
  'use strict';

  /* ── Sidebar & Avatar (same as javascript.js pattern) ── */
//   const app = document.querySelector('.app');
//   const toggleBtn = document.getElementById('sidebarToggle');
//   const avatarMenu = document.getElementById('avatarMenu');
//   const avatarToggle = document.getElementById('avatarToggle');

//   if (toggleBtn && app) {
//     toggleBtn.addEventListener('click', () => {
//       const collapsed = app.classList.toggle('sidebar-collapsed');
//       toggleBtn.setAttribute('aria-expanded', String(!collapsed));
//       toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
//       const logoBig = document.getElementById('logo-big');
//       const logoSmall = document.getElementById('logo-small');
//       const isBigVisible = logoBig.style.display !== 'none';
//       logoBig.style.display = isBigVisible ? 'none' : 'flex';
//       logoSmall.style.display = isBigVisible ? 'flex' : 'none';
//     });
//   }

//   if (avatarMenu && avatarToggle) {
//     avatarToggle.addEventListener('click', (e) => {
//       e.stopPropagation();
//       const opened = avatarMenu.classList.toggle('open');
//       avatarToggle.setAttribute('aria-expanded', String(opened));
//     });
//     document.addEventListener('click', (e) => {
//       if (!avatarMenu.contains(e.target)) {
//         avatarMenu.classList.remove('open');
//         avatarToggle.setAttribute('aria-expanded', 'false');
//       }
//     });
//   }

  /* ── Tab switching ── */
  const tabs = document.querySelectorAll('.cw-tab');
  const tabPanels = { chat: 'tabChat', voice: 'tabVoice', avatar: 'tabAvatar' };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      Object.values(tabPanels).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      const panel = document.getElementById(tabPanels[tab.dataset.tab]);
      if (panel) panel.style.display = 'block';
    });
  });

  /* ── Color pickers sync ── */
  function bindColorPair(swatchId, hexId, onUpdate) {
    const swatch = document.getElementById(swatchId);
    const hex = document.getElementById(hexId);
    if (!swatch || !hex) return;

    swatch.addEventListener('input', () => {
      hex.value = swatch.value.toUpperCase();
      if (onUpdate) onUpdate(swatch.value);
    });

    hex.addEventListener('input', () => {
      const v = hex.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        swatch.value = v;
        if (onUpdate) onUpdate(v);
      }
    });
  }

  bindColorPair('primaryColor', 'primaryHex', (color) => {
    document.getElementById('cwpHeader').style.background = buildGradient(color, document.getElementById('secondaryColor').value);
    document.getElementById('cwpFab').style.background = color;
    document.getElementById('cwpSendBtn').querySelector('svg').style.stroke = color;
  });

  bindColorPair('secondaryColor', 'secondaryHex', (color) => {
    document.getElementById('cwpHeader').style.background = buildGradient(document.getElementById('primaryColor').value, color);
  });

  bindColorPair('logoBgColor', 'logoBgHex', (color) => {
    document.getElementById('cwpAvatar').style.background = color;
  });

  bindColorPair('bubbleColor', 'bubbleHex', () => {});

  function buildGradient(c1, c2) {
    return `linear-gradient(90deg, ${c1}, ${c2})`;
  }

  /* Apply initial gradient */
//   document.getElementById('cwpHeader').style.background = buildGradient('#6038B3', '#6366F1');
//   document.getElementById('cwpFab').style.background = '#6038B3';

  /* ── Steppers ── */
  document.querySelectorAll('.cw-stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isTime = target.id === 'timeoutVal';
      if (isTime) {
        const mins = [1, 2, 5, 10, 15, 30];
        let cur = parseInt(target.value) || 1;
        let idx = mins.indexOf(cur);
        if (btn.dataset.action === 'inc') idx = Math.min(mins.length - 1, idx + 1);
        else idx = Math.max(0, idx - 1);
        target.value = mins[idx] + ' Min';
      } else {
        let v = parseInt(target.value) || 0;
        const min = parseInt(target.min) || 0;
        const max = parseInt(target.max) || 999;
        v = btn.dataset.action === 'inc' ? Math.min(max, v + 1) : Math.max(min, v - 1);
        target.value = v;
      }
    });
  });

  /* ── Live preview: title & subtitle ── */
  const headerTitle = document.getElementById('headerTitle');
  const companyName = document.getElementById('companyName');
  const cwpTitle    = document.getElementById('cwpTitle');
  const cwpSubtitle = document.getElementById('cwpSubtitle');
  const welcomeMsg  = document.getElementById('welcomeMsg');
  const cwpBubble   = document.getElementById('cwpBubble');
  const inputPlaceholder = document.getElementById('inputPlaceholder');
  const cwpPlaceholderInput = document.getElementById('cwpPlaceholderInput');

  if (headerTitle) headerTitle.addEventListener('input', () => { cwpTitle.textContent = headerTitle.value || 'Chat with us'; });
  if (companyName) companyName.addEventListener('input', () => { cwpSubtitle.textContent = companyName.value || 'AI Assistant'; });
  if (welcomeMsg)  welcomeMsg.addEventListener('input',  () => { cwpBubble.textContent  = welcomeMsg.value  || 'Hi! How can I help you today?'; });
  if (inputPlaceholder) inputPlaceholder.addEventListener('input', () => { cwpPlaceholderInput.placeholder = inputPlaceholder.value || 'Type your message...'; });

  /* ── Powered-by toggle ── */
  const togglePoweredBy = document.getElementById('togglePoweredBy');
  const cwpPowered      = document.getElementById('cwpPowered');
  if (togglePoweredBy) togglePoweredBy.addEventListener('change', () => {
    cwpPowered.style.display = togglePoweredBy.checked ? 'block' : 'none';
  });

  /* ── Suggested messages ── */
  const suggestList  = document.getElementById('suggestList');
  const cwpPills     = document.getElementById('cwpPills');
  const addSuggestBtn = document.getElementById('addSuggestBtn');

  function syncPills() {
    const texts = [...suggestList.querySelectorAll('.cw-suggest-text')].map(s => s.textContent.trim());
    cwpPills.innerHTML = texts.map(t => `<button class="cwp-pill">${t}</button>`).join('');
  }

  suggestList.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.cw-suggest-del');
    if (delBtn) { delBtn.closest('.cw-suggest-item').remove(); syncPills(); }
  });

  if (addSuggestBtn) {
    addSuggestBtn.addEventListener('click', () => {
      const text = prompt('Enter suggested message:');
      if (!text || !text.trim()) return;
      const item = document.createElement('div');
      item.className = 'cw-suggest-item';
      item.innerHTML = `
        <span class="cw-drag-handle"><i class="bi bi-grip-vertical"></i></span>
        <span class="cw-suggest-text">${text.trim()}</span>
        <button type="button" class="cw-suggest-del" aria-label="Remove"><i class="bi bi-trash3"></i></button>
      `;
      suggestList.appendChild(item);
      syncPills();
    });
  }

  /* ── Zoom label ── */
  const zoomLabel = document.getElementById('zoomLabel');
  const zooms = ['100%', '150%', '200%'];
  let zoomIdx = 2;
  if (zoomLabel) {
    zoomLabel.parentElement.addEventListener('click', () => {
      zoomIdx = (zoomIdx + 1) % zooms.length;
      zoomLabel.textContent = zooms[zoomIdx];
    });
  }

  /* ── Reset ── */
  const cwReset = document.getElementById('cwReset');
  if (cwReset) {
    cwReset.addEventListener('click', () => {
      if (confirm('Reset all settings to defaults?')) location.reload();
    });
  }

  /* ── Save ── */
  const cwSave = document.getElementById('cwSave');
  if (cwSave) {
    cwSave.addEventListener('click', () => {
      cwSave.textContent = 'Saved ✓';
      cwSave.style.background = '#45b288';
      setTimeout(() => { cwSave.textContent = 'Save Configuration'; cwSave.style.background = ''; }, 2000);
    });
  }

  /* ── Border radius live update ── */
  const borderRadiusInput = document.getElementById('borderRadius');
  const cwpWindow = document.getElementById('cwpWindow');
  if (borderRadiusInput && cwpWindow) {
    borderRadiusInput.addEventListener('input', () => {
      cwpWindow.style.borderRadius = borderRadiusInput.value + 'px';
    });
  }

})();