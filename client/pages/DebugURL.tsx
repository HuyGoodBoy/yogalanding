import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function DebugURL() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("=== DEBUG URL PARAMETERS ===");
    console.log("window.location.href:", window.location.href);
    console.log("window.location.search:", window.location.search);
    console.log("window.location.hash:", window.location.hash);
    console.log("window.location.pathname:", window.location.pathname);
    
    console.log("React Router searchParams:");
    for (const [key, value] of searchParams.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    console.log("Direct URLSearchParams:");
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    console.log("=== END DEBUG ===");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug URL Parameters</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">URL Information:</h2>
          
          <div className="space-y-2">
            <p><strong>Full URL:</strong> {window.location.href}</p>
            <p><strong>Search:</strong> {window.location.search}</p>
            <p><strong>Hash:</strong> {window.location.hash}</p>
            <p><strong>Pathname:</strong> {window.location.pathname}</p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-4">React Router Search Params:</h3>
          <div className="space-y-2">
            {Array.from(searchParams.entries()).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            {Array.from(searchParams.entries()).length === 0 && (
              <p className="text-gray-500">No search parameters found</p>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-4">Direct URLSearchParams:</h3>
          <div className="space-y-2">
            {Array.from(new URLSearchParams(window.location.search).entries()).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            {Array.from(new URLSearchParams(window.location.search).entries()).length === 0 && (
              <p className="text-gray-500">No search parameters found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
