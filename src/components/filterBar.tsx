// filterBar.tsx Copyright 2020 Paul Beaudet 
import React, { useState, ChangeEvent } from "react"
import FoldDropdown from "./dropdown"
import SkillFilter from "./skillFilter"
import FilterCheckbox from "./filterCheckBox"
import { FilterState } from "./graphQlTypes"

interface props {
  toggleShowAll: (show: boolean) => void
  filterOptions: FilterState
  changeDropdownState: (type: string) => (event: ChangeEvent<HTMLSelectElement>) => void
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
      <div>
        <button onClick={toggleFilterBar}>
          {filterShown ? "Hide Filter" : "Show Filter"}
        </button>
      </div>
      {filterShown && <div>
        <div className="filter-dropdowns">
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
          <FilterCheckbox
            itemName="Dates"
            onChange={() => { toggleFilterProps("dates") }}
            checkState={filterOptions.dates}
          />
        </div>
        <div className="filter-bar-skill-filter">
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
      </div>}
    </small>
  )
}

export default FilterBar