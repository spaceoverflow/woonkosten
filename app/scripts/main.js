console.log("ayy lmao");

var React = require('react');
var ReactDOM = require('react-dom');
var Woonlasten = require('../components/Woonlasten/Woonlasten.jsx');

ReactDOM.render(React.createElement(Woonlasten,{}),
  document.getElementById('mount-point')
);
