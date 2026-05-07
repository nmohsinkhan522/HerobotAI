// ─────────────────────────────────────────────
//  modal.js  –  Upload modal logic
//  Supports: Documents | Text | API modals
// ─────────────────────────────────────────────

(function () {
  'use strict';

  /* ── DOM refs (shared) ── */
  const overlay = document.getElementById('overlay');
  const modal   = document.getElementById('modal');

  /* ── Upload timer ── */
  let uploadTimer = null;

  /* ── Modal configs per source ── */
  const MODAL_CONFIGS = {
    Documents: {
      title:    'Add Documents',
      subtitle: 'If you are uploading a PDF, make sure you can select/highlight the text.',
      render:   renderDocumentsModal,
    },
    Text: {
      title:    'Add Text',
      subtitle: 'Enter the text you want to include while crawling the website.',
      render:   renderTextModal,
    },
    API: {
      title:    'Add API',
      subtitle: 'Connect an external API as a knowledge source for your bot.',
      render:   renderAPIModal,
    },
  };

  /* ════════════════════════════════════════════
     DOCUMENTS MODAL
  ════════════════════════════════════════════ */
  function renderDocumentsModal(container) {
    const ALLOWED = ['pdf','doc','docx','svg','png','jpg','jpeg','gif'];
    let files = [];

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

    container.innerHTML = `
      <input id="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.svg,.png,.jpg,.jpeg,.gif" style="display:none"/>

      <div class="dropzone" id="dropzone">
        <div class="drop-inner" id="uploadLink">
          <div class="icon-wrap" aria-hidden="true">
            <i><img src="images/upload-icon.svg"/></i>
          </div>
          <p class="upload-text"><span class="upload-link">Click to upload</span> or drag and drop</p>
          <div class="formats">PDF, DOC, DOCX, SVG, PNG, JPG or GIF (max. 800×400px)</div>
        </div>
      </div>

      <div class="file-list" id="fileList"></div>

      <div class="progress-wrap" id="progressWrap" style="display:none">
        <div class="progress-label"><span>Uploading</span><span id="progressPct">0%</span></div>
        <div class="bar"><span id="progressBar" style="width:0%"></span></div>
      </div>

      <div class="success" id="successMsg" style="display:none">Upload completed successfully.</div>

      <div class="modal-actions">
        <button class="btn cancel" id="cancelBtn">CANCEL</button>
        <button class="btn upload" id="uploadBtn">UPLOAD</button>
      </div>
    `;

    const fileInput    = container.querySelector('#fileInput');
    const uploadLink   = container.querySelector('#uploadLink');
    const dropzone     = container.querySelector('#dropzone');
    const fileList     = container.querySelector('#fileList');
    const uploadBtn    = container.querySelector('#uploadBtn');
    const cancelBtn    = container.querySelector('#cancelBtn');
    const progressWrap = container.querySelector('#progressWrap');
    const progressBar  = container.querySelector('#progressBar');
    const progressPct  = container.querySelector('#progressPct');
    const successMsg   = container.querySelector('#successMsg');

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
      fileList.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => { files.splice(Number(btn.dataset.index), 1); render(); });
      });
    };

    const addFiles = (list) => {
      [...list].forEach(f => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        if (ALLOWED.includes(ext) && !files.some(x => x.name === f.name && x.size === f.size)) files.push(f);
      });
      render();
    };

    uploadLink.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => addFiles(e.target.files));

    dropzone.addEventListener('dragover',  e => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', ()  => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault(); dropzone.classList.remove('dragover'); addFiles(e.dataTransfer.files);
    });

    uploadBtn.addEventListener('click', () => {
      if (!files.length) return;
      successMsg.style.display   = 'none';
      progressWrap.style.display = 'block';
      uploadBtn.disabled = true;
      let p = 0;
      clearInterval(uploadTimer);
      uploadTimer = setInterval(() => {
        p += 4;
        if (p >= 100) {
          p = 100; clearInterval(uploadTimer);
          progressBar.style.width = '100%'; progressPct.textContent = '100%';
          setTimeout(() => {
            progressWrap.style.display = 'none';
            successMsg.style.display   = 'block';
            uploadBtn.disabled = false;
          }, 250);
          return;
        }
        progressBar.style.width = p + '%'; progressPct.textContent = p + '%';
      }, 50);
    });

    cancelBtn.addEventListener('click', closeModal);
  }

  /* ════════════════════════════════════════════
     TEXT MODAL
  ════════════════════════════════════════════ */
  function renderTextModal(container) {
    const MAX_CHARS = 1500;

    container.innerHTML = `
      <div class="modal-field">
        <label class="modal-label" for="textTitle">Text Title</label>
        <input class="modal-input" id="textTitle" type="text" placeholder="What is your title?"/>
      </div>

      <div class="modal-field">
        <label class="modal-label" for="textBody">Text</label>
        <textarea class="modal-textarea" id="textBody" maxlength="${MAX_CHARS}"
          placeholder="e.g. Add your website link and describe what this page is about, such as pricing details, product features, or support information."></textarea>
        <div class="char-count"><span id="charCount">0</span>/${MAX_CHARS}</div>
      </div>

      <div class="modal-actions">
        <button class="btn cancel" id="cancelBtn">CANCEL</button>
        <button class="btn upload" id="addBtn">ADD</button>
      </div>
    `;

    const textBody  = container.querySelector('#textBody');
    const charCount = container.querySelector('#charCount');
    const cancelBtn = container.querySelector('#cancelBtn');
    const addBtn    = container.querySelector('#addBtn');

    textBody.addEventListener('input', () => {
      charCount.textContent = textBody.value.length;
    });

    addBtn.addEventListener('click', () => {
      const title = container.querySelector('#textTitle').value.trim();
      const body  = textBody.value.trim();
      if (!title || !body) {
        alert('Please fill in both the title and text fields.');
        return;
      }
      // TODO: handle save logic here
      console.log('Text saved:', { title, body });
      closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);
  }

  /* ════════════════════════════════════════════
     API MODAL
  ════════════════════════════════════════════ */
  function renderAPIModal(container) {
    container.innerHTML = `
      <div class="modal-field">
        <label class="modal-label" for="apiName">API Name</label>
        <input class="modal-input" id="apiName" type="text" placeholder="e.g. My Product API"/>
      </div>

      <div class="modal-field">
        <label class="modal-label" for="apiUrl">API Endpoint URL</label>
        <input class="modal-input" id="apiUrl" type="url" placeholder="https://api.example.com/data"/>
      </div>

      <div class="modal-field">
        <label class="modal-label" for="apiKey">API Key <span class="optional">(optional)</span></label>
        <input class="modal-input" id="apiKey" type="password" placeholder="Bearer token or API key"/>
      </div>

      <div class="modal-field">
        <label class="modal-label" for="apiMethod">Method</label>
        <div class="modal-select-wrap">
          <select class="modal-select" id="apiMethod">
            <option value="">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn cancel" id="cancelBtn">CANCEL</button>
        <button class="btn upload" id="connectBtn">CONNECT</button>
      </div>
    `;

    const cancelBtn  = container.querySelector('#cancelBtn');
    const connectBtn = container.querySelector('#connectBtn');

    connectBtn.addEventListener('click', () => {
      const name   = container.querySelector('#apiName').value.trim();
      const url    = container.querySelector('#apiUrl').value.trim();
      const method = container.querySelector('#apiMethod').value;
      if (!name || !url) {
        alert('Please fill in the API Name and Endpoint URL.');
        return;
      }
      // TODO: handle connect logic here
      console.log('API connected:', { name, url, method });
      closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);
  }

  /* ════════════════════════════════════════════
     OPEN / CLOSE
  ════════════════════════════════════════════ */
  const openModal = (source) => {
    const config = MODAL_CONFIGS[source] || MODAL_CONFIGS['Documents'];

    // Build fresh modal HTML on every open
    modal.innerHTML = `
      <div class="top">
        <div>
          <h2 id="modalTitle">${config.title}</h2>
          <p class="subtitle">${config.subtitle}</p>
        </div>
        <button class="close" id="closeBtn" aria-label="Close">
          <img src="images/CloseIcon.svg"/>
        </button>
      </div>
      <div id="modalBody"></div>
    `;

    // Wire close button
    modal.querySelector('#closeBtn').addEventListener('click', closeModal);

    // Render source-specific content into #modalBody
    config.render(modal.querySelector('#modalBody'));

    // Show overlay + modal
    clearInterval(uploadTimer);
    overlay.classList.add('show');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('closing');
    setTimeout(() => {
      overlay.classList.remove('show');
      modal.classList.remove('show', 'closing');
      modal.innerHTML = '';          // wipe so next open is always fresh
      document.body.style.overflow = '';
      clearInterval(uploadTimer);
    }, 220);
  };

  /* ── Escape key ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

  /* ── Click backdrop to close ── */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  /* ── Trigger buttons ── */
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', function () {
      openModal(this.dataset.source || 'Documents');
    });
  });

})();