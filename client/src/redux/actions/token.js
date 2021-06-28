const setToken = (token) => {
    return {
        type: 'SET_TOKEN',
        payload: token
    }
}

const resetToken = () => {
    return {
        type: 'RESET_TOKEN'
    }
}

export { setToken, resetToken };