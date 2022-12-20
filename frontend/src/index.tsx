
import axios from "axios";
import React from 'react';
import ReactDOM from 'react-dom/client';
import cached5510 from './cached_predictions/5510.json';
import cached7724 from './cached_predictions/7724.json';
import cached7750 from './cached_predictions/7750.json';
import configData from "./config.json";
import { DeparturesTable } from './departuresFromStop/departures.tsx';
import './index.css';
import type { Prediction, RideOption } from './type';

// var requirejs = require('requirejs');

// TODO: show all times as relative. hover to show actual time?

interface AppProps {
  fromFile: boolean,
}

interface AppState {
  rideFromStop: string,
  availableStops: Array<RideOption>,
  fromFile: boolean,
  prediction?: Prediction,
  disableStops: boolean,
}

class App extends React.Component<AppProps, AppState> {

  state: AppState;
  
  RIDE = {
    "5510": {"name": "Going home", "stop": "5510", "trip": "27", file: cached5510} as RideOption,
    "7750": {"name": "Going to work - McColl", "stop": "7750", "trip": "27", file: cached7750} as RideOption,
    "7724": {"name": "Going to work - Mills Rd", "stop": "7724", "trip": "7", file: cached7724} as RideOption,
  }

  constructor (props) {
    super(props);

    this.handleStopChange = this.handleStopChange.bind(this);
    
    this.state = {
      rideFromStop: "7724",
      fromFile: props.fromFile || false,
      availableStops: [
        this.RIDE['5510'],
        this.RIDE['7750'],
        this.RIDE['7724'],
      ],
      disableStops: false,
    };
  }
  
  componentDidMount(): void {
    this.getPredictions();
  }

  componentDidUpdate() {
    // TODO: select stop via dropdown
  }

  getPredictions() {
    // disableStops may be true if an error was encountered
    if (this.state.fromFile) {
      this.setState({
        prediction: this.getRide().file as Prediction,
        disableStops: false,
      });
      return;
    }
    
    if (!this.state.rideFromStop) {
      console.error('No stop set')
      return;
    }

    this.getMetlinkApi();
  }

  getMetlinkApi() {
    // disableStops may be true if an error was encountered
    try {
      axios.get(
        configData.PREDICTIONS + this.state.rideFromStop,
        {
          headers: {
            "x-api-key": configData.API_KEY
          }
        }
      ).then(response => this.setState({ prediction: response.data, disableStops: false }));
    } catch(e) {
      console.error(e.toString());
    }
  }

  getRide() {
    return this.RIDE[this.state.rideFromStop];
  }

  handleStopChange(e) {
    console.log(this.state.rideFromStop, this.getRide().name)
    console.log(e.target.value, this.RIDE[e.target.value].name)
    this.setState({ rideFromStop: e.target.value, disableStops: true }, () => this.getPredictions());
  }

  render() {
    let stopOptions = this.state.availableStops.map((stop) => {
      return (
        <option key={stop.stop} value={stop.stop}>{stop.stop} - {stop.name}</option>
      )
    });

    return (
      <div className="game">
        <div className="stop-select">
          <select value={this.state.rideFromStop} onChange={this.handleStopChange} disabled={this.state.disableStops}>
            { stopOptions }
          </select>
        </div>
        {/* <input type="text" value={search} onChange={onInputChange}/> */}
        <div className="game-board">
          { this.state && this.state.prediction && this.state.rideFromStop &&
            <DeparturesTable prediction={this.state.prediction} ride={this.getRide()}/> }
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App fromFile={true}/>);
