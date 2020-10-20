import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { layoutData } from "./graphQlTypes"

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
    }
  `)
  const header: React.DetailedHTMLProps<any, any> = (
    <nav className="page-nav">
      <div className="logo">
        <Link className="nav-link" to={`/`}>
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            alt={process.env.GATSBY_AUTHOR}
            imgStyle={{
              borderRadius: `50%`,
            }}
          />
        </Link>
      </div>
      <h1 className="site-title">
        <Link className="nav-link" to={`/`}>
          {process.env.GATSBY_AUTHOR}
        </Link>
      </h1>
      <h1 className="contact-link">
        <a className="nav-link" href={process.env.GATSBY_CONTACT_LINK}>Contact</a>
      </h1>
    </nav>
  )

  return (
    <div className="page">
      <header>{header}</header>
      <main>{children}</main>
      <footer className="page-footer">
        © {new Date().getFullYear()} {process.env.GATSBY_AUTHOR} | See <a href={process.env.GATSBY_SITE_REPO}>Site</a><span> for site source</span>
      </footer>
    </div>
  )
}

export default Layout
