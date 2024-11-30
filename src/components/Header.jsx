import React from 'react'
import { CiMenuFries,CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosNotificationsOutline } from "react-icons/io";



const Header = ({handleMenuBarToggle}) => {
  return (
    <header className='relative h-[10%] w-full ' >
      <div className='flex h-full w-full '>
        <CiMenuFries id='menubar' onClick={handleMenuBarToggle} className='absolute text-3xl top-4 left-2 hidden lg:block cursor-pointer'/>  
          {/* <div className='flex items-center my-2 lg:ml-28 sm:ml-8 w-[50%] h-[50%] bg-pink-700 rounded-md '>
            <CiSearch className='text-3xl'/>
            <input type='text' id='searchbar' placeholder='search' className=' ml-2 w-[100%] rounded-md bg-pink-700 outline-none'></input>
          </div>  */}
        <CgProfile className='absolute lg:text-4xl xsm:text-3xl right-5 lg:top-4 xsm:top-2'/>
        <IoIosNotificationsOutline className='absolute lg:text-4xl xsm:text-3xl xsm:right-16 lg:right-20 lg:top-4 xsm:top-2'/>
        {/* <button className='absolute border-2 border-black w-40 h-9 right-40 top-1 rounded'>Create</button> */}

      </div>
      
    </header>
  )
}
//mmvml

export default Header