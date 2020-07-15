import React from "react"
import { Link } from "gatsby"
import Trifold from "./trifold"
import { frontmatter, Node } from "./markdownTypes"

interface props {
  title: string
  slug: string
  frontmatter: frontmatter
  html: string
  shown: {
    roles: string
    projects: string
    info: string
  }
}

const AccordionOrg: React.FC<props> = ({
  title,
  slug,
  frontmatter,
  html,
  shown,
}) => {
  const {
    enddate,
    startdate,
    summary,
  } = frontmatter
  const endTxt: string =
    enddate === "Invalid date" ? " " : " to " + enddate + " "

  return (
    <article key={slug}>
      <h5 style={{ marginTop: "0.5rem", marginBottom: 0, display: "inline-block" }}>
        {/* <Link style={{ boxShadow: `none` }} to={slug}>
          {title}
        </Link> */}
        {title}
      </h5>
      <span> </span>
      <Trifold html={html} summary={summary} show={shown.info}>
        <small style={{ marginLeft: 0 }}>{startdate + endTxt} </small>
      </Trifold>
    </article>
  )
}

export default AccordionOrg
