import { useState, useEffect } from "react";
import axios from "axios";
import './Owner.scss';

const Owner = ({holderData=null}) => {
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
    return prefix + '...' + sufix;
  }

  return (
    <div className='owner'>
      <p>{holderData.rank}</p>
      <p className='owner-address'>{formatOwnerAddress(holderData.owner)}</p>
      <p className='token-amount'>{formatPrice(addDecimalPoint(holderData.amount))}</p>
    </div>
  )
}

export default Owner;