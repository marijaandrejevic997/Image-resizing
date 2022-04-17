import React, { Component, useRef } from 'react';
import './App.css';

import FilesUploadComponent from './FilesUploadComponent';

class App extends Component {
 
  constructor(props) {
    super(props);
  }

  render() {
    return (
     <div className="App">
       <FilesUploadComponent/>
     </div>
    );
  }
}

export default App;
