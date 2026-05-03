function AppellationPanel({ feature, onDrillDown, onClose }) {
  if (!feature) return null;

  return (
    <div className="appellation-panel">
      <div className="appellation-panel-header">
        <div>
          <h3>{feature.name || 'Unknown'}</h3>
          <span className="country-label">{feature.country || ''}</span>
        </div>
        <button className="panel-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {feature.classification && (
        <dl className="panel-detail">
          <dt>Classification</dt>
          <dd>{
            feature.classification === 'lieu_dit' ? 'Lieu-dit' :
            feature.classification === 'einzellage' ? 'Einzellage' :
            feature.classification === 'ried' ? 'Ried' :
            feature.classification === 'grand_cru' ? 'Grand Cru' :
            feature.classification === 'grand_cru___heritage' ? 'Grand Cru / Heritage' :
            feature.classification === 'premier_cru' ? 'Premier Cru' :
            feature.classification === 'premier' ? 'Premier' :
            feature.classification === 'heritage' ? 'Heritage' :
            feature.classification === 'mga' ? 'MGA' :
            feature.classification
          }</dd>
        </dl>
      )}

      {feature.appellation && !feature.appellationType && (
        <dl className="panel-detail">
          <dt>Appellation</dt>
          <dd>{feature.appellation}</dd>
        </dl>
      )}

      {feature.commune && (
        <dl className="panel-detail">
          <dt>Commune</dt>
          <dd>{feature.commune}</dd>
        </dl>
      )}

      {feature.appellationType && (
        <dl className="panel-detail">
          <dt>Type</dt>
          <dd>{feature.appellationType}</dd>
        </dl>
      )}

      {feature.region && (
        <dl className="panel-detail">
          <dt>Region</dt>
          <dd>{feature.region}</dd>
        </dl>
      )}

      {feature.grapes && (
        <dl className="panel-detail">
          <dt>Key Grapes</dt>
          <dd>{feature.grapes}</dd>
        </dl>
      )}

      {feature.producers && (
        <dl className="panel-detail">
          <dt>Key Producers</dt>
          <dd>{feature.producers}</dd>
        </dl>
      )}

      {feature.rank && (
        <dl className="panel-detail">
          <dt>CA Top 200 Rank</dt>
          <dd>#{feature.rank}</dd>
        </dl>
      )}

      {feature.type === 'winery' && (
        <>
          {feature.address && (
            <dl className="panel-detail">
              <dt>Address</dt>
              <dd>{feature.address}</dd>
            </dl>
          )}
          {feature.production && (
            <dl className="panel-detail">
              <dt>Production</dt>
              <dd>{feature.production}</dd>
            </dl>
          )}
          {feature.tasting && (
            <dl className="panel-detail">
              <dt>Tours/Tasting</dt>
              <dd>{feature.tasting}</dd>
            </dl>
          )}
          {feature.website && (
            <dl className="panel-detail">
              <dt>Website</dt>
              <dd><a href={feature.website} target="_blank" rel="noopener noreferrer">{feature.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></dd>
            </dl>
          )}
          {feature.has_cave && feature.has_cave !== 'NO' && (
            <dl className="panel-detail">
              <dt>Wine Cave</dt>
              <dd>Yes</dd>
            </dl>
          )}
        </>
      )}

      {feature.operator && (
        <dl className="panel-detail">
          <dt>Operator</dt>
          <dd>{feature.operator}</dd>
        </dl>
      )}

      {feature.county && !feature.commune && (
        <dl className="panel-detail">
          <dt>County</dt>
          <dd>{feature.county}</dd>
        </dl>
      )}

      {feature.acres && (
        <dl className="panel-detail">
          <dt>Acres</dt>
          <dd>{feature.acres}</dd>
        </dl>
      )}

      {feature.since && (
        <dl className="panel-detail">
          <dt>Planted Since</dt>
          <dd>{feature.since}</dd>
        </dl>
      )}

      {feature.name_source && (
        <dl className="panel-detail">
          <dt>Source</dt>
          <dd>{feature.name_source}</dd>
        </dl>
      )}

      {feature.vineyard_type && (
        <dl className="panel-detail">
          <dt>Category</dt>
          <dd>{feature.vineyard_type === 'vineyard' ? 'Vineyard / Grower' : 'Winery'}</dd>
        </dl>
      )}

      {feature.vdp && (
        <dl className="panel-detail">
          <dt>VDP</dt>
          <dd>{feature.vdp === 'grosse_lage' ? 'Große Lage' : feature.vdp === 'erste_lage' ? 'Erste Lage' : feature.vdp}</dd>
        </dl>
      )}

      {feature.hierarchyLevel && feature.hierarchyLevel !== 'appellation' && (
        <button
          className="drill-down-btn"
          onClick={() => onDrillDown(feature)}
        >
          Explore sub-regions &rarr;
        </button>
      )}
    </div>
  );
}

export default AppellationPanel;
