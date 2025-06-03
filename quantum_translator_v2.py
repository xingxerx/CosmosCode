import re
from qiskit import QuantumCircuit
from qiskit.qasm2 import dumps

def generate_quantum_circuit():
    """
    Create a quantum circuit that includes a parameterized u gate, a CNOT gate, 
    and measurements of all qubits.
    """
    qc = QuantumCircuit(2)
    # Apply u gate to qubit 0 with parameters: theta=1.5708, phi=0, lambda=3.1415
    qc.u(1.5708, 0, 3.1415, 0)
    qc.cx(0, 1)
    qc.measure_all()
    return qc

def convert_parameter_to_binary(param):
    """
    Convert a numerical parameter to a 16-bit binary string.
    For demonstration we multiply the parameter by 10,000 to keep four decimal places.
    """
    try:
        value = float(param)
        scaled = int(value * 10000)
        # Represent in 16 bits; adjust width as needed
        return format(scaled, '016b')
    except ValueError:
        # If conversion fails, revert to an ASCII conversion
        return "".join(format(ord(c), '08b') for c in param)

def convert_qasm_to_binary(qasm_str):
    """
    Convert QASM code into a simplified binary representation.
    
    For the parameterized u gate, we use a specific mapping ("0100") followed by each parameter 
    converted to binary. For other known gates, we use a lookup mapping.
    Unknown tokens are converted to their ASCII binary representation.
    """
    binary_code = ""
    
    # Regex pattern to match a u gate line.
    # Example QASM: u(1.5708,0,3.1415) q[0];
    u_pattern = re.compile(r"^\s*u\(([^)]+)\)\s+(\w+\[\d+\]);")
    
    # Process each line in the QASM output
    for line in qasm_str.splitlines():
        # Skip header lines and register declarations
        if line.startswith("OPENQASM") or line.startswith("include") or \
           line.startswith("qreg") or line.startswith("creg"):
            continue

        # Check if the line matches the u gate pattern
        u_match = u_pattern.match(line)
        if u_match:
            # Use "0100" as the binary code for the u gate.
            binary_code += "0100 "  
            params_str = u_match.group(1)
            # Split parameters by commas and convert each one
            params = params_str.split(',')
            for p in params:
                binary_code += convert_parameter_to_binary(p.strip()) + " "
            continue

        # Process other gates using a basic regex for extracting the first word.
        match = re.match(r"^\s*(\w+)", line)
        if match:
            gate = match.group(1)
            gate_mapping = {
                "h": "0001",      # Hadamard gate
                "cx": "0010",     # CNOT gate
                "measure": "0011" # Measure operation
            }
            if gate in gate_mapping:
                binary_code += gate_mapping[gate] + " "
            else:
                # For unknown gate names, convert each character to an 8-bit ASCII binary.
                for char in gate:
                    binary_code += format(ord(char), '08b') + " "
                binary_code += " "
    return binary_code.strip()

def main():
    # Generate the quantum circuit
    qc = generate_quantum_circuit()
    
    # Export the circuit's QASM using qiskit.qasm2.dumps
    try:
        qasm_str = dumps(qc)
    except Exception as e:
        print("Error exporting QASM:", e)
        return

    print("QASM Output:")
    print(qasm_str)
    
    # Convert the QASM into our binary representation
    binary_representation = convert_qasm_to_binary(qasm_str)
    
    print("\nBinary Translation:")
    print(binary_representation)

if __name__ == '__main__':
    main()