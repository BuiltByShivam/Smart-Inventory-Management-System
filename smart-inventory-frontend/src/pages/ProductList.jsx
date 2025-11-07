// src/pages/ProductList.jsx
import React from "react";

const ProductList = () => {
  return (
    <main className="min-h-screen w-full bg-gray-100 p-4">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow p-6 force-dark-text w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mb-4">(mock table below)</p>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                  <th className="border px-4 py-2 text-left">Stock</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">1</td>
                  <td className="border px-4 py-2">Sample Product</td>
                  <td className="border px-4 py-2">100</td>
                  <td className="border px-4 py-2">50</td>
                  <td className="border px-4 py-2">Edit / Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductList;
