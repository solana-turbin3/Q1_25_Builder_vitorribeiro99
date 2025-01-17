import base58

# Base58 encoded private key
base58_key = ""

# Decode the base58 string into a byte array
decoded_private_key = base58.b58decode(base58_key)

# Convert the byte array to a list of integers
byte_array = list(decoded_private_key)
print(byte_array)
