import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModal = ({modalData}) => {
  return (
    <div>

        <div>
            <p>
                {modalData.text1}
            </p>
            <p>
                {modalData.text1}
            </p>
            <div>
                <IconBtn
                    onclick={modalData?.btnHandler} 
                    text={modalData?.btn1Text}
                />

                <button onClick = {modalData?.btn2handler}>
                    {modalData?.btn2Text}
                </button>
            </div>
        </div>
      
    </div>
  )
}

export default ConfirmationModal
