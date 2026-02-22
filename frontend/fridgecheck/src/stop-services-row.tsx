import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; // Install with npm install axios


function StopServicesRow() {
  const [stops, setStops] = useState([]);
  
  // useEffect(() => {
  //   axios.get('127.0.0.1:5000/stops')
  //     .then((response) => {
  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the data!", error);
  //     });
  // }, []);

  return (
    <>
      <tr>
          <td colspan="2">
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
                  {stop.departures.forEach((departure) => (
                    <DepartureRow departure={departure} />
                  ))}
              </table>
          </td>
      </tr>
    </>
  )
}

export default StopServicesRow
