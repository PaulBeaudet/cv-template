import React from "react"

import Dropdown, { showObj } from "./dropdown"
import SkillFilter from "./skillFilter"

interface props {
  shown: showObj,
  setShown: (type: string) => {}
  infoOptions: Array<string>
  listFoldOptions: Array<string>
  skillsOptions: Array<string>
  skillFilter: Array<string>
  skillReference: Array<string>
  setSkillFilter: any
  toggleShowAll: any

}

const FilterBar: React.FC<props> = ({
  shown,
  setShown,
  infoOptions,
  listFoldOptions,
  skillsOptions,
  skillFilter,
  skillReference,
  setSkillFilter,
  toggleShowAll
}) => {
  return (
    <small>
      <span>Filter |</span>
      <Dropdown
        options={infoOptions}
        stateValue={shown.info}
        name="Info"
        label="Text"
        onChange={setShown}
      />
      <Dropdown
        options={listFoldOptions}
        stateValue={shown.roles}
        name="Roles"
        label="Roles"
        onChange={setShown}
      />
      <Dropdown
        options={listFoldOptions}
        stateValue={shown.projects}
        name="Projects"
        label="Projects"
        onChange={setShown}
      />
      <Dropdown
        options={skillsOptions}
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
    </small>
  )
}

export default FilterBar