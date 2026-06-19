const SITE_CONFIG = {
  showTime: "10am-3pm",
  admissionPrice: "[Admission Price]",
  tablePrice: "$45",
  tablePriceNumeric: 45,
  availableTables: 75,
  vendorSetupTime: "[Vendor Setup Time]",
  contactEmail: "[Contact Email]",
  facebookEventLink: "https://www.facebook.com/share/18ZadFtMSy/",
  vendorFormLink: "https://forms.gle/QwTPR3o1Ax1UqKz57",
  refundPolicy: "[Refund Policy]",
};

function getRemainingTables() {
  return SITE_CONFIG.availableTables;
}

function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    element.textContent = SITE_CONFIG[key] || "";
  });

  document.querySelectorAll("[data-available-tables]").forEach((element) => {
    element.textContent = getRemainingTables();
  });

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function createMailto(subject, body) {
  const email = SITE_CONFIG.contactEmail.includes("@") ? SITE_CONFIG.contactEmail : "";
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email}?${params.toString()}`;
}

function handleContact(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const body = [`Name: ${data.name}`, `Email: ${data.email}`, "", data.message].join("\n");
  window.location.href = createMailto("Question about The Findlay Card Show", body);
}

function initMenu() {
  const button = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initMenu();

  document.querySelector("[data-contact-form]")?.addEventListener("submit", handleContact);
});
