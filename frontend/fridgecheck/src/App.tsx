import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; // Install with npm install axios
import StopServicesRow from './stop-services-row';


function App() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/stops')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <>
    <head>
        <title>@fridgecheck</title>
        <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}" />
    </head>
    <body>
        <div class="container">
            <table>
                <tr>
                    <th>stops</th>
                    {
                      data.map((stops_services) => (
                        <StopServicesRow stops={stops_services} />
                      ))
                    }
                </tr>
            </table>
        </div>
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
