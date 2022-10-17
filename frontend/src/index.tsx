import { formatDistanceToNow, parseISO } from 'date-fns';
import React from 'react';
import ReactDOM from 'react-dom/client';
import cachedPrediction from "./cached_prediction.json";
import configData from "./config.json";
import './index.css';


class DeparturesTable extends React.Component {
  /**
   * Show the information related to a predicted departure from a stop.
   */
    constructor(props) {
      super(props);
      this.state = {
        now: new Date(),
        departure: props.departure};
    }

    render() {
      let departures = []
      let now = new Date();

      if (this.state.departure) {
        this.state.departure.departures.forEach((prediction) => {
          // Parse the incoming dates into date-fns
          let aimedAsDate = parseISO(prediction.arrival.aimed);
          let expectedAsDate = parseISO(prediction.arrival.expected);
          console.log("actual as date", aimedAsDate)
          console.log("expected as date", expectedAsDate)

          // Format as human-readable strings
          let aimedForHumans = (
            !isNaN(aimedAsDate.getTime()) ?
            formatDistanceToNow(aimedAsDate, now, {includeSeconds: true}) :
            undefined
          );
          let expectededForHumans = (
            !isNaN(expectedAsDate.getTime()) ?
            formatDistanceToNow(expectedAsDate, now, {includeSeconds: true}) :
            undefined
          );
          console.log("actual as for humans", aimedForHumans)
          console.log("expected as for humans", expectededForHumans)

          departures.push(
            <tr key={prediction.stop_id + prediction.service_id + prediction.arrival.aimed}>
              <td><b>{ prediction.destination.name }</b> ({ prediction.destination.stop_id })</td>
              <td>{ aimedForHumans }</td>
              <td>
                { expectededForHumans }
              </td>
              <td>{ prediction.status }</td>
            </tr>
         );
        });
      }

      return (
        <table>
          <tbody>
            <tr>
                <th>Upcoming departures</th>
            </tr>
            <tr>
              <td colSpan="2">
                { this.state.departure.farezone }
              </td>
              <td>
                { this.state.departure.closed }
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
  
  class App extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        stop: 5510,
        fromFile: props.fromFile,
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
        this.state.departures = cachedPrediction;
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
        this.state.departures = data;
      } catch(e) {
        console.error(e.toString());
      }
    }

    render() {
      return (
        <div className="game">
          {/* <input type="text" value={search} onChange={onInputChange}/> */}
          <div className="game-board">
            <DeparturesTable departure={this.state.departures} />
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App fromFile={true}/>);
  