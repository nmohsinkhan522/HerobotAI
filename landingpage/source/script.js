document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const revealElements = document.querySelectorAll('.reveal');
  const setupRows = [...document.querySelectorAll('.setup-row')];
  const progressDots = [...document.querySelectorAll('.step-dot')];
  const tracker = document.querySelector('.container.tracker-flex');
  const pricingSwitch = document.getElementById('pricing-switch');


  let currentStepIndex = -1;
  let lastStepIndex = -1;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));

  function applyStep(index) {
    if (index === currentStepIndex) return;
    lastStepIndex = currentStepIndex;
    currentStepIndex = index;

    progressDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    setupRows.forEach((row, i) => {
      row.classList.remove('active', 'enter-from-right', 'enter-from-left', 'exit-to-left', 'exit-to-right');

      if (i === index) {
        row.classList.add('active');
        if (lastStepIndex === -1 || index > lastStepIndex) row.classList.add('enter-from-right');
        else if (index < lastStepIndex) row.classList.add('enter-from-left');
        else row.classList.add('enter-from-right');
      } else if (i < index) {
        row.classList.add('exit-to-left');
      } else {
        row.classList.add('exit-to-right');
      }
    });
  }

  const setupObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;

    const chosen = visible.sort((a, b) => 
      Math.abs(a.boundingClientRect.top - window.innerHeight * 0.5) -
      Math.abs(b.boundingClientRect.top - window.innerHeight * 0.5)
    )[0];

    const index = setupRows.findIndex(row => row.id === chosen.target.id);
    if (index !== -1) applyStep(index);
  }, {
    root: null,
    threshold: 0.35,
    rootMargin: '-35% 0px -35% 0px'
  });

  setupRows.forEach(row => setupObserver.observe(row));

  const trackerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) applyStep(0);
    });
  }, {
    root: null,
    threshold: 0.5,
    rootMargin: '-45% 0px -45% 0px'
  });

  if (tracker) trackerObserver.observe(tracker);

  applyStep(-1);

  // if (pricingSwitch) {
  //   pricingSwitch.addEventListener('change', (e) => {
  //     const isYearly = e.target.checked;

  //     if (monthlyLabel && yearlyLabel) {
  //       monthlyLabel.style.opacity = isYearly ? '0.5' : '1';
  //       yearlyLabel.style.opacity = isYearly ? '1' : '0.5';
  //       monthlyLabel.style.fontWeight = isYearly ? 'normal' : 'bold';
  //       yearlyLabel.style.fontWeight = isYearly ? 'bold' : 'normal';
  //     }

  //     amountElements.forEach((el) => {
  //       el.style.opacity = '0';
  //       setTimeout(() => {
  //         el.innerText = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
  //         el.style.opacity = '1';
  //         el.style.transition = 'opacity 0.3s ease';
  //       }, 150);
  //     });
  //   });
  // }

//   function updatePricing(isYearly) {
//   amountElements.forEach((el) => {
//     const monthly = el.getAttribute('data-monthly');
//     const yearly = el.getAttribute('data-yearly');
//     el.style.opacity = '0';
//     setTimeout(() => {
//       el.textContent = isYearly ? yearly : monthly;
//       el.style.opacity = '1';
//     }, 150);
//   });

//   if (monthlyLabel && yearlyLabel) {
//     monthlyLabel.style.opacity = isYearly ? '0.5' : '1';
//     yearlyLabel.style.opacity = isYearly ? '1' : '0.5';
//     monthlyLabel.style.fontWeight = isYearly ? '400' : '700';
//     yearlyLabel.style.fontWeight = isYearly ? '700' : '400';
//   }
// }

// if (pricingSwitch) {
//   pricingSwitch.addEventListener('change', (e) => {
//     updatePricing(e.target.checked);
//   });
//   updatePricing(pricingSwitch.checked);
// }

  
});

// function setPricing(isYearly) {
//     const monthlyLabel = document.getElementById('monthly-label');
//     const yearlyLabel = document.getElementById('yearly-label');
//     const amountElements = document.querySelectorAll('.amount');

//     if (monthlyLabel && yearlyLabel) {
//       monthlyLabel.classList.toggle('active', !isYearly);
//       yearlyLabel.classList.toggle('active', isYearly);
//     }

//     amountElements.forEach((el) => {
//       const monthly = el.getAttribute('data-monthly');
//       const yearly = el.getAttribute('data-yearly');
//       el.textContent = isYearly ? yearly : monthly;
//     });
//   }


  function setPricing(isYearly) {
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');
    const amountElements = document.querySelectorAll('.amount');

    if (monthlyLabel && yearlyLabel) {
      monthlyLabel.classList.toggle('active', !isYearly);
      yearlyLabel.classList.toggle('active', isYearly);
    }

    amountElements.forEach((el) => {
      const monthly = el.getAttribute('data-monthly');
      const yearly = el.getAttribute('data-yearly');
      const period = el.nextElementSibling.querySelector('span');

      el.textContent = isYearly ? yearly : monthly;
      if (period) period.textContent = isYearly ? 'annually' : 'monthly';
    });
  }