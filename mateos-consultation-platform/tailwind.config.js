/* eslint-disable no-mixed-spaces-and-tabs */
import tailwindcssAnimate from "tailwindcss-animate"
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
    	extend: {
    		colors: {
    			primary: {
    				'50': '#f0fdfa',
    				'100': '#ccfbf1',
    				'200': '#99f6e4',
    				'300': '#5eead4',
    				'400': '#2dd4bf',
    				'500': '#038794',
    				'600': '#0d9488',
    				'700': '#0f766e',
    				'800': '#115e59',
    				'900': '#134e4a',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			gray: {
    				'50': '#f8fafc',
    				'100': '#f1f5f9',
    				'200': '#e2e8f0',
    				'300': '#cbd5e1',
    				'400': '#94a3b8',
    				'500': '#64748b',
    				'600': '#475569',
    				'700': '#334155',
    				'800': '#1e293b',
    				'900': '#0f172a'
    			},
    			success: {
    				'50': '#f0fdf4',
    				'500': '#22c55e',
    				'600': '#16a34a'
    			},
    			warning: {
    				'50': '#fffbeb',
    				'500': '#f59e0b',
    				'600': '#d97706'
    			},
    			error: {
    				'50': '#fef2f2',
    				'500': '#ef4444',
    				'600': '#dc2626'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'Geist',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'Segoe UI',
    				'Roboto',
    				'Oxygen',
    				'Ubuntu',
    				'Cantarell',
    				'Fira Sans',
    				'Droid Sans',
    				'Helvetica Neue',
    				'system-ui',
    				'sans-serif'
    			],
    			display: [
    				'Raleway',
    				'Geist',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'system-ui',
    				'sans-serif'
    			]
    		},
    		boxShadow: {
    			soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    			card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    		},
    		borderRadius: {
    			xl: '1rem',
    			'2xl': '1.5rem',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'pulse-slow': {
    				'0%, 100%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0.8'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
    		}
    	}
    },
	plugins: [tailwindcssAnimate],
}
