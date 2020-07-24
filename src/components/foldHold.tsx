import React from "react"
import ListFold from "./listFold"
import { Node, frontmatter, FilterState } from "./graphQlTypes"
interface props {
  orgFrontmatter: frontmatter
  allSections: {
    node: Node
  }[]
  filterOptions: FilterState
}

const FoldHold: React.FC<props> = ({ orgFrontmatter, allSections, filterOptions }) => {
  const { organization } = orgFrontmatter
  return (
    <>
      {filterOptions.dropdowns.map((dropdown, index) => {
        if (index) { // zeroth item is not frontmatter
          return (
            <ListFold
              key={organization + dropdown.name}
              organization={organization}
              list={orgFrontmatter[dropdown.name]}
              listType={dropdown.label}
              sections={allSections}
              filterOptions={filterOptions}
              showState={dropdown.state}
            />
          )
        }
      })}
    </>
  )
}

export default FoldHold