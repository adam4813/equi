import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App, { TEST_UI_NAME } from "./App";
import * as serviceWorker from "./serviceWorker";
import SIDLProvider from "context/sidlContext";
import FilesProvider from "./context/fileContext";

ReactDOM.render(
  <SIDLProvider uiName={TEST_UI_NAME}>
    <FilesProvider uiName={TEST_UI_NAME}>
      <App />
    </FilesProvider>
  </SIDLProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
