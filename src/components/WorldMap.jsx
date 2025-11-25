import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ markers = [], density = 50 }) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#3b82f6", outline: "none", transition: "all 250ms" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset, value }) => (
          <Marker key={name} coordinates={coordinates}>
            <motion.circle
              r={4 + (value || 0) / 20}
              fill={value > 50 ? "#F00" : "#3b82f6"}
              stroke="#fff"
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: density / 100 }}
              transition={{ duration: 0.5, delay: Math.random() * 1 }}
            />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "10px", fontWeight: "bold" }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #334155',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F00' }}></span>
          <span>High Activity</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
          <span>Normal Activity</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
