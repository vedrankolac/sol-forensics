import GoogleFontLoader from 'react-google-font-loader';
import axios from "axios";
import { useState, useEffect } from "react";

import Owner from './Owner';
import './App.scss';

const App = () => {
  const InitTokenAddress = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE';
  const [holders, setHolders] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);

  useEffect(() => {
    setTokenAddress(InitTokenAddress);
    loadNewData(InitTokenAddress);
  }, []);

  const loadNewData = newTokenAddress => {
    const limit = '30';
    const baseURL = `https://public-api.solscan.io/token/holders?tokenAddress=${newTokenAddress}&offset=0&limit=${limit}`;

    axios.get(baseURL).then(response => {
      // console.log('response', response);
      setHolders(response.data.data);
    })
  }

  const handleChange = event => {
    setTokenAddress(event.target.value);
  }

  const handleSubmit = event => {
    loadNewData(tokenAddress);
    event.preventDefault();
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
        <form className='search-form' onSubmit={handleSubmit}>
          <label>
            A <input className='address-search' type="text" value={tokenAddress ? tokenAddress : ''} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h1>{tokenAddress}</h1>
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
