import GoogleFontLoader from 'react-google-font-loader';
import axios from "axios";
import { useState, useEffect } from "react";
import './App.scss';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadNewData();
  }, []);

  const loadNewData = () => {
    const tokenAddress = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE';
    const limit = '10';
    const baseURL = `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&offset=0&limit=${limit}`;

    axios.get(baseURL).then(response => {
      console.log('response', response);
    })
  }

  return (
    <>
      <GoogleFontLoader
        fonts={[
          {
            font: 'Roboto Mono',
            weights: [400, 700],
          },
        ]}
        subsets={['latin-ext']}
      />
      <div className="app">

      </div>
    </>
  );
}

export default App;
