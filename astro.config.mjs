// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://janrummel.github.io',
	base: '/ai-product-thinking',
	redirects: {
		'/': '/de/start/',
		'/de/': '/de/start/',
		'/en/': '/en/start/',
	},
	integrations: [
		starlight({
			title: 'AI Product Thinking',
			defaultLocale: 'de',
			locales: {
				de: { label: 'Deutsch', lang: 'de' },
				en: { label: 'English', lang: 'en' },
			},
			customCss: ['./src/styles/custom.css'],
			social: [],
			sidebar: [
				{
					label: 'Start',
					translations: { en: 'Start' },
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
			],
		}),
	],
});
