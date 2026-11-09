/* ==========================================================================
   A.O.L.S — Contact Page Interactions
   ========================================================================== */

(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function initReveal() {
        var targets = document.querySelectorAll(".contact-page [data-reveal]");
        if (!targets.length) return;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            targets.forEach(function (el) {
                el.classList.add("is-visible");
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        );

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initScrollIndicator() {
        var btn = document.querySelector("[data-scroll-target]");
        if (!btn) return;

        btn.addEventListener("click", function () {
            var target = document.querySelector(btn.getAttribute("data-scroll-target"));
            if (!target) return;
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start",
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initReveal();
        initScrollIndicator();
    });
})();