import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; // Install with npm install axios


function DepartureRow() {
  const [services, setServices] = useState([]);
  const serviceHasStarted = service.status !== null;
  const departureInFuture = new Date();


  return (
    <>
      <tr *if departure.status or (departure.arrival.expected and departure.arrival.expected < max_departure_time) %}
                  <tr>
                      <td><img src="{{ url_for('static', filename='train.svg') }}" /><b>{{ departure.destination.name }}</b> ({{ departure.destination.stop_id }})</td>
                      <td>{{ departure.arrival.aimed.strftime('%H:%M') }}</td>
                      <td>
                          {% if departure.arrival.expected %}
                              {{ departure.arrival.expected.strftime('%H:%M:%S')|default('=', true) }}
                          {% else %}
                              -
                          {% endif %}
                      </td>
                      {# <td>{{ departure.delay }}</td> #}
                      {# <td>{{ departure.vehicle_id }}</td> #}
                      <td>{{ departure.status }}</td>
                  </tr>
                  {% endif %}
    </>
  )
}

export default StopServicesRow
