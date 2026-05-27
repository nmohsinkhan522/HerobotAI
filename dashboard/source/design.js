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

  function switchRightPane(tabName) {
    const rpChat = document.getElementById('rpChatPreview');
    const rpAvatar = document.getElementById('rpAvatarPreview');
    if (!rpChat || !rpAvatar) return;
    if (tabName === 'avatar') {
      rpChat.style.display = 'none';
      rpAvatar.style.display = 'flex';
    } else {
      rpChat.style.display = '';
      rpAvatar.style.display = 'none';
    }
  }

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
      switchRightPane(tab.dataset.tab);
    });
  });


/* Voice Widget */

const voiceToggle = document.getElementById('voiceFeatureToggle');
const voicePanel = document.querySelector('.voice-widget-panel');
const voiceCards = document.querySelectorAll('.vw-voice-card');

function resetAllVoiceCards() {
  voiceCards.forEach(c => {
    c.classList.remove('active');
    const btn = c.querySelector('.vw-play');
    const icon = c.querySelector('.vw-play i');
    if (btn) btn.classList.remove('active');
    if (icon) icon.className = 'bi bi-play-fill';
  });
}

voiceCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't double-fire if play button was clicked
    if (e.target.closest('.vw-play')) return;
    resetAllVoiceCards();
    card.classList.add('active');
    const playBtn = card.querySelector('.vw-play');
    if (playBtn) {
      playBtn.classList.add('active');
      const icon = playBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-pause-fill';
    }
  });
});

document.querySelectorAll('.vw-play').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.vw-voice-card');
    if (!card) return;
    const wasActive = btn.classList.contains('active');
    resetAllVoiceCards();
    if (!wasActive) {
      card.classList.add('active');
      btn.classList.add('active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'bi bi-pause-fill';
    }
  });
});

if (voiceToggle && voicePanel) {
  voiceToggle.addEventListener('change', () => {
    voicePanel.classList.toggle('voice-disabled', !voiceToggle.checked);
  });
}

/* Range slider live value display */
const speechSpeed = document.getElementById('speechSpeed');
const speechSpeedVal = document.getElementById('speechSpeedVal');
const pitchSpeed = document.getElementById('pitchSpeed');
const pitchSpeedVal = document.getElementById('pitchSpeedVal');

function rangeToSpeed(val) {
  return (0.5 + (val / 100) * 1.5).toFixed(1) + 'x';
}

if (speechSpeed && speechSpeedVal) {
  speechSpeed.addEventListener('input', () => {
    speechSpeedVal.textContent = rangeToSpeed(speechSpeed.value);
    const pct = speechSpeed.value + '%';
    speechSpeed.style.background = `linear-gradient(to right, #7acdb8 0%, #7acdb8 ${pct}, #e5e7eb ${pct}, #e5e7eb 100%)`;
  });
}

if (pitchSpeed && pitchSpeedVal) {
  pitchSpeed.addEventListener('input', () => {
    pitchSpeedVal.textContent = rangeToSpeed(pitchSpeed.value);
    const pct = pitchSpeed.value + '%';
    pitchSpeed.style.background = `linear-gradient(to right, #7acdb8 0%, #7acdb8 ${pct}, #e5e7eb ${pct}, #e5e7eb 100%)`;
  });
}

/* Voice Widget end */
  

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
//   const suggestList  = document.getElementById('suggestList');
//   const cwpPills     = document.getElementById('cwpPills');
//   const addSuggestBtn = document.getElementById('addSuggestBtn');

//   function syncPills() {
//     const texts = [...suggestList.querySelectorAll('.cw-suggest-text')].map(s => s.textContent.trim());
//     cwpPills.innerHTML = texts.map(t => `<button class="cwp-pill">${t}</button>`).join('');
//   }

// //   suggestList.addEventListener('click', (e) => {
// //     const delBtn = e.target.closest('.cw-suggest-del');
// //     if (delBtn) { delBtn.closest('.cw-suggest-item').remove(); syncPills(); }
// //   });

// suggestList.addEventListener('click', (e) => {
//   const delBtn = e.target.closest('.cw-suggest-del');
//   if (delBtn) {
//     if (!confirm('Are you sure you want to remove?')) return;
//     delBtn.closest('.cw-suggest-item').remove();
//     syncPills();
//   }
// });


