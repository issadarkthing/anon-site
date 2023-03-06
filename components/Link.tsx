import BaseLink from "next/link";
import { CSSProperties, useState } from "react";

export function Link(props: { 
  href: string, 
  children: React.ReactNode, 
  style?: CSSProperties,
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <BaseLink 
      href={props.href}
      style={{
        color: "lightblue",
        textDecoration: isHover ? "" : "none",
        ...props.style,
      }}
      onMouseEnter={() => { setIsHover(true) }}
      onMouseLeave={() => { setIsHover(false) }}
    >
      {props.children}
    </BaseLink>
  )
}
