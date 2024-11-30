import React from 'react'
import { LiaRupeeSignSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';


const FourTile = () => {
  return (
    <div>
        <header className=' grid grid-rows-2 p-2 gap-2  '>
            <div className='flex gap-2 items-center justify-center'>
            <div className='xsm:h-[100%] xsm:w-[50%] overflow-y-auto px-1 rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
                <div className='flex justify-between'><h2 className='xsm:text-sm'>USERS</h2><p className='xsm:ml-8 xsm:text-sm'>^ +5%</p></div>
                <div className='flex items-center'><LiaRupeeSignSolid /><h1 className='text-xl'>720</h1> </div>

                <p className='underline xsm:text-sm '><Link>see all users</Link></p>
            </div>
            <div className='xsm:h-[100%] xsm:w-[50%] overflow-y-auto px-1 rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
                <div className='flex justify-between'><h2 className='xsm:text-sm'>ORDERS</h2><p className='xsm:ml-4 xsm:text-sm'>^ +5%</p></div>
                <div className='flex items-center'><LiaRupeeSignSolid /><h1 className='text-xl'>720</h1> </div>

                <p className='underline xsm:text-sm '><Link>see all users</Link></p>
            </div>
            
            
            </div>
            <div className='flex gap-2 items-center justify-center'>
            <div className='xsm:h-[100%] xsm:w-[50%] overflow-y-auto px-1 rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
                <div className='flex justify-between'><h2 className='xsm:text-sm '>EARNINGS</h2><p className='xsm:text-sm'>^ +5%</p></div>
                <div className='flex items-center'><LiaRupeeSignSolid /><h1 className='text-xl'>720</h1> </div>
                <p className='underline xsm:text-sm '><Link>see all users</Link></p>
            </div>
            <div className='xsm:h-[100%] xsm:w-[50%] overflow-y-auto px-1 rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
                <div className='flex justify-between w-full'>
                <h2 className='xsm:text-sm'>PROFIT</h2>
                <p className='xsm:text-sm '>^ +5%</p>
                </div>

                <div className='flex items-center'><LiaRupeeSignSolid /><h1 className='text-xl'>720</h1> </div>
                <p className='underline xsm:text-sm '><Link>see all users</Link></p>
            </div>
            
            </div>
        

        </header>
        
    </div>
  )
}

export default FourTile
//mmvml
