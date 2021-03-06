// accordionFold.tsx Copyright 2020 Paul Beaudet MIT License

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Trifold from "./trifold"
import { frontmatter, githubQuery, FilterState } from "./graphQlTypes"

interface props {
  title: string
  slug: string
  frontmatter: frontmatter
  html: string
  type: string
  filterOptions: FilterState
}


const AccordionFold: React.FC<props> = ({
  title,
  slug,
  frontmatter,
  html,
  type,
  filterOptions,
}) => {
  const { enddate, startdate, summary, link } = frontmatter
  const endTxt = enddate === "Invalid date" ? " to current" : " to " + enddate + " "

  const data: githubQuery = useStaticQuery(graphql`
    query {
      github {
        viewer {
          repositoriesContributedTo(last: 70) {
            edges {
              node {
                name
                url
              }
            }
          }
          repositories(last: 70) {
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
  `)
  let hasRepos: boolean = false
  let projectLinks: Array<string> = link.split(", ")
  projectLinks = projectLinks.filter(url => url) // make sure each url is more than an empty string
  if (!projectLinks.length) {
    const repos: Array<any> = data.github.viewer.repositoriesContributedTo.edges.concat(
      data.github.viewer.repositories.edges
    )

    const repoMatch: any = repos.filter(
      node =>
        node.node.name.toLowerCase().replace(/_/g, " ") === title.toLowerCase()
    )[0]
    hasRepos =
      typeof repoMatch !== "undefined" && repoMatch.node.url ? true : false
    if (hasRepos) {
      projectLinks.push(repoMatch.node.url)
    }
  } else {
    hasRepos = true
  }

  const createLink = (url: string): React.DetailedHTMLProps<any, any> => {
    // maybe decern whether this is another type of link in future, they all github are now
    return (
      <small key={url}> <a href={url}>github</a></small>
    )
  }

  return (
    <article className="sub-section-article" key={slug}>
      <header>
        <h5 className="section-header">
          {title}
          <small><i> ({type})</i></small>
        </h5>
        <Trifold html={html} summary={summary} show={filterOptions.dropdowns[0].state}>
          {filterOptions.dates && <small>{startdate + endTxt}</small>}
          {hasRepos && projectLinks.map(createLink)}
        </Trifold>
      </header>
    </article>
  )
}

export default AccordionFold
