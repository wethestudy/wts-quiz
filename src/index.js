import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store/store";
import './index.css';
import './assets/fonts/Heebo/Heebo-VariableFont_wght.ttf';
import App from './App';
import { MathJaxContext } from 'better-react-mathjax';

const root = ReactDOM.createRoot(document.getElementById('root-quiz'));
root.render(
    <MathJaxContext>
        <Provider store={store}>
            <App />
        </Provider>
    </MathJaxContext>
);
