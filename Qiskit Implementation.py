from qiskit import QuantumCircuit
from qiskit_aer import Aer

qc = QuantumCircuit(2, 2)

# Step 1: Create Entanglement
qc.h(0)  # Hadamard gate puts q0 in superposition
qc.cx(0, 1)  # CNOT gate entangles q0 and q1

# Step 2: Encode Secure Key (Example: '11')
qc.x(0)  # X gate flips q0
qc.z(0)  # Z gate applies phase shift

# Step 3: Decode & Measure
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])

# Simulating the Quantum Key Exchange
backend = Aer.get_backend('qasm_simulator')
# The 'execute' function is deprecated. Use backend.run() instead.
job = backend.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()
print("Quantum Key Distribution Output:", counts)