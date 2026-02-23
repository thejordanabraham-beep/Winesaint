"""
Extract wine region boundaries from INAO shapefile.
Each record is a parcel; this script dissolves all parcels per appellation
into a single region boundary, then simplifies and saves as GeoJSON.

The shapefile is in Lambert93 (EPSG:2154), needs converting to WGS84.
"""

import shapefile
import json
import math
import os
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

SHP_PATH = "/Users/jordanabraham/wine-reviews/data/inao/inao-extracted/2026-02-16_delim-parcellaire-aoc-shp.shp"
OUT_DIR = "/Users/jordanabraham/wine-reviews/data/boundaries"

# Lambert93 (EPSG:2154) to WGS84 conversion
# Using a simple approximation via pyproj if available, otherwise manual
def lambert93_to_wgs84(x, y):
    """Convert Lambert93 coordinates to WGS84 lon/lat."""
    # Lambert93 parameters
    n = 0.7256077650
    c = 11754255.426
    Xs = 700000.0
    Ys = 12655612.050
    e = 0.0818191910435
    a = 6378137.0
    
    r = math.sqrt((x - Xs)**2 + (y - Ys)**2)
    gamma = math.atan((x - Xs) / (Ys - y))
    
    lon_rad = gamma / n + math.radians(3.0)  # 3 degrees = central meridian
    
    lat_iso = -1/n * math.log(abs(r / c))
    
    # Iterative conversion from isometric to geographic latitude
    lat = 2 * math.atan(math.exp(lat_iso)) - math.pi/2
    for _ in range(10):
        e_sin = e * math.sin(lat)
        lat_new = 2 * math.atan(
            math.exp(lat_iso) * ((1 + e_sin) / (1 - e_sin))**(e/2)
        ) - math.pi/2
        if abs(lat_new - lat) < 1e-12:
            break
        lat = lat_new
    lat = lat_new
    
    return math.degrees(lon_rad), math.degrees(lat)

def convert_ring(ring):
    """Convert a list of Lambert93 coords to WGS84."""
    return [lambert93_to_wgs84(x, y) for x, y in ring]

def simplify_coords(coords, tolerance=0.001):
    """Simplify using shapely."""
    from shapely.geometry import Polygon, MultiPolygon
    try:
        geom = Polygon(coords) if len(coords) > 3 else None
        if geom and geom.is_valid:
            simplified = geom.simplify(tolerance, preserve_topology=True)
            if simplified.geom_type == 'Polygon':
                return list(simplified.exterior.coords)
            return coords
    except:
        pass
    return coords

# Target appellations: maps appellation name in shapefile -> our slug
TARGETS = {
    # Major Burgundy
    'Bourgogne': 'burgundy',
    'Beaujolais': 'beaujolais',
    'Chablis': 'chablis',
    
    # Burgundy sub-regions (no direct OSM match)
    'Côte de Nuits-Villages ou Vins fins de la Côte de Nuits': 'cote-de-nuits',
    'Côte de Beaune': 'cote-de-beaune',
    
    # Burgundy communes
    'Gevrey-Chambertin': 'gevrey-chambertin',
    'Chambolle-Musigny': 'chambolle-musigny',
    'Vosne-Romanée': 'vosne-romanee',
    'Nuits-Saint-Georges': 'nuits-saint-georges',
    'Beaune': 'beaune',
    'Pommard': 'pommard',
    'Meursault': 'meursault',
    'Puligny-Montrachet': 'puligny-montrachet',
    'Chassagne-Montrachet': 'chassagne-montrachet',
    'Savigny-lès-Beaune': 'savigny-les-beaune',
    
    # Burgundy Grand Crus
    'Chambertin': 'chambertin',
    'Chambertin-Clos de Bèze': 'chambertin-clos-de-beze',
    
    # Côte Chalonnaise
    'Mercurey': 'mercurey',
    'Rully': 'rully',
    'Givry': 'givry',
    
    # Rhône
    'Côtes du Rhône': 'rhone-valley',
    'Côte Rôtie': 'cote-rotie',
    
    # Bordeaux sub-regions
    'Côtes de Bordeaux': 'bordeaux',  # fallback
    
    # Other French regions
    'Côtes du Jura': 'jura',
    'Côtes du Roussillon': 'roussillon',
    'Côtes de Provence': 'provence',
}

