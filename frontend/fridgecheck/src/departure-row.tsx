import './App.css'
import type {Departure} from './types'


function prettyDate(str) {
  if (str) {
    return new Date(str).toLocaleTimeString();
  }
}

function DepartureRow({departure}) {
  console.log('row', departure);
  const serviceHasStarted = departure.status !== null;
  console.log(departure.arrival, departure.departure, departure.destination

  )
  // FIXME put this somewhere useful
  const now = new Date(); 
  const lookAheadHours = 2;
  const lookAheadTime = now.getTime() + (lookAheadHours*60*60*1000);
  let departsSoon = false;
  
  if (departure.arrival && departure.arrival.aimed !== null) {
    const schedule = new Date(departure.arrival.aimed);
    if (departure.arrival && schedule.getTime() < lookAheadTime) {
      departsSoon = true;
    }
  }

  if (departure.aimed && new Date(departure.aimed).getTime() < lookAheadTime) {
    departsSoon = true;
  }

  if (!departsSoon) {
    return (
      <><tr><td></td><td></td><td></td><td></td><td></td></tr></>
    )
  }

  return (
    <>
      <tr>
          <td>
            <img src="/static/train.svg" />
            { departure.destination &&
              <span>
                <b>{ departure.destination.name || '' }</b> ({ departure.destination.stop_id })
              </span>
            }
          </td>
          <td>{ departure.arrival &&
            <span>
              { prettyDate(departure.arrival.aimed) }
            </span>}
          </td>
          <td>
            {departure.arrival && 
              <span>
                { prettyDate(departure.arrival.expected) }
              </span>
            }
          </td>
          {/* {# <td>{{ departure.delay }}</td> #} */}
          {/* {# <td>{{ departure.vehicle_id }}</td> #} */}
          <td>{ serviceHasStarted }</td>
      </tr>
      {/* } */}
    </>
)}

export default DepartureRow
