import { useEffect, useState } from "react";

const defaultProducts = [
  { company: "Asian Paint", litre: "1L", price: 300, stock: 10 },
  { company: "Asian Paint", litre: "5L", price: 1400, stock: 5 },
];

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  // 🔹 Load
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || defaultProducts);
    setHistory(JSON.parse(localStorage.getItem("history")) || []);
  }, []);

  // 🔹 Save
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // 🔍 Find product
  const findProduct = (company, litre) =>
    products.find(
      (p) =>
        p.company.toLowerCase() === company.toLowerCase() &&
        p.litre.toLowerCase() === litre.toLowerCase()
    );

  // 📊 History update
  const updateHistory = (action, product, qty = 1) => {
    const today = new Date().toLocaleDateString();

    const entry = {
      action,
      company: product.company,
      litre: product.litre,
      qty,
      price: product.price,
      time: new Date().toLocaleTimeString(),
    };

    const existing = history.find((h) => h.date === today);

    if (existing) {
      setHistory(
        history.map((h) =>
          h.date === today
            ? { ...h, logs: [...h.logs, entry] }
            : h
        )
      );
    } else {
      setHistory([{ date: today, logs: [entry] }]);
    }
  };

  // ➕ SALE (reduce stock)
  const sellProduct = (product) => {
    if (product.stock <= 0) {
      alert("Stock finished");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.company === product.company && p.litre === product.litre
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );

    setCart((prev) => {
      const exist = prev.find(
        (i) =>
          i.company === product.company && i.litre === product.litre
      );

      if (exist) {
        return prev.map((i) =>
          i.company === product.company && i.litre === product.litre
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    updateHistory("SALE", product);
  };

  // ➖ CANCEL SALE
  const cancelSale = (product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.company === product.company && p.litre === product.litre
          ? { ...p, stock: p.stock + 1 }
          : p
      )
    );

    setCart((prev) =>
      prev
        .map((i) =>
          i.company === product.company && i.litre === product.litre
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0)
    );

    updateHistory("CANCEL", product);
  };

  // 📦 ADD STOCK
  const addStock = () => {
    const company = prompt("Company:");
    const litre = prompt("Litre:");

    let product = findProduct(company, litre);

    if (product) {
      const qty = Number(prompt("Add stock quantity:"));
      setProducts((prev) =>
        prev.map((p) =>
          p.company === company && p.litre === litre
            ? { ...p, stock: p.stock + qty }
            : p
        )
      );
      updateHistory("STOCK_ADD", product, qty);
      return;
    }

    const price = Number(prompt("Price:"));
    const stock = Number(prompt("Stock:"));

    const newProduct = { company, litre, price, stock };
    setProducts((prev) => [...prev, newProduct]);
  };

  // 💰 Cart total
  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  // 📦 Total stock value
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🎨 Paint Store POS</h1>

      <button onClick={addStock}>➕ Add Stock</button>

      <h2>🛒 Billing</h2>
      {products.map((p, i) => (
        <div key={i}>
          {p.company} ({p.litre}) ₹{p.price}
          <button onClick={() => sellProduct(p)}>➕ Sell</button>
        </div>
      ))}

      <h2>🧾 Cart</h2>
      {cart.map((i, idx) => (
        <div key={idx}>
          {i.company} ({i.litre}) × {i.qty} = ₹{i.qty * i.price}
          <button onClick={() => cancelSale(i)}>➖ Cancel</button>
        </div>
      ))}

      <h3>Total Bill: ₹{total}</h3>

      <h2>📦 Available Stock</h2>
      {products.map((p, i) => (
        <div key={i}>
          {p.company} ({p.litre}) → {p.stock} pcs | Value: ₹
          {p.stock * p.price}
        </div>
      ))}

      <h3>Total Stock Value: ₹{totalStockValue}</h3>

      <h2>📊 History</h2>
      {history.map((h, i) => (
        <div key={i}>
          <b>{h.date}</b>
          {h.logs.map((l, idx) => (
            <div key={idx}>
              {l.time} - {l.action} - {l.company} ({l.litre}) x {l.qty}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;