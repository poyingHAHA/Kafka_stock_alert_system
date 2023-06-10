import React from "react";
import styled from "styled-components";

const StyledStockInfoBox = styled.div`
  background-color: #98DDCA;
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
  height: 80vh;
  width: 70vw;
  overflow: scroll;
`;

const InfoBox = styled.div`
  display: flex;
  border: 1px solid #e0e0e0;
  background-color: ${ props => props.up ? "#D5ECC2" : "#FFAAA7"} };
  padding: 10px;
  border-radius: 10px;
  flex-direction: column;
  margin-bottom: 10px;
  p {
    display: flex;
    justify-content: space-between;
    margin-left: 25vw;
    margin-right: 25vw;
    margin-top: 0.5vh;
    margin-bottom: 0;
    span:first-child {
      text-align: left;
    }
    span:last-child {
      text-align: right;
    }
  }
`;

const noShowKeys = ["_id", "stock_id", "created_at", "updated_at", "__v"];

const StockInfoBox = ({ stockInfos }) => {
  console.log(stockInfos)
  let stockInfoJSX = stockInfos.map((obj, index) => (
    <InfoBox key={index} up={obj.up} >
      {Object.entries(obj).map(([key, value]) => (
        noShowKeys.includes(key) ? null :
        <p key={key}>
          <span>{key}:</span> <span>{value === true ? "Yes" : value === false ? "No" : key==="timestamp" ? (new Date(value).toLocaleString()) : value}</span>
        </p>
      ))}
    </InfoBox>
  ));

  return (
    <StyledStockInfoBox>
      {stockInfoJSX}
    </StyledStockInfoBox>
  )
}

export default StockInfoBox;