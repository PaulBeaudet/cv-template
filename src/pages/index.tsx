import React, {useState} from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import AccordionOrg from "../components/accordionOrg"

type Data = {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          projects: string
          organization: string
          startdate: string
          enddate: string
          summary: string
          roles: string
          type: string
          skillsused: string
          skillslearned: string
        }
        fields: {
          slug: string
        }
        html: string
      }
    }[]
  }
}

const BlogIndex = ({ data }: PageProps<Data>) => {
  const infoSel = "summary" // none, summary, details
  const [shown, setShown] = useState({roles: false, projects: false, info: infoSel})
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="All posts" />
      <span>Options |</span>
      <small>
        <label htmlFor="roles"> Roles</label>
        <input type="checkbox" id="roles" name="roles" 
          onChange={()=>{setShown({projects: shown.projects, roles: !shown.roles, info: shown.info})}}
          value={1} checked={shown.roles}
        />
        <label htmlFor="projects"> Projects</label>
        <input type="checkbox" id="projects" name="projects" 
          onChange={()=>{setShown({projects: !shown.projects, roles: shown.roles, info: shown.info})}}
          value={1} checked={shown.projects}
        />
        <label htmlFor="descriptions"> Info</label>
        <select id="descriptions" name="descriptions" defaultValue={infoSel} onChange={(event) => {
          setShown({projects: shown.projects, roles: shown.roles, info: event.target.value})
        }}>
          <option value="summary">summary</option>
          <option value="details">details</option>
          <option value="none">none</option>
        </select>
      </small>
      {posts.map(({ node }) => {    
        const org = node.frontmatter.organization
        const postType = node.frontmatter.type || "organization"
        if(postType === "organization"){
          return (
            <AccordionOrg
              key={node.fields.slug}
              title={node.frontmatter.organization}
              slug={node.fields.slug} 
              frontmatter={node.frontmatter}
              html={node.html}
              shown={shown}
            />
          )
        }
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: {frontmatter: {type: {eq: "organization"}}} , sort: { fields: [frontmatter___enddate], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          html
          frontmatter {
            projects
            type
            organization
            roles
            startdate(formatString: "MMMM DD, YYYY")
            enddate(formatString: "MMMM DD, YYYY")
            summary
            skillsused
            skillslearned
          }
        }
      }
    }
  }
`
