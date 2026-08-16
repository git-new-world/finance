import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
const Page0 = React.lazy(() => import('./features/consult/ai/FeaturePanel.tsx'));
const Page1 = React.lazy(() => import('./features/daily_report/v6task_finance_task_010/FeaturePanel.tsx'));
const Page2 = React.lazy(() => import('./features/invoice/v6task_finance_task_008/FeaturePanel.tsx'));
const Page3 = React.lazy(() => import('./features/invoice_issuance/v6task_finance_task_012/FeaturePanel.tsx'));
const Page4 = React.lazy(() => import('./features/reports/v6task_finance_task_005/FeaturePanel.tsx'));
const Page5 = React.lazy(() => import('./features/risk/v6task_finance_task_014/FeaturePanel.tsx'));
const Page6 = React.lazy(() => import('./features/system/v6task_finance_task_001/FeaturePanel.tsx'));
const Page7 = React.lazy(() => import('./features/tax/v6task_finance_task_006/FeaturePanel.tsx'));
const Page8 = React.lazy(() => import('./features/voucher/page-001_page-002_page-003_page-004_api/FeaturePanel.tsx'));

const pages = [
  { path: "/consult-ai", label: "Consult Ai", Page: Page0, nav: true },
  { path: "/ai-consult", label: "Consult Ai", Page: Page0, nav: false },
  { path: "/v6task_finance_task_010", label: "V6Task Finance Task 010", Page: Page1, nav: true },
  { path: "/daily-dashboard", label: "V6Task Finance Task 010", Page: Page1, nav: false },
  { path: "/v6task_finance_task_008", label: "V6Task Finance Task 008", Page: Page2, nav: true },
  { path: "/invoice-recognition", label: "V6Task Finance Task 008", Page: Page2, nav: false },
  { path: "/v6task_finance_task_012", label: "V6Task Finance Task 012", Page: Page3, nav: true },
  { path: "/invoice-issuance", label: "V6Task Finance Task 012", Page: Page3, nav: false },
  { path: "/document-generation", label: "V6Task Finance Task 012", Page: Page3, nav: false },
  { path: "/v6task_finance_task_005", label: "V6Task Finance Task 005", Page: Page4, nav: true },
  { path: "/reports/standard", label: "V6Task Finance Task 005", Page: Page4, nav: false },
  { path: "/reports/custom", label: "V6Task Finance Task 005", Page: Page4, nav: false },
  { path: "/v6task_finance_task_014", label: "V6Task Finance Task 014", Page: Page5, nav: true },
  { path: "/risk-overview", label: "V6Task Finance Task 014", Page: Page5, nav: false },
  { path: "/v6task_finance_task_001", label: "V6Task Finance Task 001", Page: Page6, nav: true },
  { path: "/admin/settings", label: "V6Task Finance Task 001", Page: Page6, nav: false },
  { path: "/admin/datasources", label: "V6Task Finance Task 001", Page: Page6, nav: false },
  { path: "/admin/logs", label: "V6Task Finance Task 001", Page: Page6, nav: false },
  { path: "/v6task_finance_task_006", label: "V6Task Finance Task 006", Page: Page7, nav: true },
  { path: "/tax-filing", label: "V6Task Finance Task 006", Page: Page7, nav: false },
  { path: "/tax-records", label: "V6Task Finance Task 006", Page: Page7, nav: false },
  { path: "/voucher-page-001_page-002_page-003_page-004_api", label: "Voucher Page 001 Page 002 Page 003 Page 004 Api", Page: Page8, nav: true },
  { path: "/bank-stream-sync", label: "Voucher Page 001 Page 002 Page 003 Page 004 Api", Page: Page8, nav: false },
  { path: "/vouchers", label: "Voucher Page 001 Page 002 Page 003 Page 004 Api", Page: Page8, nav: false },
  { path: "/voucher-review", label: "Voucher Page 001 Page 002 Page 003 Page 004 Api", Page: Page8, nav: false },
  { path: "/voucher-history", label: "Voucher Page 001 Page 002 Page 003 Page 004 Api", Page: Page8, nav: false }
];
function App() { return <BrowserRouter basename="/finance"><main style={{padding:24,fontFamily:'system-ui,sans-serif'}} data-ai-factory-render-marker="true"><h1>V6 Integrated Task Pages</h1><nav>{pages.filter(p => p.nav !== false).map(p => <Link key={p.path} to={p.path} style={{margin:4}}>{p.label}</Link>)}</nav><React.Suspense fallback={<div>Loading...</div>}><Routes><Route path="/" element={<div>Select a page from the menu</div>}/>{pages.map(p => { const PageComp = p.Page; return React.createElement(Route, { key: p.path, path: p.path, element: React.createElement(PageComp) }); })}</Routes></React.Suspense></main></BrowserRouter>; }
export default App;
