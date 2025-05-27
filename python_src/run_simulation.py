#!/usr/bin/env python
"""
Script to run simulations from command line or Node.js
"""
import argparse
import json
import sys
import numpy as np
from cosmology.simulation import NBodySimulation

def main():
    """Main entry point for the simulation runner"""
    parser = argparse.ArgumentParser(description='Run a cosmological simulation')
    parser.add_argument('--input', required=True, help='Input JSON file with parameters')
    parser.add_argument('--output', required=True, help='Output JSON file for results')
    
    args = parser.parse_args()
    
    try:
        # Read parameters from input file
        with open(args.input, 'r') as f:
            params = json.load(f)
        
        # Create and run simulation
        sim = NBodySimulation(
            num_particles=params.get('particles', 100),
            box_size=params.get('boxSize', 10.0)
        )
        
        results = sim.run(
            time_steps=params.get('timeSteps', 100),
            dt=params.get('dt', 0.01)
        )
        
        # Convert numpy arrays to lists for JSON serialization
        serializable_results = {
            'id': f"py-sim-{np.random.randint(10000)}",
            'type': params.get('type', 'n-body'),
            'particles': params.get('particles', 100),
            'energy': float(results['energy']),
            'momentum': float(results['momentum']),
            # Only include a sample of the trajectory to keep the output manageable
            'trajectory_sample': results['trajectory'][::10].tolist() if len(results['trajectory']) > 10 else results['trajectory'].tolist(),
            'final_positions': results['final_positions'].tolist()
        }
        
        # Write results to output file
        with open(args.output, 'w') as f:
            json.dump(serializable_results, f)
            
        print(f"Simulation completed successfully. Results written to {args.output}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Error running simulation: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()