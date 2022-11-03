import { add, format, formatDistance, parseISO } from 'date-fns';
import React from 'react';
import '../index.css';
import type { Departure, Prediction, Recommendation } from '../type';
import { Status } from '../type.tsx';
import { DeparturesTableProps } from './types';

  
class DeparturesTable extends React.Component<Prediction> {
  /**
   * Show the information related to a predicted departure from a stop.
   */
  state: DeparturesTableProps
  filterStops = ["7730"]
  filterTrips = ["27"]
  
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
    classes.push(departure.status)
    return classes.join(' ')
  }

  formatPrediction(now: Date, prediction: Prediction) {
    let departures = Array();
    
    prediction.departures.forEach((departure) => {
      // Parse the incoming dates into date-fns
      let aimedAsDate = parseISO(departure.arrival.aimed);
      let expectedAsDate = parseISO(departure.arrival.expected);

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

      departures.push(
        <tr 
          className={this.departureClass(now, departure)}
          key={departure.stop_id + departure.service_id + departure.arrival.aimed}
        >
          <td className="destination-name"><b>{ departure.destination.name }</b></td>
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

  filterPredictionDepartures(prediction: Prediction) {
    if (this.filterStops) {
      prediction.departures = prediction.departures.filter((departure: Departure) => {
        console.log(departure.trip_id)
        return departure.trip_id.slice(0, 4) === "27__"
      })
    }
  }

  findFutureCancellations(prediction: Prediction) {
    let futureCancellations = new Array();

    for (var i = 0; i < prediction.departures.length; i ++) {
      let departure = prediction.departures[i];
      if (departure.status === Status.CANCELLED) {
        let recommendation : Recommendation = {
          departure: departure,
          earlierDeparture: prediction.departures.slice(0, i).reverse().find((d) => d.status !== Status.CANCELLED),
          nextDeparture: prediction.departures.slice(i, prediction.departures.length).find((d) => d.status !== Status.CANCELLED),
        } ;
        futureCancellations.push(recommendation);
      }
    }

    return futureCancellations
  }

  formatCancellations(cancellations: Recommendation[]) {
    return cancellations.map(
      (r) => {
        let cancelledTime = format(parseISO(r.departure.arrival.aimed), 'h:mma');
        let earlierTime = (
          r.earlierDeparture ? format(parseISO(r.earlierDeparture.arrival.aimed), 'h:mma') : null
        );
        let laterTime = (
          r.nextDeparture ? format(parseISO(r.nextDeparture.arrival.aimed), 'h:mma') : null
        )
      return (
        <div key="r.departure.arrival.aimed">
          <div>{ cancelledTime } was cancelled.</div>
          {earlierTime && laterTime && <div>
            You could <b>go earlier</b> to catch the { earlierTime }, or catch the later { laterTime };
          </div>}
          {!earlierTime && laterTime && <div>
            The next one is at <b>{ laterTime }</b>
          </div>
          }
          {earlierTime && !laterTime && <div>
            You have to catch the earlier <b>{earlierTime}</b>: there is no later bus.
          </div>}
        </div>
      )
    });
  }

  render() {
    let now = new Date();
    let departures = new Array();
    let cancellations;

    if (this.state.prediction && this.state.prediction.departures) {
      this.filterPredictionDepartures(this.state.prediction);
      cancellations = this.findFutureCancellations(this.state.prediction);
      cancellations = this.formatCancellations(cancellations)
      departures = this.formatPrediction(now, this.state.prediction);
    }

    return (
      <table>
        <tbody>
          <tr>
              <th colSpan="5">Upcoming departures</th>
          </tr>
          { cancellations && <tr>
            <th colSpan="5" className="cancellations">
              Cancellations
              { cancellations}
            </th>
          </tr> }
          <tr>
            <td colSpan="1">
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

export { DeparturesTable };
