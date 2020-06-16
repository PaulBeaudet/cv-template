import React, {useState} from "react"

const Trifold = ({html, summary}) => {
  let [folded, setFold] = useState(0)
  const nextFold = () => {
    setFold(folded === 2 ? 0 : folded + 1) // 0 -> 1 -> 2 -> 0 -> 1 -> ect.
  }

  return (
    <>
      <small><button 
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
        {(()=>{
          let dialog = "show "
          if(folded === 0){ 
            dialog += "summary"
          } else if (folded === 1){
            dialog += "details"
          } else if (folded === 2){
            dialog = "hide"
          }
          return dialog
        })()}
      </button></small>
      {(()=>{
        if(folded){ 
        return (
          <section>
            <p
              dangerouslySetInnerHTML={{ 
                __html: folded === 2 ? html : summary
              }}></p>
          </section>)
        }
      })()}
    </>
  )
}

export default Trifold