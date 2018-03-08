import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Game } from './components/Game.js'

class App extends Component {

  render() {
    var gameStyle = {
        textAlign: "center",

        page: {
            width: "80vw",
            minHeight: "70vh",
            margin: "auto",
            border: "1px solid #000000",
            padding: 20
        }
    };

    return (
        <div>
            <h1 style={gameStyle}>Love letter</h1>

            <Router>
                <div style={gameStyle.page}>
                    <Link to="/">Ici</Link>

                    <Route exact path="/" component={Game} />
                </div>
            </Router>
        </div>
    );
  }
}

export default App;
