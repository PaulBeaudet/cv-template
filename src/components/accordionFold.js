import React from "react"
import { Link } from "gatsby"

import Trifold from "./trifold"

const AccordionFold = ({title, slug, frontmatter, html}) => {
  const {enddate, startdate, summary} = frontmatter;
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "

  return (
    <article style={{marginLeft: "1rem",}} key={slug}>
      <header>
        <h5
          style={{
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link>
        </h5>  
      </header>
      <small>{startdate + endTxt}</small>
      <Trifold html={html} summary={summary}/>
    </article>
  )
}

export default AccordionFold