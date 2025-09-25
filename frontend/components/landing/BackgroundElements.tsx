
"use client";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import * as topojson from "topojson-client";
import { schemeCategory10 } from "d3-scale-chromatic";
import { color as d3color } from "d3-color";
import { motion } from "framer-motion";

import { useScroll, useTransform } from "framer-motion";

interface BackgroundElementsProps {
  backgroundY: any;
}

// Wireframe globe
function Globe() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial
        color="#4cc9f0"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Country borders
function CountryBorders() {
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    // Fetch world topojson (small file, e.g. from unpkg)
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
      .then((res) => res.json())
      .then((topology) => {
        const geo = topojson.feature(topology, topology.objects.countries);
        setFeatures(geo.features);
      });
  }, []);

  // Project lat/lon to sphere
  function project([lon, lat]: [number, number], r = 2) {
    const phi = (lon * Math.PI) / 180;
    const theta = ((90 - lat) * Math.PI) / 180;
    return [
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta),
    ];
  }

  return (
    <group>
      {features.map((feature, i) => {
        // Each country: draw border as line
        const coords = feature.geometry.coordinates;
        // MultiPolygon or Polygon
        const polygons = feature.geometry.type === "MultiPolygon" ? coords : [coords];
        return polygons.map((poly: any, j: number) => {
          // Each poly: array of rings
          return poly.map((ring: any, k: number) => {
            const points = ring.map((pt: [number, number]) => project(pt));
            const d3c = d3color(schemeCategory10[i % schemeCategory10.length]);
            const color = d3c ? d3c.formatHex() : schemeCategory10[i % schemeCategory10.length];
            return (
              <line key={`${i}-${j}-${k}`}> 
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(points.flat()), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.7} linewidth={1} />
              </line>
            );
          });
        });
      })}
    </group>
  );
}

// Random arcs between globe points
function Connections() {
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate random start/end points on the sphere surface
  const lines = useMemo(() => {
    const positions: number[] = [];
    const N = 30; 
    for (let i = 0; i < N; i++) {
      const phi1 = Math.random() * Math.PI * 2;
      const theta1 = Math.acos(2 * Math.random() - 1);
      const phi2 = Math.random() * Math.PI * 2;
      const theta2 = Math.acos(2 * Math.random() - 1);

      const r = 2;
      const x1 = r * Math.sin(theta1) * Math.cos(phi1);
      const y1 = r * Math.sin(theta1) * Math.sin(phi1);
      const z1 = r * Math.cos(theta1);

      const x2 = r * Math.sin(theta2) * Math.cos(phi2);
      const y2 = r * Math.sin(theta2) * Math.sin(phi2);
      const z2 = r * Math.cos(theta2);

      positions.push(x1, y1, z1, x2, y2, z2);
    }
    return new Float32Array(positions);
  }, []);

  // Animate line opacity flickering
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[lines, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ff6ec7"
        transparent
        opacity={0.5}
        linewidth={2}
      />
    </lineSegments>
  );
}

// Combine globe + connections + country borders
function InternetGlobe() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <group ref={group}>
      <Globe />
      <CountryBorders />
      <Connections />
    </group>
  );
}

const BackgroundElements: React.FC<BackgroundElementsProps> = ({ backgroundY }) => {
  const { scrollYProgress } = useScroll();
  const globeOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ y: backgroundY, opacity: globeOpacity }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={.7} color={"#ff80b5"} />

        <InternetGlobe />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </motion.div>
  );
};

export default BackgroundElements;
