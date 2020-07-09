import React from "react"

interface props {
  options: Array<string>
  name: string
  label: string
  onChange: any //(event: any)=>void
}

const Dropdown: React.FC<props> = ({ options, name, label, onChange }) => {
  const listProperty: string = name.replace(/\s/g, "").toLowerCase()
  return (
    <>
      <label htmlFor={name}> {label} </label>
      <select
        id={name}
        name={name}
        defaultValue={options[0]}
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
}

export default Dropdown
