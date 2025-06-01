"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Products = [
  {
    id: "101",
    title: "Wireless Headphones",
    description: "High-quality sound with noise cancellation.",
    price: 149.99,
    variants: ["Black", "White", "Silver"],
    image:
      "https://m.media-amazon.com/images/I/31QB73-5IEL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "102",
    title: "Smart Fitness Watch",
    description: "Track your fitness goals and heart rate accurately.",
    price: 89.99,
    variants: ["Black", "Pink", "Navy Blue"],
    image:
      "https://m.media-amazon.com/images/I/41EcnbfGJiL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "103",
    title: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and clear audio.",
    price: 59.99,
    variants: ["Red", "Blue", "Camo"],
    image:
      "https://m.media-amazon.com/images/I/51vpv2AS-WL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "104",
    title: "4K Action Camera",
    description: "Capture your adventures in stunning 4K quality.",
    price: 129.99,
    variants: ["Black", "Yellow", "Orange"],
    image:
      "https://m.media-amazon.com/images/I/314bYOvfzqL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "105",
    title: "Electric Toothbrush",
    description: "Keep your teeth clean with sonic vibrations.",
    price: 39.99,
    variants: ["White", "Blue", "Mint"],
    image:
      "https://m.media-amazon.com/images/I/41gnxkh812L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "106",
    title: "Gaming Mouse",
    description: "Precision and comfort for competitive gaming.",
    price: 49.99,
    variants: ["RGB Black", "Matte Black", "Glossy White"],
    image:
      "https://m.media-amazon.com/images/I/3183YJQkCoL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: "107",
    title: "LED Desk Lamp",
    description: "Brighten up your workspace with touch controls.",
    price: 24.99,
    variants: ["White", "Black", "Wood Finish"],
    image: "https://m.media-amazon.com/images/I/515GbYKACyL._SX679_.jpg",
  },
  {
    id: "108",
    title: "Laptop Backpack",
    description: "Water-resistant backpack with USB charging port.",
    price: 69.99,
    variants: ["Gray", "Navy", "Green"],
    image: "https://m.media-amazon.com/images/I/81Yjmayg+ZL._SY879_.jpg",
  },
  {
    id: "109",
    title: "Wireless Charger Pad",
    description: "Fast charging pad for all Qi-enabled devices.",
    price: 29.99,
    variants: ["Black", "White", "Rose Gold"],
    image:
      "https://m.media-amazon.com/images/I/41YxAMPl7eL._SX300_SY300_QL70_FMwebp_.jpg",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [selections, setSelections] = useState(() =>
    Products.reduce(
      (acc, p) => {
        acc[p.id] = {
          variant: p.variants[0],
          quantity: 1,
        };
        return acc;
      },
      {} as Record<string, { variant: string; quantity: number }>
    )
  );

  const handleBuyNow = (product: any) => {
    const selected = selections[product.id];
    sessionStorage.setItem(
      "selectedProduct",
      JSON.stringify({
        ...product,
        variant: selected.variant,
        quantity: selected.quantity,
      })
    );
    router.push("/checkout");
  };

  const updateSelection = (
    id: string,
    key: "variant" | "quantity",
    value: string | number
  ) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: key === "quantity" ? Number(value) : value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Shop Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain mb-4"
            />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-lg font-bold text-indigo-600 mt-2">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-4">
              <label className="block text-sm mb-1 text-gray-700">
                Variant
              </label>
              <select
                className="w-full border rounded p-2"
                value={selections[product.id].variant}
                onChange={(e) =>
                  updateSelection(product.id, "variant", e.target.value)
                }
              >
                {product.variants.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <label className="block text-sm mb-1 text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                className="w-full border rounded p-2"
                value={selections[product.id].quantity}
                onChange={(e) =>
                  updateSelection(product.id, "quantity", e.target.value)
                }
              />
            </div>

            <button
              onClick={() => handleBuyNow(product)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
