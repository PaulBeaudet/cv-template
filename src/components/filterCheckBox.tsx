import React, { useState, useEffect } from "react"

interface props {
  itemName: string
  onChange: {
    (name: string): void
  }
  checkState?: number
}

const FilterCheckbox: React.FC<props> = ({
  itemName,
  onChange,
  checkState,
}) => {
  const [checked, setChecked] = useState<boolean>(true)
  useEffect(() => {
    if (checkState) {
      setChecked(checkState === 2 ? false : true)
    }
  }, [checkState])
  return (
    <>
      <input type="checkbox" id={itemName} name={itemName} value={itemName} checked={checked} onChange={() => {
        onChange(itemName)
        setChecked(!checked)
      }} />
      <label htmlFor={itemName}>{itemName}</label>
    </>
  )
}

export default FilterCheckbox