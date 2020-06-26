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
  roles: string
  projects: string
  info: string
  skillslearned: string
}

const BlogIndex = ({ data }: PageProps<Data>) => {
  const infoOptions: Array<string> = ["summary", "details", "hide"]
  const listFoldOptions: Array<string> = ["summary", "show all", "hide"]
  const skillsOptions: Array<string> = ["hide", "summary", "show all"]
  const [shown, setShown] = useState<showObj>({
    roles: listFoldOptions[0],
    projects: listFoldOptions[0],
    info: infoOptions[0],
    skillslearned: skillsOptions[0],
  })

  const posts: Array<any> = data.allMarkdownRemark.edges // short cut edges
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
        <Dropdown
          options={infoOptions}
          name="Info"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={listFoldOptions}
          name="Roles"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={listFoldOptions}
          name="Projects"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={skillsOptions}
          name="Skills Learned"
          onChange={makeChangeShownFunc}
        />
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
