

export interface frontmatter {
  projects: string
  organization: string
  startdate: string
  enddate: string
  summary: string
  roles: string
  type: string
  skillsused: string
  skillslearned: string
  softskills: string
  link: string
}

export interface Node {
  frontmatter: frontmatter
  fields: {
    slug: string
  }
  html: string
}

export type Data = {
  allMarkdownRemark: {
    edges: {
      node: Node
    }[]
  }
}
