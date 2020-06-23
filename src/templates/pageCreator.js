import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data, pageContext }) => {
  const {organization, summary, startdate, enddate, roles, type, projects } = data.markdownRemark.frontmatter
  let pageTitle = type === 'role' ? roles.split(', ')[0] : organization
  pageTitle = type === 'project' ? projects.split(', ')[0] : pageTitle
  const {html} = data.markdownRemark
  const endTxt = enddate === "Invalid date" ? " " : " to " + enddate + " "
  const { previous, next, readingTime } = pageContext

  return (
    <Layout>
      <SEO
        title={pageTitle}
        description={summary}
      />
      <article>
        <header>
          <h1
            style={{
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              display: `block`,
              marginBottom: 20,
            }}
          >
            {startdate + endTxt} - {readingTime}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: html }} />
        <hr
          style={{
            marginBottom: 20,
          }}
        />
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.organization}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.organization} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        organization
        startdate(formatString: "MMMM DD, YYYY")
        enddate(formatString: "MMMM DD, YYYY")
        summary
        roles
        projects
        type
      }
    }
  }
`
