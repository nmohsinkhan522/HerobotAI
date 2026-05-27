(() => {
  const teamAccessMenuButton = document.querySelector("[data-team-access-menu-button]");
  const teamAccessMenu = document.querySelector("[data-team-access-menu]");

  if (!teamAccessMenuButton || !teamAccessMenu) return;

  const teamAccessCloseMenu = () => {
    teamAccessMenu.hidden = true;
    teamAccessMenuButton.setAttribute("aria-expanded", "false");
  };

  const teamAccessOpenMenu = () => {
    teamAccessMenu.hidden = false;
    teamAccessMenuButton.setAttribute("aria-expanded", "true");
  };

  teamAccessMenuButton.setAttribute("aria-expanded", "false");

  teamAccessMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const teamAccessIsHidden = teamAccessMenu.hidden;

    if (teamAccessIsHidden) {
      teamAccessOpenMenu();
    } else {
      teamAccessCloseMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!teamAccessMenu.contains(event.target) && !teamAccessMenuButton.contains(event.target)) {
      teamAccessCloseMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      teamAccessCloseMenu();
      teamAccessMenuButton.focus();
    }
  });
})();