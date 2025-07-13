import React from 'react'
import logo from '../../Assets/Logo/Logo-Full-Light.png'
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from '../../data/navbar-links.js'
import { useLocation} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaCartArrowDown } from "react-icons/fa";
import ProfileDropDown from '../core/Auth/ProfileDropDown.jsx'

const Navbar = () => {

  const {token} = useSelector((state)=>state.auth);
  const {user} = useSelector((state) =>state.profile);
  const {totalItems} = useSelector((state) => state.cart);

  const loaction = useLocation();

  const matchRoute = (route)=>{
    return matchPath({path:route},location.pathname)
  }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 '>
      <div className='flex w-11/12 max-w-maxContainer items-center justify-between'>
           
           {/* Logo add */}
          <Link to="/">
          <img src={logo} width={160} height={42} loading='lazy'/>
          </Link>

          {/* Nav Links */}
          <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
             {
              NavbarLinks.map((link,index)=>(
                 <li key={index}>
                   {
                    link.title==="Catalog"?(
                      
                    ):(
                      <Link to={link?.path}> 
                         <p className={`${matchRoute(link?.path)?"text-yellow-25":"text-richblack-25"}`}>
                          {link.title}
                          </p>
                      </Link>
                    )
                   }
                 </li>
              ))
             }
            </ul>
          </nav>


          {/* Login/Signup/dashboard/cart */}
          <div className='flex gap-x-4 items-center'>
              
              {
                user && user?.accounttype!="Instructor" && (
                  <Link to="/dashboard/cart" className='relative'>
                   <FaCartArrowDown />
                   {
                    totalItems>0 && (
                      <span>
                        {totalItems}
                      </span>
                    )
                   }
                  </Link>
                )
              }
              {
                token===null && (
                  <Link to="/login">
                   <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                   text-richblack-100 rounded-md '>
                    Log In
                  </button>
                  </Link>
                )
              }
              {
                token===null && (
                  <Link to="/signup">
                  <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                   text-richblack-100 rounded-md '>
                    Sign Up
                  </button>
                  </Link>
                )
              }
              {
                token!==null && <ProfileDropDown/>

                
              }

          </div>

      </div>
    </div>
  )
} 

export default Navbar
