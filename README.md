# 🚀 Varabit SEO Audit

A comprehensive, client-side SEO audit tool built with React + Vite. Analyze any public website's SEO performance and generate detailed PDF reports.

![Varabit SEO Audit](https://varabit.com/images/logo/varabit_logo.svg)

## ✨ Features

### 🔍 **Six Core Audit Modules**

| Module | Description | Metrics |
|--------|-------------|---------|
| **⚡ Page Speed** | Google PageSpeed Insights integration | Performance, SEO, Accessibility scores |
| **📝 Meta Tags** | Title, description, Open Graph analysis | Length validation, completeness check |
| **📋 Headings** | H1-H6 structure and hierarchy | Proper nesting, content organization |
| **🖼️ Images** | Alt text coverage and optimization | Accessibility compliance |
| **📱 Mobile-Friendly** | Responsive design evaluation | Viewport, touch targets, usability |
| **🔍 Keyword Density** | Content analysis and optimization | Word frequency, readability |

### 🎯 **Key Capabilities**
- ✅ **No Backend Required** - Pure client-side processing
- ✅ **Instant Results** - Real-time audit execution
- ✅ **PDF Export** - Professional downloadable reports
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS
- ✅ **Open Source** - GPL v2 licensed

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **PDF Generation**: jsPDF
- **API Integration**: Axios + Google PageSpeed Insights
- **HTML Parsing**: DOMParser + Cheerio

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google PageSpeed Insights API Key ([Get yours here](https://developers.google.com/speed/docs/insights/v5/get-started))

### Installation

```bash
# Clone the repository
git clone https://github.com/varabit/varabit-seo-audit.git
cd varabit-seo-audit

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your PageSpeed API key
```

### Configuration

Create a `.env` file in the root directory:

```env
VITE_PAGESPEED_API_KEY=your_google_pagespeed_api_key_here
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. **Enter URL**: Input any public website URL
2. **Run Audit**: Click "Run Audit" to start analysis
3. **View Results**: See real-time results in responsive cards
4. **Download Report**: Generate and download PDF report

### Example URLs to Test
- `https://example.com`
- `varabit.com`
- `github.com`

## 🔧 Configuration

### API Keys
The tool requires a Google PageSpeed Insights API key for performance analysis:

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable PageSpeed Insights API
3. Create API key
4. Add to `.env` file

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PAGESPEED_API_KEY` | Google PageSpeed API key | `your_api_key_here` |

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── AuditForm.jsx
│   ├── ResultCard.jsx
│   └── ResultsSection.jsx
├── modules/             # Audit modules
│   ├── pageSpeedModule.js
│   ├── metaTagsModule.js
│   ├── headingsModule.js
│   ├── imagesModule.js
│   ├── mobileFriendlyModule.js
│   └── keywordDensityModule.js
├── store/               # State management
│   └── auditStore.js
├── utils/               # Utilities
│   ├── api.js
│   ├── htmlParser.js
│   └── pdfGenerator.js
└── App.jsx              # Main app component
```

### Data Flow
1. **User Input** → AuditForm component
2. **URL Validation** → Form validation
3. **Parallel Audits** → Six modules run simultaneously
4. **Results Display** → Real-time card updates
5. **PDF Generation** → Combined report export

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom Varabit branding:

```css
/* Custom color scheme */
colors: {
  varabit: '#09c',
}
```

### Adding New Audit Modules

1. Create module in `src/modules/`:
```javascript
export const runMyAudit = async (url) => {
  // Audit logic here
  return {
    score: 85,
    issues: [],
    suggestions: [],
    status: 'success'
  };
};
```

2. Add to audit store and form component
3. Create result card display logic

## 📊 Scoring System

Each audit module returns a score from 0-100:

- **90-100**: Excellent ✅
- **80-89**: Very Good 🟢  
- **70-79**: Good 🟡
- **60-69**: Fair 🟠
- **0-59**: Needs Improvement 🔴

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the **GPL v2 or later** - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🆘 Support

- **Email**: support@varabit.com
- **Website**: [varabit.com](https://varabit.com)
- **Issues**: [GitHub Issues](https://github.com/varabit/varabit-seo-audit/issues)

## 👨‍💻 Author

**Hridoy Varaby**  
*Founder & Systems Architect, Varabit*  
- Website: [varabit.com](https://varabit.com)
- Email: support@varabit.com

## 🙏 Acknowledgments

- Google PageSpeed Insights API
- React Team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this tool

## 📈 Roadmap

- [ ] **Enhanced Mobile Testing** - Real device simulation
- [ ] **Schema Markup Validation** - Structured data analysis  
- [ ] **Security Headers Check** - HTTPS and security analysis
- [ ] **Core Web Vitals** - Advanced performance metrics
- [ ] **Multi-language Support** - Internationalization
- [ ] **Batch Processing** - Multiple URL analysis
- [ ] **API Endpoints** - RESTful API for integrations

---

**Built with ❤️ by [Varabit](https://varabit.com)**
