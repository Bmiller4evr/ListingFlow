/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Access Realty brand colors from globals.css (using hex values)
        'primary': 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'primary-hover': 'var(--primary-hover)',
        'primary-active': 'var(--primary-active)',
        'secondary': 'var(--secondary)',  
        'secondary-foreground': 'var(--secondary-foreground)',
        'secondary-hover': 'var(--secondary-hover)',
        'secondary-active': 'var(--secondary-active)',
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'card': 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        'card-elevated': 'var(--card-elevated)',
        'popover': 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        'muted': 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        'border': 'var(--border)',
        'input': 'var(--input)',
        'input-background': 'var(--input-background)',
        'accent': 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        'destructive': 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        'success': 'var(--success)',
        'success-foreground': 'var(--success-foreground)',
        'success-hover': 'var(--success-hover)',
        'warning': 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',
        'warning-hover': 'var(--warning-hover)',
        'info': 'var(--info)',
        'info-foreground': 'var(--info-foreground)',
        'info-hover': 'var(--info-hover)',
        'ring': 'var(--ring)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}