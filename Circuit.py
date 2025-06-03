from qiskit import QuantumCircuit
from qiskit_aer import Aer

# Create a 2-qubit quantum circuit
qc = QuantumCircuit(2, 2)

# Entangle q0 and q1
qc.h(0)
qc.cx(0, 1)

# Encode classical bits (Example: Encode '11' with XZ gates)
qc.x(0)
qc.z(0)

# Decoding
qc.cx(0, 1)
qc.h(0)

# Measurement
qc.measure([0, 1], [0, 1])

# Simulate the circuit
backend = Aer.get_backend('qasm_simulator')
# The 'execute' function is deprecated. Use backend.run() instead.
job = backend.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()

print("Measurement Results:", counts)