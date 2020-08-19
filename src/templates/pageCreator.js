// pageCreator.js Copyright 2020 Paul Beaudet MIT License 
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { convertEndDate } from "../components/graphQlTypes"

const BlogPostTemplate = ({ data, pageContext }) => {
  const { organization, summary, startdate, enddate, roles, type, projects } = data.markdownRemark.frontmatter
  let pageTitle = type === 'role' ? roles.split(', ')[0] : organization
  pageTitle = type === 'project' ? projects.split(', ')[0] : pageTitle
  const { html } = data.markdownRemark
  const { readingTime } = pageContext

  return (
    <Layout>
      <SEO
        title={pageTitle}
        description={summary}
      />
      <article>
        <header>
          <h3 className="section-header">
            {pageTitle}
          </h3>
          <p>
            {startdate + convertEndDate(enddate)} - {readingTime}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        organization
        startdate(formatString: "MMMM YYYY")
        enddate(formatString: "MMMM YYYY")
        summary
        roles
        projects
        type
      }
    }
  }
`
