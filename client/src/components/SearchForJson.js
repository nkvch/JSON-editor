import React, { useState } from 'react';
import { JsonService } from '../services/JsonService';
import { useDispatch } from 'react-redux';
import { error } from '../redux/actions/error';
import { success } from '../redux/actions/success';


const SearchForJson = (props) => {

    const { notifyParent } = props;
    const [url, setUrl] = useState('');

    const dispatch = useDispatch();

    const fetching = async(url) => {
        try {
            const res = await fetch(url);
            if (res.status !== 200) {
                dispatch(error(res));
                return '';
            }
            dispatch(success(res));
            let rawData;
            if (/\.json$/.test(res.url)) {
            rawData = await res.json();
            } else {
            rawData = await res.text()
            }
            return rawData;
        } catch (e) {
            dispatch(error(e));
            return '';
        }
    }
    
    const handleUrlChange = (event) => {
        const value = event.target.value;
        setUrl(value);
    }

    const handleSearch = async() => {
        const rawData = await fetching(url);
        const foundJson = typeof rawData === 'object' 
        ? Array.isArray(rawData)
        ? { array: rawData }
        : rawData
        : JsonService.findJson(rawData, 0);
        if (foundJson) {
          notifyParent('foundJson', foundJson);
        } 
    }

    const handleJsonChoose = (event) => {
        event.preventDefault();
        const file = event.target.files[0]
        const reader = new FileReader();
        reader.readAsText(new Blob([file]));
        try {
          reader.onload = function(evt) {
            const object = JSON.parse(evt.target.result);
            notifyParent('uploadedJson', object);
            //simulation of server response just to make it simplier and handle all errors and successes same way
            dispatch(success({
              status: 200,
              data: {
                msg: 'Uploaded JSON successfully'
              }
            }));
          }; 
        } catch (e) {
            dispatch(error(e));
        }
      }

    return (
      <div className="row pt-4 px-5 bg-dark text-light">
        <div className="col-sm d-flex flex-column justify-content-center align-items-center position-relative">
          <h4>Search for JSON globally</h4>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <input 
            type="text" 
            name="url" 
            id="url" 
            className="form-control me-2" 
            placeholder="URL to search for JSON" 
            onChange={handleUrlChange}></input>
            <button 
            type="button" 
            onClick={handleSearch} 
            className="btn btn-primary" 
            disabled={!url}>Search</button>
          </div>
        </div>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <h4>OR load JSON from your computer</h4>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <input
            className="form-control"
            type="file"
            id="upload"
            name="upload"
            accept="application/json"
            onChange={handleJsonChoose}
            ></input>
          </div>
        </div>
      </div>
    )
}

export default SearchForJson;