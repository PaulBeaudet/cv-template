import React, { useState, useEffect } from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import AccordionOrg from "../components/accordionOrg"
import { showObj } from "../components/dropdown"
import { IndexData, Node, convertEndDate } from "../components/graphQlTypes"
import { addToFilter, inChildOrOrg } from "../components/skillFilter"
import FoldHold from "../components/foldHold"
import FilterBar from "../components/filterBar"
import Trifold from "../components/trifold"

const BlogIndex = ({ data }: PageProps<IndexData>) => {
  const { foldOptions, foldDefaults, foldDropdowns } = data.site.siteMetadata
  const [shown, setShown] = useState<showObj>({
    info: foldOptions[foldDefaults[0]],
    roles: foldOptions[foldDefaults[1]],
    projects: foldOptions[foldDefaults[2]],
    skillslearned: foldOptions[foldDefaults[3]],
    dates: false
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
    shownC.roles = foldOptions[indexToSelect]
    shownC.projects = foldOptions[indexToSelect]
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
  let summarySection = null
  // This is a more efficient way to pick of one item that should be first in list than filter
  for (let index in posts) {
    let { node } = posts[index]
    if (node.frontmatter.type === "summary") {
      summarySection = node
      break
    }
  }

  return (
    <Layout>
      <SEO title="All posts" />
      <FilterBar
        shown={shown}
        setShown={makeChangeShownFunc}
        skillFilter={skillFilter}
        skillReference={skillReference}
        setSkillFilter={setSkillFilter}
        toggleShowAll={toggleShowAll}
      />
      {summarySection && <AccordionOrg node={summarySection}>
        <Trifold
          html={summarySection.html}
          summary={summarySection.frontmatter.summary}
          show={shown.info}
        />
      </AccordionOrg>}
      {posts.map(({ node }) => {
        const { startdate, enddate, type, summary } = node.frontmatter
        if (type === "organization" && inChildOrOrg(skillFilter, node.frontmatter, posts)) {
          return (
            <div key={node.fields.slug}>
              <AccordionOrg node={node}>
                <Trifold html={node.html} summary={summary} show={shown.info}>
                  {shown.dates && <small style={{ marginLeft: 0 }}>{startdate + convertEndDate(enddate)} </small>}
                </Trifold>
              </AccordionOrg>
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
    site {
      siteMetadata {
        foldOptions
        foldDropdowns
        foldDefaults
      }
    }
  }
`
