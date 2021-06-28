const setLoading = () => {
    return {
        type: 'SET_LOADING'
    }
};

const resetLoading = () => {
    return {
        type: 'RESET_LOADING'
    }
}

export { setLoading, resetLoading };