
import axios from "axios";
import React from 'react';
import ReactDOM from 'react-dom/client';
import cached5510 from './cached_predictions/5510.json';
import cached7724 from './cached_predictions/7724.json';
import cached7750 from './cached_predictions/7750.json';
import configData from "./config.json";
import { DeparturesTable } from './departuresFromStop/departures.tsx';
import './index.css';
import type { Prediction, PredictionAndRide, RideOption } from './type';

// var requirejs = require('requirejs');

// TODO: show all times as relative. hover to show actual time?

interface AppProps {
  fromFile: boolean,
}

interface AppState {
  searchForStop: string,
  rideFromStop: string | null,
  availableStops: Array<RideOption>,
  fromFile: boolean,
  prediction: Prediction | null,
  disableStops: boolean,
}


class App extends React.Component<AppProps, AppState> {

  state: AppState;
  
  RIDE = {
    "5510": {"name": "Going home", "stop": "5510", "trip": "27", data: cached5510} as RideOption,
    "7750": {"name": "Going to work - McColl", "stop": "7750", "trip": "27", data: cached7750} as RideOption,
    "7724": {"name": "Going to work - Mills Rd", "stop": "7724", "trip": "7", data: cached7724} as RideOption,
  }

  constructor (props) {
    super(props);

    const stop = "7724";

    this.handleStopChange = this.handleStopChange.bind(this);
    
    this.state = {
      searchForStop: stop,
      rideFromStop: null,
      prediction: null,
      fromFile: props.fromFile || false,
      availableStops: [
        this.RIDE['5510'],
        this.RIDE['7750'],
        this.RIDE['7724'],
      ],
      disableStops: true,
    };
  }
  
  componentDidMount(): void {
    this.getPredictions();
  }

  componentDidUpdate() {
    // TODO: select stop via dropdown
  }

  handleUpdate() {

  }

  getPredictions() {
    // disableStops may be true if an error was encountered
    if (this.state.fromFile) {
      this.setState({
        rideFromStop: this.state.searchForStop,
        prediction: this.getRide().file as Prediction,
        disableStops: false,
      });
      return;
    }
    
    if (!this.state.searchForStop) {
      console.error('No stop set')
      return;
    }

    this.getMetlinkApi();
  }

  getMetlinkApi() {
    // disableStops may be true if an error was encountered
    try {
      axios.get(
        configData.PREDICTIONS + this.state.searchForStop,
        {
          headers: {
            "x-api-key": configData.API_KEY
          }
        }
      ).then(response => this.setState({ 
        rideFromStop: this.state.searchForStop, 
        prediction: response.data, 
        disableStops: false,
      }));
    } catch(e) {
      console.error(e.toString());
    }
  }

  getRide() {
    if (this.state.rideFromStop != null) {
      return this.RIDE[this.state.rideFromStop];
    }
  }

  hasPredictionAndRide() {
    return this.state.prediction !== null && this.state.rideFromStop !== null;
  }

  getPredictionAndRide() {
    return {
      prediction: this.state.prediction,
      ride: this.getRide(),
    } as PredictionAndRide
  }

  handleStopChange(e) {
    this.setState({
      rideFromStop: null,
      prediction: null,
      searchForStop: e.target.value,
      disableStops: true,
    }, () => this.getPredictions());
  }

  render() {
    let stopOptions = this.state.availableStops.map((stop) => {
      return (
        <option key={stop.stop} value={stop.stop}>{stop.trip} - {stop.name}</option>
      )
    });

    return (
      <div className="game">
        <div className="stop-select">
          <select value={this.state.rideFromStop} onChange={this.handleStopChange} disabled={this.state.disableStops}>
            { stopOptions }
          </select>
        </div>
        { this.hasPredictionAndRide() && (
          <div>
            <div className="game-board">
              { this.state && this.state.prediction && this.state.rideFromStop &&
                <DeparturesTable predictionAndRide={this.getPredictionAndRide()}/> }
            </div>
          </div>
        )}
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App fromFile={false}/>);