os.makedirs(OUT_DIR, exist_ok=True)

print("Loading shapefile...")
sf = shapefile.Reader(SHP_PATH)
fields = [f[0] for f in sf.fields[1:]]
app_idx = fields.index('app')

print(f"Total records: {len(sf)}")

# Group shapes by appellation name
print("\nGrouping parcels by appellation...")
app_shapes = {}
for i in range(len(sf)):
    rec = sf.record(i)
    app_name = rec[app_idx]
    if app_name not in TARGETS:
        continue
    
    geom = sf.shape(i)
    if geom.shapeType == 0:  # NULL shape
        continue
    
    if app_name not in app_shapes:
        app_shapes[app_name] = []
    
    # Build shapely geometry from Lambert93 coords
    # shapeType 5 = Polygon
    if hasattr(geom, 'parts'):
        points = list(geom.points)
        parts = list(geom.parts)
        parts.append(len(points))
        
        rings = []
        for j in range(len(parts) - 1):
            ring_pts = points[parts[j]:parts[j+1]]
            if len(ring_pts) >= 4:
                rings.append(ring_pts)
        
        if rings:
            app_shapes[app_name].append(rings)

print(f"Found data for {len(app_shapes)} target appellations")

# Process each appellation
results = []
for app_name, all_rings in app_shapes.items():
    slug = TARGETS[app_name]
    print(f"\n  {app_name} → {slug}: {len(all_rings)} parcels")
    
    # Build shapely polygons from Lambert93 coords
    polys = []
    for rings in all_rings:
        try:
            from shapely.geometry import Polygon
            exterior = rings[0]
            interiors = rings[1:] if len(rings) > 1 else []
            poly = Polygon(exterior, interiors)
            if poly.is_valid and not poly.is_empty:
                polys.append(poly)
            elif not poly.is_valid:
                polys.append(poly.buffer(0))
        except Exception as e:
            pass
    
    if not polys:
        print(f"    ⚠ No valid polygons")
        continue
    
    # Dissolve all parcels into one shape
    dissolved = unary_union(polys)
    
    # Convert from Lambert93 to WGS84
    def convert_geom(geom):
        from shapely.geometry import Polygon, MultiPolygon
        if geom.geom_type == 'Polygon':
            ext = [lambert93_to_wgs84(x, y) for x, y in geom.exterior.coords]
            return Polygon(ext)
        elif geom.geom_type == 'MultiPolygon':
            converted = []
            for poly in geom.geoms:
                ext = [lambert93_to_wgs84(x, y) for x, y in poly.exterior.coords]
                converted.append(Polygon(ext))
            return MultiPolygon(converted)
        return geom
    
    wgs84 = convert_geom(dissolved)
    
    # Simplify (tolerance in degrees ~ 0.002 ≈ 200m)
    simplified = wgs84.simplify(0.002, preserve_topology=True)
    
    # Convert to GeoJSON geometry
    geojson_geom = mapping(simplified)
    
    # Count points
    def count_points(g):
        if g['type'] == 'Polygon':
            return sum(len(r) for r in g['coordinates'])
        elif g['type'] == 'MultiPolygon':
            return sum(sum(len(r) for r in poly) for poly in g['coordinates'])
        return 0
    
    pts = count_points(geojson_geom)
    print(f"    ✓ {geojson_geom['type']}: {pts} points after simplification")
    
    # Save GeoJSON
    out_path = os.path.join(OUT_DIR, f"{slug}.geojson")
    feature = {
        "type": "Feature",
        "properties": {"name": app_name, "slug": slug, "source": "INAO-2026"},
        "geometry": geojson_geom
    }
    with open(out_path, 'w') as f:
        json.dump(feature, f, separators=(',', ':'))
    
    print(f"    ✓ Saved {slug}.geojson ({os.path.getsize(out_path) // 1024} KB)")
    results.append({'name': app_name, 'slug': slug, 'points': pts, 'type': geojson_geom['type']})

print(f"\n\n=== COMPLETE: {len(results)} files saved ===")
for r in results:
    print(f"  {r['slug']}: {r['type']}, {r['points']} pts")
