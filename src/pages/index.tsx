import React, { useState, useEffect } from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import AccordionOrg from "../components/accordionOrg"
import Dropdown from "../components/dropdown"
import FilterCheckbox from "../components/filterCheckBox"
import { node, Data } from "../components/markdownTypes"
import FilteredIn from "../components/filteredIn"

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
  // Items th are being filtered
  const [techFilter, setTechFilter] = useState<Array<string>>([])
  // Reference of items that can be filtered
  const [techArray, setTechArray] = useState<Array<string>>([])
  // state of if skills are being toggled, default, all skills checked, no skills checked 
  const [toggleAllSkills, setToggleAllSkills] = useState<number>(0)
  // State to track dialog of all on or off for filters
  const [toggleButton, setToggleButton] = useState<boolean>(false)
  // whether skills dialog is being shown or not
  const [skillsFilterShown, setSkillsFilterShown] = useState<boolean>(false)

  const posts: { node: node }[] = data.allMarkdownRemark.edges // short cut edges
  const makeChangeShownFunc = (type: string) => {
    return (event: any): void => {
      const shownC = { ...shown }
      shownC[type] = event.target.value
      setShown(shownC)
    }
  }
  const toggleFilter = (itemName: string): void => {
    const nextState = [...techFilter]
    const index = techFilter.indexOf(itemName)
    if (index > -1) {
      nextState.splice(index, 1)
      setTechFilter(nextState)
    } else {
      nextState.push(itemName)
      setTechFilter(nextState)
    }
    setToggleAllSkills(0)
  }

  const addToFilter = (sections) => {
    const nextArray: Array<string> = techArray
    sections.map(({ node }) => {
      let techItems = node.frontmatter.skillsused.split(", ")
      techItems = techItems.concat(node.frontmatter.skillslearned.split(", "))
      techItems = techItems.concat(node.frontmatter.softskills.split(", "))
      techItems.map((item) => {
        if (item && !nextArray.includes(item)) {
          nextArray.push(item)
        }
      })
    })
    setTechArray(nextArray)
    setTechFilter(nextArray)
  }

  useEffect(() => {
    addToFilter(posts)
  }, [])

  return (
    <Layout>
      <SEO title="All posts" />
      <span>Filter |</span>
      <small>
        <Dropdown
          options={infoOptions}
          name="Info"
          label="Text"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={listFoldOptions}
          name="Roles"
          label="Roles"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={listFoldOptions}
          name="Projects"
          label="Projects"
          onChange={makeChangeShownFunc}
        />
        <Dropdown
          options={skillsOptions}
          name="Skills Learned"
          label="Tech Learned"
          onChange={makeChangeShownFunc}
        />
        <button style={{ display: "inline-block", textAlign: "right" }} onClick={() => {
          if (skillsFilterShown) {
            setTechFilter(techArray)
            setToggleAllSkills(2)
            setToggleButton(true)
          } else {
            setTechFilter([])
            setToggleAllSkills(2)
            setToggleButton(true)
          }
          setSkillsFilterShown(!skillsFilterShown)
        }}>{skillsFilterShown ? "Remove Filter" : "Add Skills Filter"}</button>
        {skillsFilterShown && <div>
          <button onClick={() => {
            setToggleAllSkills(toggleButton ? 1 : 2)
            setTechFilter(toggleButton ? techArray : [])
            setToggleButton(!toggleButton)
          }}>{toggleButton ? "Select All" : "Clear All"}</button>
          {techArray.map((itemName) => {
            return (
              <FilterCheckbox itemName={itemName} key={itemName} onChange={(itemName) => { toggleFilter(itemName) }} checkState={toggleAllSkills} />
            )
          })}
        </div>}
      </small>
      {posts.map(({ node }) => {
        if (FilteredIn(techFilter, node.frontmatter)) {
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
            softskills
          }
        }
      }
    }
  }
`
