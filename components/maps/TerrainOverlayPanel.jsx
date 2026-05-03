function TerrainOverlayPanel({ overlays, onToggle, onClose }) {
  const items = [
    { key: 'contours', label: 'Contour Lines', desc: 'Elevation contour lines' },
    { key: 'slope', label: 'Slope Analysis', desc: 'Steepness coloring' },
    { key: 'aspect', label: 'Sun Exposure', desc: 'Hillside orientation (N/S/E/W)' },
    { key: 'drainage', label: 'Waterways', desc: 'Rivers and streams' },
  ];

  return (
    <div className="terrain-overlay-panel">
      <div className="terrain-overlay-header">
        <span>Terrain Analysis</span>
        <button className="panel-close" onClick={onClose}>&times;</button>
      </div>
      {items.map(({ key, label, desc }) => (
        <label key={key} className="terrain-overlay-item">
          <input
            type="checkbox"
            checked={overlays[key] || false}
            onChange={() => onToggle(key)}
          />
          <div>
            <span className="terrain-overlay-label">{label}</span>
            <span className="terrain-overlay-desc">{desc}</span>
          </div>
        </label>
      ))}
      {(overlays.slope || overlays.aspect) && (
        <div className="terrain-overlay-legend">
          {overlays.slope && (
            <div className="legend-row">
              <span className="legend-title">Slope</span>
              <div className="legend-gradient slope-gradient" />
              <div className="legend-labels">
                <span>0°</span><span>15°</span><span>35°+</span>
              </div>
            </div>
          )}
          {overlays.aspect && (
            <div className="legend-row">
              <span className="legend-title">Aspect</span>
              <div className="legend-gradient aspect-gradient" />
              <div className="legend-labels">
                <span>N</span><span>E</span><span>S</span><span>W</span><span>N</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TerrainOverlayPanel;
