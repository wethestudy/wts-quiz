import React from 'react';
import Lottie from 'lottie-react';
import loadingStyles from './styles/loading.module.css'
import animationData from '../../assets/lottie/Animation - 1695477922966.json'

const Loading = () => {
    return <div className={loadingStyles['loading-wrapper']}>
        <div className={loadingStyles['lottie-wrapper']}>
            <Lottie animationData={animationData} speed={1.5} loop={true} autoplay={true} />
            <div className={loadingStyles['loading-message']}><p>Now Loading...</p></div>
        </div>
    </div>
}

export default Loading;