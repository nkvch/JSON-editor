const initialJson = {
    JSONobject: {},
    name: 'myJson',
    fromDB: false,
}

const actualJson = (state = initialJson, action) => {
    switch (action.type) {
        case 'SET_JSON':
            return action.payload;
        case 'RESET_JSON':
            return initialJson;
        default:
            return state;
    }
}

export default actualJson;