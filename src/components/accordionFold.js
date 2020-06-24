import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Trifold from "./trifold"

const AccordionFold = ({title, slug, frontmatter, html}) => {
  const {enddate, startdate, summary} = frontmatter;
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
  const repos = data.github.viewer.repositoriesContributedTo.edges.concat(data.github.viewer.repositories.edges)
  const repoMatch = repos.filter(node =>
    node.node.name.toLowerCase().replace(/_/g, ' ') === title.toLowerCase()
  )[0]
  const hasRepos = typeof repoMatch !== "undefined" && repoMatch.node.url ? true : false

  return (
    <article style={{marginLeft: "1rem",}} key={slug}>
      <header>
        <div>
          <h5
            style={{
              marginTop: ".2rem",
              marginBottom: 0,
              display: `inline`
            }}
          >
            <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link>
          </h5> 
          {hasRepos && <small style={{display: `inline`}}><span>: </span><a href={repoMatch.node.url}>github</a></small>}
        </div>
      </header>
      <small>{startdate + endTxt}</small>
      <Trifold html={html} summary={summary}/>
    </article>
  )
}

export default AccordionFold