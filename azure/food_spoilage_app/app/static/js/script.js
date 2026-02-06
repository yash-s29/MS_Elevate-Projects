/* =========================================================
   Food Spoilage Predictor — Advanced Interactive Features
   Scope: Animations, interaction feedback, modern UX
   Features: Smooth inputs, form animations, loading states
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    console.log("🍃 Spoilage Predictor UI loaded");

    initializeForm();
    initializeInputAnimations();
    initializeNavigation();
    initializeScrollEffects();
});

/* =========================================================
   INPUT ANIMATIONS & EFFECTS
========================================================= */
function initializeInputAnimations() {
    const numInputs = document.querySelectorAll('input[type="number"]');
    
    numInputs.forEach((input) => {
        const name = input.name;
        let sliderElement = null;

        switch (name) {
            case "temp":
                sliderElement = document.getElementById("tempSlider");
                setupInputSlider(input, sliderElement, -10, 60);
                break;
            case "humid_%":
                sliderElement = document.getElementById("humidSlider");
                setupInputSlider(input, sliderElement, 0, 100);
                break;
            case "light_fux":
                sliderElement = document.getElementById("lightSlider");
                setupInputSlider(input, sliderElement, 0, 20000);
                break;
            case "co2_pmm":
                sliderElement = document.getElementById("co2Slider");
                setupInputSlider(input, sliderElement, 200, 10000);
                break;
        }

        // Add floating label animation
        input.addEventListener("focus", function () {
            this.closest(".form-group")?.classList.add("focused");
        });

        input.addEventListener("blur", function () {
            if (!this.value) {
                this.closest(".form-group")?.classList.remove("focused");
            }
        });

        // Pulse effect on input
        input.addEventListener("input", function () {
            this.closest(".form-group")?.classList.add("active");
        });
    });
}

function setupInputSlider(input, sliderElement, min, max) {
    if (!sliderElement) return;

    input.addEventListener("input", function () {
        if (!this.value) {
            sliderElement.style.width = "0%";
            return;
        }

        const percentage = ((this.value - min) / (max - min)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        sliderElement.style.width = clampedPercentage + "%";
    });

    input.addEventListener("blur", function () {
        if (!this.value) {
            sliderElement.style.width = "0%";
        }
    });
}

/* =========================================================
   FORM VALIDATION & SUBMISSION
========================================================= */
function initializeForm() {
    const form = document.getElementById("predictionForm") || document.querySelector("form");
    if (!form) return;

    const inputs = form.querySelectorAll("input, select, textarea");
    const submitBtn = form.querySelector("[type='submit']");

    // Clear errors on input
    inputs.forEach((input) => {
        input.addEventListener("input", () => clearError(input));
        input.addEventListener("focus", () => clearError(input));
    });

    // Form submission
    form.addEventListener("submit", (e) => {
        let hasError = false;

        inputs.forEach((input) => {
            if (input.disabled || input.type === "hidden") return;

            const value = input.value?.trim();

            // Required validation
            if (input.hasAttribute("required") && !value) {
                showError(input, "This field is required");
                hasError = true;
                return;
            }

            // Numeric validation
            if (input.type === "number" && value) {
                const num = Number(value);

                if (Number.isNaN(num)) {
                    showError(input, "Please enter a valid number");
                    hasError = true;
                    return;
                }

                // Range checks
                switch (input.name) {
                    case "temp":
                        if (num < -10 || num > 60) {
                            showError(input, "Temperature: -10°C to 60°C");
                            hasError = true;
                        }
                        break;
                    case "humid_%":
                        if (num < 0 || num > 100) {
                            showError(input, "Humidity: 0% to 100%");
                            hasError = true;
                        }
                        break;
                    case "light_fux":
                        if (num < 0 || num > 20000) {
                            showError(input, "Light: 0 to 20,000 lux");
                            hasError = true;
                        }
                        break;
                    case "co2_pmm":
                        if (num < 200 || num > 10000) {
                            showError(input, "CO₂: 200 to 10,000 ppm");
                            hasError = true;
                        }
                        break;
                }
            }

            // Email validation
            if (input.type === "email" && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(input, "Invalid email address");
                    hasError = true;
                }
            }
        });

        if (hasError) {
            e.preventDefault();
            shake(form);
            focusFirstError();
            return;
        }

        // Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-loading">Processing...</span>';
            submitBtn.classList.add("loading");

            // Add ripple effect
            createRipple(submitBtn, e);
        }
    });

    // Restore state on page show
    window.addEventListener("pageshow", () => {
        if (submitBtn && submitBtn.disabled) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || "Predict Spoilage Risk";
            submitBtn.classList.remove("loading");
        }
    });
}

