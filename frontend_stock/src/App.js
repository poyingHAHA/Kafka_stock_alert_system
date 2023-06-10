import React, { useEffect, useState } from 'react';
import DropdownMenu from './component/DropdownMenu';
import StockInfoBox from './page/StockInfoBox';
import apiHelper from './APIHelper/APIHelper';
import APIs from './config/config'
import styled from 'styled-components';

const MainPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    const fetchStockList = async () => {
      try{
        const response = await apiHelper.get(APIs.STOCK_LIST_API);
        console.log(response)
        const data = response.data;
        setStockList(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStockList();
  }, []);

  const handleSelectStock = async (stockId) => {
    const selected = stockList.find((stock) => stock.id === stockId);
    console.log(selected.id)
    const result = await apiHelper.get(APIs.STOCK_ALERT_API + selected.id);
    setSelectedStock(result.data);
  };

  return (
    <MainPage>
      <h1>股票資訊</h1>
      <DropdownMenu stockList={stockList} onSelectStock={handleSelectStock} />
      {selectedStock && <StockInfoBox stockInfos={selectedStock} />}
    </MainPage>
  );
}

export default App;
