import React, { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ markers = [], density = 50 }) => {
  // Better initial centering - focus on main continents, less Antarctica
  const [position, setPosition] = useState({ coordinates: [0, 10], zoom: 1 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMoveStart = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleMoveEnd = useCallback((position) => {
    setPosition(position);
  }, []);

  const handleZoomIn = () => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * 1.5, 8)
    }));
  };

  const handleZoomOut = () => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / 1.5, 1)
    }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 10], zoom: 1 });
    setSelectedMarker(null);
  };

  const handleMarkerClick = (e, marker) => {
    e.stopPropagation();
    setSelectedMarker(marker);
    const mapContainer = e.currentTarget.closest('div[style*="position"]');
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      setTooltipPosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Helper function to determine marker color - all markers are red
  const getMarkerColor = (value) => {
    return '#F00'; // All markers are red
  };

  // Helper function to get marker size
  const getMarkerSize = (value) => {
    if (typeof value === 'string') {
      return 6; // Default size for string values
    }
    return 4 + (value || 0) / 20;
  };

  // Helper function to check if a point is inside a polygon (point-in-polygon algorithm)
  const pointInPolygon = (point, polygon) => {
    if (!polygon || polygon.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Check if a country contains any marker
  const countryHasMarker = (geo) => {
    if (!markers || markers.length === 0) return false;
    if (!geo.geometry || !geo.geometry.coordinates) return false;
    
    const geometryType = geo.geometry.type;
    const coords = geo.geometry.coordinates;
    
    // Check each marker
    for (const marker of markers) {
      const [lon, lat] = marker.coordinates;
      
      try {
        if (geometryType === 'Polygon') {
          // Polygon: coordinates is an array of rings (first is exterior, rest are holes)
          if (pointInPolygon([lon, lat], coords[0])) {
            return true;
          }
        } else if (geometryType === 'MultiPolygon') {
          // MultiPolygon: array of polygons
          for (const polygon of coords) {
            if (polygon && polygon[0] && pointInPolygon([lon, lat], polygon[0])) {
              return true;
            }
          }
        }
      } catch (error) {
        // Silently continue if there's an error with this geometry
        continue;
      }
    }
    return false;
  };

  return (
    <div 
      style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
      onClick={() => {
        setSelectedMarker(null);
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20], // Center slightly north to reduce Antarctica visibility
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveStart={handleMoveStart}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const hasMarker = countryHasMarker(geo);
                const defaultFill = hasMarker ? "#F00" : "#3b82f6"; // Red if has marker, blue otherwise
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={defaultFill}
                    stroke="#334155"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        fill: hasMarker ? "#ff4444" : "#60a5fa", 
                        outline: "none", 
                        transition: "all 250ms"
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset, value, description }) => (
            <Marker key={name} coordinates={coordinates}>
              <g
                onClick={(e) => handleMarkerClick(e, { name, coordinates, value, description })}
                style={{ cursor: "pointer" }}
              >
                <motion.circle
                  r={getMarkerSize(value)}
                  fill={getMarkerColor(value)}
                  stroke="#fff"
                  strokeWidth={selectedMarker?.name === name ? 3 : 2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: selectedMarker?.name === name ? 1.3 : 1, 
                    opacity: density / 100 
                  }}
                  transition={{ duration: 0.3 }}
                />
                {/* No text displayed by default - only in tooltip */}
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '8px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '8px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleReset}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '8px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Tooltip for Marker - Only shows when marker is clicked */}
      <AnimatePresence>
        {selectedMarker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 10}px`,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              padding: '12px 16px',
              zIndex: 1000,
              pointerEvents: 'none',
              maxWidth: '300px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              transform: 'translateX(-50%)'
            }}
          >
            <div style={{ 
              fontSize: '0.95rem', 
              fontWeight: 'bold', 
              color: '#f8fafc', 
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {selectedMarker.name}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              color: '#94a3b8',
              marginBottom: selectedMarker.description ? '4px' : '6px'
            }}>
              <span style={{ color: '#64748b' }}>Status:</span>{' '}
              <span style={{ 
                color: getMarkerColor(selectedMarker.value), 
                fontWeight: '600' 
              }}>
                {typeof selectedMarker.value === 'string' ? selectedMarker.value : `Value: ${selectedMarker.value}`}
              </span>
            </div>
            {selectedMarker.description && (
              <div style={{
                fontSize: '0.8rem',
                color: '#e2e8f0',
                marginBottom: '6px',
                lineHeight: '1.5'
              }}>
                {selectedMarker.description}
              </div>
            )}
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#64748b', 
              marginTop: '4px',
              fontFamily: 'monospace'
            }}>
              [{selectedMarker.coordinates[0].toFixed(4)}, {selectedMarker.coordinates[1].toFixed(4)}]
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #334155',
        fontSize: '0.8rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F00' }}></span>
          <span>High Activity</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
          <span>Normal Activity</span>
        </div>
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid #334155',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          💡 Drag to pan, scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
