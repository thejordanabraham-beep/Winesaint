'use client';

export function LivexChart() {
  // Simplified data points from Liv-ex Fine Wine 100 (2022-2024)
  // Based on the chart from the PDF showing the trend
  const dataPoints = [
    { date: 'Jan 22', value: 325 },
    { date: 'Apr 22', value: 360 },
    { date: 'Jul 22', value: 405 },
    { date: 'Oct 22', value: 420 },
    { date: 'Jan 23', value: 410 },
    { date: 'Apr 23', value: 395 },
    { date: 'Jul 23', value: 385 },
    { date: 'Oct 23', value: 375 },
    { date: 'Jan 24', value: 365 },
    { date: 'Mar 24', value: 355 },
    { date: 'Now', value: 320 },
  ];

  const width = 320;
  const height = 180;
  const padding = 30;

  // Calculate scales
  const minValue = 280;
  const maxValue = 450;
  const xStep = (width - padding * 2) / (dataPoints.length - 1);

  // Convert data to SVG coordinates
  const points = dataPoints.map((point, index) => {
    const x = padding + index * xStep;
    const y = height - padding - ((point.value - minValue) / (maxValue - minValue)) * (height - padding * 2);
    return { x, y, ...point };
  });

  // Create path string
  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[minValue, 325, 375, 425].map((value) => {
          const y = height - padding - ((value - minValue) / (maxValue - minValue)) * (height - padding * 2);
          return (
            <g key={value}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Area fill under the line */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke="#6d597a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#6d597a"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels (show only some) */}
        {points.filter((_, i) => i % 3 === 0 || i === points.length - 1).map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 10}
            fontSize="9"
            fill="#6b7280"
            textAnchor="middle"
          >
            {point.date}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d597a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6d597a" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      <p className="text-xs text-gray-400 text-center mt-2">
        2022 - 2026 Performance Trend
      </p>
    </div>
  );
}
