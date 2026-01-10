// ------------------------
// EmailJS Initialization
// ------------------------
(function() {
  emailjs.init("Ei0R78v6IrN2IuqCN"); // Replace with your EmailJS public key from https://www.emailjs.com/
})();
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 0;

  const elementTop =
    target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;

  window.scrollTo({
    top: elementTop < 0 ? 0 : elementTop,
    behavior: "smooth",
  });
}

// ------------------------
// DOM Ready
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setupSmoothNavLinks();
  setupEmiCalculator();
  setupFaqAccordion();
  setupContactForm();
  setCurrentYear();
  setupScrollReveal();
  setupStatCounters();
  setupFloatingCta();
});

// ------------------------
// Navbar: Mobile Toggle
// ------------------------
function setupNavToggle() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-open");
  });

  // Close menu when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("nav-open")) return;

    const clickInsideNav =
      navLinks.contains(e.target) || navToggle.contains(e.target);
    if (!clickInsideNav) {
      navLinks.classList.remove("nav-open");
    }
  });
}

// Close the mobile menu when a nav link is clicked & smooth scroll
function setupSmoothNavLinks() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const navLinksContainer = document.getElementById("navLinks");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = href.substring(1);
      scrollToSection(id);

      // Close mobile nav if open
      if (navLinksContainer && navLinksContainer.classList.contains("nav-open")) {
        navLinksContainer.classList.remove("nav-open");
      }
    });
  });
}


// ------------------------
// EMI Calculator
// ------------------------
function setupEmiCalculator() {
  const emiForm = document.getElementById("emiForm");
  const emiResults = document.getElementById("emiResults");
  const emiValue = document.getElementById("emiValue");
  const interestTotal = document.getElementById("interestTotal");
  const totalAmount = document.getElementById("totalAmount");

  if (!emiForm || !emiResults) return;

  emiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amountInput = document.getElementById("amount");
    const interestInput = document.getElementById("interest");
    const tenureInput = document.getElementById("tenure");

    const principal = parseFloat(amountInput.value);
    const annualRate = parseFloat(interestInput.value);
    const tenureYears = parseFloat(tenureInput.value);

    if (!principal || !annualRate || !tenureYears || principal <= 0) {
      showToast("Please enter valid loan details.", "error");
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = principal / numberOfMonths;
    } else {
      const pow = Math.pow(1 + monthlyRate, numberOfMonths);
      emi = (principal * monthlyRate * pow) / (pow - 1);
    }

    const totalPayable = emi * numberOfMonths;
    const totalInterest = totalPayable - principal;

    emiValue.textContent = formatCurrency(emi);
    interestTotal.textContent = formatCurrency(totalInterest);
    totalAmount.textContent = formatCurrency(totalPayable);

    emiResults.classList.remove("hidden");
    emiResults.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ------------------------
// FAQ Accordion
// ------------------------
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) other.classList.remove("active");
      });
      // Toggle current
      item.classList.toggle("active");
    });
  });
}

