import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { siteMetadata } from "./graphQlTypes"

interface props {
  stateValue: string
  name: string
  label: string
  onChange: any //(event: any)=>void
}

type data = {
  site: siteMetadata
}

const FoldDropdown: React.FC<props> = ({ stateValue, name, label, onChange }) => {
  const listProperty: string = name.replace(/\s/g, "").toLowerCase()
  const { site }: data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          foldOptions
        }
      }
    }
  `)
  const options = site.siteMetadata.foldOptions
  return (
    <>
      <label htmlFor={label}> {label} </label>
      <select
        id={name}
        name={name}
        value={stateValue}
        onChange={onChange(listProperty)}
      >
        {options.map((item: string) => {
          return (
            <option value={item} key={item + name}>
              {item}
            </option>
          )
        })}
      </select>
    </>
  )
}
export interface showObj {
  roles: string
  projects: string
  info: string
  skillslearned: string
  dates: boolean
}

export default FoldDropdown
