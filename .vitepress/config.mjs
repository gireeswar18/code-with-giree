import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Code with Giree",
  description: "Software Engineer | Cloud Enthusiast | DevOps Learner",
    base: "/code-with-giree/",

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'SQL', link: '/sql/home' },
      { text: 'DSA', link: '/dsa/home' }
    ],

    sidebar: {

      '/sql/': [
        {
          text: 'SQL Quest',
          items: [
            { text: 'Introduction', link: '/sql/home' }
          ]
        }
      ],

      '/dsa/': [
        {
          text: 'DSA Journey',
          items: [
            { text: 'Introduction', link: '/dsa/home' }
          ]
        }
      ]

    }
  }
})
