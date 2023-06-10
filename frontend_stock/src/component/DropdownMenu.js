import React from "react";

const DropdownMenu = ({ stockList, onSelectStock }) => {
  return (
    <select onChange={(e) => onSelectStock(e.target.value)}>
      <option value="">Select a stock</option>
      {stockList.map((stock) => (
        <option key={stock.id} value={stock.id}>
          {stock.stock}
        </option>
      ))}
    </select>
  )
}

export default DropdownMenu;