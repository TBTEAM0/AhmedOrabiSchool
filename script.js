
/* ===========================
   PAGE LOADER
=========================== */

 const loader = document.createElement("div");
 loader.className = "page-loader";
 loader.innerHTML = `<div class="loader-logo">A.O.L.S</div>`;
 document.body.prepend(loader);

 window.addEventListener("load", () => {
     setTimeout(() => {
         loader.classList.add("fade-out");
         setTimeout(() => loader.remove(), 700);
     }, 900);
 });


/* ===========================
   MOBILE MENU
=========================== */

const menuBtn   = document.querySelector(".menu-btn");
const navbar    = document.querySelector("#navbar");
const menuIcon  = document.querySelector(".menu-btn i");
const header    = document.querySelector("header");

// إنشاء الـ overlay وإضافته للصفحة
const navOverlay = document.createElement("div");
navOverlay.className = "nav-overlay";
document.body.appendChild(navOverlay);

function closeMenu() {
    navbar?.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.classList.remove("nav-open");
    menuIcon?.classList.remove("fa-times");
    menuIcon?.classList.add("fa-bars");
}

function openMenu() {
    navbar?.classList.add("active");
    navOverlay.classList.add("active");
    document.body.classList.add("nav-open");
    menuIcon?.classList.remove("fa-bars");
    menuIcon?.classList.add("fa-times");
}

if (menuBtn && navbar && menuIcon) {

    menuBtn.addEventListener("click", () => {
        const isOpen = navbar.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    });

}

// قفل المنيو لما تدوس على أي رابط
document.querySelectorAll("#navbar a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// قفل المنيو لما تدوس على الـ overlay نفسه
navOverlay.addEventListener("click", closeMenu);

/* ===========================
    SCROLL PROGRESS BAR
=========================== */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);


/* ===========================
    SCROLL TO TOP BUTTON
=========================== */

const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top";
scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ===========================
   SCROLL EVENTS
=========================== */

window.addEventListener("scroll", () => {

    const scrollTop  = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

    progressBar.style.width =
        `${pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0}%`;

    header?.classList.toggle("scrolled", scrollTop > 50);

    scrollTopBtn.classList.toggle("show", scrollTop > 500);

});


/* ===========================
   HERO ENTRANCE (STAGGERED)
=========================== */

const heroH1      = document.querySelector(".hero-content h1");
const heroPara    = document.querySelector(".hero-content p");
const heroButtons = document.querySelector(".hero-buttons");

[heroH1, heroPara, heroButtons].forEach((el, i) => {
    if (!el) return;
    el.style.opacity   = "0";
    el.style.transform = "translateY(35px)";
    setTimeout(() => {
        el.style.transition = "opacity .85s cubic-bezier(.22,1,.36,1), transform .85s cubic-bezier(.22,1,.36,1)";
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
    }, 1000 + i * 200);
});




/* ===========================
   REVEAL ON SCROLL (STAGGERED GRID)
=========================== */

const revealElements = document.querySelectorAll(
    ".hero-content, .title, .feature-card, .stage-card, .stat-box, .news-card, .gallery-box, .teacher-card, .stage-breadcrumb, .stage-hero, .stage-grades-header, .stage-footer"
);

revealElements.forEach(el => el.classList.add("reveal"));

