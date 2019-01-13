import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "./store";

import "./theme.scss";
// import App from "./components/App/App";
import Login from './components/Login/Login';

import {library} from '@fortawesome/fontawesome-svg-core'
import {faEnvelope, faLock, faAngleDoubleLeft} from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faLock, faAngleDoubleLeft);

ReactDOM.render(
    <Provider store={configureStore()}>
        <Login/>
    </Provider>
    , document.getElementById('root')
);
