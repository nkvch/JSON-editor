const token = (state = null, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            //localStorage.setItem('token', action.payload);
            return action.payload;
        case 'RESET_TOKEN':
            //localStorage.removeItem('token');
            return null;
        default:
            return state;
    }
}

export default token;