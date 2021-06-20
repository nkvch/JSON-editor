import React, { useState } from 'react';
import { JsonService } from './services/JsonService';
import JsonView from './components/JsonView';
import HTTPservice from './services/HTTPservice.js';
import './App.css';

function App() {

  const [obj, setObj] = useState({});

  const fetching = async(url) => {
    const res = await fetch(url);
    const rawData = await res.text();
    return rawData;
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    const searchingFor = event.target[0].value;
    const rawData = await fetching(searchingFor);
    const foundJson = JsonService.findJson(rawData, 0);
    console.log(foundJson);
    setObj(foundJson);
  }
  
  const save = async() => {
    try {
        const res = await HTTPservice.post(obj);
        console.log(res);
    } catch (e) {
        console.error(e);
    }  
  }

  const setModifiedJson = (name, modified) => {
    setObj(modified);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="row mt-5">
        <div className="col-sm-4">
          <label for="url">Where is JSON?</label>
        </div>
        <div className="col-sm-4">
          <input type="text" name="url" id="url" className="form-control" placeholder="Paste here url to search for JSON"></input>
        </div>
        <div className="col-sm-4">
          <button className="btn btn-success">There</button>
        </div>
        <button type="button" className="btn btn-primary" onClick={save}>Save</button>
      </form>
      <JsonView obj={obj} name="JSON" comma={false} notifyParent={setModifiedJson} />
    </div>
  );
}

export default App;
