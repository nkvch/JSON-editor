const errors = (state = [], action) => {
    switch (action.type) {
        case 'ERROR':
            return state.concat(action.payload);
        default:
            return state;
    }
}

export default errors;