// ─────────────────────────────────────────────
//  modal.js  –  Upload modal logic
//  Depends on: overlay, modal, fileInput,
//  dropzone, fileList, uploadBtn, cancelBtn,
//  closeBtn, progressWrap, progressBar,
//  progressPct, successMsg  (all in index.html)
// ─────────────────────────────────────────────

(function () {
  'use strict';

  /* ── DOM refs ── */
  const overlay      = document.getElementById('overlay');
  const modal        = document.getElementById('modal');
  const modalTitle   = document.getElementById('modalTitle');
  const fileInput    = document.getElementById('fileInput');
  const uploadLink   = document.getElementById('uploadLink');
  const dropzone     = document.getElementById('dropzone');
  const fileList     = document.getElementById('fileList');
  const uploadBtn    = document.getElementById('uploadBtn');
  const cancelBtn    = document.getElementById('cancelBtn');
  const closeBtn     = document.getElementById('closeBtn');
  const progressWrap = document.getElementById('progressWrap');
  const progressBar  = document.getElementById('progressBar');
  const progressPct  = document.getElementById('progressPct');
  const successMsg   = document.getElementById('successMsg');

  /* ── State ── */
  const ALLOWED = ['pdf','doc','docx','svg','png','jpg','jpeg','gif'];
  let files       = [];
  let uploadTimer = null;

  /* ── Helpers ── */
  const fmt = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1) + ' ' + sizes[i];
  };

  const iconFor = (name) => {
    const ext = (name.split('.').pop() || '').toUpperCase();
    return ext.length > 4 ? ext.slice(0, 3) : ext;
  };

  /* ── Render file list ── */
  const render = () => {
    fileList.innerHTML = files.map((f, i) => `
      <div class="file-item">
        <div class="file-icon">${iconFor(f.name)}</div>
        <div class="file-meta">
          <div class="file-name">${f.name}</div>
          <div class="file-size">${fmt(f.size)}</div>
        </div>
        <button class="remove" aria-label="Remove file" data-index="${i}">&times;</button>
      </div>
    `).join('');

    /* Attach remove handlers after render */
    fileList.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        files.splice(Number(btn.dataset.index), 1);
        render();
      });
    });
  };

  /* ── Add files (dedup) ── */
  const addFiles = (fileListLike) => {
    [...fileListLike].forEach(f => {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (ALLOWED.includes(ext) && !files.some(x => x.name === f.name && x.size === f.size)) {
        files.push(f);
      }
    });
    render();
  };

  /* ── Reset modal state (called on every open AND on cancel) ── */
  const resetModal = () => {
    clearInterval(uploadTimer);
    files = [];
    fileInput.value = '';
    fileList.innerHTML = '';
    progressWrap.style.display = 'none';
    successMsg.style.display   = 'none';
    progressBar.style.width    = '0%';
    progressPct.textContent    = '0%';
    uploadBtn.disabled         = false;
    modal.classList.remove('closing');
  };

  /* ── Open modal ── */
  const openModal = (source) => {
    resetModal();                              // always start fresh
    modalTitle.textContent = `Add ${source}`; // update title per source type
    overlay.classList.add('show');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';  // prevent background scroll
  };

  /* ── Close modal (NO overlay.remove() – just hide) ── */
  const closeModal = () => {
    modal.classList.add('closing');
    overlay.classList.remove('show');

    /* Wait for CSS closing animation then fully hide */
    setTimeout(() => {
      modal.classList.remove('show', 'closing');
      document.body.style.overflow = '';
      resetModal();                            // clean up after close
    }, 220);
  };

  /* ── File input / drop events ── */
  uploadLink.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => addFiles(e.target.files));

  dropzone.addEventListener('dragover',  e => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', ()  => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });

  /* ── Upload button ── */
  uploadBtn.addEventListener('click', () => {
    if (!files.length) return;
    successMsg.style.display   = 'none';
    progressWrap.style.display = 'block';
    uploadBtn.disabled         = true;

    let p = 0;
    clearInterval(uploadTimer);
    uploadTimer = setInterval(() => {
      p += 4;
      if (p >= 100) {
        p = 100;
        clearInterval(uploadTimer);
        progressBar.style.width = '100%';
        progressPct.textContent = '100%';
        setTimeout(() => {
          progressWrap.style.display = 'none';
          successMsg.style.display   = 'block';
          uploadBtn.disabled         = false;
        }, 250);
        return;
      }
      progressBar.style.width = p + '%';
      progressPct.textContent = p + '%';
    }, 50);
  });

  /* ── Cancel / Close buttons ── */
  cancelBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('click',  closeModal);

  /* ── Click outside modal to close ── */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  /* ── Escape key to close ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

  /* ── Open-modal triggers (all .open-modal buttons) ── */
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', function () {
      const source = this.dataset.source || 'Documents';
      openModal(source);
    });
  });

})();