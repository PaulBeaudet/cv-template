import React, { useState, useEffect } from "react"

import AccordionFold from "./accordionFold"
import { Node, FilterState } from "./graphQlTypes"
import { sectionHasSkill } from "./skillFilter"
import { visKey } from "./graphQlTypes"

interface props {
  list: string
  organization: string
  listType: string
  sections: {
    node: Node
  }[]
  filterOptions: FilterState
  showState: number
}

interface showingItemType {
  name: string
  vis: boolean
  link: boolean
}

const ListFold: React.FC<props> = ({
  list,
  organization,
  listType,
  sections,
  filterOptions,
  showState,
}) => {
  // make sure list type follows frontmatter name convention, remove spaces / convert to lower case
  const [showingItems, setShowingItems] = useState<Array<showingItemType>>(
    list.split(", ").map(
      (item: string): showingItemType => {
        return { name: item, vis: false, link: false }
      }
    )
  )
  const listProperty: string = listType.replace(/\s/g, "").toLowerCase()
  const nonPluralType: string = listProperty.replace(/s$/, "")
  const [linksPainted, setPaintedLinks] = useState<boolean>(false)
  const [numberOfLinks, setNumberOfLinks] = useState<number>(0)
  // Action for toggling an item's visibility on button press
  const toggleItem = (targetItem: string): void => {
    setShowingItems(
      showingItems.map((lastItem: showingItemType) => {
        if (lastItem.name === targetItem) {
          lastItem.vis = !lastItem.vis
        }
        return lastItem
      })
    )
  }

  // Determine if show all state has changed on render
  useEffect(() => {
    setShowingItems(
      showingItems.map(
        (item: showingItemType): showingItemType => {
          item.vis = showState === visKey.showAll ? true : false
          return item
        }
      )
    )
  }, [showState, filterOptions.skills])

  // Determine if list is populated with meaningful data
  const hasItems: boolean =
    showingItems.length && showingItems[0].name ? true : false

  const findCorrectSections: (func: (name: string) => void) => void = (
    onCorrectSection: (name: string) => void
  ): void => {
    sections.map(({ node }): void => {
      let name: string = "Invalid Name"
      if (node.frontmatter[listProperty]) {
        name = node.frontmatter[listProperty].split(",")[0]
      }
      const org: string = node.frontmatter.organization
      // Be sure this is correct org of parent and type of fold element minus plural
      if (
        org === organization &&
        node.frontmatter.type === nonPluralType
      ) {
        onCorrectSection(name)
      }
    })
  }
  if (!linksPainted) { // FIX useEffect(()=>{},[])
    const showColorLink = (nameArray: Array<string>) => {
      const newShowingItems: showingItemType[] = showingItems.map(
        (item: showingItemType): showingItemType => {
          const available = nameArray.filter(name => name === item.name)
          if (available.length) {
            item.link = true
          }
          return item
        }
      )
      setShowingItems(newShowingItems)
    }
    const correctNames: Array<string> = [] // array of correct name strings associated with this fold
    findCorrectSections((name: string): void => {
      correctNames.push(name)
    })
    showColorLink(correctNames)
    setNumberOfLinks(correctNames.length)
    setPaintedLinks(true)
  }
  const showCapability: number =
    showState === visKey.showAll && !numberOfLinks ? visKey.summary : showState
  const validShowState: boolean = showState === visKey.hide ? false : true
  return (
    <div>
      {hasItems && validShowState && showCapability === visKey.summary && (
        <span style={{ marginLeft: ".75rem" }}>{listType}: </span>
      )}
      {showCapability === visKey.summary &&
        hasItems && ( // so long as show all is unchecked & meaningful data exist
          <small>
            {showingItems.map(
              (item: showingItemType): React.DetailedHTMLProps<any, any> => {
                return item.link ? ( // Given this is a link show a button vs span
                  <button
                    key={item.name}
                    onClick={() => {
                      toggleItem(item.name)
                    }}
                    style={{
                      border: "none",
                      padding: 0,
                      background: "none",
                      color: "#069", // #069 for default
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ marginRight: "0.5rem" }}> {item.name} </span>
                  </button>
                ) : (
                    <span key={item.name} style={{ marginRight: "0.5rem" }}>
                      {" "}
                      {item.name}{" "}
                    </span>
                  )
              }
            )}
          </small>
        )}
      {sections.map(({ node }) => {
        let name: string = "Invalid Name"
        if (node.frontmatter[listProperty]) {
          name = node.frontmatter[listProperty].split(",")[0]
        }
        const org: string = node.frontmatter.organization
        // Be sure this is correct org of parent and type of fold element minus plural
        if (
          org === organization &&
          node.frontmatter.type === nonPluralType
        ) {
          if (
            showingItems.filter(item => item.name === name && item.vis).length &&
            sectionHasSkill(filterOptions, node.frontmatter)
          ) {
            return (
              <AccordionFold
                key={node.fields.slug}
                title={name}
                slug={node.fields.slug}
                frontmatter={node.frontmatter}
                html={node.html}
                type={listType.replace(/s$/, "")}
                filterOptions={filterOptions}
              />
            )
          }
        }
      })}
    </div>
  )
}

export default ListFold
