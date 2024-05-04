import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./layouts/Home";
import PlaceOrder from "./features/placeOrder/PlaceOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/create-order" element={<PlaceOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
