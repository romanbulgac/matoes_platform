import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// В development режиме проводим диагностику подключения ОДИН раз
if (import.meta.env.DEV && !window.__diagnosisCompleted) {
  console.log('🚀 Starting Mathematics Consultation Platform in development mode');
  
  // Импортируем и запускаем диагностику асинхронно
  import('./utils/healthCheck').then(({ diagnoseConnection }) => {
    diagnoseConnection().catch(console.error);
  });
  
  // Помечаем что диагностика уже запущена
  window.__diagnosisCompleted = true;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
