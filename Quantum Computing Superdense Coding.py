from qiskit import QuantumCircuit, Aer, transpile, assemble, execute

# Create a 2-qubit superdense circuit
qc = QuantumCircuit(2)
qc.h(0)  # Apply Hadamard to first qubit
qc.cx(0, 1)  # Apply CNOT gate

qc.measure_all()
backend = Aer.get_backend('qasm_simulator')
result = execute(qc, backend, shots=1024).result()
counts = result.get_counts()

print("Superdense Coding Output:", counts)