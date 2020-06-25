import React, {useState, useEffect} from "react"

const Trifold = ({html, summary, show}) => {
  let globFold: number= 0 // Global fold type representation  
  // convert fold name to number type
  if (show !== "none"){globFold = show === "summary" ? 1 : 2}
  // Which type state for this fold
  let [folded, setFold] = useState(globFold)
  // function for iterating through fold types
  const nextFold = ():void => {
    setFold(folded === 2 ? 0 : folded + 1) // 0 -> 1 -> 2 -> 0 -> 1 -> ect.
  }
  // Only change fold on parent's request when "show" changes
  useEffect(():void=>{setFold(globFold)}, [show])
  // function to reverse number representation of fold types
  const foldType = (foldNumber: number):string => {
    let type = ""
    if(foldNumber === 0){ 
      type = "summary"
    } else if (foldNumber === 1){
      type = "details"
    } else if (foldNumber === 2){
      type = "hide"
    }
    return type
  }
  // function that decides on contents to render based on type
  const foldContents = (foldNumber: number):any => {
    if (foldNumber) {
      return (
        <p style={{marginTop: ".2rem", marginBottom: ".2rem"}} dangerouslySetInnerHTML={{
          __html: foldNumber === 2 ? html : summary
        }}></p>
      )
    } else {return null}
  }

  return (
    <>
      <small>
        <button 
          onClick={()=>{nextFold()}}
          style={{
            border: "none",
            padding: 0,
            background: "none",
            color: "#069",
            textAlign: "right",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          {"show " + foldType(folded)}
        </button>
      </small>
      {foldContents(folded)}
    </>
  )
}

export default Trifold