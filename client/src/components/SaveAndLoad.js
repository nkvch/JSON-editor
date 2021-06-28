import React, { useEffect, useState } from 'react';
import JsonHTTPservice from '../services/JsonHTTPservice.js';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { loadJsons, saveJson, updateJson } from '../redux/actions/savedJsons.js';
import { success } from '../redux/actions/success.js';
import { error } from '../redux/actions/error.js';


const SaveAndLoad = (props) => {

    const {
        obj,
        name,
        notifyParent, 
        fromDB,
        userData,
        token,
        savedJsons
    } = props;

    const [mongoId, setMongoId] = useState(null);
    const [showNameInput, setShowNameInput] = useState(false);
    const [jsonName, setJsonName] = useState(name);

    const [jsonFile, setJsonFile] = useState(new Blob([JSON.stringify(obj)], { type: "application/json"}));

    const [successAlert, setSuccessAlert] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
      if (!fromDB) {
          setMongoId(null);
      }
    }, [fromDB]);

    useEffect(() => {
      console.log(userData);
      if (userData) {
        dispatch(loadJsons());
      }
    }, [userData]);

    useEffect(() => {
      setJsonName(name);
      setJsonFile(new Blob([JSON.stringify(obj)], { type: "application/json"}));
    }, [obj]);

    const save = async() => {
        try {
            const res = fromDB ? await JsonHTTPservice.updateJson({
              name: jsonName,
              JSONobject: obj
            }, mongoId, userData._id, token) : await JsonHTTPservice.post({
              name: jsonName,
              JSONobject: obj
            }, userData._id, token);

            if (!fromDB) {
              setMongoId(res.data.jsonId);
              dispatch(saveJson({
                name: jsonName,
                _id: res.data.jsonId
              }))
            } else {
              dispatch(updateJson({
                name: jsonName,
                _id: mongoId
              }))
            }
            dispatch(success(res));
            setShowNameInput(false);
            notifyParent(jsonName, obj);
        } catch (e) {
            console.error(e);
        }  
    }


    const chooseFromSaved = async (_id) => {
        try {
          const res = await JsonHTTPservice.getById(_id, userData._id, token);
          const chosenObj = res.data.json.JSONobject;
          const nameOfChosen = res.data.json.name;
          console.log(chosenObj);
          dispatch(success(res));
          setMongoId(res.data.json._id);
          notifyParent(nameOfChosen, chosenObj);
          setJsonName(nameOfChosen);
        } catch (e) {
          dispatch(error(e));
          console.error(e);
        }
    }

    const handleInputChange = (event) => {
      setJsonName(event.target.value);
    }

    const handleCloseModal = () => {
      setShowNameInput(false);
    }

    return (
        <div className="row py-3 px-5 bg-light position-relative">
          {
            successAlert
            && <div className="pt-4 px-5 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
            <div className="alert alert-success">
              {successAlert}
            </div>
            </div>
          }
          {
            !userData
            && <div className="position-absolute button-cover buttons-auth-cover">
                <p>Log in to be able to save and load your JSONs from application</p>
                </div>
          }
          {
            userData && savedJsons.length === 0
            && <div className="position-absolute button-cover no-saved-cover">
                <p>Have no saved JSONs yet</p>
                </div>
          }
        <Modal show={showNameInput} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Name your JSON</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-floating">
                  <input 
                  type="text" 
                  className="form-control" 
                  id="name"
                  name="name"
                  value={jsonName}
                  onChange={handleInputChange}
                  placeholder="superJson">
                  </input>
                  <label htmlFor="name">
                      Name
                  </label>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
            className="btn btn-success"
            type="btn"
            onClick={save}>
              Save
            </button>
          </Modal.Footer>
        </Modal>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <a 
          className={`btn btn-success my-2 ${Object.keys(obj).length === 0 ? 'disabled' : ''}`} 
          href={URL.createObjectURL(jsonFile)} 
          download={`${jsonName || Object.keys(obj)[0]}.json`}>Download JSON</a>
        </div>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <button 
          type="button" 
          className="btn btn-success my-2" 
          onClick={() => setShowNameInput(true)} 
          disabled={!userData || Object.keys(obj).length === 0}>Save</button>
        </div>
        <div className="col-sm d-flex flex-column justify-content-center align-items-center">
          <div className="dropdown">
            <button 
            className="btn btn-secondary my-2 dropdown-toggle" 
            type="button" 
            id="dropdownMenuButton1" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
            disable={!userData || savedJsons.length === 0}>
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
    )
}

const mapStateToProps = (state) => ({
  userData: state.user,
  token: state.token,
  savedJsons: state.savedJsons
});

export default connect(mapStateToProps)(SaveAndLoad);