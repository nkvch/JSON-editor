import JsonHTTPservice from "../../services/JsonHTTPservice"

const setJsons = (jsonArray) => {
    return {
        type: 'SET_JSONS',
        payload: jsonArray
    }
}

const saveJson = (jsonData) => {
    return {
        type: 'SAVE_JSON',
        payload: jsonData
    }
}

const updateJson = (updated) => {
    return {
        type: 'UPDATE_JSON',
        payload: updated
    }
}

const resetJsons = () => {
    return {
        type: 'RESET_JSONS'
    }
}

const loadJsons = () => async (dispatch, getState) => {
    try {
        const userId = getState().user._id;
        const token = getState().token;
        const res = await JsonHTTPservice.getUsersJsons(userId, token);
        dispatch(setJsons(res.data));
      } catch (e) {
        console.error(e);
      }
}

export { loadJsons, saveJson, updateJson, resetJsons };