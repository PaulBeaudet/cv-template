module.exports = {
  siteMetadata: {
    title: `${process.env.AUTHOR}`,
    author: {
      name: `${process.env.AUTHOR}`,
      summary: `${process.env.SUMMARY_AUTHOR}`,
      repo: `https://github.com/PaulBeaudet/cv-template`,
      contactLink: `https://contactpaul.deabute.com`,
    },
    description: `${process.env.DESCRIPTION_AUTHOR}`,
    social: {
      contact: ``
    }
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
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `${process.env.AUTHOR}`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `${process.env.PROFILE_PIC_LOCATION}`
      }
    },
    `gatsby-plugin-react-helmet`,
  ]
}
