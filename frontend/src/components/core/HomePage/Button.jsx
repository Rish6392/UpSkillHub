import React from 'react'
import { Link } from "react-router-dom";

const Button = ({children,active,linkto}) => {
  return (
    <Link to={linkto}>
    <div className='text-ce'>
      {children}
    </div>
    </Link>
  )
}

export default Button
