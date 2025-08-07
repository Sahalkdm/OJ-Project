import React from 'react'

function Card({children, className}) {
  return (
    <div className={'p-4 bg-white shadow-md rounded-lg md:max-w-xl mx-4 ' + (className)}>
      {children}
    </div>
  )
}

export default Card
