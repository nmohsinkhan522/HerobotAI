(() => {
  const planSelectionDemoButton = document.querySelector("[data-plan-selection-demo]");

  if (!planSelectionDemoButton) return;

  planSelectionDemoButton.addEventListener("click", () => {
    planSelectionDemoButton.blur();
  });
})();