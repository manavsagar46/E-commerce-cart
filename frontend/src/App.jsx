import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://e-commerce-cart-gules-pi.vercel.app/api";

function App() {
  const [products, setProducts] = useState([]);
  const [userId] = useState("user123"); // demo user
  const [cartTotal, setCartTotal] = useState(null);
  const [quantity, setQuantity] = useState(1);

  //  all products
  useEffect(() => {
    axios
      .get(`${BASE_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // total price
  const fetchCartTotal = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/total/${userId}`);
      setCartTotal(res.data);
    } catch {
      setCartTotal(null);
    }
  };

  // Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      await axios.post(`${BASE_URL}/cart/add`, {
        userId,
        productId,
        quantity: Number(quantity),
      });
      fetchCartTotal(); // update cart immediately
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };


  useEffect(() => {
    fetchCartTotal();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row p-6 gap-6">
      {/* Product List */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
          Products
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition w-[90%]"
            >
              <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
              <p className="text-gray-600"> ₹{p.price}</p>
              <p className="text-gray-500 mb-2"> Stock: {p.stock}</p>

              <div className="flex items-center gap-2 mt-auto">
                <input
                  type="tel"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 border rounded p-1 text-center"
                />
                <button
                  onClick={() => handleAddToCart(p._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-1/3 bg-blue-200 shadow-md rounded-xl p-6 ">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Your Cart
        </h2>
        <h2 className="text-2xl font-bold mb-4">User123</h2>
        <br />
        {cartTotal ? (
          <div className="space-y-2">
            <p>Subtotal: ₹{cartTotal.subtotal.toFixed(2)}</p>
            <p>Tax (10%): ₹{cartTotal.tax.toFixed(2)}</p>
            <hr className="my-2" />
            <p className="font-bold text-lg ">
              Total: ₹{cartTotal.total.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className=" text-center">Cart is Empty</p>
        )}
      </div>
    </div>
  );
}

export default App;
