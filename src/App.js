import LiveLocationTracker from './Components/LiveLocationTracker';
import NetworkStatusChecker from './Components/NetworkStatusChecker';
import IdleMonitor from './Components/IdleMonitor';
import LazyLoadTips from './Components/LazyLoadTips';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🚨 Safe Spot Finder
        </h1>
        <LiveLocationTracker />
        <NetworkStatusChecker />
        <IdleMonitor/>
        <LazyLoadTips/>
      </div>
    </div>
  );
}

export default App;