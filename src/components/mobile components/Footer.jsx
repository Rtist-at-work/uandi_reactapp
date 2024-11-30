import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineProductionQuantityLimits,MdOutlineChecklist } from "react-icons/md";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import { IoMdHome} from "react-icons/io";


const Footer = () => {
  return (
    <div className='h-[100%] w-[100%] flex items-center justify-around'>
         <Link to='/admin/homepage'><IoMdHome/></Link>
          <Link to='/admin/addproducts'><MdOutlineProductionQuantityLimits /></Link>
          <Link to='/admin/categories'><BiSolidCategory/></Link>
          <Link to='/admin/banners'><BiSolidOffer/></Link>
          <Link to='/admin/orderlists'><MdOutlineChecklist/></Link>   
      
    </div>
  )
}
//mmvml

export default Footer
