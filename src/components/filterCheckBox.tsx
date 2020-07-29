import React, { useState, useEffect } from "react"

interface props {
  itemName: string
  onChange: {
    (name: string): void
  }
  checkState?: boolean
}

const FilterCheckbox: React.FC<props> = ({
  itemName,
  onChange,
  checkState,
}) => {
  const [checked, setChecked] = useState<boolean>(true)
  useEffect(() => {
    setChecked(checkState)
  }, [checkState])
  return (
    <div>
      <input type="checkbox" id={itemName} name={itemName} value={itemName} checked={checked} onChange={() => {
        onChange(itemName)
        setChecked(!checked)
      }} />
      <label htmlFor={itemName}>{itemName}</label>
    </div>
  )
}

export default FilterCheckbox