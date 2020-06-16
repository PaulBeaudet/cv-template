import React from "react"
import { Link } from "gatsby"

const Layout = ({ metadata, children }) => {
  const {author, title} = metadata
  const header = (
    <>
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 10,
          marginBottom: 10,
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
      </h3>
      <hr></hr>
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
