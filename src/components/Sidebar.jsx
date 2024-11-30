import React from 'react'
import uandiLogo from '../assets/uandilogo.jpg';
import { IoMdHome} from "react-icons/io";
import { MdOutlineProductionQuantityLimits,MdOutlineChecklist } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Sidebar = React.forwardRef(() => {

//mmvml
  

  return (
    <aside className='z-50 w-[20%] h-full shadow-md rounded-lg md:block xsm:hidden'>
        <img src={uandiLogo} alt='img' className=' relative h-[10%] w-[100%]'></img>
        <ul className='text-sans text-base font-light text-gray-500 space-y-4 '>
          <li id='home'  className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><IoMdHome className='text-xl mr-2 '/><Link to='/admin/homepage'>Home</Link></li>
          <li id='addproducts'   className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><MdOutlineProductionQuantityLimits className='text-xl mr-2 '/><Link to='/admin/addproducts'>Products</Link></li>
          <li id='categories'  className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><BiSolidCategory className='text-xl mr-2 '/><Link to='/admin/Categories'>Categories</Link></li>
          <li id='banners'  className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><BiSolidOffer className='text-xl mr-2 '/><Link to='/admin/Banners'>Banners</Link></li>
          <li id='orderlist'  className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><MdOutlineChecklist className='text-xl mr-2 ' /><Link to='/admin/orderlists'>Order List</Link></li>
          <li id='policy'  className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><MdPolicy  className='text-xl mr-2 ' /><Link to='/admin/policy'>Policy</Link></li>
      </ul>
    </aside>
  )
});

export default Sidebar