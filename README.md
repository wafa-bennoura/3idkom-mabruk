# 3idkomMabruk - عيدكم مبروك

A beautiful, interactive Eid Mubarak greeting card with animated envelope and lanterns.

## Features

- Interactive envelope animation with pull-down thread
- Animated lanterns with hanging threads
- Confetti and balloon animations
- Arabic and English greetings
- Responsive design for all screen sizes
- Eid Mubarak greeting card with interactive elements

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   │   └── GreetingCard.tsx  # Main greeting card component
│   ├── assets/         # Images and assets
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── index.html          # Main HTML file
└── package.json        # Dependencies and scripts
```

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically deploy on push

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Deploy to GitHub Pages
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
# (Configure GitHub Actions or use gh-pages)
```

## Customization

- Edit `src/components/GreetingCard.tsx` to modify the greeting card
- Update colors in the component styles
- Modify animations in the CSS animations

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for routing
- **React Query** for state management

## License

MIT License - feel free to use and modify for your Eid greetings!

---

**Eid Mubarak!** - عيد مبارك