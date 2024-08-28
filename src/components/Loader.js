import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../assets/images/loader.json'

function Loader() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        
        }
      };
  return (
    <div>
      <Lottie options={defaultOptions} height={200} width={200} className="px-5 mt-4" />
    </div>
  )
}

export default Loader
