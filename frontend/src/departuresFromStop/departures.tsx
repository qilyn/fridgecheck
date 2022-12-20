import { add, format, formatDistance, parseISO } from 'date-fns';
import React from 'react';
import '../index.css';
import type { Departure, Prediction, Recommendation } from '../type';
import { RideOption, Status } from '../type.tsx';


interface State {
  now: Date,
  prediction: Prediction,
  ride: RideOption,
}


interface Props {
  prediction: Prediction,
  ride: RideOption,
}

function clonePrediction(prediction) {
  let copiedPrediction = { ...prediction};
  copiedPrediction.departures = [...prediction.departures];
  return copiedPrediction as Prediction
}


class DeparturesTable extends React.Component<Props, State> {
  /**
   * Show the information related to a predicted departure from a stop.
   */
  // filterStops = ["7750"]
  // filterTrips = ["27"]
  
  constructor(props: Props) {
    super(props);

    this.state = {
      now: new Date(),
      // prediction does get mutated! don't forget to take a copy!
      prediction: clonePrediction(props.prediction),
      ride: props.ride,
    }
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
      return (
        nextProps.prediction !== this.props.prediction ||
        nextProps.ride !== this.props.ride
      );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.prediction !== this.props.prediction || prevProps.ride !== this.props.ride) {
      this.setState((prevState) => {
        const newState = {...prevState};
        newState.prediction = clonePrediction(this.props.prediction);
        newState.ride = this.props.ride;
        return newState;
      })
    }
  }

  departureClass(now: Date, departure: Departure) {
    let classes: string[]  = [];
    // If more than an hour
    if (add(parseISO(departure.arrival.expected), {hours: 1})) {
      classes.push('far-away');
    }
    classes.push(departure.status)
    return classes.join(' ')
  }

  formatPrediction(now: Date, prediction: Prediction) {
    let departures: any[] = [];
    
    
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
    if (!prediction || !prediction.departures) {
      return;
    }
    console.log(prediction.departures.length, this.state.ride.trip);
    prediction.departures = prediction.departures.filter((departure: Departure) => {
      return departure.service_id === this.state.ride.trip
    });
    console.log(prediction.departures.length, this.state.ride.trip);
  }

  findFutureCancellations(prediction: Prediction) {
    let futureCancellations: Recommendation[] = [];

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
        <div key={r.departure.arrival.aimed}>
          <div>{ cancelledTime } was cancelled.</div>
          {earlierTime && laterTime && <div>
            Either go earlier on the <b>{ earlierTime }</b>, or later ({ laterTime }).
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
    let departures: any[] = [];
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
              <th colSpan="4">Upcoming departures</th>
          </tr>
          { cancellations && <tr>
            <th colSpan="4" className="cancellations">
              Cancellations
              { cancellations}
            </th>
          </tr> }
          <tr>
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