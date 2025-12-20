# SaveTax.my - Malaysian Tax Relief Calculator

A lightweight, mobile-optimized web app that helps Malaysian taxpayers discover tax reliefs through a fun, Tinder-like swipe interface.

## Features

- 🎯 **Swipe Interface**: Tinder-like swipe cards for tax relief discovery
- 💰 **Tax Calculator**: Calculate tax based on 2025 Malaysian tax brackets
- 📱 **Mobile-First**: Optimized for mobile devices with touch gestures
- 💾 **Auto-Save**: Progress automatically saved to browser localStorage
- 📊 **Detailed Results**: Full breakdown of tax calculations and savings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React useState + localStorage

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tax Relief Cards

The app includes 19 tax relief categories for Year of Assessment 2025:

- Individual reliefs (self, spouse, disabled)
- Medical expenses (serious illness, fertility, parents)
- Lifestyle (books, smartphones, sports, EV)
- Education (self education, children)
- Children (under 18, disabled, higher education)
- Insurance (medical, life, EPF)
- Housing (home loan interest)

## How It Works

1. **Welcome Screen**: Introduction to the app
2. **Income Input**: Enter your annual income
3. **Swipe Cards**: Swipe right on applicable reliefs, left to skip
4. **Amount Collection**: Use sliders to set relief amounts
5. **Results**: View tax calculation and estimated savings

## Build for Production

```bash
npm run build
npm start
```

## Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT

## Disclaimer

This is an estimation tool for educational purposes only. Tax calculations are based on publicly available LHDN information and may not reflect your exact tax liability. Always verify with official LHDN sources or consult a licensed tax professional.
