"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

type OrderProduct = {
  quantity: number;
  variant?: string;
  product: {
    name: string;
    image?: string; // URL string
  };
};

type Order = {
  _id: string;
  orderNumber: string;
  _createdAt: string;
  totalPrice: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  products: OrderProduct[];
};

type OrdersResponse = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type FilterValue = "all" | OrderStatus;

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pagination, setPagination] = useState<OrdersResponse["pagination"]>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    // Check if customer is already authenticated
    const email = sessionStorage.getItem("customer_email");
    if (email) {
      setCustomerEmail(email);
      setIsAuthenticated(true);
      void fetchOrders(1, "all", email);
    } else {
      setLoading(false);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerEmail.trim()) {
      sessionStorage.setItem("customer_email", customerEmail);
      setIsAuthenticated(true);
      void fetchOrders(1, filter, customerEmail);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("customer_email");
    setIsAuthenticated(false);
    setCustomerEmail("");
    setOrders([]);
  };

  const fetchOrders = async (
    page = 1,
    status: FilterValue = "all",
    email?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        email: email || customerEmail,
      });

      if (status !== "all") {
        params.append("status", status);
      }

      const response = await fetch(`/api/orders?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data: OrdersResponse | { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(
          ("error" in data && data.error) || "Failed to fetch orders"
        );
      }

      setOrders((data as OrdersResponse).orders);
      setPagination((data as OrdersResponse).pagination);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: FilterValue): void => {
    setFilter(newFilter);
    void fetchOrders(1, newFilter);
  };

  const handlePageChange = (newPage: number): void => {
    void fetchOrders(newPage, filter);
  };

  // Email input form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Meine Bestellungen
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Geben Sie Ihre E-Mail-Adresse ein, um Ihre Bestellungen zu sehen
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="E-Mail-Adresse"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Bestellungen anzeigen
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { bg: string; text: string; label: string }
    > = {
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

    const config = statusConfig[status] ?? statusConfig.processing;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const statusConfig: Record<
      PaymentStatus,
      { bg: string; text: string; label: string }
    > = {
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

    const config = statusConfig[status] ?? statusConfig.pending;
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Meine Bestellungen
            </h1>
            <p className="mt-2 text-gray-600">
              Verwalten und verfolgen Sie Ihre Bestellungen für {customerEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Abmelden
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            {(
              [
                { value: "all", label: "Alle" },
                { value: "processing", label: "In Bearbeitung" },
                { value: "shipped", label: "Versandt" },
                { value: "delivered", label: "Zugestellt" },
              ] satisfies { value: FilterValue; label: string }[]
            ).map(({ value, label }) => (
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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Error */}
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
                                  // eslint-disable-next-line @next/next/no-img-element
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
                          {!!order.trackingNumber && (
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
