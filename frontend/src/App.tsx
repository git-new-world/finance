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
const Page8 = React.lazy(() => import('./features/voucher/v6task_finance_task_003/FeaturePanel.tsx'));

const pages = [
  { path: "/featurepanel", label: "Featurepanel", Page: Page0 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page1 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page2 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page3 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page4 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page5 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page6 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page7 },
  { path: "/featurepanel", label: "Featurepanel", Page: Page8 }
];
function App() { return <BrowserRouter basename="/"><main style={{padding:24,fontFamily:'system-ui,sans-serif'}} data-ai-factory-render-marker="true"><h1>V6 Integrated Task Pages</h1><nav>{pages.map(p => <Link key={p.path} to={p.path} style={{margin:4}}>{p.label}</Link>)}</nav><React.Suspense fallback={<div>Loading...</div>}><Routes><Route path="/" element={<div>Select a page from the menu</div>}/>{pages.map(p => <Route key={p.path} path={p.path} element={<p.Page/>}/>)}</Routes></React.Suspense></main></BrowserRouter>; }
export default App;
