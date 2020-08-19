// accordionOrg.tsx Copyright 2020 Paul Beaudet MIT License 
import React from "react"
import { Node } from "./graphQlTypes"

interface props {
  node: Node
  children?: any
}

const AccordionOrg: React.FC<props> = ({
  node,
  children,
}) => {
  const { organization } = node.frontmatter

  return (
    <article key={node.fields.slug}>
      <h5 className="section-header">{organization}</h5>
      {children}
    </article>
  )
}

export default AccordionOrg
