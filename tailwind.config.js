/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HIMRASAD Himalayan Institutional Operations Palette (Exact Tokens)
        olive: "#4F5D2F",          // Primary: nav, primary buttons, table headers
        "olive-deep": "#2F3A1E",     // Sidebar, footer, heavy headings
        pine: "#141C10",           // Text on light, deepest dark
        saffron: "#E8861A",        // Accent / CTA / urgent actions
        gold: "#D9A441",           // Emblem line, highlights, badges, focus on dark
        glacier: "#4F86B0",        // Info, links, chart series
        "glacier-mist": "#BCD3E3", // Subtle fills, chart tints, "open" chips
        snow: "#F5F7F4",           // Page background
        sand: "#C8B88A",           // Dividers, secondary surfaces, borders
        night: "#1B2430",          // Hero, dark surfaces, login screen
        danger: "#B3261E",         // Errors, low stock, destructive
        success: "#2E7D4F",        // Healthy stock, confirmations

        // Backward-compatible semantic bridges
        yolk: "#E8861A",           // Mapped to Saffron
        tomato: "#B3261E",         // Mapped to Danger
        mint: "#2E7D4F",           // Mapped to Success
        canvas: "#F5F7F4",         // Mapped to Snow
        ink: "#141C10",            // Mapped to Pine
        crust: "#4F5D2F",          // Mapped to Olive

        // Surface tokens mapped to Himalayan Palette
        surface: "#FFFFFF",
        "surface-dim": "#F5F7F4",
        "surface-bright": "#FFFFFF",
        "surface-container-low": "#F5F7F4",
        "surface-container": "#FFFFFF",
        "surface-container-high": "#EAECE7",
        "surface-container-highest": "#C8B88A",
        "on-surface": "#141C10",
        "on-surface-variant": "#4F5D2F",
        outline: "#C8B88A",
        "outline-variant": "#E0DAC9",

        primary: "#4F5D2F",
        "on-primary": "#F5F7F4",
        secondary: "#2F3A1E",
        "on-secondary": "#F5F7F4",
        error: "#B3261E",
        "on-error": "#F5F7F4",
        background: "#F5F7F4",
        "on-background": "#141C10",
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "Montserrat", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Montserrat", "system-ui", "sans-serif"],
        headline: ['"Plus Jakarta Sans"', "Montserrat", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        epilogue: ['"Plus Jakarta Sans"', "Montserrat", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        control: "8px",
        card: "12px",
        badge: "999px",
        pill: "999px",
        full: "999px",
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '1.5': '1.5px',
        '2.5': '1.5px',
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(20, 28, 16, 0.05), 0 1px 2px rgba(20, 28, 16, 0.08)",
        elevation: "0 4px 14px rgba(20, 28, 16, 0.06), 0 1px 3px rgba(20, 28, 16, 0.04)",
        card: "0 1px 3px rgba(20, 28, 16, 0.06), 0 1px 2px rgba(20, 28, 16, 0.04)",
        modal: "0 12px 32px rgba(20, 28, 16, 0.16), 0 2px 6px rgba(20, 28, 16, 0.08)",
        command: "0 20px 48px -12px rgba(20, 28, 16, 0.25), 0 0 0 1px rgba(200, 184, 138, 0.3)",
        'chibi-sm': '0 1px 2px 0 rgba(20, 28, 16, 0.06)',
        'chibi': '0 1px 3px 0 rgba(20, 28, 16, 0.08)',
        'chibi-hover': '0 4px 12px rgba(20, 28, 16, 0.06)',
        'chibi-modal': '0 8px 24px rgba(20, 28, 16, 0.12)',
        'chibi-focus': '0 0 0 3px #D9A441',
      },
      animation: {
        'float-soft': 'floatSoft 4s ease-in-out infinite',
      },
      keyframes: {
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};

