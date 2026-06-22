import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
const socket: Socket = io(API_URL, {
  autoConnect: true,
});
type Dish = {
  dishId: string;
  dishName: string;
  imageUrl: string;
  isPublished: boolean;
};

function App() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleStatus = async (dishId: string) => {
    try {
      await axios.patch(`${API_URL}/api/dishes/${dishId}/toggle`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dishes`);

        setDishes(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);
  useEffect(() => {
    const handleUpdate = (updatedDish: Dish) => {
      setDishes((prev) =>
        prev.map((dish) =>
          dish.dishId === updatedDish.dishId ? updatedDish : dish,
        ),
      );
    };

    socket.on("dishUpdated", handleUpdate);

    return () => {
      socket.off("dishUpdated", handleUpdate);
    };
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading dishes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold mb-3">🍽 Dish Dashboard</h1>

        <p className="text-slate-400 mb-10">
          Manage publication status of dishes
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div
              key={dish.dishId}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition duration-300"
            >
              <img
                src={dish.imageUrl}
                alt={dish.dishName}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{dish.dishName}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      dish.isPublished
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {dish.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>

                <button
                  onClick={() => toggleStatus(dish.dishId)}
                  className={`w-full mt-5 py-3 rounded-xl font-medium transition ${
                    dish.isPublished
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {dish.isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
