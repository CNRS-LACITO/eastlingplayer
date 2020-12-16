import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-translated';
import translation from './translation';



var lang = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape('lang').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));	
lang = (lang.length > 0) ? lang : 'fr';

ReactDOM.render(
  <React.StrictMode>
    <Provider language={lang} translation={translation}>
    	<App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
