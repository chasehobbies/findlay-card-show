const SITE_CONFIG = {
  showTime: "10am-3pm",
  admissionPrice: "[Admission Price]",
  tablePrice: "$45",
  tablePriceNumeric: 45,
  availableTables: 40,
  vendorSetupTime: "[Vendor Setup Time]",
  contactEmail: "[Contact Email]",
  facebookEventLink: "https://www.facebook.com/share/18ZadFtMSy/",
  paymentLink: "[Payment Processor Link]",
  refundPolicy: "[Refund Policy]",
};

const storageKey = "findlay-card-show-vendor-reservations";

function getReservations() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveReservation(reservation) {
  const reservations = getReservations();
  reservations.push(reservation);
  localStorage.setItem(storageKey, JSON.stringify(reservations));
}

function getRemainingTables() {
  const reservedTables = getReservations().reduce((sum, item) => sum + Number(item.tables || 0), 0);
  return Math.max(SITE_CONFIG.availableTables - reservedTables, 0);
}

function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    if (key === "paymentLinkText") {
      element.textContent = SITE_CONFIG.paymentLink;
      return;
    }
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

function handleReservation(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const requestedTables = Number(data.tables || 0);
  const remainingTables = getRemainingTables();
  const confirmation = document.querySelector("[data-confirmation]");

  if (requestedTables > remainingTables) {
    confirmation.hidden = false;
    confirmation.textContent = `Only ${remainingTables} table(s) are currently available. Please adjust your request or contact Chase Hobbies.`;
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const reservation = {
    ...data,
    tables: requestedTables,
    submittedAt: new Date().toISOString(),
    paymentStatus: "Pending",
  };

  saveReservation(reservation);
  applyConfig();

  const body = [
    "New vendor reservation for The Findlay Card Show",
    "",
    `Full name: ${data.fullName}`,
    `Business name: ${data.businessName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Tables requested: ${data.tables}`,
    `Items sold: ${data.items}`,
    `Social media: ${data.social || "N/A"}`,
    `Notes: ${data.notes || "N/A"}`,
    "",
    "Payment status: Pending until checkout is completed.",
  ].join("\n");

  const paymentHref = SITE_CONFIG.paymentLink.startsWith("http") ? SITE_CONFIG.paymentLink : "#reserve";

  confirmation.hidden = false;
  confirmation.replaceChildren();
  confirmation.append(
    `Thank you, ${data.fullName}. Your reservation details were recorded in this browser. Please complete payment to confirm your table.`
  );

  const actions = document.createElement("div");
  actions.className = "confirmation-actions";

  const paymentLink = document.createElement("a");
  paymentLink.className = "button primary";
  paymentLink.href = paymentHref;
  paymentLink.target = "_blank";
  paymentLink.rel = "noreferrer";
  paymentLink.textContent = "Continue to Payment";

  const emailLink = document.createElement("a");
  emailLink.className = "button secondary";
  emailLink.href = createMailto("Findlay Card Show vendor reservation", body);
  emailLink.textContent = "Notify Host by Email";

  actions.append(paymentLink, emailLink);
  confirmation.append(actions);

  if (SITE_CONFIG.paymentLink.startsWith("http")) {
    window.open(SITE_CONFIG.paymentLink, "_blank", "noopener,noreferrer");
  }

  form.reset();
  confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
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

  document.querySelector("[data-reservation-form]")?.addEventListener("submit", handleReservation);
  document.querySelector("[data-contact-form]")?.addEventListener("submit", handleContact);
});
