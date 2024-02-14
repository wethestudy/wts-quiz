import React from 'react';
import { useSelector } from "react-redux";
import Card from '../main/Card';
import Loading from '../main/Loading';

function LoadingScreen() {
    const isLoading = useSelector((state) => state.data.loading);
    let body = <Loading/>

    return (
        <div>
            <Card body={body}/>
        </div>
    );
}

export default LoadingScreen;