//   if (addSuggestBtn) {
//     addSuggestBtn.addEventListener('click', () => {
//       const text = prompt('Enter suggested message:');
//       if (!text || !text.trim()) return;
//       const item = document.createElement('div');
//       item.className = 'cw-suggest-item';
//       item.innerHTML = `
//         <span class="cw-drag-handle"><i class="bi bi-grip-vertical"></i></span>
//         <span class="cw-suggest-text">${text.trim()}</span>
//         <button type="button" class="cw-suggest-del" aria-label="Remove"><i class="bi bi-trash3"></i></button>
//       `;
//       suggestList.appendChild(item);
//       syncPills();
//     });
//   }



const suggestList  = document.getElementById('suggestList');
const cwpPills     = document.getElementById('cwpPills');
const addSuggestBtn = document.getElementById('addSuggestBtn');

function syncPills() {
  const texts = [...suggestList.querySelectorAll('.cw-suggest-text')].map(s => s.textContent.trim());
  cwpPills.innerHTML = texts.map(t => `<button class="cwp-pill">${t}</button>`).join('');
}

function createFormElement() {
  const container = document.createElement('div');
  container.className = 'cw-suggest-form-container';
  container.innerHTML = `
    <div class="cw-suggest-form">
      <input type="text" class="cw-suggest-input" placeholder="Enter suggested message..."/>
      <button type="button" class="cw-btn-save cw-suggest-save">Add</button>
      <button type="button" class="cw-btn-reset cw-suggest-cancel">Cancel</button>
    </div>
  `;
  return container;
}

// Insert form after the button and wire handlers
if (addSuggestBtn) {
  addSuggestBtn.addEventListener('click', (e) => {
    // avoid creating duplicate forms
    const existing = document.querySelector('.cw-suggest-form-container');
    if (existing) {
      const input = existing.querySelector('.cw-suggest-input');
      input.focus();
      return;
    }

    const formEl = createFormElement();
    // insert immediately after the button
    addSuggestBtn.after(formEl); // insertAdjacentElement or after() recommended by MDN [web:11]

    const input = formEl.querySelector('.cw-suggest-input');
    const saveBtn = formEl.querySelector('.cw-suggest-save');
    const cancelBtn = formEl.querySelector('.cw-suggest-cancel');

    // focus input
    input.focus();

    function closeForm() {
      formEl.remove();
    }

    cancelBtn.addEventListener('click', () => closeForm());

    saveBtn.addEventListener('click', () => {
      const text = input.value;
      if (!text || !text.trim()) {
        input.focus();
        return;
      }
      const item = document.createElement('div');
      item.className = 'cw-suggest-item';
      item.innerHTML = `
        <span class="cw-drag-handle"><i class="bi bi-grip-vertical"></i></span>
        <span class="cw-suggest-text">${text.trim()}</span>
        <button type="button" class="cw-suggest-del" aria-label="Remove"><i class="bi bi-trash3"></i></button>
      `;
      suggestList.appendChild(item);
      syncPills();
      closeForm();
    });

    // allow Enter to submit, Escape to cancel
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        saveBtn.click();
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        cancelBtn.click();
      }
    });
  });
}

// existing delete listener with confirmation
suggestList.addEventListener('click', (e) => {
  const delBtn = e.target.closest('.cw-suggest-del');
  if (delBtn) {
    if (!confirm('Are you sure you want to remove?')) return;
    delBtn.closest('.cw-suggest-item').remove();
    syncPills();
  }
});



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



