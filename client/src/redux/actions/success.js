const success = (successData) => {
    return {
        type: 'SUCCESS',
        payload: successData
    }
}

export { success };