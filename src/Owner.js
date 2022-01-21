import { useState, useEffect } from "react";
import axios from "axios";
import './Owner.scss';

const Owner = ({holderData=null}) => {
  const holderAccount = holderData.owner;
  const [ownerData, setOwnerData] = useState(null);
  const [portfolioValue, setportfolioValue] = useState(null);

  useEffect(() => {
    loadNewData();
  }, []);

  const loadNewData = () => {
    const baseURL = `https://public-api.solscan.io/account/tokens?account=${holderAccount}`;

    axios.get(baseURL).then(response => {
      console.log('Owner response', response.data);
      const filtered = response.data.filter(item => item.tokenName != '');

      let portfolioValueTemp = 0;
      filtered.map(token => {
        let usdv = getValueInUSD(token);
        if(typeof usdv == 'number') {
          portfolioValueTemp += usdv;
        }
        console.log('portfolioValueTemp: ', portfolioValueTemp);
      })

      setportfolioValue(portfolioValueTemp);
      setOwnerData(filtered);
    })
  }

  const formatPrice = (price) => {
    const formatConfig = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0
    });
  
    return formatConfig.format(price);
  };

  const formatPriceLarge = (price) => {
    const formatConfig = new Intl.NumberFormat("en-US", {
      style: "decimal",
      notation: "compact",
      compactDisplay: "short"
    });
  
    return formatConfig.format(price);
  };

  const addDecimalPoint = amount => {
    let amountFormated = amount.toString().slice(0,-6);
    return amountFormated;
  }

  const formatOwnerAddress = address => {
    const prefix = address.slice(0, 4);
    const sufix = address.slice(-4);
    // return prefix + '...' + sufix;
    return address;
  }

  const getValueInUSD = token => {
    if (token.tokenAmount.uiAmount && token.priceUsdt) {
      return token.tokenAmount.uiAmount * token.priceUsdt;
    } else {
      return ''
    }
  }

  return (
    <div className="owner">
      <div className="general">
        <div className="left-aligned">
          <p className="rank">{holderData.rank}. </p>
          <p className='owner-address'>
            <a>{formatOwnerAddress(holderData.owner)}</a>
            </p>
          <p className='token-amount'> • {formatPrice(addDecimalPoint(holderData.amount))}</p>
        </div>
        <p className='wallet-value'>${formatPriceLarge(portfolioValue)}</p>
      </div>
      {ownerData && <div className="details">
        {ownerData.map(token => (
          <div className="token-item">
            <p><span className="token-name">{token.tokenName}</span> {'$' + formatPrice(getValueInUSD(token))}</p>
          </div>
        ))}
      </div>}
    </div>
  )
}

export default Owner;



