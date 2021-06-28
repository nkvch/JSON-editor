import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from "redux-persist/integration/react";
import thunk from 'redux-thunk';
import reducers from './redux/reducers/combined';


const store = createStore(
  reducers,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<div>{'Loading'}</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

