
const user = (state = null, action) => {
    switch (action.type) {
        case 'SET_USER':
            //localStorage.setItem('token', action.payload.token);
            return action.payload;
        case 'RESET_USER':
            return null;
        default:
            return state;
    }
}

export default user;