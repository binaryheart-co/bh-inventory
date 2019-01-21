import React from 'react';
import ReactDOM from 'react-dom';

import "./theme.scss";
import App from "./App";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faEnvelope, faLock, faAngleDoubleLeft} from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faLock, faAngleDoubleLeft);

ReactDOM.render(
    <App/>
    , document.getElementById('root')
);
