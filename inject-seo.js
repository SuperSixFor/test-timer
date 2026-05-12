#!/usr/bin/env node
/**
 * inject-seo.js
 * Reads seo.config.js and rewrites lap-timer.html, sitemap.xml, robots.txt
 * Usage: node inject-seo.js
 */

const fs   = require("fs");
const path = require("path");
const SEO  = require("./seo.config.js");
const { site, page, og, twitter, schema, sitemap, robots, company, social, ads } = SEO;

// ── SVG icon paths for social platforms ───────────────────────────────────────
const ICONS = {
  twitter:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  github:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>`,
  youtube:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  linkedin:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  discord:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>`,
  facebook:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  reddit:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
};

// ── Build <head> meta block ────────────────────────────────────────────────────
const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: site.name,
  url: page.canonical,
  description: page.description,
  applicationCategory: schema.applicationCategory,
  operatingSystem: schema.operatingSystem,
  offers: { "@type": "Offer", price: schema.offers.price, priceCurrency: schema.offers.currency },
  screenshot: schema.screenshot,
  ...(schema.aggregateRating ? {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: schema.aggregateRating.ratingValue,
      ratingCount: schema.aggregateRating.ratingCount,
    }
  } : {}),
}, null, 2);

// AdSense head script (only if enabled)
const adsenseHeadScript = (ads.enabled && ads.adsense.enabled)
  ? `\n<!-- ═══ Google AdSense ═══════════════════════════════════════════════════ -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.adsense.publisherId}" crossorigin="anonymous"></script>\n${ads.adsense.autoAds ? `<script>(adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: "${ads.adsense.publisherId}", enable_page_level_ads: true });</script>` : ''}`
  : `<!-- ads disabled — set ads.enabled + ads.adsense.enabled in seo.config.js to activate -->`;

const metaBlock = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="${site.themeColor}">
<link rel="icon" href="${site.favicon}">

<!-- ═══ Primary SEO (edit via seo.config.js) ══════════════════════════════ -->
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="keywords"    content="${page.keywords}">
<link rel="canonical"    href="${page.canonical}">
<meta name="robots"      content="index, follow">

<!-- ═══ Open Graph ════════════════════════════════════════════════════════ -->
<meta property="og:type"         content="${og.type}">
<meta property="og:title"        content="${page.title}">
<meta property="og:description"  content="${page.description}">
<meta property="og:url"          content="${page.canonical}">
<meta property="og:site_name"    content="${site.name}">
<meta property="og:image"        content="${og.image}">
<meta property="og:image:width"  content="${og.imageWidth}">
<meta property="og:image:height" content="${og.imageHeight}">
<meta property="og:image:alt"    content="${og.imageAlt}">
<meta property="og:locale"       content="${og.locale}">

<!-- ═══ Twitter / X ══════════════════════════════════════════════════════ -->
<meta name="twitter:card"        content="${twitter.card}">
${twitter.site    ? `<meta name="twitter:site"    content="${twitter.site}">` : ""}
${twitter.creator ? `<meta name="twitter:creator" content="${twitter.creator}">` : ""}
<meta name="twitter:title"       content="${page.title}">
<meta name="twitter:description" content="${page.description}">
<meta name="twitter:image"       content="${twitter.image}">

<!-- ═══ Schema.org structured data ═══════════════════════════════════════ -->
<script type="application/ld+json">
${schemaJson}
</script>
${adsenseHeadScript}`;

// ── Build footer HTML ──────────────────────────────────────────────────────────

// Social icon links (only non-empty URLs)
const socialLinks = Object.entries(social)
  .filter(([, url]) => url && url.trim() !== "")
  .map(([platform, url]) => {
    const svg = ICONS[platform] || "";
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${platform}" class="social-icon">${svg}</a>`;
  }).join("\n        ");

