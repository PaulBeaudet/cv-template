//index.tsx Copyright 2020 Paul Beaudet MIT License
import React, { useState, useEffect, ChangeEvent } from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import AccordionOrg from "../components/accordionOrg"
import { IndexData, convertEndDate, FilterState, DropdownObj, visKey, SkillObj } from "../components/graphQlTypes"
import { createSkillsArray, skillInOrg } from "../components/skillFilter"
import FoldHold from "../components/foldHold"
import FilterBar from "../components/filterBar"
import Trifold from "../components/trifold"

const BlogIndex = ({ data }: PageProps<IndexData>) => {
  const { foldDropdowns } = data.site.siteMetadata
  const [filterOptions, setFilterOptions] = useState<FilterState>({
    dropdowns: foldDropdowns,
    dates: true,
    toggleSkills: false,
    skills: []
  })

  const changeDropdownState = (type: string) => {
    return (event: ChangeEvent<HTMLSelectElement>): void => {
      const filterStateCopy: FilterState = { ...filterOptions }
      filterStateCopy.dropdowns = filterOptions.dropdowns.map((dd: DropdownObj): DropdownObj => {
        if (dd.name === type) {
          dd.state = Number(event.target.value)
        }
        return dd
      })
      setFilterOptions(filterStateCopy)
    }
  }

  const toggleFilterProps = (prop: string): void => {
    const filterStateCopy = { ...filterOptions }
    filterStateCopy[prop] = !filterStateCopy[prop]
    setFilterOptions(filterStateCopy)
  }

  const changeOnFilterToggle = (show: boolean): void => {
    const filterStateCopy: FilterState = { ...filterOptions }
    filterStateCopy.dropdowns = filterOptions.dropdowns.map((dd: DropdownObj): DropdownObj => {
      // when filter on show all / when off show default
      if (dd.sticky) { return dd } // skip sticky filters
      dd.state = show ? visKey.showAll : visKey.summary
      return dd
    })
    setFilterOptions(filterStateCopy)
  }

  const toggleSkill = (skillName: string, all?: boolean): void => {
    const filterStateCopy = { ...filterOptions }
    if (all) {
      filterStateCopy.skills = filterStateCopy.skills.map((skill: SkillObj): SkillObj => {
        skill.showing = skillName === "show" ? true : false
        return skill
      })
    } else {
      filterStateCopy.skills = filterStateCopy.skills.map((skill: SkillObj): SkillObj => {
        if (skill.name === skillName) {
          skill.showing = !skill.showing
        }
        return skill
      })
    }
    setFilterOptions(filterStateCopy)
  }

  const posts = data.allMarkdownRemark.edges // short cut edges
  useEffect(() => {
    const filterStateCopy = { ...filterOptions }
    filterStateCopy.skills = createSkillsArray(posts, foldDropdowns)
    setFilterOptions(filterStateCopy)
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
      <FilterBar
        toggleShowAll={changeOnFilterToggle}
        filterOptions={filterOptions}
        changeDropdownState={changeDropdownState}
        toggleFilterProps={toggleFilterProps}
        toggleSkill={toggleSkill}
      />
      {summarySection && <AccordionOrg node={summarySection}>
        <Trifold
          html={summarySection.html}
          summary={summarySection.frontmatter.summary}
          show={visKey.summary}
        />
      </AccordionOrg>}
      {posts.map(({ node }) => {
        const { startdate, enddate, type, summary } = node.frontmatter
        if (type === "organization" && skillInOrg(filterOptions, node.frontmatter, posts)) {
          return (
            <div key={node.fields.slug}>
              <AccordionOrg node={node}>
                <Trifold html={node.html} summary={summary} show={filterOptions.dropdowns[0].state}>
                  {filterOptions.dates && <small>{startdate + convertEndDate(enddate)} </small>}
                </Trifold>
              </AccordionOrg>
              <FoldHold
                orgFrontmatter={node.frontmatter}
                allSections={posts}
                filterOptions={filterOptions}
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
            startdate(formatString: "MMMM YYYY")
            enddate(formatString: "MMMM YYYY")
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
        foldDropdowns {
          name
          state
          sticky
          label
        }
      }
    }
  }
`
