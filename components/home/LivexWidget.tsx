import { LivexChart } from './LivexChart';

export function LivexWidget() {
  return (
    <div className="bg-[#f4d35e] border-3 border-[#1C1C1C] rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="font-serif text-xl italic">Market Update 📊</h2>
        <p className="text-xs text-gray-700 mt-1">Liv-ex Fine Wine 100 • March 2026</p>
      </div>

      <div className="bg-white p-6">
        {/* Current Value & Performance */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-bold text-[#1C1C1C]">319.8</span>
            <span className="text-sm text-gray-500">Index Value</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#FAF7F2] rounded-lg">
              <p className="text-xs text-gray-500 mb-1">MoM</p>
              <p className="text-lg font-semibold text-gray-600">0%</p>
            </div>
            <div className="text-center p-3 bg-[#FAF7F2] rounded-lg">
              <p className="text-xs text-gray-500 mb-1">YTD</p>
              <p className="text-lg font-semibold text-green-600">+0.1%</p>
            </div>
            <div className="text-center p-3 bg-[#FAF7F2] rounded-lg">
              <p className="text-xs text-gray-500 mb-1">1yr</p>
              <p className="text-lg font-semibold text-red-600">-1.2%</p>
            </div>
          </div>
        </div>

        {/* Additional Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 bg-[#FAF7F2] rounded-lg">
            <p className="text-xs text-gray-500 mb-1">2yr</p>
            <p className="text-base font-semibold text-red-600">-10%</p>
          </div>
          <div className="text-center p-3 bg-[#FAF7F2] rounded-lg">
            <p className="text-xs text-gray-500 mb-1">5yr</p>
            <p className="text-base font-semibold text-red-600">-0.9%</p>
          </div>
        </div>

        {/* Live Chart */}
        <div className="mb-4">
          <LivexChart />
        </div>

        <p className="text-xs text-gray-500 mb-3">
          The Liv-ex Fine Wine 100 is the industry benchmark for fine wine prices, tracking 100 of the most sought-after wines.
        </p>

        <p className="text-xs text-gray-400">
          Data from{' '}
          <a
            href="https://www.liv-ex.com/resources/indices/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#722F37]"
          >
            Liv-ex.com
          </a>
        </p>
      </div>
    </div>
  );
}
