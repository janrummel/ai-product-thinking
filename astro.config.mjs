// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.GITHUB_ACTIONS ? '/ai-product-thinking' : '';

export default defineConfig({
	site: process.env.GITHUB_ACTIONS
		? 'https://janrummel.github.io'
		: 'http://localhost:4321',
	base: base || undefined,
	redirects: {
		'/': `${base}/en/start/`,
		'/de/': `${base}/de/start/`,
		'/en/': `${base}/en/start/`,
	},
	integrations: [
		starlight({
			title: 'AI Product Thinking',
			defaultLocale: 'en',
			locales: {
				en: { label: 'English', lang: 'en' },
				de: { label: 'Deutsch', lang: 'de' },
			},
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/janrummel/ai-product-thinking' }],
			head: [
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'AI Product Thinking' } },
				{ tag: 'meta', attrs: { property: 'og:title', content: 'AI Product Thinking — Free AI Product Management Curriculum' } },
				{ tag: 'meta', attrs: { property: 'og:description', content: '9 chapters, 46 lessons, real-world case studies. Learn to make better decisions about AI products. Free, bilingual (EN/DE).' } },
				{ tag: 'meta', attrs: { property: 'og:url', content: 'https://janrummel.github.io/ai-product-thinking/' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://janrummel.github.io/ai-product-thinking/og-image.png' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
				{ tag: 'meta', attrs: { name: 'twitter:title', content: 'AI Product Thinking — AI PM Curriculum' } },
				{ tag: 'meta', attrs: { name: 'twitter:description', content: '9 chapters, 46 lessons, case studies. Free AI Product Management learning path.' } },
			],
			sidebar: [
				{
					label: 'Start',
					items: [
						{ slug: 'start' },
					],
				},
				{
					label: '01 — Foundations',
					translations: { de: '01 — Grundlagen' },
					autogenerate: { directory: '01-foundations' },
				},
				{
					label: '02 — Strategy',
					translations: { de: '02 — Strategie' },
					autogenerate: { directory: '02-strategy' },
				},
				{
					label: '03 — Product Design',
					translations: { de: '03 — Produktdesign' },
					autogenerate: { directory: '03-product-design' },
				},
				{
					label: '04 — Technical Literacy',
					translations: { de: '04 — Technisches Wissen' },
					autogenerate: { directory: '04-technical-literacy' },
				},
				{
					label: '05 — Evaluation',
					translations: { de: '05 — Evaluation' },
					autogenerate: { directory: '05-evaluation' },
				},
				{
					label: '06 — Agentic AI',
					translations: { de: '06 — Agentic AI' },
					autogenerate: { directory: '06-agentic-ai' },
				},
				{
					label: '07 — Ethics & Governance',
					translations: { de: '07 — Ethik & Governance' },
					autogenerate: { directory: '07-ethics-governance' },
				},
				{
					label: '08 — Execution',
					translations: { de: '08 — Umsetzung' },
					autogenerate: { directory: '08-execution' },
				},
				{
					label: '09 — Leadership',
					translations: { de: '09 — Leadership' },
					autogenerate: { directory: '09-leadership' },
				},
				{
					label: '10 — Capstone',
					translations: { de: '10 — Capstone' },
					autogenerate: { directory: '10-capstone' },
				},
				{
					label: 'Templates',
					translations: { de: 'Templates' },
					autogenerate: { directory: 'templates' },
				},
			],
		}),
	],
});
