import math
def calculate_signal_strength(distance_km, frequency_ghz):
    # Simplified signal strength calculation
    signal_strength = 100 - (distance_km * frequency_ghz)
    return signal_strength
# Example usage:
distance_km = 1000  # distance to satellite
frequency_ghz = 20   # frequency band
signal_strength = calculate_signal_strength(distance_km, frequency_ghz)
print("Signal Strength:", signal_strength)
