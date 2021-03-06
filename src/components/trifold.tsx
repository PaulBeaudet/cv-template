// trifold.tsx Copyright 2020 Paul Beaudet MIT License
import React, { useState, useEffect } from "react"
import { visKey } from "./graphQlTypes"

interface props {
  html: string
  summary: string
  show: number
  children?: any
}

const Trifold: React.FC<props> = ({ html, summary, show, children }) => {
  let globFold: number = 0 // Global fold type representation
  // convert fold name to number type
  if (show !== visKey.hide) {
    globFold = show === visKey.summary ? 1 : 2
  }
  // Which type state for this fold
  let [folded, setFold] = useState<number>(globFold)
  // function for iterating through fold types
  const nextFold = (): void => {
    setFold(folded === 2 ? 0 : folded + 1) // 0 -> 1 -> 2 -> 0 -> 1 -> ect.
  }
  // Only change fold on parent's request when "show" changes
  useEffect((): void => {
    setFold(globFold)
  }, [show])
  // function to reverse number representation of fold types
  const foldType = (foldNumber: number): string => {
    let type = ""
    if (foldNumber === 0) {
      type = "summary"
    } else if (foldNumber === 1) {
      type = "details"
    } else if (foldNumber === 2) {
      type = "hide"
    }
    return type
  }
  // function that decides on contents to render based on type
  const foldContents = (
    foldNumber: number
  ): React.DetailedHTMLProps<any, any> | null => {
    if (foldNumber) {
      return (
        <p
          className="fold-contents"
          dangerouslySetInnerHTML={{
            __html: foldNumber === 2 ? html : summary,
          }}
        ></p>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <small>
        <button
          onClick={() => { nextFold() }}
          className="text-button"
        >
          {foldType(folded)}
        </button>
      </small>
      <br></br>
      {children}
      {foldContents(folded)}
    </>
  )
}

export default Trifold
