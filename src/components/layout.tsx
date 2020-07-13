import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image, { FixedObject } from "gatsby-image"

type Data = {
  avatar: {
    childImageSharp: {
      fixed: {
        height: number
        src: string
        originalName: string
        srcSet: string
        srcSetWebp: string
        srcWebp: string
        tracedSVG: string
        width: number
        base64: string
        aspectRatio: string
      }
    }
  }
  site: {
    siteMetadata: {
      title: string
      author: {
        name: string
        repo: string
        contactLink: string
      }
    }
  }
}

// ...GatsbyImageSharpFixed
const Layout = ({ children }) => {
  const data: Data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          title
          author {
            name
            repo
            contactLink
          }
        }
      }
    }
  `)
  const { author, title } = data.site.siteMetadata
  const header: React.DetailedHTMLProps<any, any> = (
    <>
      <div style={{ borderBottom: `2px solid black` }}>
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author.name}
          style={{
            marginRight: 5,
            marginBottom: 0,
            minWidth: 50,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
        <h1
          style={{
            fontFamily: `Montserrat, sans-serif`,
            display: `inline`,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
        <h3 style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: `2rem`,
          display: `inline`,
          float: `right`,
        }}>
          <a href={author.contactLink}>Contact</a>
        </h3>
      </div>
    </>
  )

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: 800,
        padding: `0`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <hr style={{ marginTop: 40, }}></hr>
      <footer>
        © {new Date().getFullYear()} {author.name} | <a href={author.repo}>Site</a><span> built with Gatsby</span>
      </footer>
    </div>
  )
}

export default Layout
