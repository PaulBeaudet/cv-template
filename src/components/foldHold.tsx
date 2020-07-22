import React from "react"
import ListFold from "./listFold"
import { Node, frontmatter } from "./graphQlTypes"
import { showObj } from "./dropdown"

interface props {
  orgFrontmatter: frontmatter
  allSections: {
    node: Node
  }[]
  showObj: showObj
  skillsFilter: Array<string>
}

const FoldHold: React.FC<props> = ({ orgFrontmatter, allSections, showObj, skillsFilter }) => {
  const foldTypes: Array<string> = ["Roles", "Projects", "Skills Used", "Skills Learned", "Soft Skills"]
  const { organization } = orgFrontmatter

  return (
    <>
      {foldTypes.map((foldType) => {
        const foldProp: string = foldType.replace(/\s/g, "").toLowerCase()
        return (
          <ListFold
            key={organization + foldProp}
            organization={organization}
            list={orgFrontmatter[foldProp]}
            listType={foldType}
            showObj={showObj}
            sections={allSections}
            skillsFilter={skillsFilter}
          />
        )
      })}
    </>
  )
}

export default FoldHold