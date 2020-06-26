import React, { useState } from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import AccordionOrg from "../components/accordionOrg"
import Dropdown from "../components/dropdown"

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

interface showObj {
  roles: boolean
  projects: boolean
  info: string
}

const BlogIndex = ({ data }: PageProps<Data>) => {
  const infoSel: string = "summary" // none, summary, details
  const infoOptions: Array<string> = ["summary", "details", "none"]
  const [shown, setShown] = useState<showObj>({
    roles: false,
    projects: false,
    info: infoSel,
  })

  const posts: Array<any> = data.allMarkdownRemark.edges // short cut edges
  console.log("render ", shown)
  const makeChangeShownFunc = (type: string) => {
    return (event: any): void => {
      const shownC = { ...shown }
      shownC[type] = event.target.value
      setShown(shownC)
    }
  }

  return (
    <Layout>
      <SEO title="All posts" />
      <span>Options |</span>
      <small>
        <label htmlFor="roles"> Roles</label>
        <input
          type="checkbox"
          id="roles"
          name="roles"
          onChange={() => {
            setShown({
              projects: shown.projects,
              roles: !shown.roles,
              info: shown.info,
            })
          }}
          value={1}
          checked={shown.roles}
        />
        <label htmlFor="projects"> Projects</label>
        <input
          type="checkbox"
          id="projects"
          name="projects"
          onChange={() => {
            setShown({
              projects: !shown.projects,
              roles: shown.roles,
              info: shown.info,
            })
          }}
          value={1}
          checked={shown.projects}
        />
        <Dropdown
          options={infoOptions}
          name="info"
          onChange={makeChangeShownFunc("info")}
        />
        <label htmlFor="descriptions"> Info</label>
      </small>
      {posts.map(({ node }) => {
        const org = node.frontmatter.organization
        const postType = node.frontmatter.type || "organization"
        if (postType === "organization") {
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
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "organization" } } }
      sort: { fields: [frontmatter___enddate], order: DESC }
    ) {
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