function showError(input, message) {
    clearError(input);
    
    const error = document.createElement("div");
    error.className = "input-error";
    error.textContent = message;
    error.style.animation = "fadeUp 0.3s ease";

    input.classList.add("input-invalid");
    input.closest(".form-group")?.appendChild(error);
    
    // Add shake animation
    input.style.animation = "none";
    setTimeout(() => {
        input.style.animation = "shake 0.4s ease";
    }, 10);
}

function clearError(input) {
    input.classList.remove("input-invalid");
    input.style.animation = "";
    
    const container = input.closest(".form-group");
    if (!container) return;

    const error = container.querySelector(".input-error");
    if (error) {
        error.style.animation = "fadeUp 0.3s ease reverse";
        setTimeout(() => error.remove(), 300);
    }
}

function shake(element) {
    element.classList.add("shake");
    setTimeout(() => element.classList.remove("shake"), 400);
}

function focusFirstError() {
    const firstInvalid = document.querySelector(".input-invalid");
    if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function createRipple(button, event) {
    if (!event.clientX) return;

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

/* =========================================================
   NAVIGATION & SCROLL EFFECTS
========================================================= */

// Smart scroll to section function for all pages
function scrollToSection(event, sectionId) {
    event.preventDefault();

    const section = document.getElementById(sectionId);

    // If the section exists on the current page, scroll to it
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        updateActiveNavLink(document.querySelector(`[data-link="${sectionId.replace('-section', '')}"]`));
        return;
    }

    // Section not found on this page -> redirect to home with hash
    if (window.location.pathname !== '/') {
        window.location.href = '/#' + sectionId;
        return;
    }
}

// Handle hash navigation on page load
function handleHashNavigation() {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            const sectionName = link.dataset.link;
            
            // If it's a hash link (e.g., /#about)
            if (href && href.startsWith("/#")) {
                e.preventDefault();
                const sectionId = href.substring(2) + "-section";
                scrollToSection(e, sectionId);
                return;
            }

            // If we're on home page and it's an internal section link
            if (window.location.pathname === "/" && href && href.startsWith("#")) {
                e.preventDefault();
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                    updateActiveNavLink(link);
                }
                return;
            }
        });
    });

    // Update nav on scroll
    window.addEventListener("scroll", () => {
        updateNavOnScroll();
    });
    
    // Handle hash navigation on page load
    handleHashNavigation();
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
    });
    if (activeLink) activeLink.classList.add("active");
}

function updateNavOnScroll() {
    const sections = [
        { id: 'predictor-section', link: 'home' },
        { id: 'about-section', link: 'about' },
    ];

    // Only operate when at least one of our tracked sections exists on
    // the current page. This prevents changing the active nav link on
    // pages like /feedback or /history that do not include these sections.
    const presentSections = sections.filter(s => document.getElementById(s.id));
    if (presentSections.length === 0) return;

    const scrollY = window.scrollY;
    let currentSection = presentSections[0].link;
    for (let section of presentSections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollY + 100) {
            currentSection = section.link;
        }
    }

    const activeLink = document.querySelector(`[data-link="${currentSection}"]`);
    if (activeLink && !activeLink.classList.contains('active')) {
        updateActiveNavLink(activeLink);
    }
}

/* =========================================================
   SCROLL EFFECTS & REVEAL ANIMATIONS
========================================================= */
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and stats
    document.querySelectorAll(".glass-card, .stat-card, .info-card").forEach((el) => {
        observer.observe(el);
    });

    // Parallax effect for hero
    window.addEventListener("scroll", () => {
        const hero = document.querySelector(".hero");
        if (!hero) return;

        const scrolledPercent = window.scrollY / window.innerHeight;
        const blobs = hero.querySelectorAll(".gradient-orb");

        blobs.forEach((blob, index) => {
            const speed = 1 + index * 0.1;
            blob.style.transform = `translateY(${scrolledPercent * 50 * speed}px)`;
        });
    });
}

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Add animation to elements on page load
window.addEventListener("load", () => {
    document.querySelectorAll(".word-wrapper").forEach((el, index) => {
        el.style.animationDelay = (index * 0.05) + "s";
    });
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // Focus search with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const form = document.querySelector("form");
        if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});
