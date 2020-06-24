import React, {useState} from "react"
import {graphql, useStaticQuery} from "gatsby"

import AccordionFold from "./accordionFold"

const ListFold = ({list, organization, showAll, listType, show}) => {
  const [showingItems, setShowingItems] = useState(list.split(", ").map((item)=>{return{name: item, vis: false, link: false}}))
  const [lastShowAll, setLastShowAll] = useState(showAll)
  const [linksPainted, setPaintedLinks] = useState(false) 
  // Action for toggling an item's visibility on button press  
  const toggleItem = (targetItem: string) => {
    setShowingItems(showingItems.map((lastItem)=>{
      if(lastItem.name === targetItem){
        return {name: targetItem, vis: !lastItem.vis, link: lastItem.link}
      } else {
        return lastItem
      }
    }))
  }
  // make sure list type follows frontmatter name convention, remove spaces / convert to lower case
  const frontMProp = listType.replace(/\s/g, '').toLowerCase()
  // Determine if show all state has changed on render
  if(showAll !== lastShowAll){
    setShowingItems(showingItems.map((item)=>{return {name: item.name, link: item.link ,vis: showAll ? true : false}}))
    setLastShowAll(showAll)
  }
  // Determine if list is populated with meaningful data
  const hasItems = showingItems.length && showingItems[0].name ? true : false
  // query everything markdown, because this is a static site generated on build not dynamically at run time
  const data = useStaticQuery(graphql`
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
                summary
              }
            }
          }
        }
      }
    `
  )
  const sections = data.allMarkdownRemark.edges // shorthand edges
  
  const findCorrectSections = (onCorrectSection) => {
    sections.map(({node}) => {
      let name = "Invalid Name"
      if(node.frontmatter[frontMProp]){
        name = node.frontmatter[frontMProp].split(",")[0]
      }
      const org  = node.frontmatter.organization
      // Be sure this is correct org of parent and type of fold element minus plural
      if(org === organization && node.frontmatter.type === frontMProp.replace(/s$/, "")){
        onCorrectSection(name)
      }
    })
  }
  if (!linksPainted) {
    const showColorLink = (nameArray: Array<string>) => {
      let newShowingItems = showingItems.map((item)=>{
        const available = nameArray.filter(name => name === item.name )
        if (available.length){
          return {name: item.name, vis: item.vis, link: true}
        } else {
          return item
        }
      })
      setShowingItems(newShowingItems)
    }
    const correctNames: Array<string> = []  // array of correct name strings associated with this fold
    findCorrectSections((name: string) => {correctNames.push(name)})
    showColorLink(correctNames)
    setPaintedLinks(true)
  }
  
  return (
    <div>
      {hasItems && <span style={{marginLeft: ".5rem" }}>{listType}: </span>}
      {!showAll && hasItems && // so long as show all is unchecked & meaningful data exist
        <small>
          {showingItems.map((item)=>{
            return (
              item.link // Given this is a link show a button vs span
              ? <button 
                  key={item.name}
                  onClick={()=>{toggleItem(item.name)}}
                  style={{
                    border: "none",
                    padding: 0,
                    background: "none",
                    color: "#069", // #069 for default
                    cursor: "pointer",
                  }}
                >
                <span style={{marginRight: "0.5rem"}}> {item.name} </span>
              </button>
              : <span key={item.name} style={{marginRight: "0.5rem"}}> {item.name} </span>
            )
          })}
        </small>
      }
      {sections.map(({ node }) => {
        let name = "Invalid Name"
        if(node.frontmatter[frontMProp]){
          name = node.frontmatter[frontMProp].split(",")[0]
        }
        const org  = node.frontmatter.organization
        // Be sure this is correct org of parent and type of fold element minus plural
        if(org === organization && node.frontmatter.type === frontMProp.replace(/s$/, "")){
          if (showingItems.filter(item => item.name === name && item.vis).length){
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