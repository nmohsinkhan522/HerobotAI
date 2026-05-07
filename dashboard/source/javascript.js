    const app = document.querySelector('.app');
    const toggleBtn = document.getElementById('sidebarToggle');
    const avatarMenu = document.getElementById('avatarMenu');
    const avatarToggle = document.getElementById('avatarToggle');

    if (toggleBtn && app) {
      toggleBtn.addEventListener('click', () => {
        const collapsed = app.classList.toggle('sidebar-collapsed');
        toggleBtn.setAttribute('aria-expanded', String(!collapsed));
        toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');

        const logoBig = document.getElementById('logo-big');
        const logoSmall = document.getElementById('logo-small');

        const isBigVisible = logoBig.style.display !== 'none';

        logoBig.style.display = isBigVisible ? 'none' : 'flex';
        logoSmall.style.display = isBigVisible ? 'flex' : 'none';
      });
    }

    if (avatarMenu && avatarToggle) {
      
      avatarToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const opened = avatarMenu.classList.toggle('open');
        avatarToggle.setAttribute('aria-expanded', String(opened));
      });

      document.addEventListener('click', (event) => {
        if (!avatarMenu.contains(event.target)) {
          avatarMenu.classList.remove('open');
          avatarToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

  const selects = document.querySelectorAll('.select');

  selects.forEach(select => {
    function updateColor() {
      if (select.selectedIndex === 0) {
        select.style.color = '#797B8D'; // first option color
      } else {
        select.style.color = '#3d3d3d'; // selected option color
      }
    }

    updateColor();
    select.addEventListener('change', updateColor);
  });
    