// app/dashboard/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function CustomerOrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchOrders = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status !== "all") {
        params.append("status", status);
      }

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders(1, filter);
    }
  }, [isLoaded, user, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchOrders(1, newFilter);
  };

  const handlePageChange = (newPage) => {
    fetchOrders(newPage, filter);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Please sign in to view your orders
        </h2>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Verarbeitung",
      },
      shipped: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Versandt",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Zugestellt",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Storniert" },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Erstattet",
      },
    };

    const config = statusConfig[status] || statusConfig.processing;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Bezahlt" },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Ausstehend",
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Fehlgeschlagen",
      },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Erstattet",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Meine Bestellungen
          </h1>
          <p className="mt-2 text-gray-600">
            Verwalten und verfolgen Sie Ihre Bestellungen
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            {[
              { value: "all", label: "Alle" },
              { value: "processing", label: "In Bearbeitung" },
              { value: "shipped", label: "Versandt" },
              { value: "delivered", label: "Zugestellt" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleFilterChange(value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">
              Fehler beim Laden der Bestellungen: {error}
            </p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Keine Bestellungen gefunden
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Sie haben noch keine Bestellungen aufgegeben.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Jetzt einkaufen
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Bestellung #{order.orderNumber.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(order._createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(order.orderStatus)}
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Products */}
                          <div className="space-y-2 mb-4">
                            {order.products.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-3"
                              >
                                {item.product.image && (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {item.product.name}
                                    {item.variant && (
                                      <span className="text-gray-500 ml-2">
                                        ({item.variant})
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Menge: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Info */}
                          {order.trackingNumber && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                              <p className="text-sm font-medium text-blue-900">
                                Sendungsverfolgung
                              </p>
                              <p className="text-sm text-blue-700">
                                {order.shippingCarrier?.toUpperCase()}:{" "}
                                {order.trackingNumber}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="ml-6 text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {order.totalPrice.toFixed(2)} {order.currency}
                          </p>
                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Details anzeigen
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pagination.hasPrev
                        ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Vorherige
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700">
                    Seite {pagination.page} von {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pagination.hasNext
                        ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Nächste
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
