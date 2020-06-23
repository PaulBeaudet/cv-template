import React from "react"
import { Link, useStaticQuery, graphql} from "gatsby"
import Image from "gatsby-image"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
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
  const {author, title} = data.site.siteMetadata
  const header = (
    <>
    <div style={{borderBottom: `2px solid black`}}>
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
      <hr style={{marginTop:40,}}></hr>
      <footer>
        © {new Date().getFullYear()} {author.name} | <a href={author.repo}>Site </a>built with Gatsby
      </footer>
    </div>
  )
}

export default Layout
