import GoogleFontLoader from 'react-google-font-loader';
import axios from "axios";
import { useState, useEffect } from "react";

import Owner from './Owner';
import './App.scss';

const App = () => {
  const tokenAddress = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE';
  const [holders, setHolders] = useState(null);

  useEffect(() => {
    loadNewData();
  }, []);

  const loadNewData = () => {
    const limit = '30';
    const baseURL = `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&offset=0&limit=${limit}`;

    axios.get(baseURL).then(response => {
      console.log('response', response);
      setHolders(response.data.data);
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
        <h1>{tokenAddress} (token address)</h1>
        {holders && <div className='holders'>
          {holders.map(holder => (
            <Owner key={holder.rank} holderData={holder} />
          ))}
        </div>}
      </div>
    </>
  );
}

export default App;