// Ad slots
const adSlotHtml = (ads.enabled)
  ? ads.slots
      .filter(s => s.enabled)
      .map(s => {
        if (s.type === "adsense") {
          return `<div class="ad-slot" id="ad-${s.id}">
  <ins class="adsbygoogle" style="display:block" data-ad-client="${ads.adsense.publisherId}" data-ad-slot="${s.slotId}" data-ad-format="${s.format}" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;
        }
        return `<div class="ad-slot" id="ad-${s.id}">${s.customHtml}</div>`;
      }).join("\n")
  : "<!-- ad slots inactive — set ads.enabled: true in seo.config.js -->";

const companyHtml = company.enabled
  ? `<div class="footer-company">
      <span class="footer-tagline">${company.tagline}</span>
      <a href="${company.url}" target="_blank" rel="noopener noreferrer" class="footer-company-link">${company.name} →</a>
    </div>`
  : "";

const footerHtml = `
  ${adSlotHtml}

  <footer class="site-footer">
    ${socialLinks ? `<div class="social-icons">\n        ${socialLinks}\n      </div>` : ""}
    ${companyHtml}
    <div class="footer-copy">&copy; ${new Date().getFullYear()} ${site.name}</div>
  </footer>`;

const footerStyles = `
  /* ── Footer ────────────────────────────────────────────── */
  .site-footer {
    max-width: 480px;
    margin: 3rem auto 0;
    padding: 2rem 1rem 2.5rem;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }
  .social-icons {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .social-icon {
    color: #444;
    display: flex;
    align-items: center;
    transition: color 0.15s;
    text-decoration: none;
  }
  .social-icon:hover { color: #888; }
  .social-icon svg { width: 18px; height: 18px; }
  .footer-company {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #444;
  }
  .footer-company-link {
    color: #666;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.15s;
  }
  .footer-company-link:hover { color: #888; }
  .footer-copy {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #2e2e2e;
    text-transform: uppercase;
  }
  .ad-slot {
    max-width: 480px;
    margin: 1.5rem auto 0;
    width: 100%;
  }`;

// ── Read + patch lap-timer.html ────────────────────────────────────────────────
const htmlPath = require("path").join(__dirname, "lap-timer.html");
let html = fs.readFileSync(htmlPath, "utf8");

// Inject meta block (replace everything between <head> and first <link rel="preconnect">)
html = html.replace(
  /<head>[\s\S]*?(<link rel="preconnect")/,
  `<head>\n${metaBlock}\n$1`
);

// Update lang attribute
html = html.replace(/(<html\s[^>]*lang=")[^"]*(")/,  `$1${site.lang}$2`);
html = html.replace(/<html(?![^>]*lang)/, `<html lang="${site.lang}"`);

// Inject footer styles before closing </style>
html = html.replace("</style>", `${footerStyles}\n</style>`);

// Inject footer before closing </body>
html = html.replace("</body>", `${footerHtml}\n</body>`);

fs.writeFileSync(htmlPath, html, "utf8");
console.log("✓  lap-timer.html — meta + footer injected");

// ── sitemap.xml ───────────────────────────────────────────────────────────────
const urlset = sitemap.pages.map(p => `
  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

fs.writeFileSync(
  require("path").join(__dirname, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`.trim(),
  "utf8"
);
console.log("✓  sitemap.xml written");

// ── robots.txt ────────────────────────────────────────────────────────────────
const robotsTxt = [
  "User-agent: *",
  ...robots.allow.map(r => `Allow: ${r}`),
  ...(robots.disallow.length ? robots.disallow.map(r => `Disallow: ${r}`) : ["Disallow:"]),
  ...(robots.crawlDelay ? [`Crawl-delay: ${robots.crawlDelay}`] : []),
  "",
  `Sitemap: ${robots.sitemapUrl}`,
].join("\n");

fs.writeFileSync(require("path").join(__dirname, "robots.txt"), robotsTxt, "utf8");
console.log("✓  robots.txt written");

console.log("\nDone! Deploy: lap-timer.html, sitemap.xml, robots.txt");