// ------------------------
// Contact / Apply Form
// ------------------------
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = contactForm.querySelector("input[type='text']")?.value.trim();
    const email = contactForm.querySelector("input[type='email']")?.value.trim();
    const mobile = contactForm.querySelector("input[type='tel']")?.value.trim();
    const loanType = contactForm.querySelector("select")?.value;
    const loanAmount = contactForm.querySelectorAll("input[type='number']")[0]?.value.trim();
    const monthlyIncome = contactForm.querySelectorAll("input[type='number']")[1]?.value.trim();
    const requirement = contactForm.querySelector("textarea")?.value.trim();

    if (!name || !email || !mobile || !loanType) {
      showToast("Please fill all required fields before submitting.", "error");
      return;
    }

    // Simple mobile validation (10 digits)
    const mobileDigits = mobile.replace(/\D/g, "");
    if (mobileDigits.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    // Show loading
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Send email using EmailJS
    emailjs.send("service_v3x116o", "template_ibpd6u4", {
      from_name: name,
      from_email: email,
      mobile: mobile,
      loan_type: loanType,
      loan_amount: loanAmount,
      monthly_income: monthlyIncome,
      requirement: requirement,
    })
    .then((response) => {
      console.log("Email sent successfully:", response);
      showToast("Your application has been submitted. Our specialist will contact you shortly.", "success");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      showToast("Failed to send application. Please try again.", "error");
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

// ------------------------
// Footer Year
// ------------------------
function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  yearSpan.textContent = new Date().getFullYear();
}

// ------------------------
// Helper: Currency Formatter
// ------------------------
function formatCurrency(value) {
  if (!isFinite(value)) return "₹0";
  return (
    "₹" +
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

// ------------------------
// Helper: Toast Notification
// ------------------------
let toastTimeout = null;

function showToast(message, type = "info") {
  let toast = document.querySelector(".swift-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "swift-toast";
    document.body.appendChild(toast);

    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "1.5rem",
      transform: "translateX(-50%)",
      padding: "0.75rem 1.4rem",
      borderRadius: "999px",
      fontSize: "0.85rem",
      zIndex: "9999",
      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.8)",
      background: "#0f172a",
      color: "#e5e7eb",
      border: "1px solid rgba(148, 163, 184, 0.6)",
      opacity: "0",
      pointerEvents: "none",
      transition: "opacity 0.2s ease, transform 0.2s ease",
      maxWidth: "90%",
      textAlign: "center",
      whiteSpace: "normal",
    });
  }

  toast.textContent = message;

  if (type === "success") {
    toast.style.borderColor = "rgba(34, 197, 94, 0.8)";
  } else if (type === "error") {
    toast.style.borderColor = "rgba(239, 68, 68, 0.8)";
  } else {
    toast.style.borderColor = "rgba(148, 163, 184, 0.6)";
  }

  toast.style.opacity = "1";
  toast.style.pointerEvents = "auto";
  toast.style.transform = "translateX(-50%) translateY(-4px)";

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 3500);
}

