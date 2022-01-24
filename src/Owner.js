import { useState, useEffect } from "react";
import axios from "axios";
import './Owner.scss';

const Owner = ({holderData=null}) => {
  const holderAccount = holderData.owner;
  const [portfolioValue, setportfolioValue] = useState(null);
  const [tokensWithUSDPrice, setTokensWithUSDPrice] = useState(null);
  const [tokensWithNoUSDPrice, setTokensWithNoUSDPrice] = useState(null);

  useEffect(() => {
    setportfolioValue(null);
    setTokensWithUSDPrice(null);
    setTokensWithNoUSDPrice(null);
    loadNewData();
  }, [holderData]);

  const loadNewData = () => {
    const baseURL = `https://public-api.solscan.io/account/tokens?account=${holderAccount}`;

    axios.get(baseURL).then(response => {
      const tokensWithUSDPrice = response.data.filter(item => (item.tokenName != '' && item.tokenAmount.uiAmount && item.priceUsdt));
      const tokensWithNoUSDPrice = response.data.filter(item => (item.tokenName != '' && item.tokenAmount.uiAmount && !item.priceUsdt));

      let portfolioValueTemp = 0;
      tokensWithUSDPrice.map(token => {
        let tokenUSDTValue = getValueInUSD(token);
        token.tokenUSDTValue = tokenUSDTValue;
        if(typeof tokenUSDTValue == 'number') {
          portfolioValueTemp += tokenUSDTValue;
        }
      })

      tokensWithUSDPrice.sort((a, b) => {
        return b.tokenUSDTValue - a.tokenUSDTValue;
      });

      tokensWithNoUSDPrice.sort((a, b) => {
        return b.tokenAmount.uiAmount - a.tokenAmount.uiAmount;
      });

      // console.log('tokensWithUSDPrice', tokensWithUSDPrice);

      setportfolioValue(portfolioValueTemp);
      setTokensWithUSDPrice(tokensWithUSDPrice);
      setTokensWithNoUSDPrice(tokensWithNoUSDPrice);
    })
  }

  const getValueInUSD = token => {
    if (token.tokenAmount.uiAmount && token.priceUsdt) {
      return token.tokenAmount.uiAmount * token.priceUsdt;
    } else {
      return ''
    }
  }

  const formatPrice = (price) => {
    const formatConfig = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0
    });
  
    return formatConfig.format(price);
  };

  const formatPriceUSD = (price) => {
    const formatConfig = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: 'USD'
    });
  
    return formatConfig.format(price);
  };

  const formatValueLarge = (price) => {
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
    return prefix + '...' + sufix;
    // return address;
  }

  return (
    <div className="owner">
      <div className="general">
        <div className="left-aligned">
          <p className="rank">{holderData.rank}. </p>
          <p className='owner-address'>
            <a>{formatOwnerAddress(holderData.owner)}</a>
            </p>
          <p className='token-amount'> • {formatValueLarge(addDecimalPoint(holderData.amount))}</p>
        </div>
        <p className='wallet-value'>${formatValueLarge(portfolioValue)}</p>
      </div>
      <div className="details">
        {tokensWithUSDPrice && <div className="details-graph">
          {tokensWithUSDPrice.map(token => (
            <div className="token-item" key={token.address}>
              <p>
                <span 
                  className={token.tokenName == 'Orca' ? 'token-name-orca' : 'token-name'}
                  style={{backgroundColor: token.tokenName == 'Orca' ? '' : `hsl(300, ${getValueInUSD(token)/portfolioValue*100}%, 40%)`}}
                >{token.tokenName}</span><span className="small-graph"></span>${formatValueLarge(getValueInUSD(token))}
              </p>
              {/* <div className="graph-line-holder">
                <div className="graph-line" style={{width: getValueInUSD(token)/portfolioValue*100+'%'}}></div>
              </div> */}
            </div>
          ))}
        </div>}
        {tokensWithNoUSDPrice && <div className="details-other">
          {tokensWithNoUSDPrice.map(token => (
            <div className="token-item" key={token.address}>
              <p><span className='token-name-other'>{token.tokenName}</span>{formatValueLarge(token.tokenAmount.uiAmount)}</p>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default Owner;



