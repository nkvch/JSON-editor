import React, { useState, useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';

const Alerts = (props) => {

    const { errors, successes } = props;

    const [stack, setStack] = useState([]);
    
    useEffect(() => {
        if (errors.length > 0) {
            const lastError = errors.slice(-1)[0];
            setStack(stack.concat(lastError));
            setTimeout(() => {
                setStack(prevState => prevState.slice(1));
            }, 5000);
        }
    }, [errors.length]);

    useEffect(() => {
        if (successes.length > 0) {
            const lastSuccess = successes.slice(-1)[0];
            setStack(stack.concat(lastSuccess));
            setTimeout(() => {
                setStack(prevState => prevState.slice(1));
            }, 5000);
        }
    }, [successes.length]);


    return (
        <div className='alerts-component'>
            {
                stack.length > 0 && stack.map((response, idx) => 
                <Alert key={idx} variant={response.status === 200 ? 'success' : 'danger'} className='main-alert'>
                    {response.data?.msg || response.statusText || (response.status === 0 ? 'Request is blocked by CORS' : 'JSON is fetched')}
                </Alert>)
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    successes: state.successes
});

export default connect(mapStateToProps)(Alerts);