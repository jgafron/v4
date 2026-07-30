import React, { useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { usePrefersReducedMotion } from '@hooks';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import countries from '../data/countries-110m.json';

const WIDTH = 1000;
const HEIGHT = 625;

const dash = keyframes`
  to { stroke-dashoffset: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(1.8); opacity: 0; }
`;

const StyledMapWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 320px;
  margin-top: 10px;
  aspect-ratio: 1.6 / 1;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
    min-height: 260px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    min-height: 180px;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    background: transparent !important;
    -webkit-mask-image: radial-gradient(
      105% 78% at 50% 58%,
      #000 63%,
      rgba(0, 0, 0, 0.85) 78%,
      rgba(0, 0, 0, 0.35) 90%,
      transparent 100%
    );
    mask-image: radial-gradient(
      105% 78% at 50% 58%,
      #000 63%,
      rgba(0, 0, 0, 0.85) 78%,
      rgba(0, 0, 0, 0.35) 90%,
      transparent 100%
    );
  }

  .route {
    fill: none;
    stroke: var(--green);
    stroke-width: 1.1;
    stroke-linecap: round;
    stroke-opacity: 0.4;
    pointer-events: none;

    &[data-animate='true'] {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ${dash} 1200ms var(--easing) forwards;
    }
  }

  .route--default {
    stroke-opacity: 0.28;
  }

  .route--active {
    stroke-opacity: 0.6;
  }

  .marker {
    cursor: default;
  }

  .node {
    fill: var(--green);
  }

  .node--home {
    r: 4.5;
  }

  .node--city {
    r: 3.5;
  }

  .ring {
    fill: none;
    stroke: var(--green);
    stroke-width: 1;
    opacity: 0.35;
    transform-origin: center;

    &[data-animate='true'] {
      animation: ${pulse} 2400ms ease-out infinite;
    }
  }

  .label {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    fill: var(--lightest-slate);
    paint-order: stroke;
    stroke: var(--navy);
    stroke-width: 3px;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
    pointer-events: none;
  }

  .marker:focus-visible .label,
  .marker:hover .label {
    opacity: 1;
  }

  .focus-ring {
    fill: none;
    stroke: var(--green);
    stroke-width: 2;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
  }

  .marker:focus-visible .focus-ring {
    opacity: 0.9;
  }
`;

const TravelMap = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const places = useMemo(
    () => ({
      home: { name: 'Portland, Oregon', lat: 45.5152, lon: -122.6784 },
      cities: [
        { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
        { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
        { name: 'New York City, NY', lat: 40.7128, lon: -74.006 },
        { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018 },
        { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
        { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041 },
        { name: 'Barcelona, Spain', lat: 41.3874, lon: 2.1686 },
        { name: 'Las Vegas, NV', lat: 36.1699, lon: -115.1398 },
        { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
        { name: 'Salt Lake City, UT', lat: 40.7608, lon: -111.891 },
        { name: 'Tucson, AZ', lat: 32.2226, lon: -110.9747 },
        { name: 'Cerbère, France', lat: 42.4428, lon: 3.1654 },
      ],
    }),
    [],
  );

  const home = places.home;
  const cityPoints = places.cities;

  const [activeCity, setActiveCity] = useState(null);

  // Match the ComposableMap projection for custom paths
  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(225)
        .translate([WIDTH / 2, HEIGHT / 2]),
    [],
  );

  // Build a restrained cubic Bezier for all routes, with lift based on route length
  const getArcPath = useMemo(() => {
    const minLift = HEIGHT * 0.03; // flatter for short domestic routes
    const maxLift = HEIGHT * 0.11; // slightly higher for long international routes
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const ease = t => t * (2 - t); // easeOutQuad
    return (fromLonLat, toLonLat, cityName) => {
      const [x0, y0] = projection(fromLonLat);
      const [x1, y1] = projection(toLonLat);
      const d = Math.hypot(x1 - x0, y1 - y0);
      const dn = clamp(d / (WIDTH * 0.7), 0, 1);
      let lift = minLift + (maxLift - minLift) * ease(dn);
      if (cityName === 'Bangkok, Thailand') {
        lift -= HEIGHT * 0.01; // keep slightly lower so it remains distinguishable from Tokyo
      }
      lift = clamp(lift, minLift, maxLift);
      const cy = Math.min(y0, y1) - lift;
      const cx1 = x0;
      const cx2 = x1;
      return `M ${x0},${y0} C ${cx1},${cy} ${cx2},${cy} ${x1},${y1}`;
    };
  }, [projection]);

  return (
    <StyledMapWrapper>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 225 }}
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="Travel map: journeys from Portland, Oregon">
        <g transform="translate(0,-6)">
          <Geographies geography={countries}>
            {({ geographies }) => {
              const filtered = geographies.filter(geo => {
                const properties = geo.properties || {};
                const countryName = String(
                  properties.name || properties.NAME || properties.ADMIN || '',
                ).toLowerCase();
                const iso3 = String(properties.iso_a3 || properties.ISO_A3 || '').toUpperCase();
                const id = geo.id;
                const isAntarctica =
                  countryName.includes('antarctica') ||
                  iso3 === 'ATA' ||
                  id === '010' ||
                  id === 10 ||
                  id === 'AQ';
                return !isAntarctica;
              });
              return filtered.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--light-navy)"
                  stroke="none"
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ));
            }}
          </Geographies>

          {/* All routes as restrained arcs from Portland to each destination */}
          {cityPoints.map((c, i) => (
            <path
              key={`route-${i}`}
              d={getArcPath([home.lon, home.lat], [c.lon, c.lat], c.name)}
              stroke="var(--green)"
              strokeWidth={1.1}
              className="route route--default"
              data-animate={!prefersReducedMotion}
              pathLength={1}
              fill="none"
            />
          ))}

          {/* Active route on marker hover/focus, using the same restrained curve */}
          {activeCity && (
            <path
              key={`active-route-${activeCity.name}`}
              d={getArcPath(
                [home.lon, home.lat],
                [activeCity.lon, activeCity.lat],
                activeCity.name,
              )}
              stroke="var(--green)"
              strokeWidth={1.1}
              className="route route--active"
              data-animate={!prefersReducedMotion}
              pathLength={1}
              fill="none"
            />
          )}

          <Marker coordinates={[home.lon, home.lat]}>
            <g className="marker" tabIndex={0} aria-label={`${home.name} (home)`}>
              <circle className="focus-ring" r={8} />
              <circle className="node node--home" r={4.5} />
              {!prefersReducedMotion && (
                <circle className="ring" r={6.5} data-animate={!prefersReducedMotion} />
              )}
              <text className="label" x={10} y={-8}>
                {home.name}
              </text>
            </g>
          </Marker>

          {cityPoints.map((c, i) => (
            <Marker key={`city-${i}`} coordinates={[c.lon, c.lat]}>
              <g
                className="marker"
                tabIndex={0}
                aria-label={c.name}
                onMouseEnter={() => setActiveCity(c)}
                onMouseLeave={() => setActiveCity(null)}
                onFocus={() => setActiveCity(c)}
                onBlur={() => setActiveCity(null)}>
                <circle className="focus-ring" r={7} />
                <circle className="node node--city" r={3.5} />
                {!prefersReducedMotion && (
                  <circle className="ring" r={5.5} data-animate={!prefersReducedMotion} />
                )}
                <text className="label" x={10} y={-6}>
                  {c.name}
                </text>
              </g>
            </Marker>
          ))}
        </g>
      </ComposableMap>
    </StyledMapWrapper>
  );
};

export default TravelMap;
