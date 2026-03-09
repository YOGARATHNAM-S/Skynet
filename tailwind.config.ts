import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
        "fly-across": {
          "0%": { transform: "translateX(-120%) translateY(10px) rotate(-2deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "50%": { transform: "translateX(0%) translateY(-8px) rotate(0deg)", opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(120%) translateY(6px) rotate(2deg)", opacity: "0" },
        },
        "drift-cloud": {
          "0%": { transform: "translateX(-20px)", opacity: "0.4" },
          "50%": { opacity: "0.7" },
          "100%": { transform: "translateX(20px)", opacity: "0.4" },
        },
        "radar-ping": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "50%": { transform: "scale(1.2)", opacity: "0.15" },
          "100%": { transform: "scale(0.8)", opacity: "0.6" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.15", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.8)" },
        },
        "sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rise": {
          "0%": { transform: "translateY(100vh)", opacity: "0" },
          "10%": { opacity: "0.3" },
          "90%": { opacity: "0.3" },
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
        "fly-loop": {
          "0%": { transform: "translateX(-150%) translateY(0) rotate(-3deg) scale(0.8)", opacity: "0" },
          "15%": { opacity: "1", transform: "translateX(-50%) translateY(-20px) rotate(-1deg) scale(1)" },
          "50%": { transform: "translateX(30%) translateY(-40px) rotate(2deg) scale(1.05)" },
          "85%": { opacity: "1", transform: "translateX(100%) translateY(-15px) rotate(0deg) scale(0.95)" },
          "100%": { transform: "translateX(150%) translateY(0) rotate(3deg) scale(0.8)", opacity: "0" },
        },
        "fly-reverse": {
          "0%": { transform: "translateX(150%) scaleX(-1) translateY(0)", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { transform: "translateX(-150%) scaleX(-1) translateY(-30px)", opacity: "0" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        "contrail": {
          "0%": { width: "0%", opacity: "0" },
          "20%": { opacity: "0.3" },
          "80%": { opacity: "0.15" },
          "100%": { width: "100%", opacity: "0" },
        },
        "hud-pulse": {
          "0%, 100%": { opacity: "0.15", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.08)" },
        },
        "bank-left": {
          "0%": { transform: "translateX(-120%) rotate(-15deg)", opacity: "0" },
          "25%": { transform: "translateX(-30%) rotate(-5deg)", opacity: "1" },
          "50%": { transform: "translateX(20%) rotate(10deg)" },
          "75%": { transform: "translateX(70%) rotate(-8deg)", opacity: "1" },
          "100%": { transform: "translateX(120%) rotate(5deg)", opacity: "0" },
        },
        "heli-drift": {
          "0%": { transform: "translateX(-10%) translateY(0px)" },
          "25%": { transform: "translateX(5%) translateY(-8px)" },
          "50%": { transform: "translateX(15%) translateY(3px)" },
          "75%": { transform: "translateX(5%) translateY(-5px)" },
          "100%": { transform: "translateX(-10%) translateY(0px)" },
        },
        "rotor-spin": {
          "0%": { transform: "scaleX(1)" },
          "25%": { transform: "scaleX(0.05)" },
          "50%": { transform: "scaleX(-1)" },
          "75%": { transform: "scaleX(0.05)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fly-across": "fly-across 8s ease-in-out infinite",
        "drift-cloud": "drift-cloud 6s ease-in-out infinite alternate",
        "drift-cloud-slow": "drift-cloud 9s ease-in-out infinite alternate-reverse",
        "radar-ping": "radar-ping 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "sweep": "sweep 6s linear infinite",
        "rise": "rise 12s linear infinite",
        "fly-loop": "fly-loop 9s ease-in-out infinite",
        "fly-reverse": "fly-reverse 11s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "contrail": "contrail 6s ease-out infinite",
        "hud-pulse": "hud-pulse 3s ease-in-out infinite",
        "bank-left": "bank-left 10s ease-in-out infinite",
        "heli-drift": "heli-drift 8s ease-in-out infinite",
        "rotor-spin": "rotor-spin 0.15s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
