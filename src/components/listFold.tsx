import React, {useState} from "react"
import {graphql, useStaticQuery} from "gatsby"

import AccordionFold from "./accordionFold"

const ListFold = ({list, organization, showAll, listType}) => {
  const [showingItems, setShowingItems] = useState(list.split(", ").map((item)=>{return{name: item, vis: false}}))
  let [lastShowAll, setLastShowAll] = useState(showAll)
  // Action for toggling an item's visibility on button press  
  const toggleItem = (targetItem: string) => {
    setShowingItems(showingItems.map((lastItem)=>{
      if(lastItem.name === targetItem){
        return {name: targetItem, vis: !lastItem.vis}
      } else {
        return lastItem
      }
    }))
  }
  // Determine if show all state has changed on render
  if(showAll !== lastShowAll){
    setShowingItems(showingItems.map((item)=>{return {name: item.name, vis: showAll ? true : false}}))
    setLastShowAll(showAll)
  }
  // Determine if list is populated with meaningful data
  const hasItems = showingItems.length && showingItems[0].name ? true : false
  // query everything markdown, because this is a static site generated on build not dynamically at run time
  const data = useStaticQuery(graphql`
      query {
        allMarkdownRemark(
          sort: { fields: [frontmatter___enddate], order: DESC }
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
                startdate(formatString: "MMMM DD, YYYY")
                enddate(formatString: "MMMM DD, YYYY")
                summary
              }
            }
          }
        }
      }
    `
  )
  const sections = data.allMarkdownRemark.edges // shorthand edges
  return (
    <>
      {!showAll && hasItems && // so long as show all is unchecked & meaningful data exist
        <small>
          <span>{listType}: </span>
          {showingItems.map((item)=>{
            return (
              <button 
                  key={item.name}
                  onClick={()=>{toggleItem(item.name)}}
                  style={{
                    border: "none",
                    padding: 0,
                    background: "none",
                    color: "#069",
                    cursor: "pointer",
                  }}
                >
                <span style={{marginRight: "0.5rem"}}> {item.name} </span>
              </button>
            )
          })}
        </small>
      }
      {sections.map(({ node }) => {
        let name = "Invalid Name"
        if(node.frontmatter[listType]){
          name = node.frontmatter[listType].split(",")[0]
        }
        const org  = node.frontmatter.organization
        if(org === organization && node.frontmatter.type !== "organization"){
          if (showingItems.filter(item => item.name === name && item.vis).length){
            return (
              <AccordionFold
                key={node.fields.slug}
                title={name}
                slug={node.fields.slug}
                frontmatter={node.frontmatter}
                html={node.html}
              />
            )
          }
        }
      })}
    </>
  )
}

export default ListFold