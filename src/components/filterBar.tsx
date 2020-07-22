import React from "react"

import FoldDropdown, { showObj } from "./dropdown"
import SkillFilter from "./skillFilter"
import FilterCheckbox from "./filterCheckBox"

interface props {
  shown: showObj,
  setShown: any
  skillFilter: Array<string>
  skillReference: Array<string>
  setSkillFilter: any
  toggleShowAll: any

}

const FilterBar: React.FC<props> = ({
  shown,
  setShown,
  skillFilter,
  skillReference,
  setSkillFilter,
  toggleShowAll
}) => {
  return (
    <small>
      <span>Filter |</span>
      <FoldDropdown
        stateValue={shown.info}
        name="Info"
        label="Text"
        onChange={setShown}
      />
      <FoldDropdown
        stateValue={shown.roles}
        name="Roles"
        label="Roles"
        onChange={setShown}
      />
      <FoldDropdown
        stateValue={shown.projects}
        name="Projects"
        label="Projects"
        onChange={setShown}
      />
      <FoldDropdown
        stateValue={shown.skillslearned}
        name="Skills Learned"
        label="Tech Learned"
        onChange={setShown}
      />
      <SkillFilter
        skillFilter={skillFilter}
        refArray={skillReference}
        setSkillFilter={setSkillFilter}
        toggleShow={toggleShowAll}
      />
      <FilterCheckbox
        itemName="Show Dates"
        onChange={(itemName) => {
          setShown("dates")({
            target: {
              value: !shown.dates
            }
          })
        }}
        checkState={shown.dates ? 1 : 2}
      />
    </small>
  )
}

export default FilterBar