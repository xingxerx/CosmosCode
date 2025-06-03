import re
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.qasm2 import dumps

# ====================================================
#            Binary Translator Functions
# ====================================================

def convert_parameter_to_binary(param):
    """
    Convert a numerical parameter to a 16-bit binary string.
    Here we multiply the parameter by 10,000 to preserve four decimal places.
    """
    try:
        value = float(param)
        scaled = int(value * 10000)
        return format(scaled, '016b')
    except ValueError:
        # Fall back to ASCII binary conversion if not a valid float.
        return "".join(format(ord(c), '08b') for c in param)

def convert_qasm_to_binary(qasm_str):
    """
    Convert QASM output into a simplified binary representation.
    
    Supports:
      - Parameterized u gate (treated as u3): fixed code "0100"
      - Parameterized rx gate: fixed code "0111"
      - Parameterized ry gate: fixed code "1000"
      - Parameterized rz gate: fixed code "1001"
      - And other non-parameterized gates via a mapping.
    """
    binary_code = ""
    
    # Patterns for parameterized gates
    u_pattern = re.compile(r"^\s*u\(([^)]+)\)\s+(\w+\[\d+\]);")
    rx_pattern = re.compile(r"^\s*rx\(([^)]+)\)\s+(\w+\[\d+\]);")
    ry_pattern = re.compile(r"^\s*ry\(([^)]+)\)\s+(\w+\[\d+\]);")
    rz_pattern = re.compile(r"^\s*rz\(([^)]+)\)\s+(\w+\[\d+\]);")

    # Process each line of the QASM output.
    for line in qasm_str.splitlines():
        # Skip headers and declarations.
        if line.startswith("OPENQASM") or line.startswith("include") or \
           line.startswith("qreg") or line.startswith("creg"):
            continue

        # Check for parameterized u gate.
        m = u_pattern.match(line)
        if m:
            binary_code += "0100 "  # Fixed code for u gate.
            params_str = m.group(1)
            params = params_str.split(',')
            for p in params:
                binary_code += convert_parameter_to_binary(p.strip()) + " "
            continue

        # Check for rx gate.
        m = rx_pattern.match(line)
        if m:
            binary_code += "0111 "  # Fixed code for rx gate.
            params_str = m.group(1)
            params = params_str.split(',')
            for p in params:
                binary_code += convert_parameter_to_binary(p.strip()) + " "
            continue

        # Check for ry gate.
        m = ry_pattern.match(line)
        if m:
            binary_code += "1000 "  # Fixed code for ry gate.
            params_str = m.group(1)
            params = params_str.split(',')
            for p in params:
                binary_code += convert_parameter_to_binary(p.strip()) + " "
            continue

        # Check for rz gate.
        m = rz_pattern.match(line)
        if m:
            binary_code += "1001 "  # Fixed code for rz gate.
            params_str = m.group(1)
            params = params_str.split(',')
            for p in params:
                binary_code += convert_parameter_to_binary(p.strip()) + " "
            continue

        # For non-parameterized gates, extract the gate name.
        m = re.match(r"^\s*(\w+)", line)
        if m:
            gate = m.group(1)
            gate_mapping = {
                "h": "0001",         # Hadamard
                "cx": "0010",        # CNOT
                "measure": "0011",   # Measurement
                "x": "0101",         # Pauli-X
                "z": "0110",         # Pauli-Z
            }
            if gate in gate_mapping:
                binary_code += gate_mapping[gate] + " "
            else:
                # Fall back: convert each character to 8-bit ASCII.
                for char in gate:
                    binary_code += format(ord(char), '08b') + " "
                binary_code += " "
    return binary_code.strip()

# ====================================================
#      Superdense Coding Circuit Construction
# ====================================================

def superdense_coding_circuit(message='00'):
    """
    Constructs the full superdense coding circuit.
      - Creates a Bell pair.
      - Alice encodes a two-bit message on qubit 0.
      - Bob decodes the information and measures.
    """
    qc = QuantumCircuit(2, 2)
    
    # Create Bell pair.
    qc.h(0)
    qc.cx(0, 1)
    
    # Encoding operations: Alice encodes message.
    if message == '01':
        qc.x(0)
    elif message == '10':
        qc.z(0)
    elif message == '11':
        qc.x(0)
        qc.z(0)
    # '00' means no operation.
    
    # Decoding: Bob's operations.
    qc.cx(0, 1)
    qc.h(0)
    
    # Measurements.
    qc.measure(0, 0)
    qc.measure(1, 1)
    
    return qc

# ====================================================
#                   Main Function
# ====================================================

def main():
    # Choose a message to encode.
    message = '11'  # Options: '00', '01', '10', '11'
    qc = superdense_coding_circuit(message)
    
    # Export the QASM representation.
    qasm_str = dumps(qc)
    print("QASM Output:")
    print(qasm_str)
    
    # Generate binary translation from QASM.
    binary_representation = convert_qasm_to_binary(qasm_str)
    print("\nBinary Translation:")
    print(binary_representation)
    
    # Simulate the circuit.
    backend = Aer.get_backend('qasm_simulator')
    transpiled_circuit = transpile(qc, backend)
    job = backend.run(transpiled_circuit, shots=1024)
    counts = job.result().get_counts()
    print("\nSimulation Results (Decoded Message Distribution):")
    print(counts)
    
    # Display the circuit diagram graphically.
    # Using the matplotlib drawer. The circuit diagram is rendered as an image.
    diagram = qc.draw(output='mpl')
    # Show the diagram in a new window.
    plt.title("Superdense Coding Circuit Diagram")
    plt.show()

if __name__ == '__main__':
    main()