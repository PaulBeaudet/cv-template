import React from "react"

// interface props {
//   options: Array<string>
//   onChange:(e: any):void =>{}
// }

const Dropdown = ({ options, name, onChange }) => {
  return (
    <small>
      <label htmlFor={name}>{name}</label>
      <select
        id={name}
        name={name}
        defaultValue={options[0]}
        onChange={event => {
          console.log("trying to change")
          onChange(name)(event)
        }}
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
