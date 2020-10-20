const visKey = {
  summary: 0,
  showAll: 1,
  hide: 2,
}

module.exports = {
  siteMetadata: {
    title: process.env.GATSBY_AUTHOR,
    description: process.env.GATSBY_SITE_DESCRIPTION, 
    siteUrl: process.env.GATSBY_SITE_URL,
    foldOptions: process.env.FOLD_OPTIONS || ["summary", "show all", "hide"],
    foldDropdowns: process.env.FOLD_DROPDOWNS || [
      // note that this first item is not frontmatter, the rest are assumed to be
      { name: "info", state: visKey.hide, sticky: true, label: "Text" },
      // name needs to me exactly the same a frontmatter it refers to
      { name: "roles", state: visKey.summary, sticky: false, label: "Roles" },
      // label should be how you want it to be titled visually
      { name: "projects", state: visKey.summary, sticky: false, label: "Projects" },
      // Stick defines if something will change while filtering
      { name: "skillsused", state: visKey.summary, sticky: true, label: "Technology" },
      { name: "skillslearned", state: visKey.hide, sticky: true, label: "Learned" },
      { name: "softskills", state: visKey.summary, sticky: true, label: "Skills" },
    ],
    foldDefaults: process.env.FOLD_DEFAULTS || [0, 0, 0, 2],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `cv`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${process.env.CV_MD_SOURCE}`,
        name: `cv`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-reading-time`
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `${process.env.GATSBY_AUTHOR}`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `${process.env.PROFILE_PIC_LOCATION}`
      }
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "GitHub",
        fieldName: "github",
        url: "https://api.github.com/graphql",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }
      }
    }
  ]
}
