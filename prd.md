# 📘 Product Requirements Document (PRD)

**Project Name**: Varabit SEO Audit  
**Type**: Standalone React + Vite Web Application  
**Owner**: Hridoy Varaby (Founder & Systems Architect, Varabit : https://varabit.com)  
**Goal**: Build a fast, modular SEO audit tool that analyzes public URLs and generates downloadable reports. No backend, no CMS—just pure React + Vite.

---

## 🎯 Objective

Create a professional, minimalistic web app that performs SEO audits on any public URL. The app should analyze key SEO metrics, display results in responsive cards, and allow users to download a full PDF report. All logic runs client-side or via public APIs.

---

## 🧩 Core Features

### 1. **URL Audit Form**

- Input field for a public URL
- Submit button to trigger audit
- Optional: loading spinner or progress indicator

### 2. **Audit Modules**

Each module runs independently and returns structured results:

|Module|Description|
|---|---|
|Page Speed Analysis|Uses Google PageSpeed Insights API to fetch mobile and desktop performance|
|Meta Tags Analysis|Parses `<title>`, `<meta name="description">`, and other meta tags|
|Headings Structure|Extracts and validates H1–H6 hierarchy|
|Image Alt Text Check|Lists images missing `alt` attributes|
|Mobile-Friendliness|Checks viewport tag + PageSpeed mobile usability|
|Keyword Density|Extracts body text and calculates keyword frequency|

### 3. **Audit Results Display**

- Each module renders its own result card
- Cards include summary, issues, and suggestions
- Responsive layout (mobile and desktop)

### 4. **PDF Report Generator**

- Button to download full audit as a PDF
- Includes timestamp, branding, and all module results

---

## ⚙️ Technical Requirements

### Frontend

- **Framework**: React + Vite
- **Routing**: React Router (single page)
- **Styling**: Tailwind CSS or Material UI
- **State Management**: Zustand or React Context
- **PDF Library**: jsPDF or react-pdf

### API Integration

- **Google PageSpeed Insights**
    - Requires API key stored in `.env`
    - Endpoint: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    - Parameters: `url`, `strategy` (mobile/desktop)

### DOM Parsing

- Use `DOMParser` or `cheerio` to extract HTML elements from fetched page content

### PDF Export

- Include:
    - Audit summary
    - Module results
    - Timestamp
    - Branding - Varabit - logo url https://varabit.com/images/logo/varabit_logo.svg ; 
    - Brand color: #09c

---

## 🧪 Dev & Deployment

- **Local Dev**: `npm run dev`
- **Build**: `npm run build`
- **Offline Support**: Optional PWA plugin for Vite

---

## 🧠 UX Notes

- Minimalistic, professional design
- Responsive layout
- Clear error handling (invalid URL, API failure)
- Fast feedback loop for audits
- PDF download should be one-click and styled

---

## 🔐 Environment Variables

```env
VITE_PAGESPEED_API_KEY=your_api_key_here
```

---

## 📞 Support & Attribution

- Include footer with:
    - License (GPL v2 or later)
    - Contact: support@varabit.com
    - Version: 1.0.0

---

## 📜 License

GPL v2 or later. Include full license text in `/LICENSE.txt`.

---

## ✅ Acceptance Criteria

- [ ] User can input a URL and trigger audit
- [ ] All modules return results within 5 seconds
- [ ] Results are displayed in responsive cards
- [ ] PDF report includes all audit data
- [ ] App works without login or backend
- [ ] API key is configurable via `.env`