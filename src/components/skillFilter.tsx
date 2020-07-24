import React, { useState } from "react"
import { frontmatter, Node, SkillObj, DropdownObj, FilterState } from "./graphQlTypes"
import FilterCheckbox from "./filterCheckBox"

export const createSkillsArray = (sections: { node: Node }[], ddOptions: Array<DropdownObj>): Array<SkillObj> => {
  const allSkills: Array<string> = []
  sections.forEach(({ node }) => {
    const { frontmatter } = node
    let potentialSkills: Array<string> = []
    ddOptions.forEach((dd: DropdownObj, index: number) => {
      // skills are included from index 3 on, make sure frontmatter exist with valid data
      if (index > 2 && frontmatter.hasOwnProperty(dd.name) && frontmatter[dd.name]) {
        potentialSkills = frontmatter[dd.name].split(", ")
        potentialSkills.forEach((skill: string) => {
          if (skill && !allSkills.includes(skill)) {
            allSkills.push(skill)
          }
        })
      }
    })
  })
  return allSkills.map((skill: string): SkillObj => {
    return {
      name: skill,
      showing: true,
    }
  })
}

interface props {
  toggleShow: (show: boolean) => void
  filterOptions: FilterState
  toggleSkill: (skillName: string, all?: boolean) => void
}

const SkillFilter: React.FC<props> = ({ toggleShow, filterOptions, toggleSkill }) => {
  // state of if skills are being toggled, default, all skills checked, no skills checked 
  const [toggleAllSkills, setToggleAllSkills] = useState<number>(0)
  // State to track dialog of all on or off for filters
  const [toggleButton, setToggleButton] = useState<boolean>(false)
  // whether skills dialog is being shown or not
  const [skillsFilterShown, setSkillsFilterShown] = useState<boolean>(false)
  const toggleShowAll = (): void => {
    setToggleAllSkills(toggleButton ? 1 : 2)
    toggleSkill(toggleButton ? "show" : "", true)
    setToggleButton(!toggleButton)
  }
  const hideOrShowFilter = (): void => {
    if (skillsFilterShown) {
      toggleSkill("show", true)
      setToggleAllSkills(2)
      setToggleButton(true)
      toggleShow(false)
    } else {
      toggleSkill("", true)
      setToggleAllSkills(2)
      setToggleButton(true)
      toggleShow(true)
    }
    setSkillsFilterShown(!skillsFilterShown)
  }

  return (
    <>
      <button style={{ display: "inline-block", textAlign: "right" }} onClick={hideOrShowFilter}>
        {skillsFilterShown ? "Remove Filter" : "Add Skills Filter"}
      </button>
      {skillsFilterShown && <div>
        <button onClick={toggleShowAll}>{toggleButton ? "Select All" : "Clear All"}</button>
        {filterOptions.skills.map((skill: SkillObj) => {
          return (
            <FilterCheckbox
              itemName={skill.name}
              key={skill.name}
              onChange={toggleSkill}
              checkState={toggleAllSkills}
            />
          )
        })}
      </div>}
    </>
  )
}

export const sectionHasSkill = (filterOptions: FilterState, frontmatter: frontmatter): boolean => {
  let skillArray: Array<string> = []
  filterOptions.dropdowns.forEach((dd, index) => {
    if (index > 2 && frontmatter.hasOwnProperty(dd.name) && frontmatter[dd.name]) {
      skillArray = skillArray.concat(frontmatter[dd.name].split(", "))
    }
  })
  for (let item in filterOptions.skills) {
    if (filterOptions.skills[item].showing && skillArray.includes(filterOptions.skills[item].name)) {
      return true
    }
  }
  return false
}

// returns true if skill is in org
export const skillInOrg = (filterOptions: FilterState, frontmatter: frontmatter, sections: { node: Node }[]): boolean => {
  // if org has this skill return true
  if (sectionHasSkill(filterOptions, frontmatter)) { return true }
  // if a child of org has this skill
  for (let node in sections) {
    const { type, organization } = sections[node].node.frontmatter
    if (type !== "organization" && organization === frontmatter.organization) {
      if (sectionHasSkill(filterOptions, sections[node].node.frontmatter)) {
        return true
      }
    }
  }
  return false
}

export interface filterProp {
  array: Array<string>
  builder: (sections: { node: Node }[]) => void
}

export default SkillFilter