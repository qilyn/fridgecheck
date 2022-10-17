import { add, formatDistance, parseISO } from 'date-fns';
import React from 'react';
import ReactDOM from 'react-dom/client';
import cachedPrediction from "./cached_prediction.json";
import configData from "./config.json";
import './index.css';
import { Departure, Prediction, Status } from './type';


interface DeparturesTableProps {
  now?: Date,
  prediction: Prediction,
}

class DeparturesTable extends React.Component<Prediction> {
  /**
   * Show the information related to a predicted departure from a stop.
   */
  state: DeparturesTableProps
  
  constructor(props) {
    super(props);
    this.state = {
      now: new Date(),
      prediction: props.prediction
    }
  }

  departureClass(now: Date, departure: Departure) {
    let classes = Array();
    // If more than an hour
    if (add(parseISO(departure.arrival.expected), {hours: 1})) {
      classes.push('far-away');
    }
    if (departure.status === Status.CANCELLED) {
      classes.push('cancelled')
    }
    return classes
  }

  formatPrediction(now: Date, prediction: Prediction) {
    let departures = Array();
    
    prediction.departures.forEach((departure) => {
      // Parse the incoming dates into date-fns
      let aimedAsDate = parseISO(departure.arrival.aimed);
      let expectedAsDate = parseISO(departure.arrival.expected);
      console.log("actual as date", aimedAsDate)
      console.log("expected as date", expectedAsDate)

      // Format as human-readable strings
      let aimedForHumans = (
        !isNaN(aimedAsDate.getTime()) ?
        formatDistance(aimedAsDate, now, {includeSeconds: true}) :
        undefined
      );
      let expectededForHumans = (
        !isNaN(expectedAsDate.getTime()) ?
        formatDistance(expectedAsDate, now, {includeSeconds: true}) :
        undefined
      );
      console.log("actual as for humans", aimedForHumans)
      console.log("expected as for humans", expectededForHumans)

      departures.push(
        <tr 
          className={this.departureClass(now, departure)}
          key={departure.stop_id + departure.service_id + departure.arrival.aimed}
        >
          <td className="destination-name"><b>{ departure.destination.name }</b> ({ departure.destination.stop_id })</td>
          <td className="aimed-for-time">{ aimedForHumans }</td>
          <td className="expected-for-time">
            { expectededForHumans }
          </td>
          <td className="status">{ departure.status }</td>
        </tr>
      );
    });

    return departures
  }

  render() {
    let now = new Date();
    let departures = new Array();

    if (this.state.prediction && this.state.prediction.departures) {
      departures = this.formatPrediction(now, this.state.prediction);
    }

    return (
      <table>
        <tbody>
          <tr>
              <th>Upcoming departures</th>
          </tr>
          <tr>
            <td colSpan="2">
              { this.state.prediction.farezone }
            </td>
            <td>
              { this.state.prediction.closed }
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>To</td>
                    <td>Timetable arrival</td>
                    <td>Estimated arrival</td>
                    <td>Status</td>
                  </tr>
                  { departures }
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
};


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
