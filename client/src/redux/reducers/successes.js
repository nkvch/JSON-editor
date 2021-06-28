const successes = (state = [], action) => {
    switch (action.type) {
        case 'SUCCESS':
            return state.concat(action.payload);
        default:
            return state;
    }
}

export default successes;