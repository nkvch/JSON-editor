const loading = (state = false, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return true;
        case 'RESET_LOADING':
            return false;
        default:
            return state;
    }
}

export default loading;