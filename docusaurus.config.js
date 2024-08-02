import { config as dotenvConfig } from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';

const env = dotenvConfig({ path: '.env.local' });
dotenvExpand(env);

if (!process.env.URL_PARAM_NAME) {
  throw new Error('URL_PARAM_NAME environment variable is not set. Please set it in your .env.local file or environment.');
}

const config = {
  title: 'Secure Docus Gate',
  tagline: 'A secure Docusaurus site with URL parameter control',
  url: 'https://asakaguchi.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'asakaguchi',
  projectName: 'secure-docus-gate',
  trailingSlash: false,
  
  themeConfig: {
    navbar: {
      title: 'Secure Docus Gate',
      logo: {
        alt: 'Secure Docus Gate Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: 'docs/intro', activeBasePath: 'docs', label: 'Docs', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/asakaguchi/secure-docus-gate',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/asakaguchi/secure-docus-gate',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Akiyoshi Sakaguchi. Built with Docusaurus.`,
    },
  },
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/asakaguchi/secure-docus-gate/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/asakaguchi/secure-docus-gate/edit/main/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  plugins: [
    [
      './src/plugins/url-param-control',
      {
        validParam: process.env.URL_PARAM_NAME,
      },
    ],
  ],
};

export default config;