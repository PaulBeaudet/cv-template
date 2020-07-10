import React, { useState } from "react"
import { frontmatter, Node } from "./markdownTypes"
import FilterCheckbox from "./filterCheckBox"


export const addToFilter = (sections: { node: Node }[], referenceArray: Array<string>): Array<string> => {
  const nextArray: Array<string> = referenceArray
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
  return nextArray
}

interface props {
  skillFilter: Array<string>
  refArray: Array<string>
  setSkillFilter: (newSelection: Array<string>) => void
  toggleShow: (show: boolean) => void
}

const SkillFilter: React.FC<props> = ({ skillFilter, refArray, setSkillFilter, toggleShow }) => {
  // state of if skills are being toggled, default, all skills checked, no skills checked 
  const [toggleAllSkills, setToggleAllSkills] = useState<number>(0)
  // State to track dialog of all on or off for filters
  const [toggleButton, setToggleButton] = useState<boolean>(false)
  // whether skills dialog is being shown or not
  const [skillsFilterShown, setSkillsFilterShown] = useState<boolean>(false)
  const toggleFilter = (itemName: string): void => {
    const nextState = [...skillFilter]
    const index = skillFilter.indexOf(itemName)
    if (index > -1) { //Remove item case
      nextState.splice(index, 1)
      setSkillFilter(nextState)
    } else {          // add item case
      nextState.push(itemName)
      setSkillFilter(nextState)
    }
    setToggleAllSkills(0)
  }
  const toggleShowAll = (): void => {
    setToggleAllSkills(toggleButton ? 1 : 2)
    setSkillFilter(toggleButton ? refArray : [])
    setToggleButton(!toggleButton)
  }
  const hideOrShowFilter = (): void => {
    if (skillsFilterShown) {
      setSkillFilter(refArray)
      setToggleAllSkills(2)
      setToggleButton(true)
      toggleShow(false)
    } else {
      setSkillFilter([])
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
        {refArray.map((itemName) => {
          return (
            <FilterCheckbox
              itemName={itemName}
              key={itemName}
              onChange={toggleFilter}
              checkState={toggleAllSkills}
            />
          )
        })}
      </div>}
    </>
  )
}

// Answers question: Is this item filtered into view?
export const filteredIn = (comparisonArray: Array<string>, frontmatter: frontmatter): boolean => {
  let skillArray = frontmatter.skillsused.split(", ")
  skillArray = skillArray.concat(frontmatter.skillslearned.split(", "))
  skillArray = skillArray.concat(frontmatter.softskills.split(", "))
  for (let item in skillArray) {
    if (comparisonArray.includes(skillArray[item])) {
      return true
    }
  }
  return false
}

export const inChildOrOrg = (comparisonArray: Array<string>, frontmatter: frontmatter, sections: { node: Node }[]): boolean => {
  // first if parent has this attribute just return true
  if (filteredIn(comparisonArray, frontmatter)) {
    return true
  }
  // check if children have one of the filter attributes
  for (let node in sections) {
    const { type, organization } = sections[node].node.frontmatter
    if (type !== "organization" && organization === frontmatter.organization) {
      if (filteredIn(comparisonArray, sections[node].node.frontmatter)) {
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