// Stagger cards inside grid containers
document.querySelectorAll(
    ".feature-container, .stage-container, .news-container, .gallery-container, .stats, .stage-highlights, .subjects"
).forEach(container => {
    container.querySelectorAll(".reveal").forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.09}s`;
    });
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach(el => revealObserver.observe(el));


/* ===========================
   STAGE PAGE — HERO ENTRANCE
=========================== */

const stageIconWrap = document.querySelector(".stage-icon-wrap");

if (stageIconWrap) {
    stageIconWrap.style.opacity   = "0";
    stageIconWrap.style.transform = "scale(0.75)";
    setTimeout(() => {
        stageIconWrap.style.transition = "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)";
        stageIconWrap.style.opacity    = "1";
        stageIconWrap.style.transform  = "scale(1)";
    }, 1100);
}


/* ===========================
   COUNTER ANIMATION (EASED)
=========================== */

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const counters = document.querySelectorAll(".stat-box h2");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter    = entry.target;
            const finalValue = parseInt(counter.textContent.replace(/\D/g, ""));
            const duration   = 2000;
            const startTime  = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased    = easeOutExpo(progress);
                counter.textContent = `${Math.floor(eased * finalValue)}+`;
                if (progress < 1) requestAnimationFrame(tick);
                else counter.textContent = `${finalValue}+`;
            }

            requestAnimationFrame(tick);
            observer.unobserve(counter);
        });
    },
    { threshold: 0.5 }
);

counters.forEach(c => counterObserver.observe(c));


/* ===========================
   3D TILT EFFECT
=========================== */

if (window.matchMedia("(pointer: fine)").matches) {

    document.querySelectorAll(".feature-card, .stage-card, .stat-box, .news-card").forEach(card => {

        if (card.closest(".stage-page")) return;

        card.addEventListener("mousemove", e => {
            const rect  = card.getBoundingClientRect();
            const x     = e.clientX - rect.left;
            const y     = e.clientY - rect.top;
            const rotX  = ((y - rect.height / 2) / (rect.height / 2)) * -8;
            const rotY  = ((x - rect.width  / 2) / (rect.width  / 2)) *  8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition = "transform .4s ease";
            card.style.transform  = "";
            setTimeout(() => (card.style.transition = ""), 400);
        });

    });

}


/* ===========================
   HERO PARALLAX (MOUSE)
=========================== */

const hero        = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

if (hero && heroContent && window.matchMedia("(pointer: fine)").matches) {

    hero.addEventListener("mousemove", e => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        heroContent.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });

    hero.addEventListener("mouseleave", () => {
        heroContent.style.transition = "transform .6s ease";
        heroContent.style.transform  = "";
        setTimeout(() => (heroContent.style.transition = ""), 600);
    });

}




/* ===========================
   GALLERY OVERLAY ON HOVER
=========================== */

document.querySelectorAll(".gallery-box").forEach(box => {

    box.addEventListener("mouseenter", () => {
        box.style.background = "rgba(37,99,235,.35)";
        box.style.letterSpacing = "3px";
    });

    box.addEventListener("mouseleave", () => {
        box.style.background    = "";
        box.style.letterSpacing = "";
    });

});


/* ===========================
   RIPPLE EFFECT ON BUTTONS
=========================== */

document.querySelectorAll(".btn, .stage-card a").forEach(btn => {

    btn.addEventListener("click", function(e) {

        const ripple = document.createElement("span");
        ripple.className = "ripple";

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = `
            position:absolute;
            border-radius:50%;
            background:rgba(255,255,255,.4);
            width:${size}px;
            height:${size}px;
            left:${e.clientX - rect.left - size / 2}px;
            top:${e.clientY - rect.top  - size / 2}px;
            animation:rippleAnim .6s ease-out forwards;
            pointer-events:none;
        `;

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 700);

    });

});
/* ===========================
    LANGUAGE SWITCHER
=========================== */

const translations = {

    en: {
        "nav-home": "HOME",
        "nav-principals":"PRINCIPALS",
        "nav-class":"STAGES",
        "nav-about": "ABOUT",
        "nav-contact": "CONTACT",

        "hero-title": `Welcome To <span>A.O.L. School</span>`,
        "hero-desc": "Building Future Leaders Through Quality Education, Innovation, and Excellence.",
        "hero-btn1": "Explore Our School",
        "hero-btn2": "Learn More",

            
        "members-title":"Our Principals",

        "principal1-name": "Mrs. Eman Abdelhamed",
        "principal1-role": "Current Principal",

        "principal2-name": "Mr. Abdelrahman Rashed",
        "principal2-role": "Past Principal",
        "view-profile": "View Profile",



        
        "features-title": "Why Choose A.O.L.S?",
        "features-desc": "We provide a modern educational environment that helps every student reach their full potential.",
        "feature1-title": "Modern Education",
        "feature1-desc": "Innovative learning methods designed for every student.",
        "feature2-title": "Professional Teachers",
        "feature2-desc": "Experienced teachers supporting academic excellence.",
        "feature3-title": "Smart Classrooms",
        "feature3-desc": "Technology integrated into every classroom.",
        "feature4-title": "Activities",
        "feature4-desc": "Sports, competitions and educational events.",

        "stages-title": "School Stages",
        "stage-kg-title": "KG",
        "stage-kg-desc": "Kindergarten Stage",
        "stage-primary-title": "Primary",
        "stage-primary-desc": "Primary School",
        "stage-prep-title": "Preparatory",
        "stage-prep-desc": "Preparatory School",
        "stage-sec-title": "Secondary",
        "stage-sec-desc": "Secondary School",
        "view-btn": "View",

        "news-title": "Latest News",
        "news1-title": "Summer Activities",
        "news1-desc": "Registration is now open for summer activities.",
        "news2-title": "School Competition",
        "news2-desc": "Join our annual academic competition.",
        "news3-title": "New School Year",
        "news3-desc": "Welcome back to a new year of learning.",

        "stats-students": "Students",
        "stats-teachers": "Teachers",
        "stats-classrooms": "Classrooms",
        "stats-experience": "Years Experience",

        "gallery-title": "School Gallery",
        "gallery1-title": "Activities",
        "gallery1-desc": "School Activities",
        "gallery2-title": "Classroom",
        "gallery2-desc": "Classroom Photos",
        "gallery3-title": "Competitions",
        "gallery3-desc": "School Competitions",
        "gallery4-title": "Students",
        "gallery4-desc": "Students Gallery",

        "footer-title": "A.O.L.S School",
        "footer-copyright": "© 2026 A.O.L.S School. All Rights Reserved",
        "footer-devby": "Developed By",

        "nav-devs": "DEVS",

        "class-choose-title": "Choose Your Class",
        "accordion-kg": "🎓 KG",
        "accordion-primary": "📚 Primary",
        "accordion-preparatory": "📝 Preparatory",
        "accordion-secondary": "🎯 Secondary",
        "class-kg1": "KG 1",
        "class-kg2": "KG 2",
        "class-primary1": "Primary 1",
        "class-primary2": "Primary 2",
        "class-primary3": "Primary 3",
        "class-primary4": "Primary 4",
        "class-primary5": "Primary 5",
        "class-primary6": "Primary 6",
        "class-prep1": "Preparatory 1",
        "class-prep2": "Preparatory 2",
        "class-prep3": "Preparatory 3",
        "class-sec1": "Secondary 1",
        "class-sec2": "Secondary 2",
        "class-sec3": "Secondary 3",

        "about-title": "About A.O.L.S School",
        "about-desc": "A.O.L.S School is a modern educational institution focused on providing high quality education, developing students' skills, and creating a safe environment for learning and creativity.",
        "about-vision-title": "Our Vision",
        "about-vision-desc": "Building a generation capable of innovation and leadership.",
        "about-mission-title": "Our Mission",
        "about-mission-desc": "Providing excellent education through modern methods and professional teachers.",
        "about-values-title": "Our Values",
        "about-values-desc": "Respect, creativity, teamwork and excellence.",

        "contact-title": "Contact Us",
        "contact-desc": "Have any questions? Feel free to contact AOLS School.",
        "contact-address-title": "Address",
        "contact-address-text": "School Location Here",
        "contact-phone-title": "School ID",
        "contact-email-title": "Email",

        "stage-back": "Back to Stages",
        "stage-grades-title": "Grade Levels",
        "stage-grades-desc": "Explore each level of our program.",
        "stage-view-all": "View All Stages",

        "kg-title": "Kindergarten",
        "kg-desc": "Welcome to AOLS Kindergarten. A safe and creative environment where children start their learning journey.",
        "kg-hl1-title": "Safe Environment",
        "kg-hl1-desc": "A caring space where every child feels secure and happy.",
        "kg-hl2-title": "Creative Learning",
        "kg-hl2-desc": "Play-based activities that spark curiosity and imagination.",
        "kg-hl3-title": "Early Growth",
        "kg-hl3-desc": "Building social, motor, and language skills from day one.",
        "kg-sub1-title": "KG 1",
        "kg-sub1-desc": "Basic skills and activities",
        "kg-sub2-title": "KG 2",
        "kg-sub2-desc": "Preparing children for primary school",

        "primary-title": "Primary School",
        "primary-hl1-title": "Core Curriculum",
        "primary-hl1-desc": "Science, math, languages, and social studies.",
        "primary-hl2-title": "Team Activities",
        "primary-hl2-desc": "Group projects that build cooperation and confidence.",
        "primary-hl3-title": "Smart Learning",
        "primary-hl3-desc": "Technology integrated into everyday classroom experiences.",
        "primary-desc": "Developing students' skills and preparing them for secondary education.",
        "primary-sub1-title": "Primary 1",
        "primary-sub1-desc": "Science, Math, Languages, A.L And More",
        "primary-sub2-title": "Primary 2",
        "primary-sub2-desc": "Arabic, Math, English, A.L And More",
        "primary-sub3-title": "Primary 3",
        "primary-sub3-desc": "Arabic, Math, English, A.L And More",
        "primary-sub4-title": "Primary 4",
        "primary-sub4-desc": "Arabic, Math, English , Science , Soacial Studies, A.L And More",
        "primary-sub5-title": "Primary 5",
        "primary-sub5-desc": "Arabic, Math, English , Science , Soacial Studies, A.L And More",
        "primary-sub6-title": "Primary 6",
        "primary-sub6-desc": "Arabic, Math, English , Science , Soacial Studies, A.L And More",

        "prep-title": "Preparatory School",
        "prep-desc": "Developing students' skills and preparing them for secondary education.",
        "prep-hl1-title": "Science & Math",
        "prep-hl1-desc": "Strong foundations in core academic subjects.",
        "prep-hl2-title": "Languages",
        "prep-hl2-desc": "Arabic, English, German, French, and additional language skills.",
        "prep-hl3-title": "Critical Thinking",
        "prep-hl3-desc": "Problem-solving and independent learning habits.",
        "prep-sub1-title": "Preparatory 1",
        "prep-sub1-desc": "Arabic, Math, English, Science, Social Studies and More",
        "prep-sub2-title": "Preparatory 2",
        "prep-sub2-desc": "Arabic, Math, English, Science, Social Studies and More",
        "prep-sub3-title": "Preparatory 3",
        "prep-sub3-desc": "Arabic, Math, English, Science, Social Studies and More",

        "sec-title": "Secondary School",
        "sec-desc": "Preparing students for university through advanced education and skills development.",
        "sec-hl1-title": "University Prep",
        "sec-hl1-desc": "Guidance and curriculum aligned with higher education goals.",
        "sec-hl2-title": "Advanced Studies",
        "sec-hl2-desc": "In-depth subjects across sciences, humanities, and languages.",
        "sec-hl3-title": "Leadership",
        "sec-hl3-desc": "Building confidence, responsibility, and future-ready skills.",
        "sec-sub1-title": "Secondary 1",
        "sec-sub1-desc": "Soon...",
        "sec-sub2-title": "Secondary 2",
        "sec-sub2-desc": "Soon...",
        "sec-sub3-title": "Secondary 3",
        "sec-sub3-desc": "Soon...",


        "mrabdo-title":"Mr. Abdelrahman Rashed Achievements",
        "mrabdo-desc": "Select an achievement to view its gallery.",
          "achievement-dropdown-title":
        '<i class="fa-solid fa-images"></i> Mr. Abdelrahman Rashed Achievements',
        "click-view": "Click To View",
        "achievement-ramadan": "Ramadan Celebration",
        "achievement-mothersday": "Mother's Day",
        "achievement-masjid": "Building a Mosque",
        "achievement-creator": "Creative Child",
        "achievement-giza": "Giza Competition",
        "achievement-football": "Football Competition 2023",
        "achievement-boxing": "Kick Boxing",
        "achievement-kgvisits": "KG Visits",
        "achievement-camera": "School Insurance",
        "achievement-buildings": "Latest Buildings",
        "achievement-decoration": "School Decoration",
        "achievement-agriculture": "School Agriculture",
        "achievement-honoring": "Honoring",
        "achievement-honoring-mr": "Honoring Mr. Abdelrahman",
        "achievement-party": "Party",
        "achievement-dp": "Dream Park",
        "achievement-hospital": "57357 Hospital",
        "achievement-aml": "Amal Mubarak's Visit",
        "achievement-corridor": "Corridor",
        "achievement-purplecomet": "Purple Comet",
        "achievement-deutsch": "German Competition",
        "achievement-theater": "Theater Competition",
        "achievement-math": "Mathematics Competition",
        "achievement-childhood": "Childhood Day",
        "achievement-camp": "School Camp",



        "activity-title":"Ahmed Orabi Language School Achievements",
        "activity-desc": "Select an Activity to view its gallery",

        "activity-title2": "Ahmed Orabi Language School Championships",
        "activity-dropdown-title":
        '<i class="fa-solid fa-images"></i> Ahmed Orabi Language School Activities',
        "activity-ramadan":"Ramadan Kareem",
        "activity-em":"A Tour Of The Grand Egyptian Museum",
        "activity-nd":"New Decor",
        "activity-alr": "Administration-Level Ranking",
        "activity-abakera": "Al-Abakera",
"competitions-dropdown-title":
            ' Ahmed Orabi Language School Competitions',
                "competition-desc2":"Select an competition to view its gallery",

        "activity-math": "Mathematics Competition",
        "activity-deutsch": "German Competition",
        "activity-purplecomet": "Purple Comet",
                "activity-Chess":"Chess",
"mrseman-title": "Mrs. Eman Abdelhamed Achievements",
"mrseman-desc": "Select an achievement to view its gallery.",
"mrseman-dropdown-title":
    '<i class="fa-solid fa-images"></i> Mrs. Eman Abdelhamed Achievements',
"achievement-chess": "Chess",
"achievement-abakera": "Al-Abakera",
"achievement-windows": "New Windows",
"achievement-quran": "Quran",
        "achievement-ml": "Renovation of the School Courtyard",
"activity-quran": "Quran",
        "activity-sfl": "School Football League",
"about-hero-lang-label": "Say it in any language",
"about-hero-title": "A school built on <em>courage, language and craft</em>",
"about-hero-subtitle": "Ahmed Orabi Language School carries the name of a man who spoke truth with dignity. We teach our students to do the same — in Arabic, in English, and in every language that opens a door.",
"about-hero-scroll": "Scroll to read our story",

"about-story-eyebrow": "Our Story",
"about-story-title": "Where the name became a promise",
"about-story-since": "Est. 2020 · Giza, Egypt",
"about-story-p1": "A.O.L.S opened its doors with a small idea that never got smaller: that a child could grow up rooted in Egyptian identity while feeling completely at home in the languages of the wider world. We named the school after <strong>Ahmed Orabi</strong>, a man remembered not for titles but for the plain-spoken dignity with which he stood for his country. That is the standard we hold ourselves to.",
"about-story-p2": "What began as a handful of classrooms has grown into a full journey from Kindergarten through Secondary — but the growth was never the point. Every stage we added was added because a family asked for somewhere they would not have to choose between excellence and warmth.",
"about-story-p3": "Today, A.O.L.S exists for the same reason it always has: to hand our students two things at once — fluency in the languages that will carry them anywhere, and a sense of who they are that travels with them wherever they go.",

"about-principal-quote": "We do not measure a school year by the syllabus it covers, but by the confidence it leaves behind. Every child who walks through our gates is trusted with a voice — and our only job is to help them use it, in whichever language they choose.",
"about-principal-name": "Mrs. Eman Abdelhamed",
"about-principal-title": "School Principal, A.O.L.S",

"about-path-vision-tag": "The direction",
"about-path-vision-title": "Our Vision",
"about-path-vision-desc": "A generation that is fluent in the languages of the world and firmly rooted in the values of home — capable of leading anywhere without forgetting where they started.",
"about-path-mission-tag": "The approach",
"about-path-mission-title": "Our Mission",
"about-path-mission-desc": "To deliver an integrated bilingual education through modern teaching methods and dedicated educators — building skills for life, not just for exams.",
"about-path-values-tag": "The foundation",
"about-path-values-title": "Core Values",
"about-path-values-desc": "Everything we build rests on the same four pillars, in every classroom and every stage.",
"about-path-chip-1": "Integrity",
"about-path-chip-2": "Curiosity",
"about-path-chip-3": "Excellence",
"about-path-chip-4": "Belonging",

"about-values-eyebrow": "What We Stand For",
"about-values-title": "Six values, lived every day",
"about-values-desc": "Not words on a wall — habits our students practice from their first day in Kindergarten to their last in Secondary.",

"about-value-innovation-title": "Innovation",
"about-value-innovation-desc": "Encouraging students to ask better questions, not just find faster answers.",
"about-value-respect-title": "Respect",
"about-value-respect-desc": "For teachers, for classmates, and for every language and culture in our halls.",
"about-value-leadership-title": "Leadership",
"about-value-leadership-desc": "Giving students real chances to speak first and take responsibility early.",
"about-value-creativity-title": "Creativity",
"about-value-creativity-desc": "Making room for ideas that don't fit the textbook, on purpose.",
"about-value-responsibility-title": "Responsibility",
"about-value-responsibility-desc": "Teaching students to own their choices, in class and beyond it.",
"about-value-teamwork-title": "Teamwork",
"about-value-teamwork-desc": "Showing that the best ideas usually belong to more than one person.",

"about-cta-title": "Ready to see A.O.L.S for yourself?",
"about-cta-desc": "Come meet our teachers, walk through our classrooms, and see where your child's next language begins.",
"about-cta-btn": "Contact Us",
    },

    ar: {
        "nav-home": "الرئيسية",
        "nav-principals":"المديرون",
        "nav-class": "المراحل",
        "nav-about": "من نحن",
        "nav-contact": "تواصل معنا",


        "members-title": "مديرا المدرسه",
        "principal1-name": "أ. إيمان عبد الحميد",
        "principal1-role": "مديرة المدرسة الحالية",
        "principal2-name": "أ. عبد الرحمن راشد",
        "principal2-role": "مدير المدرسة السابق",
        "view-profile": "عرض الملف الشخصي",

        "hero-title": `مرحباً بكم في <span>أحمد عرابي الرسميه لغات</span>`,
        "hero-desc": "نبني قادة المستقبل من خلال تعليم عالي الجودة، وابتكار، وتميز.",
        "hero-btn1": "اكتشف مدرستنا",
        "hero-btn2": "اعرف أكتر",

        "features-title": "ليه تختار أحمد عرابي الرسمية لغات؟",
        "features-desc": "بنوفر بيئة تعليمية حديثة بتساعد كل طالب يوصل لأقصى إمكانياته.",
        "feature1-title": "تعليم حديث",
        "feature1-desc": "أساليب تعلم مبتكرة مصممة لكل طالب.",
        "feature2-title": "معلمين محترفين",
        "feature2-desc": "معلمين ذوي خبرة بيدعموا التميز الأكاديمي.",
        "feature3-title": "فصول ذكية",
        "feature3-desc": "تكنولوجيا مدمجة في كل فصل.",
        "feature4-title": "أنشطة",
        "feature4-desc": "رياضة، مسابقات، وفعاليات تعليمية.",

        "stages-title": "المراحل الدراسية",
        "stage-kg-title": "رياض الاطفال",
        "stage-kg-desc": "مرحلة رياض الاطفال",
        "stage-primary-title": "المرحلة الابتدائية",
        "stage-primary-desc": "المدرسة الابتدائية",
        "stage-prep-title": "المرحلة الإعدادية",
        "stage-prep-desc": "المدرسة الإعدادية",
        "stage-sec-title": "المرحلة الثانوية",
        "stage-sec-desc": "المدرسة الثانوية",
        "view-btn": "عرض",

        "news-title": "آخر الأخبار",
        "news1-title": "أنشطة صيفية",
        "news1-desc": "التسجيل متاح دلوقتي للأنشطة الصيفية.",
        "news2-title": "مسابقة مدرسية",
        "news2-desc": "شارك في مسابقتنا الأكاديمية السنوية.",
        "news3-title": "عام دراسي جديد",
        "news3-desc": "أهلاً بيكم في عام دراسي جديد.",

        "stats-students": "طالب",
        "stats-teachers": "معلم",
        "stats-classrooms": "فصل",
        "stats-experience": "سنة خبرة",

        "gallery-title": "معرض صور المدرسة",
        "gallery1-title": "الأنشطة المدرسية",
        "gallery1-desc": "أنشطة المدرسة",
        "gallery2-title": "الفصول الدراسية",
        "gallery2-desc": "صور الفصول",
        "gallery3-title": "المسابقات",
        "gallery3-desc": "مسابقات المدرسة",
        "gallery4-title": "الطلاب",
        "gallery4-desc": "معرض صور الطلاب",

        "footer-title": "مدرسة أحمد عرابي الرسميه لغات",
        "footer-copyright": " © 2026 جميع الحقوق محفوظه الي مدرسه احمد عرابي الرسميه لغات",
        "footer-devby": "تم التطوير بواسطة",

        "nav-devs": "المطورين",

        "class-choose-title": "اختر فصلك",
        "accordion-kg": "🎓 رياض الاطفال",
        "accordion-primary": "📚 الابتدائية",
        "accordion-preparatory": "📝 الإعدادية",
        "accordion-secondary": "🎯 الثانوية",
        "class-kg1": "رياض الاطفال 1",
        "class-kg2": "رياض الاطفال 2",
        "class-primary1": "ابتدائي 1",
        "class-primary2": "ابتدائي 2",
        "class-primary3": "ابتدائي 3",
        "class-primary4": "ابتدائي 4",
        "class-primary5": "ابتدائي 5",
        "class-primary6": "ابتدائي 6",
        "class-prep1": "إعدادي 1",
        "class-prep2": "إعدادي 2",
        "class-prep3": "إعدادي 3",
        "class-sec1": "ثانوي 1",
        "class-sec2": "ثانوي 2",
        "class-sec3": "ثانوي 3",

        "about-title": "عن مدرسة أحمد عرابي رسمه لغات",
        "about-desc": "مدرسة أحمد عرابي الرسميه لغات مؤسسة تعليمية حديثة بتركز على توفير تعليم عالي الجودة، وتنمية مهارات الطلاب، وخلق بيئة آمنة للتعلم والإبداع.",
        "about-vision-title": "رؤيتنا",
        "about-vision-desc": "بناء جيل قادر على الابتكار والقيادة.",
        "about-mission-title": "رسالتنا",
        "about-mission-desc": "تقديم تعليم متميز من خلال أساليب حديثة ومعلمين محترفين.",
        "about-values-title": "قيمنا",
        "about-values-desc": "الاحترام، الإبداع، العمل الجماعي، والتميز.",

        "contact-title": "تواصل معنا",
        "contact-desc": "عندك أي استفسار؟ تواصل مع مدرسة أحمد عرابي الرسميه لغات في أي وقت.",
        "contact-address-title": "العنوان",
        "contact-address-text": "موقع المدرسة هنا",
        "contact-phone-title": "الرقم التعريفي",
        "contact-email-title": "البريد الإلكتروني",

        "stage-back": "العودة للمراحل",
        "stage-grades-title": "الصفوف الدراسية",
        "stage-grades-desc": "استكشف كل مستوى في برنامجنا التعليمي.",
        "stage-view-all": "عرض كل المراحل",

        "kg-title": "رياض الاطفال",
        "kg-desc": "أهلاً بيكم في حضانة أحمد عرابي الرسميه لغات. بيئة آمنة ومبدعة يبدأ فيها الأطفال رحلة التعلم.",
        "kg-hl1-title": "بيئة آمنة",
        "kg-hl1-desc": "مساحة داعمة يشعر فيها كل طفل بالأمان والسعادة.",
        "kg-hl2-title": "تعلم إبداعي",
        "kg-hl2-desc": "أنشطة تعليمية باللعب تثير الفضول والخيال.",
        "kg-hl3-title": "نمو مبكر",
        "kg-hl3-desc": "بناء المهارات الاجتماعية والحركية واللغوية منذ البداية.",
        "kg-sub1-title": "رياض الاطفال 1",
        "kg-sub1-desc": "مهارات وأنشطة أساسية",
        "kg-sub2-title": "رياض الاطفال 2",
        "kg-sub2-desc": "تجهيز الأطفال للمرحلة الابتدائية",

        "primary-title": "المرحلة الابتدائية",
        "primary-hl1-title": "منهج أساسي",
        "primary-hl1-desc": "علوم، رياضيات، لغات، دراسات اجتماعية و اللغة الإنجليزية و المزيد.",
        "primary-hl2-title": "أنشطة جماعية",
        "primary-hl2-desc": "مشاريع جماعية تبني التعاون والثقة.",
        "primary-hl3-title": "تعلم ذكي",
        "primary-hl3-desc": "دمج التكنولوجيا في تجربة الفصل اليومية.",
        "primary-desc": "تنمية مهارات الطلاب وتجهيزهم للمرحلة الإعدادية.",
        "primary-sub1-title": "ابتدائي 1",
        "primary-sub1-desc": " اللغه العربيه, اللغه الانجليزيه, الرياضيات والمستوى الرفيع",
        "primary-sub2-title": "ابتدائي 2 ",
        "primary-sub2-desc": "اللغه العربيه, اللغه الانجليزيه, الرياضيات , والمستوي الرفيع",
        "primary-sub3-title": "ابتدائي 3",
        "primary-sub3-desc": "اللغه العربيه, اللغه الانجليزيه, الرياضيات والمستوى الرفيع",
        "primary-sub4-title": "ابتدائي 4",
        "primary-sub4-desc": "اللغه العربيه, اللغه الانجليزيه, الرياضيات, العلوم, الدراسات الاجتماعيه,المستوي الرفيع و المزيد",
        "primary-sub5-title": "ابتدائي 5",
        "primary-sub5-desc": "اللغه العربيه, اللغه الانجليزيه, الرياضيات, العلوم, الدراسات الاجتماعيه, المستوى الرفيع و المزيد",
        "primary-sub6-title": "ابتدائي 6",
        "primary-sub6-desc": " اللغه العربيه, اللغه الانجليزيه, الرياضيات, العلوم, الدراسات الاجتماعيه, المستوى الرفيع و المزيد",

        "prep-title": "المرحلة الإعدادية",
        "prep-desc": "تنمية مهارات الطلاب وتجهيزهم للمرحلة الثانوية.",
        "prep-hl1-title": "علوم ورياضيات",
        "prep-hl1-desc": "أساس قوي في المواد الأكاديمية الأساسية.",
        "prep-hl2-title": "اللغات",
        "prep-hl2-desc": "اللغة العربية، الإنجليزية، الألمانية، الفرنسية، ومهارات لغوية إضافية.",
        "prep-hl3-title": "التفكير النقدي",
        "prep-hl3-desc": "حل المشكلات وعادات التعلم المستقل.",
        "prep-sub1-title": "إعدادي 1",
        "prep-sub1-desc": "اللغة العربية، الرياضيات، الإنجليزية، العلوم، الدراسات الاجتماعية ,المستوى الرفيع والمزيد",
        "prep-sub2-title": "إعدادي 2 ",
        "prep-sub2-desc": "اللغة العربية، الرياضيات، الإنجليزية، العلوم، الدراسات الاجتماعية, المستوى الرفيع والمزيد ",
        "prep-sub3-title": "إعدادي 3",
        "prep-sub3-desc" :  "اللغة العربية، الرياضيات، الإنجليزية، العلوم، الدراسات الاجتماعية, المستوى الرفيع والمزيد",


        "sec-title": "المرحلة الثانوية",
        "sec-desc": "تجهيز الطلاب للجامعة من خلال تعليم متقدم وتنمية المهارات.",
        "sec-hl1-title": "تجهيز جامعي",
        "sec-hl1-desc": "إرشاد ومنهج متوافق مع أهداف التعليم العالي.",
        "sec-hl2-title": "دراسات متقدمة",
        "sec-hl2-desc": "مواد متعمقة في العلوم والإنسانيات واللغات.",
        "sec-hl3-title": "القيادة",
        "sec-hl3-desc": "بناء الثقة والمسؤولية ومهارات المستقبل.",
        "sec-sub1-title": "ثانوي 1",
        "sec-sub1-desc":  "قريباً ...",
        "sec-sub2-title": "ثانوي 2 ",
        "sec-sub2-desc": "قريباً ...",
        "sec-sub3-title": "ثانوي 3",
        "sec-sub3-desc" : "قريباً ...",


        "mrabdo-title": "إنجازات الأستاذ عبدالرحمن راشد",
        "mrabdo-desc": "اختر إنجازا لعرض معرض الصور الخاص به.",
        "achievement-dropdown-title":
        '<i class="fa-solid fa-images"></i> إنجازات الأستاذ عبد الرحمن راشد',

"click-view": "اضغط للعرض",

"achievement-ramadan": "احتفالات رمضان",
"achievement-mothersday": "عيد الأم",
"achievement-masjid": "بناء المسجد",
"achievement-creator": "الطفل المبدع",
"achievement-giza": "مسابقة الجيزة",
"achievement-football": "بطولة كرة القدم 2023",
"achievement-boxing": "الكيك بوكسينج",
"achievement-kgvisits": "زيارات رياض الأطفال",
"achievement-camera": "تأمين المدرسة",
"achievement-buildings": "أحدث المباني",
"achievement-decoration": "تزيين المدرسة",
"achievement-agriculture": "الزراعة المدرسية",
"achievement-honoring": "التكريم",
"achievement-honoring-mr": "تكريم الأستاذ عبدالرحمن",
"achievement-party": "الحفل",
"achievement-dp": "دريم بارك",
"achievement-hospital": "مستشفى 57357",
"achievement-aml": "زيارة أمل مبارك",
"achievement-corridor": "الممر",
"achievement-purplecomet": "مسابقة Purple Comet",
"achievement-deutsch": "مسابقة اللغة الألمانية",
"achievement-theater": "المسابقة المسرحية",
"achievement-math": "مسابقة الرياضيات",
"achievement-childhood": "يوم الطفولة",
"achievement-camp": "المعسكر المدرسي",

"activity-desc": "اختر نشاطاً لعرض معرض الصور الخاص به.",
"activity-dropdown-title":
'<i class="fa-solid fa-images"></i> نشاطات مدرسة أحمد عرابي الرسمية لغات',
"activity-ramadan":"رمضان كريم",
"activity-em":"جولة تعريفية في المتحف المصري الكبير",
"activity-nd":"ديكور جديد",
        "activity-alr": "تنصيب على مستوى الإدارة",
        "activity-abakera": "العباقره",
        "competitions-dropdown-title":
            ' مسابقات مدرسة أحمد عرابي الرسمية لغات',
        "competition-desc2": "اختر مسابقة لعرض صورها ",
        
        "activity-math": "مسابقة الرياضيات ",
        "activity-deutsch": "مسابقة اللغه الالمانيه",
        "activity-purplecomet": "Purple Comet",
        "activity-Chess": "شطرنج",
                "mrseman-title": "إنجازات الأستاذة إيمان عبدالحميد",
"mrseman-desc": "اختر إنجازا لعرض معرض الصور الخاص به.",
"mrseman-dropdown-title":
    '<i class="fa-solid fa-images"></i> إنجازات الأستاذة إيمان عبدالحميد',
"achievement-chess": "الشطرنج",
"achievement-abakera": "العباقرة",
"achievement-windows": "نوافذ جديدة",
"achievement-quran": "القرآن الكريم",
        "achievement-ml": "تجديد فناء المدرسة",
"activity-quran": "القرآن الكريم",
        "activity-sfl": "الدوري المدرسي لكرة القدم",
"about-hero-lang-label": "قولها بأي لغة",
"about-hero-title": "مدرسة بُنيت على <em>الشجاعة واللغة والحرفية</em>",
"about-hero-subtitle": "مدرسة أحمد عرابي الرسمية لغات تحمل اسم رجل قال الحق بكل كرامة. وإحنا بنعلّم طلابنا يعملوا نفس الحاجة — بالعربي، وبالإنجليزي، وبأي لغة بتفتحلهم باب جديد.",
"about-hero-scroll": "انزل تحت عشان تقرأ حكايتنا",

"about-story-eyebrow": "حكايتنا",
"about-story-title": "لما الاسم بقى وعد",
"about-story-since": "تأسست 2020 · المهندسين ، مصر",
"about-story-p1": "أحمد عرابي الرسميه لغات فتحت أبوابها بفكرة بسيطة ما صغّرتش أبداً: إن الطفل ممكن يكبر متجذر في هويته المصرية وفي نفس الوقت حاسس إنه في بيته وسط لغات العالم كله. سمينا المدرسة على اسم أحمد عرابي، الراجل اللي اتذكر مش بألقابه، لكن بصراحته وكرامته وهو بيقف لبلده. وده المعيار اللي بنحاسب نفسنا عليه.",
"about-story-p2": "اللي بدأ بفصول قليلة بقى رحلة متكاملة من رياض الأطفال لحد الثانوية — لكن النمو نفسه ما كانش الهدف. كل مرحلة ضفناها كانت لأن عيلة طلبت مكان ما يضطروش فيه يختاروا بين التميز والدفء.",
"about-story-p3": "النهاردة، مدرسة أحمد عرابي الرسمية لغات موجودة لنفس السبب اللي كانت موجودة عشانه من الأول: نديّ طلابنا حاجتين في نفس الوقت — طلاقة في اللغات اللي هتوصلهم لأي مكان، وإحساس بهويتهم اللي هيفضل معاهم أينما راحوا.",

"about-principal-quote": "احنا مابنقيّمش السنة الدراسية بالمنهج اللي اتغطى، لكن بالثقة اللي بتفضل في الطالب بعدها. كل طفل بيدخل من بوابتنا إحنا بنثق فيه بصوته — وشغلنا الوحيد إننا نساعده يستخدمه، بأي لغة يختارها.",
"about-principal-name": "أ. إيمان عبد الحميد",
"about-principal-title": "مديرة مدرسة، أحمد عرابي الرسميه لغات",

"about-path-vision-tag": "الاتجاه",
"about-path-vision-title": "رؤيتنا",
"about-path-vision-desc": "جيل طليق في لغات العالم ومتجذر بثبات في قيم بيته — قادر إنه يقود في أي مكان من غير ما ينسى منين بدأ.",
"about-path-mission-tag": "أسلوبنا",
"about-path-mission-title": "رسالتنا",
"about-path-mission-desc": "تقديم تعليم ثنائي اللغة متكامل من خلال أساليب تدريس حديثة ومعلمين متفانين — بناء مهارات للحياة، مش بس للامتحانات.",
"about-path-values-tag": "الأساس",
"about-path-values-title": "القيم الأساسية",
"about-path-values-desc": "كل حاجة بنبنيها قايمة على نفس الأربع ركائز، في كل فصل وكل مرحلة.",
"about-path-chip-1": "النزاهة",
"about-path-chip-2": "الفضول",
"about-path-chip-3": "التميز",
"about-path-chip-4": "الانتماء",

"about-values-eyebrow": "إحنا بنمثل إيه",
"about-values-title": "ست قيم بنعيشها كل يوم",
"about-values-desc": "مش كلام على الحيطة — عادات طلابنا بيمارسوها من أول يوم في رياض الأطفال لحد آخر يوم في الثانوية.",

"about-value-innovation-title": "الابتكار",
"about-value-innovation-desc": "بنشجّع الطلاب يسألوا أسئلة أذكى، مش بس يلاقوا إجابات أسرع.",
"about-value-respect-title": "الاحترام",
"about-value-respect-desc": "للمعلمين، للزملاء، ولكل لغة وثقافة موجودة في مدرستنا.",
"about-value-leadership-title": "القيادة",
"about-value-leadership-desc": "نديّ الطلاب فرص حقيقية إنهم يتكلموا الأول ويتحملوا المسؤولية بدري.",
"about-value-creativity-title": "الإبداع",
"about-value-creativity-desc": "بنفسح مجال للأفكار اللي مش لازم تكون في الكتاب المدرسي، عن قصد.",
"about-value-responsibility-title": "المسؤولية",
"about-value-responsibility-desc": "بنعلّم الطلاب يتحملوا نتيجة اختياراتهم، جوه الفصل وبرّه.",
"about-value-teamwork-title": "العمل الجماعي",
"about-value-teamwork-desc": "بنوريهم إن أحسن الأفكار غالباً بتكون نتيجة أكتر من شخص.",

"about-cta-title": "جاهز تشوف مدرسة احمد عرابي بنفسك؟",
"about-cta-desc": "تعالى قابل معلمينا، وامشي في فصولنا، وشوف منين رحلة اللغة الجديدة لابنك هتبدأ.",
"about-cta-btn": "تواصل معنا",
    }
    

};





const langSwitch = document.getElementById("langSwitch");
const htmlTag    = document.documentElement;

function applyLanguage(lang) {

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(el => {
        const key = el.getAttribute("data-i18n-html");
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });

    htmlTag.setAttribute("lang", lang);
    htmlTag.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    if (langSwitch) {
    const enSpan = langSwitch.querySelector(".ls-en");
    const arSpan = langSwitch.querySelector(".ls-ar");
    if (enSpan && arSpan) {
        enSpan.classList.toggle("ls-active", lang === "en");
        arSpan.classList.toggle("ls-active", lang === "ar");
    }
}

    localStorage.setItem("site-lang", lang);

}

const savedLang = localStorage.getItem("site-lang") || "en";
applyLanguage(savedLang);

langSwitch?.addEventListener("click", () => {
    const currentLang = htmlTag.getAttribute("lang") === "ar" ? "ar" : "en";
    const newLang = currentLang === "ar" ? "en" : "ar";
    applyLanguage(newLang);
});

/* ===========================
   ACTIVITIES TABS
=========================== */

// ================= Tabs =================

const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn => btn.classList.remove("active"));
        contents.forEach(content => content.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");

    });

});

// ================= Image Popup =================

const modal      = document.getElementById("imageModal");
const popupImage = document.getElementById("popupImage");
const popupText  = document.getElementById("popupText");
const closeBtn   = document.querySelector(".close");

if (modal && popupImage && popupText && closeBtn) {

    // فتح الصورة عند الضغط عليها
    document.querySelectorAll(".championship-gallery img, .school-gallery img ,.classes-gallery img").forEach(img => {

        img.addEventListener("click", () => {

            popupImage.src = img.src;
            popupText.textContent = img.dataset.text || "";

            modal.classList.add("show");

        });

    });

    // غلق النافذة بزر ×
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    // غلق النافذة عند الضغط خارج المحتوى
    modal.addEventListener("click", (e) => {

        if (e.target === modal) {
            modal.classList.remove("show");
        }

    });

    // غلق النافذة بزر Escape
    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            modal.classList.remove("show");
        }

    });

}

// انجازات



const galleries = {

    Ramadan:{

        title:"Football Championship",

        images:[

            {
                src:"../MrAbdoAchive/Ramadan1.png",
                
            },

            {
                src:"../images/football/2.jpg",
                title:"Football",
                description:"Football Championship"
            },

            {
                src:"../images/football/3.jpg",
                title:"Football",
                description:"Football Championship"
            }

        ]

    },

    MothersDay:{

        title:"Basketball Championship",

        images:[

            {
                src:"../MrAbdoAchive/Mother's Day1.jpg",
                title:"Basketball",
                description:"Basketball Championship"
            },

            {
                src:"../images/basketball/2.jpg",
                title:"Basketball",
                description:"Basketball Championship"
            },

            {
                src:"../images/basketball/3.jpg",
                title:"Basketball",
                description:"Basketball Championship"
            }

        ]

    },

    chess:{

        title:"Chess Championship",

        images:[

            {
                src:"../images/chess/1.jpg",
                title:"Chess",
                description:"Chess Championship"
            },

            {
                src:"../images/chess/2.jpg",
                title:"Chess",
                description:"Chess Championship"
            },

            {
                src:"../images/chess/3.jpg",
                title:"Chess",
                description:"Chess Championship"
            }

        ]

    },

    handball:{

        title:"Handball Championship",

        images:[

            {
                src:"../images/handball/1.jpg",
                title:"Handball",
                description:"Handball Championship"
            },

            {
                src:"../images/handball/2.jpg",
                title:"Handball",
                description:"Handball Championship"
            },

            {
                src:"../images/handball/3.jpg",
                title:"Handball",
                description:"Handball Championship"
            }

        ]

    },

    volleyball:{

        title:"Volleyball Championship",

        images:[

            {
                src:"../images/volleyball/1.jpg",
                title:"Volleyball",
                description:"Volleyball Championship"
            },

            {
                src:"../images/volleyball/2.jpg",
                title:"Volleyball",
                description:"Volleyball Championship"
            },

            {
                src:"../images/volleyball/3.jpg",
                title:"Volleyball",
                description:"Volleyball Championship"
            }

        ]

    },

    achievement6:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement7:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement8:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement9:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement10:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement11:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement12:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement13:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement14:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement15:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement16:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement17:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement18:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement19:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    },

    achievement20:{
        title:"",
        images:[
            {src:"",title:"",text:""},
            {src:"",title:"",text:""},
            {src:"",title:"",text:""}
        ]
    }

};
