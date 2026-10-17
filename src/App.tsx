import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { AppShell } from './components/shell/AppShell';
import { RoleGuard } from './components/RoleGuard';
import { Login } from './pages/Login';
import { Forbidden } from './pages/Forbidden';
import { NotFound } from './pages/NotFound';
import { DesignSystem } from './pages/DesignSystem';
import { BrandPage } from './pages/BrandPage';

// Lazy-loaded role-split modules
const AdminDashboard = React.lazy(() => import('./roles/admin/AdminDashboard'));
const StoreDashboard = React.lazy(() => import('./roles/storekeeper/StoreDashboard'));
const ReceiveDeliveryWizard = React.lazy(() => import('./roles/storekeeper/ReceiveDeliveryWizard'));
const IssueToMessWizard = React.lazy(() => import('./roles/storekeeper/IssueToMessWizard'));
const AdjustmentsView = React.lazy(() => import('./roles/storekeeper/AdjustmentsView'));
const CreatePOView = React.lazy(() => import('./roles/storekeeper/CreatePOView'));
const LedgerView = React.lazy(() => import('./roles/storekeeper/LedgerView'));
const MessDashboard = React.lazy(() => import('./roles/messmanager/MessDashboard'));
const TodaysEntry = React.lazy(() => import('./roles/messmanager/TodaysEntry'));
const MyStock = React.lazy(() => import('./roles/messmanager/MyStock'));
const ConsumptionHistory = React.lazy(() => import('./roles/messmanager/ConsumptionHistory'));
const DailyMenu = React.lazy(() => import('./roles/messmanager/DailyMenu'));
const FinanceDashboard = React.lazy(() => import('./roles/finance/FinanceDashboard'));
const BudgetsView = React.lazy(() => import('./roles/finance/BudgetsView'));
const PaymentsView = React.lazy(() => import('./roles/finance/PaymentsView'));
const POFinancialView = React.lazy(() => import('./roles/finance/POFinancialView'));
const FinanceAuditView = React.lazy(() => import('./roles/finance/FinanceAuditView'));
const VendorDashboard = React.lazy(() => import('./roles/vendor/VendorDashboard'));
const VendorDispatchView = React.lazy(() => import('./roles/vendor/VendorDispatchView'));
const VendorPerformanceView = React.lazy(() => import('./roles/vendor/VendorPerformanceView'));
const MessFeedbackView = React.lazy(() => import('./roles/messmanager/MessFeedbackView'));

// Loading Fallback with Operational Radar Pulse
const OperationalLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 select-none">
    <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin mb-3" />
    <span className="font-heading font-semibold text-xs tracking-wider uppercase text-pine/80">
      Authorizing Secure Operational Uplink...
    </span>
  </div>
);

// Smart Root Redirect based on JWT Role
const RootRedirect: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  const roleMap: Record<string, string> = {
    administrator: '/admin',
    store_keeper: '/store',
    mess_manager: '/mess',
    finance_staff: '/finance',
    vendor: '/vendor',
  };

  return <Navigate to={roleMap[role] || '/login'} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Screen */}
            <Route path="/login" element={<Login />} />

            {/* Living Design System (Accessible in shell) */}
            <Route
              path="/design-system"
              element={
                <AppShell>
                  <DesignSystem />
                </AppShell>
              }
            />

            {/* Living Brand Specification (HIMRASAD Institutional Identity) */}
            <Route path="/brand" element={<BrandPage />} />

            {/* 403 & 404 */}
            <Route
              path="/403"
              element={
                <AppShell>
                  <Forbidden />
                </AppShell>
              }
            />

            {/* Role Protected Routes with AppShell */}
            <Route
              path="/admin/*"
              element={
                <RoleGuard allowedRoles={['administrator']}>
                  <AppShell>
                    <Suspense fallback={<OperationalLoading />}>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="messes" element={<AdminDashboard />} />
                        <Route path="vendors" element={<AdminDashboard />} />
                        <Route path="items" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminDashboard />} />
                        <Route path="audit" element={<AdminDashboard />} />
                        <Route path="forecast" element={<AdminDashboard />} />
                      </Routes>
                    </Suspense>
                  </AppShell>
                </RoleGuard>
              }
            />

            <Route
              path="/store/*"
              element={
                <RoleGuard allowedRoles={['store_keeper', 'administrator']}>
                  <AppShell>
                    <Suspense fallback={<OperationalLoading />}>
                      <Routes>
                        <Route index element={<StoreDashboard />} />
                        <Route path="receive" element={<ReceiveDeliveryWizard />} />
                        <Route path="issue" element={<IssueToMessWizard />} />
                        <Route path="adjustments" element={<AdjustmentsView />} />
                        <Route path="create-po" element={<CreatePOView />} />
                        <Route path="ledger" element={<LedgerView />} />
                      </Routes>
                    </Suspense>
                  </AppShell>
                </RoleGuard>
              }
            />

            <Route
              path="/mess/*"
              element={
                <RoleGuard allowedRoles={['mess_manager', 'administrator']}>
                  <AppShell>
                    <Suspense fallback={<OperationalLoading />}>
                      <Routes>
                        <Route index element={<TodaysEntry />} />
                        <Route path="stock" element={<MyStock />} />
                        <Route path="history" element={<ConsumptionHistory />} />
                        <Route path="menu" element={<DailyMenu />} />
                        <Route path="feedback" element={<MessFeedbackView />} />
                      </Routes>
                    </Suspense>
                  </AppShell>
                </RoleGuard>
              }
            />

            <Route
              path="/finance/*"
              element={
                <RoleGuard allowedRoles={['finance_staff', 'administrator']}>
                  <AppShell>
                    <Suspense fallback={<OperationalLoading />}>
                      <Routes>
                        <Route index element={<FinanceDashboard />} />
                        <Route path="budgets" element={<BudgetsView />} />
                        <Route path="payments" element={<PaymentsView />} />
                        <Route path="po-view" element={<POFinancialView />} />
                        <Route path="audit" element={<FinanceAuditView />} />
                      </Routes>
                    </Suspense>
                  </AppShell>
                </RoleGuard>
              }
            />

            <Route
              path="/vendor/*"
              element={
                <RoleGuard allowedRoles={['vendor', 'administrator']}>
                  <AppShell>
                    <Suspense fallback={<OperationalLoading />}>
                      <Routes>
                        <Route index element={<VendorDashboard />} />
                        <Route path="orders" element={<VendorDashboard />} />
                        <Route path="dispatch" element={<VendorDispatchView />} />
                        <Route path="performance" element={<VendorPerformanceView />} />
                      </Routes>
                    </Suspense>
                  </AppShell>
                </RoleGuard>
              }
            />

            {/* Smart Root Index */}
            <Route path="/" element={<RootRedirect />} />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <AppShell>
                  <NotFound />
                </AppShell>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
