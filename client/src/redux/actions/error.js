const error = (errorData) => {
    return {
        type: 'ERROR',
        payload: errorData
    }
}

export { error };