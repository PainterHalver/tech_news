import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "bg-primary": "var(--bg-primary)",
      "bg-secondary": "var(--bg-secondary)",
      border: "var(--border)",
      "border-hover": "var(--border-hover)",
      "text-primary": "var(--text-primary)",
      "text-secondary": "var(--text-secondary)",
      backdrop: "var(--backdrop)",
      upvoted: "var(--upvoted)",
    },
  },
  plugins: [require("daisyui")],
};
export default config;
