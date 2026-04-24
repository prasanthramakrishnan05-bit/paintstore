return (
  <div className="app">
    <h1>🎨 Paint Store POS</h1>

    <div className="section">
      <button onClick={addStock}>➕ Add Stock</button>
    </div>

    <div className="section">
      <h2>🛒 Billing</h2>
      {products.map((p, i) => (
        <div className="card" key={i}>
          <span>
            {p.company} ({p.litre}) ₹{p.price}
          </span>
          <button onClick={() => sellProduct(p)}>Sell</button>
        </div>
      ))}
    </div>

    <div className="section">
      <h2>🧾 Cart</h2>
      {cart.map((i, idx) => (
        <div className="card cart-item" key={idx}>
          <span>
            {i.company} ({i.litre}) × {i.qty}
          </span>
          <span>₹{i.qty * i.price}</span>
          <button onClick={() => cancelSale(i)}>Cancel</button>
        </div>
      ))}
      <div className="total">Total Bill: ₹{total}</div>
    </div>

    <div className="section">
      <h2>📦 Stock</h2>
      {products.map((p, i) => (
        <div className="card stock" key={i}>
          {p.company} ({p.litre}) → {p.stock} pcs
          <span>₹{p.stock * p.price}</span>
        </div>
      ))}
      <div className="total">
        Total Stock Value: ₹{totalStockValue}
      </div>
    </div>

    <div className="section">
      <h2>📊 History</h2>
      {history.map((h, i) => (
        <div key={i}>
          <b>{h.date}</b>
          {h.logs.map((l, idx) => (
            <div className="history" key={idx}>
              {l.time} - {l.action} - {l.company} ({l.litre}) x {l.qty}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);