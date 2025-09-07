"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type UpdateOrderPayload = Partial<{
  orderStatus: OrderStatus;
  trackingNumber: string;
  shippingCarrier: string;
  notes: string;
}>;

type OrderProductRef = {
  _id: string;
  name?: string;
  price?: number;
  image?: any; // Sanity image or URL
  slug?: { current: string };
};

type OrderLine = {
  quantity: number;
  variant?: string;
  product: OrderProductRef;
};

type Order = {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  notes?: string;
  _createdAt: string;
  products: OrderLine[];
};

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus?: Partial<Record<OrderStatus, number>>;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if admin is already authenticated (simple session check)
    const adminAuth = sessionStorage.getItem("admin_authenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
      void fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - replace with your actual admin password
    if (password === "admin123") {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      void fetchData();
    } else {
      alert("Falsches Passwort");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setOrders([]);
    setStats(null);
  };

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        fetch("/api/orders/admin"),
        fetch("/api/orders/stats"),
      ]);

      const [ordersData, statsData] = await Promise.all([
        ordersRes.json(),
        statsRes.json(),
      ]);

      setOrders((ordersData?.orders ?? []) as Order[]);
      setStats(statsData as Stats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (
    orderId: string,
    updates: UpdateOrderPayload
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to update order");
      }

      await fetchData();
      setShowUpdateModal(false);
      setSelectedOrder(null);
    } catch (e) {
      console.error("Update failed:", e);
      alert("Fehler beim Aktualisieren der Bestellung");
    }
  };

  // Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin-Bereich
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Bitte geben Sie das Admin-Passwort ein
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Admin-Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anmelden
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bestellverwaltung
            </h1>
            <p className="mt-2 text-gray-600">
              Verwalten Sie alle Kundenbestellungen
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Abmelden
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              color="blue"
              title="Gesamtbestellungen"
              value={stats.totalOrders}
              emoji="📊"
            />
            <StatCard
              color="green"
              title="Gesamtumsatz"
              value={`€${(stats.totalRevenue || 0).toFixed(2)}`}
              emoji="€"
            />
            <StatCard
              color="yellow"
              title="In Bearbeitung"
              value={stats.ordersByStatus?.processing ?? 0}
              emoji="📦"
            />
            <StatCard
              color="purple"
              title="Versandt"
              value={stats.ordersByStatus?.shipped ?? 0}
              emoji="🚚"
            />
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
                  {[
                    "Bestellung",
                    "Kunde",
                    "Status",
                    "Betrag",
                    "Datum",
                    "Aktionen",
                  ].map((th) => (
                    <th
                      key={th}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber?.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.products?.length ?? 0} Artikel
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
                                : order.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{Number(order.totalPrice ?? 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order._createdAt
                        ? format(new Date(order._createdAt), "dd.MM.yyyy HH:mm")
                        : "-"}
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
                {orders.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-10 text-center text-gray-500"
                      colSpan={6}
                    >
                      Keine Bestellungen gefunden.
                    </td>
                  </tr>
                )}
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

/* ---------- Small components & modal ---------- */

function StatCard({
  color,
  title,
  value,
  emoji,
}: {
  color: "blue" | "green" | "yellow" | "purple";
  title: string;
  value: number | string;
  emoji: string;
}) {
  const bg =
    color === "blue"
      ? "bg-blue-500"
      : color === "green"
        ? "bg-green-500"
        : color === "yellow"
          ? "bg-yellow-500"
          : "bg-purple-500";

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 ${bg} rounded-md flex items-center justify-center`}
            >
              <span className="text-white font-bold">{emoji}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderUpdateModal({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (orderId: string, updates: UpdateOrderPayload) => Promise<void>;
}) {
  const [formData, setFormData] = useState<{
    orderStatus: OrderStatus;
    trackingNumber: string;
    shippingCarrier: string;
    notes: string;
  }>({
    orderStatus: order.orderStatus,
    trackingNumber: order.trackingNumber ?? "",
    shippingCarrier: order.shippingCarrier ?? "",
    notes: order.notes ?? "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onUpdate(order._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bestellung #{order.orderNumber?.slice(-8)} bearbeiten
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  orderStatus: e.target.value as OrderStatus,
                })
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
