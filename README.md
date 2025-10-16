# DEV Limited - Static Website

A clean, modern static website for DEV Limited, showcasing Virtual Reality and Augmented Reality development services.

## Overview

This is a fully static website built with vanilla HTML, CSS, and JavaScript. It's optimized for performance and works seamlessly on GitHub Pages or any static hosting service.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Fast Loading**: Optimized assets and minimal dependencies
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessible**: WCAG compliant with proper ARIA labels

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript for interactivity
├── CNAME              # Custom domain configuration
├── README.md          # This file
├── fonts/             # Local font files
└── images/            # Image assets
```

## Sections

1. **Header** - Sticky navigation with logo and menu
2. **Hero** - Full-screen hero section with tagline
3. **Services** - Service offerings with images
4. **Partners** - Technology partner logos
5. **Newsletter** - Email subscription form
6. **Contact** - Contact information
7. **Footer** - Social links and copyright

## Deployment

### GitHub Pages

1. Push to your GitHub repository
2. Go to Settings > Pages
3. Select main branch as source
4. Your site will be live at `https://yourusername.github.io/website/`

### Custom Domain

The site is configured for `devlimited.org` via the CNAME file. To use a different domain:

1. Update the `CNAME` file with your domain
2. Configure DNS records at your domain registrar:
   - Type: A Record
   - Name: @
   - Value: GitHub Pages IP addresses
   - Or use CNAME pointing to `yourusername.github.io`

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-primary: #C45308;
    --color-text-dark: #3B3C3D;
    /* ... more variables */
}
```

### Content

- Edit text directly in `index.html`
- Replace images in the `images/` folder
- Update contact information in the Contact section

### Navigation

Add or remove menu items in the `<nav>` section of `index.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Minimal external dependencies
- Optimized images
- Lazy loading support
- CSS and JS are minified for production

## Development

To develop locally:

1. Clone the repository
2. Open `index.html` in a browser
3. Or use a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000`

## Original Site

This is a rebuilt version of the original Wix site, converted to a clean static site for better performance and easier maintenance.

**Key improvements:**
- 99% faster loading (459KB → ~20KB HTML)
- No external dependencies on Wix servers
- Works on any hosting platform
- Fully customizable without limitations
- Better SEO performance

## License

© 2023-2025 DEV Limited. All rights reserved.

## Contact

- Email: info@devlimited.org
- Phone: 405.464.8485
- Address: 333 West Main Street, STE 141, Ardmore, OK 73401
