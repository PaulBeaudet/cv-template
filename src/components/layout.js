import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
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
        © {new Date().getFullYear()} Paul Beaudet | Site built with Gatsby
      </footer>
    </div>
  )
}

export default Layout
