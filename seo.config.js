/**
 * ============================================================
 *  SEO CONFIG — single source of truth
 *  Edit this file, then run:  node inject-seo.js
 * ============================================================
 */

const SEO = {

  // ── Site identity ─────────────────────────────────────────
  site: {
    name:        "Test Timer",
    domain:      "testtimer.app",        // no trailing slash, no https://
    lang:        "en",
    themeColor:  "#0d0d0d",             // browser tab / mobile chrome color
    favicon:     "/favicon.ico",
  },

  // ── Primary page ──────────────────────────────────────────
  page: {
    title:       "Test Timer — Exam Lap Timer with Per-Question Splits",
    description: "Free online exam timer that tracks time remaining and split time per question. Set your total test duration, hit Lap after each question, and see your pace vs average instantly.",
    canonical:   "https://testtimer.app/",
    keywords:    "exam timer, test timer per question, lap timer exam, question split timer, online test timer, exam countdown",
  },

  // ── Parent / company ──────────────────────────────────────
  // Shown in footer as "[company.tagline] [company.name →]"
  // Set enabled: false to hide entirely
  company: {
    enabled:  true,
    name:     "Acme Tools",             // your parent brand name
    url:      "https://acmetools.io",   // parent site URL
    tagline:  "More free tools at",     // text before the link
  },

  // ── Social links (icon row in footer) ─────────────────────
  // Set url: "" to hide that icon
  social: {
    twitter:   "https://twitter.com/testtimer",
    github:    "https://github.com/testtimer",
    instagram: "",
    tiktok:    "",
    youtube:   "",
    linkedin:  "",
    discord:   "",
    facebook:  "",
    reddit:    "https://reddit.com/r/testtimer",
  },

  // ── Open Graph ────────────────────────────────────────────
  og: {
    type:        "website",
    image:       "https://testtimer.app/og-image.png",  // 1200x630 px
    imageWidth:  1200,
    imageHeight: 630,
    imageAlt:    "Test Timer — exam lap timer screenshot",
    locale:      "en_US",
  },

  // ── Twitter / X card ──────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    site:        "@testtimer",           // @handle or ""
    creator:     "@testtimer",           // @handle or ""
    image:       "https://testtimer.app/og-image.png",
  },

  // ── Ads ───────────────────────────────────────────────────
  // Set enabled: false to turn off all ads globally with one toggle
  ads: {
    enabled: false,

    // Google AdSense
    adsense: {
      enabled:     false,
      publisherId: "ca-pub-XXXXXXXXXXXXXXXX",  // paste your pub ID here
      autoAds:     true,   // auto-inject ads across page; set false for manual only
    },

    // Manual ad slots rendered in the page
    // type: "adsense" | "custom"
    slots: [
      {
        id:         "footer-banner",
        enabled:    false,
        type:       "adsense",
        slotId:     "1234567890",        // AdSense data-ad-slot value
        format:     "auto",              // "auto" | "rectangle" | "leaderboard"
        customHtml: "",
      },
      // { id: "sidebar", enabled: false, type: "custom", customHtml: "<div>...</div>" },
    ],
  },

  // ── Schema.org WebApplication structured data ─────────────
  schema: {
    applicationCategory: "UtilitiesApplication",
    operatingSystem:     "Any",
    offers: {
      price:    "0",
      currency: "USD",
    },
    screenshot: "https://testtimer.app/og-image.png",
    // Remove aggregateRating if you have no real ratings yet
    aggregateRating: {
      ratingValue: "4.8",
      ratingCount: "24",
    },
  },

  // ── Sitemap ───────────────────────────────────────────────
  sitemap: {
    pages: [
      {
        loc:        "https://testtimer.app/",
        lastmod:    "2025-05-11",
        changefreq: "monthly",
        priority:   "1.0",
      },
      // { loc: "https://testtimer.app/about", lastmod: "...", changefreq: "yearly", priority: "0.5" },
    ],
  },

  // ── robots.txt ────────────────────────────────────────────
  robots: {
    allow:      ["/"],
    disallow:   [],
    sitemapUrl: "https://testtimer.app/sitemap.xml",
    crawlDelay: null,
  },

};

if (typeof module !== "undefined") module.exports = SEO;
