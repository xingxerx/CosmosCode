import re
from qiskit import QuantumCircuit, Aer, execute
from qiskit.qasm2 import dumps

def superdense_coding_circuit(message='00'):
    """
    Constructs a full superdense coding circuit.
    
    Parameters:
      message (str): A two-bit string ('00', '01', '10', or '11') that Alice wants to encode.
    
    Choices:
      - '00': Do nothing.
      - '01': Apply X on qubit 0.
      - '10': Apply Z on qubit 0.
      - '11': Apply X then Z on qubit 0.
      
    Returns:
      QuantumCircuit: Circuit that implements the superdense coding protocol.
    """
    # Create a quantum circuit with 2 qubits and 2 classical bits.
    qc = QuantumCircuit(2, 2)
    
    # Step 1: Create a Bell pair (entangled state).
    qc.h(0)
    qc.cx(0, 1)
    
    # Step 2: Alice encodes her two-bit message via a Pauli operation on qubit 0.
    if message == '01':
        qc.x(0)  # encode '01'
    elif message == '10':
        qc.z(0)  # encode '10'
    elif message == '11':
        qc.x(0)
        qc.z(0)  # encode '11'
    # '00' means send the qubit without any additional transformation.
    
    # Step 3: Bob decodes the message.
    # Bob applies the decoding operations to recover the two classical bits.
    qc.cx(0, 1)
    qc.h(0)
    
    # Step 4: Measure the qubits to read out the classical bits (the decoded message).
    qc.measure(0, 0)
    qc.measure(1, 1)
    
    return qc

def main():
    # Choose the two-bit message to encode.
    message = '11'
    qc = superdense_coding_circuit(message)
    
    # Export the circuit's QASM representation.
    qasm_str = dumps(qc)
    print("QASM Output:")
    print(qasm_str)
    
    # Optionally, simulate the circuit on a simulator to verify the output.
    backend = Aer.get_backend('qasm_simulator')
    job = execute(qc, backend, shots=1024)
    counts = job.result().get_counts()
    
    print("\nSimulation Results (Decoded Message Distribution):")
    print(counts)
    
    # For additional fun, you could revisit our binary translator to further extend its mapping
    # and convert this expanded QASM into a binary representation.
    
if __name__ == '__main__':
    main()