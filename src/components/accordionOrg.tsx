import React from "react"
import { Link } from "gatsby"
import Trifold from "./trifold"
import ListFold from "./listFold"

const AccordionOrg = ({title, slug, frontmatter, html, shown}) => {
  const {enddate, roles, startdate, summary, organization, projects} = frontmatter;
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "

  return (
    <article key={slug}>
      <h5 style={{ marginTop: "0.5rem", marginBottom: 0,}} >
        <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link>
      </h5>
      <small style={{marginLeft: 0}}>{startdate + endTxt} </small>
      <Trifold html={html} summary={summary} />
      {/* <br/> */}
      <ListFold 
        list={roles}
        organization={organization}
        showAll={shown.roles}
        listType="roles"
      />
      {/* <br/> */}
      <ListFold 
        list={projects}
        organization={organization}
        showAll={shown.projects}
        listType="projects"
      />
    </article>
  )
}

export default AccordionOrg
