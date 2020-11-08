import React, { useEffect } from "react"

function Container(props) {
  if (props.className === undefined) return <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>{props.children}</div>
  return <div className={props.className}>{props.children}</div>
}

export default Container
