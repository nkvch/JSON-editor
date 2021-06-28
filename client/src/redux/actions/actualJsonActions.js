const setJson = (json) => {
    return {
        type: 'SET_JSON',
        payload: json
    }
}

const resetJson = () => {
    return {
        type: 'RESET_JSON'
    }
}

export { setJson, resetJson };