// ------------------------
// Scroll Reveal Animations
// ------------------------
function setupScrollReveal() {
  const elements = document.querySelectorAll(
    ".hero-text, .stat-item, .card, .highlight-box, .step, .doc-grid > div, .emi-box, .emi-side, .testimonial, .faq-item, .contact-card, .contact-info-box"
  );

  if (!("IntersectionObserver" in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  elements.forEach((el, index) => {
    el.classList.add("reveal");
    if (index % 3 === 1) {
      el.classList.add("reveal-delay-1");
    } else if (index % 3 === 2) {
      el.classList.add("reveal-delay-2");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// ------------------------
// Animated Stat Counters
// ------------------------
function setupStatCounters() {
  const statItems = document.querySelectorAll(".stat-item h3");
  if (!statItems.length || !("IntersectionObserver" in window)) return;

  const parseTargetValue = (text) => {
    // "25,000+", "₹50 Cr+", "4.5★"
    const clean = text.replace(/[₹+,★\s]/g, "");
    // for "50Cr" style, keep number only
    return parseFloat(clean) || 0;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const parent = el.parentElement;
        const originalText = el.textContent.trim();
        const target = parseTargetValue(originalText);
        if (!target) return;

        let prefix = "";
        let suffix = "";
        if (originalText.includes("₹")) prefix = "₹";
        if (originalText.toLowerCase().includes("cr")) suffix = " Cr";
        if (originalText.includes("★")) suffix = "★";
        if (originalText.includes("+")) suffix += "+";

        const duration = 1200;
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const current = Math.floor(target * progress);

          if (suffix.includes("Cr")) {
            el.textContent = prefix + current + suffix;
          } else if (suffix.includes("★")) {
            const val = (target * progress).toFixed(1);
            el.textContent = val + suffix;
          } else {
            el.textContent = prefix + current.toLocaleString("en-IN") + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    },
    { threshold: 0.4 }
  );

  statItems.forEach((el) => observer.observe(el));
}

/* =====================================================
   TESTIMONIAL SLIDER – RESPONSIVE
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".testimonials");
  if (!slider) return;

  const cards = slider.querySelectorAll(".testimonial");
  if (!cards.length) return;

  const nav = document.createElement("div");
  nav.className = "testimonial-nav";

  const prev = document.createElement("button");
  prev.className = "testimonial-btn";
  prev.innerHTML = "‹";

  const next = document.createElement("button");
  next.className = "testimonial-btn";
  next.innerHTML = "›";

  nav.append(prev, next);
  slider.parentElement.appendChild(nav);

  const getScrollAmount = () => {
    return cards[0].offsetWidth + 24;
  };

  prev.addEventListener("click", () => {
    slider.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    slider.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", function () {

  const chatToggle = document.getElementById("chatToggle");
  const chatBox = document.getElementById("chatBox");
  const chatClose = document.getElementById("chatClose");

  if (!chatToggle || !chatBox || !chatClose) {
    console.error("Chat elements not found");
    return;
  }

  chatToggle.addEventListener("click", function () {
    chatBox.classList.toggle("active");
  });

  chatClose.addEventListener("click", function () {
    chatBox.classList.remove("active");
  });

  /* Typing effect */
  const text =
    "Hi 👋 Our loan specialist is here. How can we help you ?";
  let i = 0;
  let started = false;

  function startTyping() {
    const el = document.getElementById("chatTyping");
    if (!el || started) return;

    started = true;
    el.textContent = "";

    const timer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 35);
  }

  chatToggle.addEventListener("click", startTyping);

});
const helpText = "Need help?";
let helpIndex = 0;

function typeHelpText() {
  const el = document.getElementById("helpTyping");
  if (!el) return;

  el.textContent = "";
  helpIndex = 0;

  const timer = setInterval(() => {
    el.textContent += helpText.charAt(helpIndex);
    helpIndex++;
    if (helpIndex >= helpText.length) clearInterval(timer);
  }, 120);
}

/* Trigger every 6 seconds */
setInterval(typeHelpText, 6000);
(function () {
  const btn = document.getElementById("chatToggle");
  const chatBox = document.getElementById("chatBox");
  const closeBtn = document.getElementById("chatClose");
  if (!btn || !chatBox) return;

  let isDragging = false;
  let moved = false;
  let startX, startY, initialX, initialY;

  const parent = btn.parentElement;
  const DRAG_THRESHOLD = 6; 

  const getPos = (e) => (e.touches ? e.touches[0] : e);

  // START DRAG
  const start = (e) => {
    const pos = getPos(e);
    startX = pos.clientX;
    startY = pos.clientY;
    const rect = parent.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    moved = false;
    isDragging = true;
    parent.style.transition = "none";
  };
  // MOVE DRAG
  const move = (e) => {
    if (!isDragging) return;

    const pos = getPos(e);
    const dx = pos.clientX - startX;
    const dy = pos.clientY - startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
    }

    if (!moved) return;
    const btnRect = parent.getBoundingClientRect();
    const maxX = window.innerWidth - btnRect.width;
    const maxY = window.innerHeight - btnRect.height;

    let newX = initialX + dx;
    let newY = initialY + dy;

    // 🔒 CLAMP INSIDE SCREEN
    newX = Math.max(8, Math.min(newX, maxX - 8));
    newY = Math.max(8, Math.min(newY, maxY - 8));

    parent.style.left = newX + "px";
    parent.style.top = newY + "px";
    parent.style.right = "auto";
    parent.style.bottom = "auto";
  };
  // END DRAG
  const end = () => {
    isDragging = false;
    parent.style.transition = "all 0.25s ease";
  };

  btn.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    chatBox.classList.toggle("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatBox.classList.remove("open");
    });
  }

  // EVENTS
  btn.addEventListener("mousedown", start);
  btn.addEventListener("touchstart", start, { passive: true });
  document.addEventListener("mousemove", move);
  document.addEventListener("touchmove", move, { passive: true });
  document.addEventListener("mouseup", end);
  document.addEventListener("touchend", end);
})();
