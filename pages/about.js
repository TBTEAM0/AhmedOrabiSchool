/* ==========================================================================
   A.O.L.S — About Page Interactions
    ========================================================================== */
 
(function () {
    "use strict";
 
    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
 
    /* ---------------------------------------------------------------------
       1. Scroll reveal
       --------------------------------------------------------------------- */
    function initReveal() {
        var targets = document.querySelectorAll(".about [data-reveal]");
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
 
    /* ---------------------------------------------------------------------
       2. Spine progress fill
       --------------------------------------------------------------------- */
    function initSpine() {
        var journey = document.querySelector(".about-journey");
        var fill = document.querySelector(".about-journey__spine-fill");
        if (!journey || !fill || prefersReducedMotion) return;
 
        var ticking = false;
 
        function update() {
            var rect = journey.getBoundingClientRect();
            var viewportH = window.innerHeight;
            var total = rect.height;
 
            var visible = viewportH * 0.6 - rect.top;
            var percent = Math.max(0, Math.min(1, visible / total));
 
            fill.style.height = (percent * 100) + "%";
            ticking = false;
        }
 
        window.addEventListener(
            "scroll",
            function () {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            },
            { passive: true }
        );
 
        update();
    }
 
    /* ---------------------------------------------------------------------
       3. Hero language cycler
       --------------------------------------------------------------------- */
    function initLanguageCycle() {
        var el = document.querySelector("[data-lang-cycle]");
        if (!el) return;
 
        var words = ["Welcome", "أهلاً", "Bienvenue", "Willkommen"];
        var i = 0;
 
        if (prefersReducedMotion) return;
 
        setInterval(function () {
            i = (i + 1) % words.length;
            el.style.opacity = 0;
            setTimeout(function () {
                el.textContent = words[i];
                el.style.opacity = 1;
            }, 260);
        }, 2400);
    }
 
    document.addEventListener("DOMContentLoaded", function () {
        initReveal();
        initSpine();
        initLanguageCycle();
    });
})();
 