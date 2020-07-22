import React, { useState, useEffect } from "react"

import AccordionFold from "./accordionFold"
import { Node, MetaQuery } from "./graphQlTypes"
import { filteredIn } from "./skillFilter"
import { showObj } from "./dropdown"
import { useStaticQuery, graphql } from "gatsby"

interface props {
  list: string
  organization: string
  listType: string
  showObj: showObj
  sections: {
    node: Node
  }[]
  skillsFilter: Array<string>
}

interface showingItemType {
  name: string
  vis: boolean
  link: boolean
}

type showArray = showingItemType[]
type nameFunc = (name: string) => void
type voidFuncFunc = (func: nameFunc) => void


const ListFold: React.FC<props> = ({
  list,
  organization,
  listType,
  showObj,
  sections,
  skillsFilter,
}) => {
  const { site }: MetaQuery = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          foldOptions
        }
      }
    }
  `)
  const { foldOptions } = site.siteMetadata
  const visKey = {
    summary: 0,
    showAll: 1,
    hide: 2,
  }
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
  // Last minute patching of improperly named headings
  let listName: string = listType === "Skills Used" ? "Tech Used" : listType // FIX
  listName = listType === "Skills Learned" ? "Tech Learned" : listName // FIX 
  listName = listType === "Soft Skills" ? "Skills" : listName // FIX
  const showState: string = showObj.hasOwnProperty(listProperty)
    ? showObj[listProperty]
    : foldOptions[visKey.summary]  // assume first option if no parent state 
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
          // show all might be dumb to hard code
          item.vis = showState === foldOptions[visKey.showAll] ? true : false
          return item
        }
      )
    )
  }, [showObj, skillsFilter])

  // Determine if list is populated with meaningful data
  const hasItems: boolean =
    showingItems.length && showingItems[0].name ? true : false

  const findCorrectSections: voidFuncFunc = (
    onCorrectSection: nameFunc
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
      const newShowingItems: showArray = showingItems.map(
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
  const showCapability: string =
    showState === foldOptions[visKey.showAll] && !numberOfLinks ? foldOptions[visKey.summary] : showState
  const validShowState: boolean =
    showState === foldOptions[visKey.summary] || showState === foldOptions[visKey.showAll] ? true : false
  return (
    <div>
      {hasItems && validShowState && showCapability === foldOptions[visKey.summary] && (
        <span style={{ marginLeft: ".75rem" }}>{listName}: </span>
      )}
      {showCapability === foldOptions[visKey.summary] &&
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
            filteredIn(skillsFilter, node.frontmatter)
          ) {
            return (
              <AccordionFold
                key={node.fields.slug}
                title={name}
                slug={node.fields.slug}
                frontmatter={node.frontmatter}
                html={node.html}
                showObj={showObj}
                type={listType.replace(/s$/, "")}
              />
            )
          }
        }
      })}
    </div>
  )
}

export default ListFold
