# AlchemyLogic Consulting Website

A modern, responsive website for AlchemyLogic, a strategic business consulting firm. This project showcases the company's services, about section, and contact information with a clean, professional design.

## 🚀 Features

- **Responsive Design**: Looks great on all devices
- **Modern UI**: Clean and professional interface
- **Performance Optimized**: Fast loading times
- **Accessible**: Built with web accessibility in mind
- **Interactive Elements**: Smooth animations and transitions

## 🛠️ Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (Vanilla JS)
- [Font Awesome](https://fontawesome.com/) for icons
- Google Fonts (Manrope and Inter)

## 📁 Project Structure

```
alchemylogic/
├── css/site.css        # All styles (dark theme, blue + green accents)
├── js/main.js          # Nav, mobile menu, scroll reveal, services page nav
├── images/             # Favicon
├── vercel.json         # Security headers for the Vercel deployment
├── pages/              # services.html, about.html, contact.html
└── index.html          # Homepage
```

## 🚀 Running locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Pushing to `main` deploys to Vercel (alchemy-logic.com).

CSS and JS are cached by browsers for a year (see `vercel.json`), so **bump the `?v=` number on `site.css` and `main.js` in every page** whenever you change either file.

## 🎨 Design System

- Background: `#05080F` · Blue: `#3B82F6` · Green: `#10B981`
- Headings: Manrope · Body: Inter

## 🙏 Acknowledgments

- Modern CSS techniques for layout and animations
- Google Fonts for typography
- Font Awesome for icons
