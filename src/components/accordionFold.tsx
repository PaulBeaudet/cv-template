import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Trifold from "./trifold"
import { frontmatter } from "./markdownTypes"
import { showObj } from "./dropdown"

interface props {
  title: string
  slug: string
  frontmatter: frontmatter
  html: string
  showObj: showObj
  type: string
}

interface githubQuery {
  readonly github: {
    viewer: {
      repositoriesContributedTo: {
        edges: {
          node: {
            name: string
            url: string
          }
        }[]
      }
      repositories: {
        edges: {
          node: {
            name: string
            url: string
          }
        }[]
      }
    }
  }
}

const AccordionFold: React.FC<props> = ({
  title,
  slug,
  frontmatter,
  html,
  showObj,
  type,
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
    <article style={{ marginLeft: "1.5rem" }} key={slug}>
      <header>
        <h5
          style={{
            marginTop: ".2rem",
            marginRight: ".2rem",
            marginBottom: 0,
            display: "inline-block",
          }}
        >
          {/* <Link style={{ boxShadow: `none` }} to={slug}>{title}</Link> */}
          {title}
          <small><i> ({type}) </i></small>
        </h5>
        <Trifold html={html} summary={summary} show={showObj.info}>
          {showObj.dates && <small>{startdate + endTxt}</small>}
          {hasRepos && projectLinks.map(createLink)}
        </Trifold>
      </header>
    </article>
  )
}

export default AccordionFold
