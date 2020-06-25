import React, {useState} from "react"
import {graphql, useStaticQuery} from "gatsby"

import AccordionFold from "./accordionFold"

interface props {
  list: string
  organization: string
  showAll: boolean
  listType: string
  show: string
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

type nameFunc = (name: string) => void; {}
type voidFuncFunc = (func: nameFunc) => void; {}

const ListFold: React.FC<props> = ({list, organization, showAll, listType, show}) => {
  const [showingItems, setShowingItems] = useState<Array<showingItemType>>(
    list.split(", ").map((item:string):showingItemType=>{
      return{name: item, vis: false, link: false}
    })
  )
  const [lastShowAll, setLastShowAll] = useState<boolean>(showAll)
  const [linksPainted, setPaintedLinks] = useState<boolean>(false) 
  // Action for toggling an item's visibility on button press  
  const toggleItem = (targetItem: string):void => {
    setShowingItems(showingItems.map((lastItem: showingItemType)=>{
      if(lastItem.name === targetItem){
        return {name: targetItem, vis: !lastItem.vis, link: lastItem.link}
      } else {
        return lastItem
      }
    }))
  }
  // make sure list type follows frontmatter name convention, remove spaces / convert to lower case
  const frontMProp:string = listType.replace(/\s/g, '').toLowerCase()
  // Determine if show all state has changed on render
  if(showAll !== lastShowAll){
    setShowingItems(showingItems.map((item: showingItemType):showingItemType=> {
      return {name: item.name, link: item.link ,vis: showAll ? true : false}
    }))
    setLastShowAll(showAll)
  }
  // Determine if list is populated with meaningful data
  const hasItems:boolean = showingItems.length && showingItems[0].name ? true : false
  // query everything markdown, because this is a static site generated on build not dynamically at run time
  const data:data = useStaticQuery(graphql`
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
    `
  )
  const sections = data.allMarkdownRemark.edges // shorthand edges
  
  const findCorrectSections:voidFuncFunc = (onCorrectSection: nameFunc):void => {
    sections.map(({node}):void => {
      let name:string = "Invalid Name"
      if(node.frontmatter[frontMProp]){
        name = node.frontmatter[frontMProp].split(",")[0]
      }
      const org:string = node.frontmatter.organization
      // Be sure this is correct org of parent and type of fold element minus plural
      if(org === organization && node.frontmatter.type === frontMProp.replace(/s$/, "")){
        onCorrectSection(name)
      }
    })
  }
  if (!linksPainted) {
    const showColorLink = (nameArray: Array<string>) => {
      let newShowingItems:showArray = showingItems.map((item: showingItemType):showingItemType=>{
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
    findCorrectSections((name: string):void => {correctNames.push(name)})
    showColorLink(correctNames)
    setPaintedLinks(true)
  }
  
  return (
    <div>
      {hasItems && <span style={{marginLeft: ".75rem" }}>{listType}: </span>}
      {!showAll && hasItems && // so long as show all is unchecked & meaningful data exist
        <small>
          {showingItems.map((item: showingItemType):React.DetailedHTMLProps<any, any>=>{
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
        let name:string = "Invalid Name"
        if(node.frontmatter[frontMProp]){
          name = node.frontmatter[frontMProp].split(",")[0]
        }
        const org:string = node.frontmatter.organization
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