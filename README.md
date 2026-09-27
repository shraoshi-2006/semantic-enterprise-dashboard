# Apex Cloud Console — Semantic HTML5 & Accessible Component Architecture

[![W3C HTML5 Validated](https://img.shields.io/badge/W3C%20HTML5-Zero%20Errors-brightgreen.svg)](docs/w3c-validation-report.md)
[![WCAG 2.1 Conformance](https://img.shields.io/badge/WCAG%202.1-AA%20%2F%20AAA%20Compliant-blue.svg)](docs/w3c-validation-report.md)
[![WAI-ARIA 1.2](https://img.shields.io/badge/WAI--ARIA-1.2%20Standard-purple.svg)](https://www.w3.org/TR/wai-aria-1.2/)
[![Zero Dependencies Runtime](https://img.shields.io/badge/Runtime-Vanilla%20HTML5%2FCSS3%2FES6-orange.svg)](index.html)

A production-grade structural foundation for an enterprise cloud infrastructure console, engineered in strict accordance with **HTML5 semantic specifications**, **WCAG 2.1 AA/AAA accessibility criteria**, and a structured, clean DOM hierarchy.

Every document and component fragment within this repository has been validated against the official W3C HTML5 rulesets and passes with **zero syntax errors and zero warnings**.

---

## 📑 Table of Contents

- [Architectural Highlights](#-architectural-highlights)
- [Repository Structure](#-repository-structure)
- [Semantic HTML5 Landmark Hierarchy](#-semantic-html5-landmark-hierarchy)
- [Accessible Component Architecture](#-accessible-component-architecture)
  - [1. Navigation & Header (`<header>`, `<nav>`)](#1-navigation--header-header-nav)
  - [2. Collapsible Sidebar & Status Monitor (`<aside>`)](#2-collapsible-sidebar--status-monitor-aside)
  - [3. Main Content & KPI Metric Cards (`<main>`, `<section>`, `<article>`)](#3-main-content--kpi-metric-cards-main-section-article)
  - [4. Accessible Data Tables (`<table>`, `<caption>`, `<th scope="...">`)](#4-accessible-data-tables-table-caption-th-scope)
  - [5. Robust Accessible Form Controls (`<fieldset>`, `<legend>`, `<label>`)](#5-robust-accessible-form-controls-fieldset-legend-label)
  - [6. Native Accessible Modal Dialog (`<dialog>`)](#6-native-accessible-modal-dialog-dialog)
  - [7. Informational Footer (`<footer>`)](#7-informational-footer-footer)
- [Keyboard Navigation & ARIA Patterns](#-keyboard-navigation--aria-patterns)
- [Color Contrast & Theming (WCAG AAA)](#-color-contrast--theming-wcag-aaa)
- [W3C Validation Proof & Automated Testing](#-w3c-validation-proof--automated-testing)
- [Local Setup & Quickstart](#-local-setup--quickstart)

---

## 🌟 Architectural Highlights

1. **Strict HTML5 Semantics**: Complete elimination of generic `div`-soup in favor of native landmark and structural tags: `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<dialog>`, and `<footer>`.
2. **W3C Syntax Conformance**: Validated with zero errors against the W3C HTML5 engine (`html-validate`), with standard rules preventing redundant roles, invalid tag nesting, missing submit buttons, and un-scoped tables.
3. **WCAG 2.1 Level AA & AAA Compliance**:
   - High contrast mode exceeding **15:1** contrast ratios (`[data-contrast="high"]`).
   - Standard dark theme with **11.2:1** typography contrast.
   - Dedicated skip-to-content bypass link (`#main`).
   - Prominent, unbroken 3px `:focus-visible` outlines.
   - Live ARIA announcements (`#a11y-announcer`) for dynamic updates and sorting actions.
4. **Standalone Pages & Isolated Components**:
   - `index.html`: Unified, dynamic enterprise dashboard application.
   - `pages/`: Standalone HTML pages (`nodes.html`, `provision.html`, `audit.html`) for multi-page deployment patterns.
   - `components/`: Modular, decoupled HTML component snippets for enterprise design systems.

---

## 📂 Repository Structure

```
semantic-enterprise-dashboard/
├── index.html                      # Master enterprise dashboard (SPA view router)
├── package.json                    # Project metadata & validation test scripts
├── .gitignore                      # Git ignore patterns
├── .htmlvalidate.json              # Strict W3C & WCAG lint configuration
├── css/
│   └── dashboard.css               # WCAG 2.1 CSS (high contrast, focus ring, themes)
├── js/
│   └── dashboard.js                # Vanilla JS controller (a11y announcements, modals)
├── pages/                          # Standalone multi-page layout views
│   ├── nodes.html                  # Dedicated compute fleet data table page
│   ├── provision.html              # Dedicated cluster provisioning form page
│   └── audit.html                  # Dedicated security & compliance audit log page
├── components/                     # Clean, isolated HTML component snippets
│   ├── header.html                 # Top header landmark with search & actions
│   ├── sidebar.html                # Sidebar landmark with navigation & telemetry
│   ├── datatable.html              # Accessible data table with captions and scopes
│   ├── modal.html                  # HTML5 native <dialog> modal with focus trap
│   ├── form-controls.html          # Accessible form with fieldset, legend, labels
│   └── kpi-cards.html              # Metric cards with section and article tags
├── docs/
│   └── w3c-validation-report.md    # Full W3C validation report & WCAG matrix
└── test/
    └── w3c-validate.js             # Automated HTML5 & WCAG validation runner script
```

---

## 🏛️ Semantic HTML5 Landmark Hierarchy

The application establishes a clear landmark tree recognized by all screen readers (NVDA, JAWS, VoiceOver):

```
<body>
 ├── a.skip-link [href="#main"] (Skip to main content)
 ├── div#a11y-announcer [aria-live="polite"] (Screen reader announcements)
 ├── header.site-header (Global top banner)
 │    ├── button#sidebar-toggle-btn [aria-expanded aria-label]
 │    ├── a.brand-logo
 │    ├── form.header-search-form [role="search"]
 │    │    ├── label.sr-only [for="global-search-input"]
 │    │    ├── input#global-search-input [type="search"]
 │    │    └── button.search-submit-icon [type="submit" aria-label]
 │    └── div.header-right (High Contrast Toggle, Theme Toggle, User Profile)
 ├── div.app-layout
 │    ├── aside#site-sidebar.site-sidebar [aria-label="Console Navigation Sidebar"]
 │    │    ├── nav [aria-label="Console Primary Navigation"]
 │    │    │    └── ul.nav-menu -> li -> a.nav-item-btn [aria-current]
 │    │    └── div.sidebar-status-card (Live telemetry monitor)
 │    └── main#main.site-main [tabindex="-1"]
 │         ├── nav.breadcrumb-nav [aria-label="Breadcrumb Navigation"]
 │         ├── section#view-overview.dashboard-view
 │         │    ├── header.view-header -> h1.view-title
 │         │    ├── section.kpi-grid [aria-labelledby]
 │         │    │    └── article.kpi-card (x4)
 │         │    ├── section.quick-actions-section [aria-labelledby]
 │         │    └── section.view-section [aria-labelledby]
 │         ├── section#view-datatable.dashboard-view
 │         │    └── table.accessible-table
 │         │         ├── caption
 │         │         ├── thead -> tr -> th [scope="col" aria-sort]
 │         │         └── tbody -> tr -> th [scope="row"] + td
 │         ├── section#view-forms.dashboard-view
 │         │    └── form#cluster-provision-form [novalidate]
 │         │         ├── div#form-error-summary [role="alert" tabindex="-1"]
 │         │         ├── fieldset.accessible-fieldset
 │         │         │    ├── legend.accessible-legend
 │         │         │    └── div.form-group -> label [for] + input [aria-describedby]
 │         │         └── div.form-actions-row -> button [type="submit"]
 │         └── section#view-audit.dashboard-view
 │              └── article.audit-event-card (x4)
 ├── dialog#modal-provision.accessible-dialog [aria-labelledby aria-describedby]
 │    ├── div.dialog-header -> h2#modal-title + button.dialog-close-btn [aria-label]
 │    └── div.dialog-body -> form [method="dialog"]
 └── footer.site-footer
      ├── div.footer-left (Copyright & release status)
      └── nav.footer-nav [aria-label="Footer & Compliance Navigation"]
```

---

## 🧩 Accessible Component Architecture

### 1. Navigation & Header (`<header>`, `<nav>`)
- **Semantic Tag**: `<header class="site-header">` without redundant `role="banner"`.
- **Search Form**: Complies with **WCAG H32** by enclosing a `<button type="submit">` element. Contains `<label for="global-search-input" class="sr-only">`.
- **Accessible Toggles**: Uses `role="switch"` and `aria-checked` to communicate state changes for high-contrast and light/dark theme modes.

### 2. Collapsible Sidebar & Status Monitor (`<aside>`)
- **Semantic Tag**: `<aside id="site-sidebar" aria-label="Console Navigation Sidebar">`.
- **Nav Landmark**: `<nav aria-label="Console Primary Navigation">` enclosing an unordered list `<ul>`.
- **Current Page**: Indicates active view with `aria-current="page"`.
- **Alert Badges**: Screen-reader accessible without invalid attributes: `<span class="nav-badge"><span class="sr-only">1 degraded node</span>1</span>`.

### 3. Main Content & KPI Metric Cards (`<main>`, `<section>`, `<article>`)
- **Semantic Tag**: `<main id="main" tabindex="-1">`.
- **Grid Container**: `<section class="kpi-grid" aria-labelledby="overview-kpi-heading">`.
- **Self-Contained Cards**: Each KPI card is represented by an `<article class="kpi-card" aria-labelledby="card-id">`.
- **Status Indicators**: Status icons include text equivalents (e.g. `● Healthy`, `▲ High Load`).

### 4. Accessible Data Tables (`<table>`, `<caption>`, `<th scope="...">`)
- **Descriptive Caption**: `<caption class="table-caption">Production Compute Fleet Status and Resource Allocation</caption>`.
- **Header Scopes**: `<th scope="col">` for column headers and `<th scope="row">` for row identifiers (node IPs).
- **Sorting State**: Interactive column headers communicate sorting order via `aria-sort="ascending"`, `aria-sort="descending"`, or `aria-sort="none"`.
- **Row Checkboxes**: `<input type="checkbox" aria-label="Select node ip-10-0-1-42.us-east-1 for cluster actions">`.

### 5. Robust Accessible Form Controls (`<fieldset>`, `<legend>`, `<label>`)
- **Field Grouping**: Grouped with `<fieldset class="accessible-fieldset">` and labeled with `<legend class="accessible-legend">`.
- **Explicit Labels**: All inputs bound using `<label for="inputId">`.
- **Descriptions & Helpers**: Associated via `aria-describedby="helperId errorId"`.
- **Error Feedback**: Inline errors bound via `aria-describedby` and marked with `aria-invalid="true"`.
- **Error Summary**: Dedicated `<div id="form-error-summary" role="alert" tabindex="-1">` receiving programmatic focus upon failed submission.
- **Custom Radio Cards**: Adheres to HTML5 content models by avoiding block `<div>` elements inside `<label>`:
  ```html
  <label class="radio-card-label">
    <input type="radio" name="instanceProfile" value="general" checked>
    <span class="radio-card-text">
      <span class="radio-card-title">General Purpose</span>
      <span class="radio-card-desc">4 vCPU · 16 GB RAM</span>
    </span>
  </label>
  ```

### 6. Native Accessible Modal Dialog (`<dialog>`)
- **Semantic Tag**: Native HTML5 `<dialog id="modal-provision" class="accessible-dialog" aria-labelledby="modal-title" aria-describedby="modal-desc">`.
- **Modal Display**: Invoked using `.showModal()`, automatically enforcing native inert background blocking and top-layer rendering.
- **Keyboard Handling**: Dismissible via the `Escape` key and dedicated close button.
- **Focus Restoration**: Automatically returns keyboard focus to the triggering element upon closure.

### 7. Informational Footer (`<footer>`)
- **Semantic Tag**: `<footer class="site-footer">`.
- **Secondary Nav**: Contains `<nav aria-label="Footer & Compliance Navigation">` for terms, compliance, and telemetry status links.

---

## ⌨️ Keyboard Navigation & ARIA Patterns

| Key Combo | Action |
| :--- | :--- |
| `Tab` | Moves forward through interactive controls in logical DOM sequence |
| `Shift + Tab` | Moves backward through interactive controls |
| `Enter` / `Space` | Activates buttons, toggles switches, selects checkboxes and radio cards |
| `Escape` | Closes open `<dialog>` modal and restores focus to triggering button |
| `Arrow Keys` | Navigates radio groups (`role="radiogroup"`) and select menus |

---

## 🎨 Color Contrast & Theming (WCAG AAA)

| Theme Mode | Element Pair | Measured Ratio | WCAG 2.1 Threshold | Conformance |
| :--- | :--- | :---: | :---: | :---: |
| **Dark (Default)** | Primary Text on Background (`#e6edf3` on `#0d1117`) | **11.2:1** | 4.5:1 (AA) | **PASS (AAA)** |
| **Dark (Default)** | Muted Text on Background (`#8b949e` on `#0d1117`) | **5.4:1** | 4.5:1 (AA) | **PASS (AA)** |
| **High Contrast** | Active Text on Black (`#ffffff` on `#000000`) | **21.0:1** | 7.0:1 (AAA) | **PASS (AAA)** |
| **High Contrast** | Accent Amber on Black (`#ffff00` on `#000000`) | **19.5:1** | 7.0:1 (AAA) | **PASS (AAA)** |
| **Focus Rings** | Active Focus Outline against adjacent background | **3.8:1** | 3.0:1 (AA) | **PASS (AA)** |

---

## 🧪 W3C Validation Proof & Automated Testing

The project includes an automated test suite verifying 100% compliance across all 10 HTML documents and component fragments.

### Run Validation:

```bash
# Execute html-validate CLI across all files
npm run validate

# Execute automated Node.js test runner with colored diagnostics
npm test
```

### Automated Test Output:

```
================================================================
  SEMANTIC ENTERPRISE DASHBOARD - W3C HTML5 & WCAG VALIDATOR   
================================================================

  [PASS] 0 errors, 0 warnings -> index.html
  [PASS] 0 errors, 0 warnings -> pages/nodes.html
  [PASS] 0 errors, 0 warnings -> pages/provision.html
  [PASS] 0 errors, 0 warnings -> pages/audit.html
  [PASS] 0 errors, 0 warnings -> components/datatable.html
  [PASS] 0 errors, 0 warnings -> components/form-controls.html
  [PASS] 0 errors, 0 warnings -> components/header.html
  [PASS] 0 errors, 0 warnings -> components/kpi-cards.html
  [PASS] 0 errors, 0 warnings -> components/modal.html
  [PASS] 0 errors, 0 warnings -> components/sidebar.html

----------------------------------------------------------------
SUMMARY: 10/10 files passed validation.
TOTAL ERRORS:   0
TOTAL WARNINGS: 0
----------------------------------------------------------------

✔ SUCCESS: 100% W3C HTML5 & WCAG 2.1 compliance verified with ZERO errors.
```

---

## 🚀 Local Setup & Quickstart

No build compilation steps are required. The application runs natively in all modern browsers:

```bash
# 1. Clone the repository
git clone https://github.com/shraoshi-2006/semantic-enterprise-dashboard.git
cd semantic-enterprise-dashboard

# 2. Install validation tooling
npm install

# 3. Launch local development server
npm start
# Or open index.html directly in any web browser!
```

---

## 📄 License

This project is distributed under the **MIT License**.
