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
  filterOptions: FilterState
  toggleSkill: (skillName: string, all?: boolean) => void
  toggleSkillButton: () => void
}

const SkillFilter: React.FC<props> = ({
  filterOptions,
  toggleSkill,
  toggleSkillButton
}) => {
  return (
    <>
      <button onClick={toggleSkillButton}>{filterOptions.toggleSkills ? "Select All Skills" : "Clear All Skills"}</button>
      {filterOptions.skills.map((skill: SkillObj) => {
        return (
          <FilterCheckbox
            itemName={skill.name}
            key={skill.name}
            onChange={toggleSkill}
            checkState={skill.showing}
          />
        )
      })}
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