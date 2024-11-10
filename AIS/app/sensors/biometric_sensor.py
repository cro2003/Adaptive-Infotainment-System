import random

def get_biometric_data():
    return {
        "heart_rate": random.randint(60, 100),
        "stress_level": random.choice(["low", "medium", "high"])
    }
