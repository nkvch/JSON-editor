import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingComponent = () => {
    return (
        <div className='loading-component'>
            <Spinner animation='border' />
            <h2 className="mt-3">Loading...</h2>
        </div>
    )
}

export default LoadingComponent;