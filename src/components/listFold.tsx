import React, {useState} from "react"
import {graphql, useStaticQuery} from "gatsby"

import AccordionFold from "./accordionFold"

const ListFold = ({list, organization, showAll, listType}) => {
  const [showingItems, setShowingItems] = useState(list.split(", ").map((item)=>{return{name: item, vis: false}}))
  let [lastShowAll, setLastShowAll] = useState(showAll)
  const toggleItem = (targetItem) => {
    setShowingItems(showingItems.map((lastItem)=>{
      if(lastItem.name === targetItem){
        return {name: targetItem, vis: !lastItem.vis}
      } else {
        return lastItem
      }
    }))
  }
  if(showAll !== lastShowAll){
    setShowingItems(showingItems.map((item)=>{return {name: item.name, vis: showAll ? true : false}}))
    setLastShowAll(showAll)
  }
  // filter: {frontmatter: {type: {eq: "role"}}}, 
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
  const sections = data.allMarkdownRemark.edges
  return (
    <>
      {!showAll &&
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