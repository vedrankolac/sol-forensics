import GoogleFontLoader from 'react-google-font-loader';
import axios from "axios";
import { useState, useEffect } from "react";

import Owner from './Owner';
import './App.scss';

const App = () => {
  const initTokenAddress = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE';
  const [holders, setHolders] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [searchTokenAddress, setSearchTokenAddress] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryTokenAddress = queryParams.get('tokenAddress');

    if (queryTokenAddress != null) {
      setTokenAddress(queryTokenAddress);
    } else {
      setTokenAddress(initTokenAddress);
    }

    if (tokenAddress) {
      loadNewData(tokenAddress);
    }
  }, [tokenAddress]);

  const loadNewData = newTokenAddress => {
    const limit = '30';
    const baseURL = `https://public-api.solscan.io/token/holders?tokenAddress=${newTokenAddress}&offset=0&limit=${limit}`;

    axios.get(baseURL).then(response => {
      setHolders(response.data.data);
    })
  }

  const handleChange = event => {
    setSearchTokenAddress(event.target.value);
  }

  const handleSubmit = event => {
    window.location.href = '?tokenAddress=' + searchTokenAddress;
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
          <label className='search-label'>
            <input className='address-search' type="text" value={searchTokenAddress ? searchTokenAddress : ''} onChange={handleChange} />
          </label>
          <input className='search-button' type="submit" value="SEARCH" />
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
