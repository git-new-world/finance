import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
const pages = [];
function App() { return <BrowserRouter basename="/finance"><main style={{padding:24,fontFamily:'system-ui,sans-serif'}} data-ai-factory-render-marker="true"><h1>V6 Integrated Task Pages</h1><nav>{pages.filter(p => p.nav !== false).map(p => <Link key={p.path} to={p.path} style={{margin:4}}>{p.label}</Link>)}</nav><React.Suspense fallback={<div>Loading...</div>}><Routes><Route path="/" element={<div>Select a page from the menu</div>}/>{pages.map(p => { const PageComp = p.Page; return React.createElement(Route, { key: p.path, path: p.path, element: React.createElement(PageComp) }); })}</Routes></React.Suspense></main></BrowserRouter>; }
export default App;
