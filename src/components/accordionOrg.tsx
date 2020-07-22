import React from "react"
import { Link } from "gatsby"
import { Node } from "./graphQlTypes"

interface props {
  node: Node
  children?: any
}

const AccordionOrg: React.FC<props> = ({
  node,
  children,
}) => {
  const {
    enddate,
    organization,
  } = node.frontmatter
  const endTxt: string =
    enddate === "Invalid date" ? " to current " : " to " + enddate + " "

  return (
    <article key={node.fields.slug}>
      <h5 style={{ marginTop: "0.5rem", marginBottom: 0, display: "inline-block" }}>
        {/* <Link style={{ boxShadow: `none` }} to={slug}>
          {title}
        </Link> */}
        {organization}
      </h5>
      <span> </span>
      {children}
    </article>
  )
}

export default AccordionOrg
