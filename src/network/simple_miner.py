import hashlib
import time

def calculate_sha256(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def mine_block(block_number, transactions, previous_hash, difficulty_zeros):
    """
    Simulates Bitcoin mining by finding a nonce that produces a hash
    with the specified number of leading zeros.
    """
    prefix_string = '0' * difficulty_zeros
    nonce = 0
    start_time = time.time()

    print(f"Starting to mine block {block_number} with difficulty {difficulty_zeros}...")

    while True:
        # Concatenate block data and nonce
        text = str(block_number) + transactions + previous_hash + str(nonce)
        current_hash = calculate_sha256(text)

        if current_hash.startswith(prefix_string):
            end_time = time.time()
            time_taken = end_time - start_time
            print(f"\nBlock mined! Hash: {current_hash}")
            print(f"Nonce: {nonce}")
            print(f"Time taken: {time_taken:.4f} seconds")
            return current_hash, nonce
        
        nonce += 1
        # Optional: Print progress periodically (can slow down for very high difficulty)
        if nonce % 100000 == 0:
            print(f"Trying nonce {nonce}, current hash: {current_hash[:difficulty_zeros+5]}...", end='\r')

if __name__ == "__main__":
    # Example block data
    block_num = 1
    transaction_data = "Alice sends 5 BTC to Bob; Charlie sends 2 BTC to Dave"
    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000" # Genesis block's previous hash (or a placeholder)
    
    # Difficulty: Number of leading zeros the hash must have
    # For demonstration, start with a low number (e.g., 4 or 5).
    # Bitcoin's actual difficulty is *much* higher, often 18+ leading zeros,
    # making it computationally infeasible for a CPU.
    difficulty = 5 

    mined_hash, found_nonce = mine_block(block_num, transaction_data, prev_hash, difficulty)
    print(f"Mined block details: Block #{block_num}, Nonce: {found_nonce}, Hash: {mined_hash}")