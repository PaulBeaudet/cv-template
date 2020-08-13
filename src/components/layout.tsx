import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image, { FixedObject } from "gatsby-image"
import { layoutData } from "./graphQlTypes"

// ...GatsbyImageSharpFixed
const Layout = ({ children }) => {
  const data: layoutData = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 35, height: 35) {
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
    <nav className="page-nav">
      <div className="logo">
        <Link className="nav-link" to={`/`}>
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            alt={author.name}
            imgStyle={{
              borderRadius: `50%`,
            }}
          />
        </Link>
      </div>
      <h1 className="site-title">
        <Link className="nav-link" to={`/`}>
          {title}
        </Link>
      </h1>
      <h1 className="contact-link">
        <a className="nav-link" href={author.contactLink}>Contact</a>
      </h1>
    </nav>
  )

  return (
    <div className="page">
      <header>{header}</header>
      <main>{children}</main>
      <footer className="page-footer">
        © {new Date().getFullYear()} {author.name} | <a href={author.repo}>Site</a><span> built with Gatsby</span>
      </footer>
    </div>
  )
}

export default Layout
