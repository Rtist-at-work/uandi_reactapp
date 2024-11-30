import React from 'react'
import { LiaRupeeSignSolid } from "react-icons/lia";
import {Circle} from "rc-progress";
import { BsThreeDotsVertical } from "react-icons/bs";

const TotalRevenue = () => {
  return (
        <main className=' p-2 items-center  justify-center h-[100%] w-[100%]'>
            <div className='flex xsm:h-[100%] xsm:w-[100%] overflow-y-auto px-1 rounded border-2 border-gray-300 hover:shadow-lg cursor-pointer '>
                <div className='xsm:w-[50%] xsm:h-[100%]'>
                <h1>TOTAL REVENUE </h1>
                <div className='relative xsm:w-[100%] xsm:h-[70%] xsm:mt-2 flex justify-center '>
                    <Circle percent={40} strokeColor="pink" strokeWidth={10} trailWidth={10} className='h-[100%] w-[100%]' />
                    <div className='absolute inset-0 flex items-center justify-center text-lg font-bold'>
                    40%
                    </div>            
                </div>
                </div>
                <div className='xsm:w-[50%] gap-4 flex flex-col py-2'>
                <div className='flex w-[100%] justify-end'>
                <BsThreeDotsVertical className='right-20 top-4 '/>
                </div>
                <div className='flex flex-col px-2 gap-4'>
                <div className='w-[100%]  flex justify-center'><p className='xsm:text-sm  xsm:mt-2 '>Made by Today</p></div>
                    <div className='relative xsm:w-[100%] xsm:mt-2 flex justify-center  bg-red-700'>
                    <div className=' absolute flex'>
                        <LiaRupeeSignSolid className='text-2xl' />
                        <h1 className='text-xl '>720</h1>
                    </div>
                    </div> 
                </div>
                </div>
            
            </div>
            
        </main>
  )
}
//mmvml

export default TotalRevenue
