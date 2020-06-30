import React from "react"

// interface props {
//   options: Array<string>
//   onChange:(e: any):void =>{}
// }

const Dropdown = ({ options, name, label, onChange }) => {
  const listProperty: string = name.replace(/\s/g, "").toLowerCase()
  return (
    <small>
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
    </small>
  )
}

export default Dropdown
