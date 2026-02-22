import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; // Install with npm install axios
import StopServicesRow from './stop-services-row';
import type { Stop } from './types';


function App() {
  const [data, setData] = useState<Stop[]>([]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/stops')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  console.log(data)

  return  (
    <>
    <head>
        <title>@fridgecheck</title>
        {/* <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}" /> */}
    </head>
    <body>
      {data && <div class="container">
        <table>
          <thead>
            <tr>
              <th>stops</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stops_services, index) => (
                <StopServicesRow stop={stops_services} />
              ))
            }
          </tbody>
        </table>
      </div>}
    </body>
    
    <footer>
        <div>
            Icon sets by <a href="https://icon-sets.iconify.design/mdi/?icon-filter=train" target="_blank">Iconify</a>
        </div>
    </footer>
    </>
  )
}

export default App
