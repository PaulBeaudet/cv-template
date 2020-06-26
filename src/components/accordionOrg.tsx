import React from "react"
import { Link } from "gatsby"
import Trifold from "./trifold"
import ListFold from "./listFold"

interface props {
  title: string
  slug: string
  frontmatter: {
    enddate: string
    roles: string
    startdate: string
    summary: string
    organization: string
    projects: string
    skillslearned: string
    skillsused: string
  }
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
    roles,
    startdate,
    summary,
    organization,
    projects,
    skillslearned,
    skillsused,
  } = frontmatter
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "

  return (
    <article key={slug}>
      <h5 style={{ marginTop: "0.5rem", marginBottom: 0 }}>
        <Link style={{ boxShadow: `none` }} to={slug}>
          {title}
        </Link>
      </h5>
      <small style={{ marginLeft: 0 }}>{startdate + endTxt} </small>
      <Trifold html={html} summary={summary} show={shown.info} />
      <ListFold
        list={roles}
        organization={organization}
        listType="Roles"
        show={shown.info}
        showObj={shown}
      />
      <ListFold
        list={projects}
        organization={organization}
        listType="Projects"
        show={shown.info}
        showObj={shown}
      />
      {skillsused && (
        <ListFold
          list={skillsused}
          organization={organization}
          listType="Skills Used"
          show={shown.info}
          showObj={shown}
        />
      )}
      {skillslearned && (
        <ListFold
          list={skillslearned}
          organization={organization}
          listType="Skills Learned"
          show={shown.info}
          showObj={shown}
        />
      )}
    </article>
  )
}

export default AccordionOrg
