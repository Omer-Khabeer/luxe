// app/admin/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

export default function AdminOrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch("/api/orders/admin"),
        fetch("/api/orders/stats"),
      ]);

      const [ordersData, statsData] = await Promise.all([
        ordersRes.json(),
        statsRes.json(),
      ]);

      setOrders(ordersData.orders || []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        setShowUpdateModal(false);
        setSelectedOrder(null);
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Fehler beim Aktualisieren der Bestellung");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bestellverwaltung
          </h1>
          <p className="mt-2 text-gray-600">
            Verwalten Sie alle Kundenbestellungen
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gesamtbestellungen
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">€</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gesamtumsatz
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        €{(stats.totalRevenue || 0).toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📦</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        In Bearbeitung
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.ordersByStatus?.processing || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">🚚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Versandt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.ordersByStatus?.shipped || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Aktuelle Bestellungen
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.products.length} Artikel
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order._createdAt), "dd.MM.yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowUpdateModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Bearbeiten
                      </button>
                      <a
                        href={`/admin/orders/${order._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Modal */}
        {showUpdateModal && selectedOrder && (
          <OrderUpdateModal
            order={selectedOrder}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedOrder(null);
            }}
            onUpdate={handleUpdateOrder}
          />
        )}
      </div>
    </div>
  );
}

// Order Update Modal Component
function OrderUpdateModal({ order, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    orderStatus: order.orderStatus,
    trackingNumber: order.trackingNumber || "",
    shippingCarrier: order.shippingCarrier || "",
    notes: order.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(order._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bestellung #{order.orderNumber.slice(-8)} bearbeiten
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({ ...formData, orderStatus: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="processing">In Bearbeitung</option>
              <option value="shipped">Versandt</option>
              <option value="delivered">Zugestellt</option>
              <option value="cancelled">Storniert</option>
              <option value="refunded">Erstattet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versandunternehmen
            </label>
            <select
              value={formData.shippingCarrier}
              onChange={(e) =>
                setFormData({ ...formData, shippingCarrier: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Auswählen...</option>
              <option value="dhl">DHL</option>
              <option value="dpd">DPD</option>
              <option value="hermes">Hermes</option>
              <option value="ups">UPS</option>
              <option value="fedex">FedEx</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking-Nummer
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tracking-Nummer eingeben..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notizen
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Interne Notizen..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
