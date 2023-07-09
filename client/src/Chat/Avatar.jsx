import React from 'react'

function Avatar({userId , username , online}) {

    //* have unique color for uniue user with the userId

    const colors = ['bg-blue-200' , 'bg-blue-200' ,'bg-red-200' ,'bg-yellow-200' ,'bg-purple-200' ,'bg-green-200' , 'bg-teal-200' ]

    const userIdBase10 = parseInt(userId , 16)    //*conversion to have it 0,4,0
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex]

  return (
    <div className={"w-9 h-9 relative rounded-full flex items-center " + color}> 
    
        <div className="text-center w-full opacity-60 uppercase">
        {username[0]} 
        </div>  
        {online && (
          <div className="absolute w-3 h-3 bg-green-400 right-0 bottom-0 rounded-full border border-white"></div> 
        )}
        {!online && (
          <div className="absolute w-3 h-3 bg-gray-400 right-0 bottom-0 rounded-full border border-white"></div> 
        )}
        
    </div>
  );
}

export default Avatar