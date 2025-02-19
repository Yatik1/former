import React from 'react'

function layout({children} : {children:React.ReactNode}) {
  return (
    <div className='flex w-full h-screen flex-grow'>
        {children}
    </div>
  )
}

export default layout