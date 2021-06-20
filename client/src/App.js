import React, { useState } from 'react';
import { JsonService } from './services/JsonService';
import JsonView from './components/JsonView';
import HTTPservice from './services/HTTPservice.js';
import './App.css';

function App() {

  const [url, setUrl] = useState('');
  const [obj, setObj] = useState({});
  const [jsonFile, setJsonFile] = useState(new Blob([JSON.stringify({})], { type: "application/json"}));
  const [savedJsons, setSavedJsons] = useState([]);
  const [fromDB, setFromDB] = useState(false);
  const [mongoId, setMongoId] = useState(null);
  const [uploadedJson, setUploadedJson] = useState(null);
  const [noneFound, setNoneFound] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [findSuccess, setFindSuccess] = useState(false);

  const fetching = async(url) => {
    const res = await fetch(url)
    .catch(e => {
      setNoneFound(true);
      setTimeout(() => {
        setNoneFound(false);
      }, 5000);
    });
    const rawData = res ? await res.text() : '';
    return rawData;
  }

  const handleUrlChange = (event) => {
    setNoneFound(false);
    const value = event.target.value;
    setUrl(value);
  }

  const handleSearch = async() => {
    const rawData = await fetching(url);
    const foundJson = JsonService.findJson(rawData, 0);
    console.log(foundJson);
    if (foundJson) {
      setObj(foundJson);
      setMongoId(null);
      setJsonFile(new Blob([JSON.stringify(foundJson)], { type: "application/json"}));
      setFromDB(false);
      setFindSuccess(true);
      setTimeout(() => {
        setFindSuccess(false);
      }, 5000);
    } else {
      setNoneFound(true);
      setTimeout(() => {
        setNoneFound(false);
      }, 5000);
    }
  }
  
  const save = async() => {
    try {
        const res = fromDB ? await HTTPservice.updateJson(obj, mongoId) : await HTTPservice.post(obj);
        console.log(res);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 5000);
    } catch (e) {
        console.error(e);
    }  
  }

  const setModifiedJson = (name, modified) => {
    setObj(modified);
    setJsonFile(new Blob([JSON.stringify(modified)], { type: "application/json"}));
  }

  const getSaved = async() => {
    try {
      const res = await HTTPservice.get();
      setSavedJsons(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  const chooseFromSaved = async (_id) => {
    try {
      const res = await HTTPservice.getById(_id);
      const chosenObj = res.data;
      setMongoId(res.data._id);
      delete chosenObj._id;
      setObj(chosenObj);
      setJsonFile(new Blob([JSON.stringify(chosenObj)], { type: "application/json"}));
      setFromDB(true);
    } catch (e) {
      console.error(e);
    }
  }

  const handleJsonUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsText(new Blob([file]));
    reader.onload = function(evt) {
      setUploadedJson(evt.target.result);
    };  
  }

  const parseUploadedJson = () => {
    const object = JSON.parse(uploadedJson);
    setObj(object);
    setMongoId(null);
    setJsonFile(new Blob([JSON.stringify(object)], { type: "application/json"}));
    setFromDB(false);
    setUploadedJson(null);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
    }, 5000);
  }

  return (
    <div>
      <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
        <h2>JSON GUI editor</h2>
      </div>
          {
            noneFound
            && <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
              <div className="alert alert-danger" role="alert">
                Nothing found on this URL or error occured while fetching
              </div>
            </div> 
          }
          {
            saveSuccess
            && <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
            <div className="alert alert-success">
              Saved to DataBase successfully
            </div>
            </div>
          }
          {
            uploadSuccess
            && <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
            <div className="alert alert-success">
              Uploaded JSON successfully
            </div>
            </div>
          }
          {
            findSuccess
            && <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
            <div className="alert alert-success">
              Found JSON successfully
            </div>
            </div>
          }
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
            type="file"
            id="upload"
            name="upload"
            accept="application/json"
            onChange={handleJsonUpload}
            ></input>
            <button 
            className="btn btn-outline-primary" 
            type="button" 
            onClick={parseUploadedJson} 
            disabled={!uploadedJson}>Upload</button>
          </div>
        </div>
      </div>
      <div className="row py-3 px-5 bg-light position-relative">
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <a 
          className={`btn btn-success ${Object.keys(obj).length === 0 ? 'disabled' : ''}`} 
          href={URL.createObjectURL(jsonFile)} 
          download={`${obj.name || Object.keys(obj)[0]}.json`}>Download JSON</a>
        </div>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <button 
          type="button" 
          className="btn btn-success" 
          onClick={save} 
          disabled={Object.keys(obj).length === 0}>Save remotely</button>
        </div>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <div className="dropdown">
            <button 
            className="btn btn-secondary dropdown-toggle" 
            onClick={getSaved} 
            type="button" 
            id="dropdownMenuButton1" 
            data-bs-toggle="dropdown" 
            aria-expanded="false">
              Saved JSONs
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              {
                savedJsons.map((saved, idx) => 
                  <li key={idx}>
                  <button 
                  onClick={() => chooseFromSaved(saved._id)} 
                  className="dropdown-item" 
                  type="button">{`${idx + 1}: ${saved.name || saved._id}`}</button></li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
      <div className="px-5 py-3">
        <JsonView obj={obj} name="JSON" comma={false} notifyParent={setModifiedJson} show={true} />
      </div>
    </div>
  );
}

export default App;
