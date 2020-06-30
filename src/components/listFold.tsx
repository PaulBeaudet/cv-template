import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

import AccordionFold from "./accordionFold"

interface props {
  list: string
  organization: string
  listType: string
  show: string
  showObj: {
    projects: string
    roles: string
    info: string
  }
}

interface showingItemType {
  name: string
  vis: boolean
  link: boolean
}

type showArray = showingItemType[]

interface data {
  allMarkdownRemark: {
    edges: {
      node: {
        fields: {
          slug: string
        }
        html: string
        frontmatter: {
          type: string
          organization: string
          role: string
          projects: string
          startdate: string
          enddate: string
          link: string
          summary: string
        }
      }
    }[]
  }
}

type nameFunc = (name: string) => void
{
}
type voidFuncFunc = (func: nameFunc) => void
{
}

const ListFold: React.FC<props> = ({
  list,
  organization,
  listType,
  show,
  showObj,
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
  const showState: string = showObj.hasOwnProperty(listProperty)
    ? showObj[listProperty]
    : "summary"
  const [lastShowAll, setLastShowAll] = useState<string>(showState)
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
  if (showState !== lastShowAll) {
    setShowingItems(
      showingItems.map(
        (item: showingItemType): showingItemType => {
          // show all might be dumb to hard code
          item.vis = showState === "show all" ? true : false
          return item
        }
      )
    )
    setLastShowAll(showState)
  }
  // Determine if list is populated with meaningful data
  const hasItems: boolean =
    showingItems.length && showingItems[0].name ? true : false
  // query everything markdown opposed to just what is needed
  // this is a static site generated on build not dynamically at run time
  const data: data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        sort: { fields: [frontmatter___startdate], order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
            }
            html
            frontmatter {
              type
              organization
              roles
              projects
              startdate(formatString: "MMMM DD, YYYY")
              enddate(formatString: "MMMM DD, YYYY")
              link
              summary
            }
          }
        }
      }
    }
  `)
  const sections = data.allMarkdownRemark.edges // shorthand edges

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
        node.frontmatter.type === listProperty.replace(/s$/, "")
      ) {
        onCorrectSection(name)
      }
    })
  }
  if (!linksPainted) {
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
    showState === "show all" && !numberOfLinks ? "summary" : showState
  const validShowState: boolean =
    showState === "summary" || showState === "show all" ? true : false
  return (
    <div>
      {hasItems && validShowState && (
        <span style={{ marginLeft: ".75rem" }}>{listType}: </span>
      )}
      {showCapability === "summary" &&
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
          node.frontmatter.type === listProperty.replace(/s$/, "")
        ) {
          if (
            showingItems.filter(item => item.name === name && item.vis).length
          ) {
            return (
              <AccordionFold
                key={node.fields.slug}
                title={name}
                slug={node.fields.slug}
                frontmatter={node.frontmatter}
                html={node.html}
                show={show}
              />
            )
          }
        }
      })}
    </div>
  )
}

export default ListFold
