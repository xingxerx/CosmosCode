import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { processSimulationData } from '../../utils/dataProcessing';

const CosmologyVisualizer = ({ simulationData, options = {} }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current || !simulationData) return;
    
    // Initialize Three.js scene if not already created
    if (!sceneRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);
      
      // Add controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      
      sceneRef.current = { scene, camera, renderer, controls };
    }
    
    // Process and visualize data
    const { scene } = sceneRef.current;
    const particles = processSimulationData(simulationData);
    
    // Clear previous visualization
    scene.children = scene.children.filter(child => !(child instanceof THREE.Points));
    
    // Add new visualization
    scene.add(particles);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sceneRef.current.controls.update();
      sceneRef.current.renderer.render(scene, sceneRef.current.camera);
    };
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current && sceneRef.current) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, [simulationData, options]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '500px' }}
      className="cosmology-visualizer"
    />
  );
};

export default CosmologyVisualizer;