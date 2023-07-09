import React from 'react'
import Alogo from '../assets/Alogo.png'

function Logo() {
  return (
    <div className='text-blue-500 flex font-bold gap-2 p-4'>
    <div className='w-8 mt-2 mb-4' >
        <img src={Alogo} alt="" />
    </div>
    <h2 className='mt-3 ml-3 text-xl'>Chat App</h2>
    </div>
  )
}

export default Logo