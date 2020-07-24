import React from "react"
import FoldDropdown from "./dropdown"
import SkillFilter from "./skillFilter"
import FilterCheckbox from "./filterCheckBox"
import { FilterState } from "./graphQlTypes"

interface props {
  toggleShowAll: any
  filterOptions: FilterState
  changeDropdownState: any
  toggleDates: () => void
  toggleSkill: (skillName: string, all?: boolean) => void
}

const FilterBar: React.FC<props> = ({
  toggleShowAll,
  filterOptions,
  changeDropdownState,
  toggleDates,
  toggleSkill,
}) => {
  return (
    <small>
      <span>Filter |</span>
      {
        filterOptions.dropdowns.map((dropdown) => {
          return (
            <FoldDropdown
              key={dropdown.name}
              dropdown={dropdown}
              onChange={changeDropdownState}
            />
          )
        })
      }
      <SkillFilter
        toggleShow={toggleShowAll}
        filterOptions={filterOptions}
        toggleSkill={toggleSkill}
      />
      <FilterCheckbox
        itemName="Show Dates"
        onChange={toggleDates}
        checkState={filterOptions.dates ? 1 : 2}
      />
    </small>
  )
}

export default FilterBar