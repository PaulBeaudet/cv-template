import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Trifold from "./trifold"

const AccordionFold = ({title, slug, frontmatter, html, show}) => {
  const {enddate, startdate, summary, link} = frontmatter;
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "

  const data = useStaticQuery(graphql`
      query {
        github {
          viewer {
            repositoriesContributedTo(last: 70){
              edges {
                node {
                  name
                  url
                }
              }
            }
            repositories(last: 70){
              edges {
                node {
                  name
                  url
                }
              }
            }
          }
        }
      }
    `
  )
  let hasRepos = false
  let projectLinks = link.split(", ")
  projectLinks = projectLinks.filter( url => url ) // make sure each url is more than an empty string
  if(!projectLinks.length){
    const repos = data.github.viewer.repositoriesContributedTo.edges.concat(data.github.viewer.repositories.edges)
    const repoMatch = repos.filter(node =>
      node.node.name.toLowerCase().replace(/_/g, ' ') === title.toLowerCase()
    )[0]
    hasRepos = typeof repoMatch !== "undefined" && repoMatch.node.url ? true : false
    if(hasRepos){projectLinks.push(repoMatch.node.url)}
  } else {hasRepos = true}

  const createLink = (url)=> {
    // maybe decern whether this is another type of link in future, they all github are now
    return (<small style={{display: `inline`}}><span>: </span><a href={url}>github</a></small>)
  }
  
  return ( 
    <article style={{marginLeft: "1.5rem",}} key={slug}>
      <header>
        <div>
          <h5
            style={{
              marginTop: ".2rem",
              marginRight: ".2rem",
              marginBottom: 0,
              display: `inline`
            }}
          >
            <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link>
          </h5> 
          {hasRepos && projectLinks.map(createLink)}
        </div>
        <small>{startdate + endTxt}</small>
        <Trifold html={html} summary={summary} show={show}/>
      </header>
    </article>
  )
}

export default AccordionFold