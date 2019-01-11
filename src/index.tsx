import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

async function startApp() {
	ReactDOM.render(<App />, document.getElementById("root"));
}

startApp();
