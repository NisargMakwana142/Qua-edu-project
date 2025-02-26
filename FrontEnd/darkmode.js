let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

// Function to enable dark mode
const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
  themeSwitch.classList.add('darkmode-active'); // Add class to switch button
};

// Function to disable dark mode
const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', '');
  themeSwitch.classList.remove('darkmode-active'); // Remove class from switch button
};

// Initialize dark mode based on localStorage or system preference
if (darkmode === "active") {
  enableDarkmode();
} else if (darkmode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  enableDarkmode();
}

// Toggle dark mode when the switch is clicked
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode');
  if (darkmode !== "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});
