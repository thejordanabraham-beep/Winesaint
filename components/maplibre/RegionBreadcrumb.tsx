'use client';
function RegionBreadcrumb({ stack, onNavigate }) {
  if (!stack || stack.length <= 1) return null;

  return (
    <nav className="breadcrumb">
      {stack.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          <button
            className={`breadcrumb-item ${index === stack.length - 1 ? 'active' : ''}`}
            onClick={() => index < stack.length - 1 && onNavigate(index)}
            disabled={index === stack.length - 1}
          >
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  );
}

export default RegionBreadcrumb;
