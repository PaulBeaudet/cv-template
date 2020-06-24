import React from "react"
import { Link } from "gatsby"
import Trifold from "./trifold"
import ListFold from "./listFold"

const AccordionOrg = ({title, slug, frontmatter, html, shown}) => {
  const {enddate, roles, startdate, summary, organization, projects, skillslearned, skillsused} = frontmatter;
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "

  return (
    <article key={slug}>
      <h5 style={{ marginTop: "0.5rem", marginBottom: 0,}} >
        <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link>
      </h5>
      <small style={{marginLeft: 0}}>{startdate + endTxt} </small>
      <Trifold html={html} summary={summary} show={shown.info}/>
      <ListFold 
        list={roles}
        organization={organization}
        showAll={shown.roles}
        listType="Roles"
        show={shown.info}
      />
      <ListFold 
        list={projects}
        organization={organization}
        showAll={shown.projects}
        listType="Projects"
        show={shown.info}
      />
      {skillsused && <ListFold
        list={skillsused}
        organization={organization}
        listType="Skills Used"
        showAll={false}
        show={shown.info}
      />}
      {skillslearned && <ListFold
        list={skillslearned}
        organization={organization}
        listType="Skills Learned"
        showAll={false}
        show={shown.info}
      />}
    </article>
  )
}

export default AccordionOrg
