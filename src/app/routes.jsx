
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const LeadsPage = lazy(() => import("../pages/LeadsPage"));
const QuotationsPage = lazy(() => import("../pages/QuotationsPage"));
const DealsPage = lazy(() => import("../pages/DealsPage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const PaymentsPage = lazy(() => import("../pages/PaymentsPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading dashboard...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/quotations" element={<QuotationsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
