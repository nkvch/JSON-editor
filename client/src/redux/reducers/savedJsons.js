const savedJsons = (state = [], action) => {
    switch (action.type) {
        case 'SET_JSONS':
            return action.payload;
        case 'SAVE_JSON':
            return state.concat(action.payload);
        case 'UPDATE_JSON':
            return state.map((json) => 
                json._id === action.payload._id ? action.payload : json
            );
        case 'RESET_JSONS':
            return [];
        default:
            return state;
    }
}

export { savedJsons };