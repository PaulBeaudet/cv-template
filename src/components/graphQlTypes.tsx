// graphQlTypes.tsx Copyright 2020 Paul Beaudet MIT License

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

export type IndexData = {
  allMarkdownRemark: {
    edges: {
      node: Node
    }[]
  }
  site: siteMetadata
}

export interface githubQuery {
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

export interface siteMetadata {
  siteMetadata: {
    foldOptions: Array<string>
    foldDropdowns: Array<DropdownObj>
    foldDefaults: Array<number>
  }
}

export type layoutData = {
  avatar: {
    childImageSharp: {
      fixed: {
        height: number
        src: string
        originalName: string
        srcSet: string
        srcSetWebp: string
        srcWebp: string
        tracedSVG: string
        width: number
        base64: string
        aspectRatio: string
      }
    }
  }
  site: siteMetadata
}

export type ConfigData = {
  siteMetadata: siteMetadata
  plugins: Array<any>
}

export type MetaQuery = {
  site: siteMetadata
}

export interface DropdownObj {
  name: string
  state: number
  sticky: boolean
  label: string
}

export interface SkillObj {
  name: string
  showing: boolean
}

export interface FilterState {
  dropdowns: Array<DropdownObj>
  dates: boolean
  toggleSkills: boolean
  skills: Array<SkillObj>
}

export const visKey = {
  summary: 0,
  showAll: 1,
  hide: 2,
}

export const convertEndDate = (enddate: string): string => {
  return enddate === "Invalid date" ? " to current " : " to " + enddate + " "
}
