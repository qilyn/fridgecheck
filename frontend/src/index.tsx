import React from 'react';
import ReactDOM from 'react-dom/client';
import cachedPrediction from "./cached_prediction.json";
import configData from "./config.json";
import { DeparturesTable } from './departuresFromStop/departures.tsx';
import './index.css';
import type { Prediction } from './type';


// TODO: show all times as relative. hover to show actual time?

interface AppProps {
  stop: number,
  prediction?: Prediction,
  fromFile: boolean
}


class App extends React.Component<AppProps> {
  state: AppProps

  constructor (props) {
    super(props);
    this.state = {
      stop: 5510,
      fromFile: props.fromFile || false,
    }
    this.getPredictions()
  }
  
  getDepartures() {
    console.log(configData.API_KEY);
  }

  async getPredictions() {
    if (!this.state.stop) {
      console.error('No stop set')
      return;
    }

    if (this.state.fromFile) {
      console.log(cachedPrediction)
      this.state.prediction = cachedPrediction as Prediction;
      return;
    }

    try {
      var response = await fetch(
        configData.PREDICTIONS + this.state.stop,
        {
          headers: {
            "x-api-key": configData.API_KEY
          }
        }
      );
      const data = await response.json();
      this.state.prediction = data;
    } catch(e) {
      console.error(e.toString());
    }
  }

  render() {
    return (
      <div className="game">
        {/* <input type="text" value={search} onChange={onInputChange}/> */}
        <div className="game-board">
          <DeparturesTable prediction={this.state.prediction} />
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App stop="5510" fromFile={true}/>);
