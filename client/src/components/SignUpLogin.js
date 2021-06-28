import React, { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { setUser, resetUser } from '../redux/actions/userActions';
import { setToken, resetToken } from '../redux/actions/token';
import { resetJson } from '../redux/actions/actualJsonActions';
import { error } from '../redux/actions/error';
import { success } from '../redux/actions/success';
import UserHTTPservice from '../services/UserHTTPservice';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const SignUpLogin = (props) => {

    const { userData, jsonData } = props;

    //const { SignedUp, notifyParent, Show, close } = props;

    const [signUp, setSignUp] = useState(true);

    const [FNwarning, setFNwarning] = useState('');
    const [LNwarning, setLNwarning] = useState(false);
    const [usernameWarning, setUsernameWarning] = useState(false);
    const [passwordWarning, setPasswordWarning] = useState(false);

    //const [showLogIn, setShowLogIn] = useState(false);

    const [show, setShow] = useState(false);
    //const [signedUp, setSignedUp] = useState(SignedUp);


    const dispatch = useDispatch();

    const LogInInitial = { 
        username: '',
        password: '',
    };
    const SignUpInitial =  {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    };
    const [data, setData] = useState(signUp ? SignUpInitial : LogInInitial);

    useEffect(() => {
        setData(signUp ? SignUpInitial : LogInInitial);
        setFNwarning('');
        setLNwarning('');
        setUsernameWarning('');
        setPasswordWarning('');
    }, [signUp]);

    // useEffect(() => {
    //     setShow(Show);
    // }, [Show])

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        const changedValues = {
            [name]: value,
        };
        
        setData({
            ...data,
            ...changedValues,
        });
    }

    const handleSubmit = async (event) => {
        if (signUp) {
            try {

                const response = await UserHTTPservice.postUser(data)
                console.log(response);
                dispatch(success(response));
                setSignUp(false);
            } catch (e) {
                // setErrorAlert(true);
                console.log(e.response);
                dispatch(error(e.response));
            }
        } else {
            try {
                
                const res = await UserHTTPservice.logIn(data);

                dispatch(setToken(res.data.token));
                dispatch(setUser(res.data.user));
                dispatch(success(res));
                handleClose();
                //}
            } catch (e) {
                console.log(e.response);
                dispatch(error(e.response));
                
            }
        }
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleLogInClick = () => {
        setSignUp(false);
        setShow(true);
    }

    const handleSignUpClick = () => {
        setSignUp(true);
        setShow(true);
    }

    const handleLogOutClick = () => {
        setSignUp(true);
        dispatch(resetUser());
        dispatch(resetToken());
        if (jsonData.fromDB) {
            dispatch(resetJson());
        }
    }

    const validateFN = (event) => {
        const value = event.target.value;
        if (!value) {
            setFNwarning('First name is required');
        } else if (!/^[A-Z][a-z]+$/.test(value)){
            setFNwarning('First name must be a word written using engilsh letters starting with Capital');
        } else {
            setFNwarning('');
        }
    }

    const validateLN = (event) => {
        const value = event.target.value;
        if (!value) {
            setLNwarning('Last name is required');
        } else if (!/^[A-Z][a-z]+$/.test(value)){
            setLNwarning('Last name must be a word written using engilsh letters starting with Capital');
        } else {
            setLNwarning('');
        }
    }

    const validateUsername = async (event) => {
        const value = event.target.value;
        if (!value) {
            setUsernameWarning('Username is required');
        } else if (!/([a-z]|[A-Z]){4}/.test(value)) {
            setUsernameWarning('Username must contain at least 4 english letters');
        } else {
            const res = await UserHTTPservice.findByUsername(value);
            if (res.data.userExists) {
                setUsernameWarning('User with such username already exists');
            } else {
                setUsernameWarning('');
            }
        }
    }

    const validatePassword = async (event) => {
        const value = event.target.value;
        if (!value) {
            setPasswordWarning('Password is required');
        } else if (
            !/\d/.test(value)
            || !/[A-Z]/.test(value)
            || value.length < 6
            ) 
        {
            setPasswordWarning('Password must contain at least one Big letter, one digit and have minimum length of 6');
        } else {
            setPasswordWarning('');
        }
    }

    return (
        <div>
        {
            userData
            ? <div>
                <p className="d-inline-block me-3">{`${userData?.firstName} ${userData?.lastName}`}</p>
                <a href  
                className="link-warning log-link"
                onClick={handleLogOutClick} >Log out</a>
              </div>
            : <>
              <a href  
              className="link-primary log-link me-3"
              onClick={handleLogInClick} >Log in</a>
              <a href  
              className="link-success log-link" 
              onClick={handleSignUpClick} >Sign up</a>
            </>
          }
        <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>
                    {
                        signUp
                        ? 'Sign Up'
                        : 'Log In'
                    }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    {
                        signUp 
                        && <>
                        <div className="form-floating">
                            <input 
                            type="text" 
                            className="form-control w-100 mb-2" 
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={(event) => {
                                handleInputChange(event);
                                validateFN(event);
                            }}
                            placeholder="Stanisław">
                            </input>
                            <label htmlFor="firstName">
                                First name
                            </label>
                            {
                                FNwarning 
                                && <Alert className="valid-form-alert" variant={'warning'}>
                                    {FNwarning}
                                </Alert>
                            }
                        </div>
                        <div className="form-floating">
                            <input 
                            type="text" 
                            className="form-control w-100 mb-2" 
                            id="lastName"
                            name="lastName"
                            value={data.lastName}
                            onChange={(event) => {
                                handleInputChange(event);
                                validateLN(event);
                            }}
                            placeholder="Stankiewicz">
                            </input>
                            <label htmlFor="lastName">
                                Last name
                            </label>
                            {
                                LNwarning 
                                && <Alert className="valid-form-alert" variant={'warning'}>
                                    {LNwarning}
                                </Alert>
                            }
                        </div>
                        </>
                    }
                    <div className="form-floating">
                        <input 
                        type="text" 
                        className="form-control w-100 mb-2" 
                        id="username"
                        name="username"
                        value={data.username}
                        onChange={(event) => {
                                handleInputChange(event);
                                if (signUp) {
                                    validateUsername(event);
                                }
                            }}
                        placeholder="superUser123">
                        </input>
                        <label htmlFor="username">
                            Your username
                        </label>
                        {
                            usernameWarning && signUp
                            && <Alert className="valid-form-alert" variant={'warning'}>
                                {usernameWarning}
                            </Alert>
                        }
                    </div>
                    <div className="form-floating">
                        <input 
                        type="password" 
                        className="form-control w-100 mb-2" 
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(event) => {
                                handleInputChange(event);
                                if (signUp) {
                                    validatePassword(event);
                                }
                            }}
                        placeholder="gsrsklgnKknsf98rnsi">
                        </input>
                        <label htmlFor="password">
                            Password
                        </label>
                        {
                            passwordWarning && signUp
                            && <Alert className="valid-form-alert" variant={'warning'}>
                                {passwordWarning}
                            </Alert>
                        }
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-success"
                    disabled={
                        signUp
                        ? (!data.firstName || !data.lastName || !data.username || !data.password 
                        || FNwarning || LNwarning || usernameWarning || passwordWarning)
                        : (!data.username || !data.password)
                    }>
                    {
                        signUp
                        ? 'Sign Up'
                        : 'Log In'
                    }
                    </button>
                </Modal.Footer>
        </Modal>
        </div>
    )
}

const mapStateToProps = (state) => ({
    userData: state.user,
    jsonData: state.actualJson
});

export default connect(mapStateToProps)(SignUpLogin);