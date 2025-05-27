"""
Tests for the cosmology simulation module
"""
import pytest
import numpy as np
from cosmology.simulation import NBodySimulation

def test_simulation_initialization():
    """Test that the simulation initializes correctly"""
    sim = NBodySimulation(num_particles=100, box_size=10.0)
    
    assert sim.num_particles == 100
    assert sim.box_size == 10.0
    assert sim.positions.shape == (100, 3)
    assert sim.velocities.shape == (100, 3)
    assert sim.masses.shape == (100,)

def test_simulation_run():
    """Test that the simulation runs and returns expected results"""
    sim = NBodySimulation(num_particles=50, box_size=5.0)
    results = sim.run(time_steps=10, dt=0.1)
    
    assert "trajectory" in results
    assert "final_positions" in results
    assert "final_velocities" in results
    assert "energy" in results
    assert "momentum" in results
    
    assert results["trajectory"].shape == (10, 50, 3)
    assert results["final_positions"].shape == (50, 3)
    assert isinstance(results["energy"], float)
    assert isinstance(results["momentum"], float)

def test_energy_calculation():
    """Test energy calculation"""
    sim = NBodySimulation(num_particles=10)
    
    # Set known velocities and masses for predictable energy
    sim.velocities = np.ones((10, 3))
    sim.masses = np.ones(10)
    
    energy = sim._calculate_energy()
    # Energy should be 0.5 * sum(m * v^2) = 0.5 * 10 * 3 = 15
    assert np.isclose(energy, 15.0)

def test_momentum_calculation():
    """Test momentum calculation"""
    sim = NBodySimulation(num_particles=10)
    
    # Set known velocities and masses for predictable momentum
    sim.velocities = np.ones((10, 3))
    sim.masses = np.ones(10)
    
    momentum = sim._calculate_momentum()
    # Momentum should be |sum(m * v)| = |10 * [1,1,1]| = |[10,10,10]| = 10*sqrt(3)
    assert np.isclose(momentum, 10 * np.sqrt(3))