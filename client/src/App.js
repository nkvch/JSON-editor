import React, { useEffect, useState } from 'react';
import { JsonService } from './services/JsonService';
import JsonView from './components/JsonView';
import JsonHTTPservice from './services/JsonHTTPservice.js';
import SignUpLogin from './components/SignUpLogin';
import SaveAndLoad from './components/SaveAndLoad';
import SearchForJson from './components/SearchForJson';
import { connect, useDispatch } from 'react-redux';
import { Transition } from 'react-transition-group';
import { resetUser, loadUser } from './redux/actions/userActions';
import { setJson, resetJson } from './redux/actions/actualJsonActions';
import LoadingComponent from './components/LoadingComponent';
import Alerts from './components/Alerts';
import './App.scss';
//import { disconnect } from 'mongoose';

function App(props) {

  const { jsonData, loading, errors } = props;

  const {
    name,
    JSONobject,
    fromDB
  } = jsonData;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {

  }, [errors.length])

  const setNewJson = (name, json, fromDB) => {
    const newJsonData = {
      name,
      JSONobject: json,
      fromDB
    }
    dispatch(setJson(newJsonData));
  }


  return (
    <div className="App position-relative container-fluid">
      {
        loading && <LoadingComponent />
      }
      <Alerts />
      <div className="row pt-4 px-5 bg-dark text-light justify-content-center align-items-center">
        <h2>JSON GUI editor</h2>
          <SignUpLogin />
      </div>
      <SearchForJson
        notifyParent={(name, newObj) => {
          setNewJson(name, newObj, false);
        }}
      />
      <SaveAndLoad 
      obj={JSONobject} 
      name={name}
      notifyParent={(name, newObj) => {
        setNewJson(name, newObj, true);
        }} 
      fromDB={fromDB}
        />
      <div className="row px-5 py-3">
        <JsonView obj={JSONobject} name={name} comma={false} notifyParent={(name, object) => setNewJson(name, object, fromDB)} show={true} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  jsonData: state.actualJson,
  userData: state.user,
  loading: state.loading,
  errors: state.errors,
});

export default connect(mapStateToProps)(App);
