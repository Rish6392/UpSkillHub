import React from 'react'
import { useSelector } from 'react-redux'

const RenderTotalAmount = () => {

    const {total} = useSelector((state)=>state.cart);

    const handleBuyCourse=()=>{
          const courses = cart.map((course)=>course._id);
          console.log("Bought these courses:",courses);
          //Todo : API integration -> payment gateway tak leke jayegi 
    }
  return (
    <div>

        <p>Total:</p>
        <p>Rs {total}</p>

        <IconBtn
          text="Buy Now"
          onclick={handleBuyCourse}
          customClasses={"w-full justify-center"}
        />
      
    </div>
  )
}

export default RenderTotalAmount
