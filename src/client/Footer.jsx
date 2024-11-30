import React from 'react'
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate()
  return (
    <footer className='relative h-auto w-full bg-gray-200 p-4 xsm:grid xsm:grid-cols-2 my-4 '>
                   <div >
                        <h1>SUPPORT</h1>
                        <ul className='ml-6 list-disc underline texm-sm'>
                            <li className='cursor-pointer'>shipping</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/return')}>return</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/faq')}>FAQ</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/shippingpolicy')}>shipping</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/admin/homepage')}>Contact Us</li>
                        </ul>
                    </div>
                    <div >
                        <h1>ABOUT US</h1>
                        <ul className='ml-6 list-disc underline text-sm'>
                            <li className='cursor-pointer'>ABOUT US</li>
                            <li className='cursor-pointer'>Our Story</li>
                            <li className='cursor-pointer'>Blog</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/PrivacyPolicy')}>Privacy</li>
                            <li className='cursor-pointer' onClick={()=>navigate('/Terms&Services')}>Terms & Conditions</li>
                            <li className='cursor-pointer'>Accesibility</li>
                        </ul>
                    </div>
                    <div className=' py-6 w-full  flex items-center col-span-2'>
                        Follow Us 
                        <RiInstagramFill className='xsm:text-3xl mx-2'/>
                        <FaFacebookSquare className='xsm:text-3xl mx-2' />
                       
                    </div>
                     <div className='col-span-2 '>
                        <h1 className='xsm:text-lg    m-2'>U&I</h1>
                        <p className='xsm:text-sm'>Join our  list for updates</p>
                        <form className='flex items-center gap-2'>
                            <input type="email" required class="border-0 border-b border-black focus:outline-none"/>
                            <FaArrowRightLong />
                        </form>                        
                    </div>
                    <div className='col-span-2  my-2'>
                        <p className='xsm:text-sm'>© 2024, U&I.  ALL RIGHTS RESERVED</p>
                    </div> 
            </footer>
  )
}

export default Footer
