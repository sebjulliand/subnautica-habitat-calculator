import React, { Component } from 'react';
import { render } from 'react-dom';
import Calculator from './components/Calculator';
import './style.css';
import 'typeface-roboto';

import Button from '@material-ui/core/Button';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <Calculator />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
