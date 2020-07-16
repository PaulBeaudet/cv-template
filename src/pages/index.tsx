import React, { useState, useEffect } from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import AccordionOrg from "../components/accordionOrg"
import { showObj } from "../components/dropdown"
import { Data, Node } from "../components/markdownTypes"
import { addToFilter, inChildOrOrg } from "../components/skillFilter"
import FoldHold from "../components/foldHold"
import FilterBar from "../components/filterBar"

const BlogIndex = ({ data }: PageProps<Data>) => {
  const infoOptions: Array<string> = ["summary", "details", "hide"]
  const listFoldOptions: Array<string> = ["summary", "show all", "hide"]
  const skillsOptions: Array<string> = ["hide", "summary", "show all"]
  const [shown, setShown] = useState<showObj>({
    roles: listFoldOptions[0],
    projects: listFoldOptions[0],
    info: infoOptions[0],
    skillslearned: skillsOptions[0],
    dates: true
  })
  // Items th are being filtered
  const [skillFilter, setSkillFilter] = useState<Array<string>>([])
  // Reference of items that can be filtered
  const [skillReference, setSkillReference] = useState<Array<string>>([])

  const makeChangeShownFunc = (type: string) => {
    return (event: any): void => {
      const shownC = { ...shown }
      shownC[type] = event.target.value
      setShown(shownC)
    }
  }

  const toggleShowAll = (show: boolean): void => {
    const indexToSelect = show ? 1 : 0
    const shownC = { ...shown }
    shownC.roles = listFoldOptions[indexToSelect]
    shownC.projects = listFoldOptions[indexToSelect]
    setShown(shownC)
  }

  const posts = data.allMarkdownRemark.edges // short cut edges
  const filterBuilder = (sections: { node: Node }[]): void => {
    const filterBuild: Array<string> = addToFilter(sections, skillReference)
    setSkillReference(filterBuild)
    setSkillFilter(filterBuild)
  }
  useEffect(() => {
    filterBuilder(posts)
  }, [])

  return (
    <Layout>
      <SEO title="All posts" />
      <FilterBar
        shown={shown}
        setShown={makeChangeShownFunc}
        infoOptions={infoOptions}
        listFoldOptions={listFoldOptions}
        skillsOptions={skillsOptions}
        skillFilter={skillFilter}
        skillReference={skillReference}
        setSkillFilter={setSkillFilter}
        toggleShowAll={toggleShowAll}
      />
      {posts.map(({ node }) => {
        const { organization, type } = node.frontmatter
        if (type === "organization" && inChildOrOrg(skillFilter, node.frontmatter, posts)) {
          return (
            <div key={node.fields.slug}>
              <AccordionOrg
                title={organization}
                slug={node.fields.slug}
                frontmatter={node.frontmatter}
                html={node.html}
                shown={shown}
              />
              <FoldHold
                orgFrontmatter={node.frontmatter}
                allSections={posts}
                showObj={shown}
                skillsFilter={skillFilter}
              />
            </div>
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
      sort: { fields: [frontmatter___startdate], order: DESC }
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
            softskills
            link
          }
        }
      }
    }
  }
`