/* ═══════════════════════════════════════════
   AVATAR WIDGET JS
═══════════════════════════════════════════ */
(function() {

  /* --- Feature toggle --- */
  const avatarFeatureToggle = document.getElementById('avatarFeatureToggle');
  const awPanel = document.querySelector('.aw-panel');
  if (avatarFeatureToggle && awPanel) {
    avatarFeatureToggle.addEventListener('change', () => {
      awPanel.classList.toggle('aw-disabled', !avatarFeatureToggle.checked);
    });
  }

  /* --- Appearance pill group (Full Body / Half Body / Face Only) --- */
  function bindBtnGroup(groupId, onSelect) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.aw-btn-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.aw-btn-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (onSelect) onSelect(btn.dataset.val);
      });
    });
  }

  bindBtnGroup('appearanceGroup', (val) => {
    const rp = document.getElementById('rpAvatarPreview');
    if (!rp) return;
    rp.classList.remove('mode-full', 'mode-half', 'mode-face');
    rp.classList.add('mode-' + val);
  });

  bindBtnGroup('styleGroup', () => {});

  /* --- Gender tabs --- */
  const genderFemale = document.getElementById('genderFemale');
  const genderMale = document.getElementById('genderMale');
  [genderFemale, genderMale].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      [genderFemale, genderMale].forEach(b => b && b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* --- Avatar Carousel --- */
  const carousel = document.getElementById('awCarousel');
  const slides = carousel ? Array.from(carousel.querySelectorAll('.aw-char-slide')) : [];
  let selectedIdx = 2;

  const charClasses = ['avp-char-c1','avp-char-c2','avp-char-c3','avp-char-c4','avp-char-c5'];

  function updateCarousel() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('aw-char-selected', i === selectedIdx);
    });
    // Update right pane character
    const avpChar = document.getElementById('avpCharacter');
    if (avpChar) {
      avpChar.className = 'avp-character ' + (charClasses[selectedIdx] || 'avp-char-c3');
    }
  }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      selectedIdx = i;
      updateCarousel();
    });
  });

  const awPrev = document.getElementById('awPrev');
  const awNext = document.getElementById('awNext');

  if (awPrev) awPrev.addEventListener('click', () => {
    selectedIdx = (selectedIdx - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  if (awNext) awNext.addEventListener('click', () => {
    selectedIdx = (selectedIdx + 1) % slides.length;
    updateCarousel();
  });

  /* --- Deselect All checkbox --- */
  const awDeselectAll = document.getElementById('awDeselectAll');
  const awAnimCbs = document.querySelectorAll('.aw-anim-cb');

  if (awDeselectAll) {
    awDeselectAll.addEventListener('change', () => {
      awAnimCbs.forEach(cb => { cb.checked = awDeselectAll.checked; });
    });
    awAnimCbs.forEach(cb => {
      cb.addEventListener('change', () => {
        awDeselectAll.checked = [...awAnimCbs].every(c => c.checked);
      });
    });
  }

  /* --- Character Position live update --- */
  const awCharPosition = document.getElementById('awCharPosition');
  const avpCharWrap = document.getElementById('avpCharWrap');
  const rpAvatarPreview = document.getElementById('rpAvatarPreview');
  if (awCharPosition) {
    awCharPosition.addEventListener('change', () => {
      const val = awCharPosition.value;
      if (!avpCharWrap) return;
      avpCharWrap.classList.toggle('pos-right', val === 'Right');
      if (rpAvatarPreview) rpAvatarPreview.classList.toggle('pos-right', val === 'Right');
    });
  }

  /* --- Avatar Size live update --- */
  const awAvatarSize = document.getElementById('awAvatarSize');
  const avpChar = document.getElementById('avpCharacter');
  if (awAvatarSize && avpChar) {
    const observer = new MutationObserver(() => {
      const sz = parseInt(awAvatarSize.value) || 80;
      const w = Math.round(sz * 1.3);
      const h = Math.round(sz * 2.0);
      avpChar.style.width = w + 'px';
      avpChar.style.height = h + 'px';
    });
    // Watch stepper button clicks
    document.querySelectorAll('.cw-stepper-btn').forEach(btn => {
      if (btn.dataset.target === 'awAvatarSize') {
        btn.addEventListener('click', () => {
          setTimeout(() => {
            const sz = parseInt(awAvatarSize.value) || 80;
            const w = Math.round(sz * 1.3);
            const h = Math.round(sz * 2.0);
            if (avpChar) {
              avpChar.style.width = w + 'px';
              avpChar.style.height = h + 'px';
            }
          }, 10);
        });
      }
    });
  }

  /* --- Waving animation toggle --- */
  const avpCharEl = document.getElementById('avpCharacter');
  if (avpCharEl) {
    let wavingTimer = null;
    function startWaving() {
      avpCharEl.classList.add('anim-waving');
      wavingTimer = setTimeout(() => avpCharEl.classList.remove('anim-waving'), 3000);
    }
    // Start waving after 2 seconds on avatar tab open
    const avatarTab = document.querySelector('[data-tab="avatar"]');
    if (avatarTab) {
      avatarTab.addEventListener('click', () => {
        setTimeout(startWaving, 2000);
      });
    }
  }

})();

})();