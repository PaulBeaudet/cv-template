import React, { useState, ChangeEvent } from "react"
import FoldDropdown from "./dropdown"
import SkillFilter from "./skillFilter"
import FilterCheckbox from "./filterCheckBox"
import { FilterState } from "./graphQlTypes"

interface props {
  toggleShowAll: any // fix this
  filterOptions: FilterState
  changeDropdownState: any
  toggleFilterProps: (prop: string) => void
  toggleSkill: (skillName: string, all?: boolean) => void
}

const FilterBar: React.FC<props> = ({
  toggleShowAll,
  filterOptions,
  changeDropdownState,
  toggleFilterProps,
  toggleSkill,
}) => {
  const [filterShown, setFilterShown] = useState<boolean>(false)
  const toggleFilterBar = (): void => {
    setFilterShown(!filterShown)
  }
  return (
    <small>
      <button onClick={toggleFilterBar}>
        {filterShown ? "Hide Filter" : "Show Filter"}
      </button>
      {filterShown && <div>
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
        <div>
          <SkillFilter
            filterOptions={filterOptions}
            toggleSkill={toggleSkill}
            toggleSkillButton={() => {
              toggleSkill(filterOptions.toggleSkills ? "show" : "", true)
              toggleShowAll(!filterOptions.toggleSkills)
              toggleFilterProps("toggleSkills")
            }}
          />
        </div>
        <div>
          <FilterCheckbox
            itemName="Show Dates"
            onChange={() => { toggleFilterProps("dates") }}
            checkState={filterOptions.dates}
          />
        </div>
      </div>}
    </small>
  )
}

export default FilterBar