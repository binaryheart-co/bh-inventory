import React from 'react';
import ReactDOM from 'react-dom';

import "./theme.scss";
import App from "./App";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faEnvelope, faLock, faAngleDoubleLeft, faTasks, faBoxOpen, faAngleDown, faGlasses} from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faLock, faAngleDoubleLeft, faTasks, faBoxOpen, faAngleDown, faGlasses);

ReactDOM.render(
    <App/>
    , document.getElementById('root')
);
