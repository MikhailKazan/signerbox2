import React, { Component } from 'react';
import './App.css';
import FileSelect from './FileSelect';
import KeySelect from './KeySelect';
import Material from './Material';

import {makeMatches} from './match';
import save from './save';
import certfetch from './certfetch';

function fetchMissing(material) {
  const [key1, key2] = material.filter((file)=> (
    (file.type === 'Priv') && !file.match
  ));
  return key1 ? certfetch([key1, key2]) : Promise.reject();
}

const handler = {file: null, material: []};

const state = new Proxy({title: 'Podatok.signcrypt'}, handler);
class App extends Component {
  constructor(props) {
    super(props);
    handler.set = (target, key, value)=> {
      target[key] = value;
      this.forceUpdate();
      return true;
    };
  }

  handleFile(file) {
    state.file = file;
  }

  handleSign(signFn) {
    signFn(state.file.contents)
      .then((signedContents)=> save(signedContents, state.file.name + '.p7s'));
  }

  render() {
    return (
      <div className="App">
        {state.title}
        {state.file
          ? (<p>Signing file "{state.file.name}"</p>)
          : (<FileSelect onAdd={this.handleFile} />)}
        {state.file && (<KeySelect material={state.material} onAdd={this.handleAdd} onSign={this.handleSign} />)}
        <Material value={state.material} />
      </div>
    );
  }
}

export default App;
