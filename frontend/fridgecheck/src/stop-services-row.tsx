import './App.css'
import DepartureRow from './departure-row'
import type {Stop} from './types'


function StopServicesRow({stop}) {
  console.log('stop', stop.departures)
  return (
    <>{stop && stop.departures &&
      <tr>
          <td colSpan="2">
              { stop.farezone } // <b>{stop.departures[0].stop_id}</b>
              {stop.closed && <b>CLOSED</b> }
          </td>
          <td>
              <table>
                  <tr>
                      <th>To</th>
                      <th>Timetable arrival</th>
                      <th>Estimated arrival</th>
                      <th>Status</th>
                  </tr>
                  {stop.departures.map((departure) => (
                    departure && <DepartureRow departure={departure} />
                  ))}
              </table>
          </td>
      </tr>
    }
    </>
  )
}

export default StopServicesRow
