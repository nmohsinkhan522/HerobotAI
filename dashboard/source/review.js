// For review page
    const selectAll = document.getElementById('selectAll');
    const itemChecks = () => document.querySelectorAll('.item-check');
    // const addBtn = document.getElementById('addBtn');
    // const popup = document.getElementById('popup');
    // const closePopup = document.getElementById('closePopup');
    const sortSelect = document.getElementById('sortSelect');
    const list = document.getElementById('list');
    const chatBox = document.getElementById('chatBox');
    const chatToggle = document.getElementById('chatToggle');
    const rowsPerPage = document.getElementById('rowsPerPage');
    const pageInfo = document.getElementById('pageInfo');
    const firstPage = document.getElementById('firstPage');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const lastPage = document.getElementById('lastPage');
    let currentPage = 1;

    function updateItemHandlers() {
      document.querySelectorAll('.caret-btn').forEach(btn => {
        btn.onclick = () => {
          const row = btn.closest('.row');
          row.classList.toggle('open');
          btn.innerHTML = row.classList.contains('open') ? '<i class="bi bi-chevron-up"></i>' : '<i class="bi bi-chevron-down"></i>';
        };
      });
      document.querySelectorAll('.item-check').forEach(cb => {
        cb.onchange = () => { selectAll.checked = [...itemChecks()].every(x => x.checked); };
      });
    }

    function sortRows(mode) {
      const rows = [...list.querySelectorAll('.row')].map(row => ({
        row,
        checked: row.querySelector('.item-check').checked,
        open: row.classList.contains('open')
      }));
      if (mode !== 'default') {
        rows.sort((a, b) => {
          const ta = a.row.dataset.title.toLowerCase();
          const tb = b.row.dataset.title.toLowerCase();
          return mode === 'asc' ? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
      }
      rows.forEach(({ row, checked, open }) => {
        row.querySelector('.item-check').checked = checked;
        row.classList.toggle('open', open);
        // row.querySelector('.caret-btn').textContent = open ? '<i class="bi bi-chevron-up"></i>' : '<i class="bi bi-chevron-down"></i>';
        list.appendChild(row);
      });
      selectAll.checked = [...itemChecks()].every(x => x.checked);
      updateItemHandlers();
      renderPagination();
    }

    function renderPagination() {
      const rows = [...list.querySelectorAll('.row')];
      const perPage = parseInt(rowsPerPage.value, 10);
      const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
      currentPage = Math.min(currentPage, totalPages);
      rows.forEach((row, idx) => {
        const visible = idx >= (currentPage - 1) * perPage && idx < currentPage * perPage;
        row.style.display = visible ? '' : 'none';
      });
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      firstPage.disabled = prevPage.disabled = currentPage === 1;
      nextPage.disabled = lastPage.disabled = currentPage === totalPages;
    }

    function goToPage(page) {
      currentPage = page;
      renderPagination();
    }
    
    selectAll.addEventListener('change', () => { itemChecks().forEach(cb => cb.checked = selectAll.checked); });
    sortSelect.addEventListener('change', () => sortRows(sortSelect.value));
    rowsPerPage.addEventListener('change', () => { currentPage = 1; renderPagination(); });
    firstPage.addEventListener('click', () => goToPage(1));
    prevPage.addEventListener('click', () => goToPage(Math.max(1, currentPage - 1)));
    nextPage.addEventListener('click', () => goToPage(currentPage + 1));
    lastPage.addEventListener('click', () => { const total = Math.max(1, Math.ceil([...list.querySelectorAll('.row')].length / parseInt(rowsPerPage.value,10))); goToPage(total); });
    // addBtn.addEventListener('click', () => popup.classList.add('open'));
    // closePopup.addEventListener('click', () => popup.classList.remove('open'));
    // popup.addEventListener('click', (e) => { if (e.target === popup) popup.classList.remove('open'); });
    chatToggle.addEventListener('click', () => chatBox.classList.toggle('closed'));
    updateItemHandlers();
    renderPagination();
	const dotButtons = document.querySelectorAll('.dots-btn');

  dotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('open');
      });
      menu.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
  });
  // review page end here

  // Review page gap section start here
    const reviewSectionToggleBtn = document.getElementById('reviewSectionToggleBtn');
    const reviewSectionPane = document.getElementById('reviewSectionPane');
    const reviewSectionPaneCloseBtn = document.getElementById('reviewSectionPaneCloseBtn');
    const reviewSectionRemoveRowBtns = document.querySelectorAll('.review-section-remove-row-btn');

    reviewSectionToggleBtn.addEventListener('click', function () {
      const isOpen = reviewSectionPane.classList.toggle('review-section-is-open');
    });

    reviewSectionPaneCloseBtn.addEventListener('click', function () {
      reviewSectionPane.classList.remove('review-section-is-open');
    });

    reviewSectionRemoveRowBtns.forEach(function (button) {
      button.addEventListener('click', function () {
        const row = button.closest('.review-section-row');
        if (row) {
          row.remove();
        }
      });
    });

  // Review page gap section end here