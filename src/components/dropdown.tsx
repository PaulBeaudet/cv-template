import React, { ChangeEvent } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { MetaQuery, DropdownObj } from "./graphQlTypes"

interface props {
  dropdown: DropdownObj
  onChange: (type: string) => (event: ChangeEvent<HTMLSelectElement>) => void
}

const FoldDropdown: React.FC<props> = ({ dropdown, onChange }) => {
  const { name, label, state } = dropdown
  const { site }: MetaQuery = useStaticQuery(graphql`
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
    <div>
      <label htmlFor={label}> {label} </label>
      <select
        id={name}
        name={name}
        value={state}
        onChange={onChange(name)}
      >
        {options.map((item: string, index: number) => {
          return (
            <option value={index} key={item + name}>
              {item}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FoldDropdown
