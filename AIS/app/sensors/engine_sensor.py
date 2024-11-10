import random

def get_engine_data():
    return {
        "fuel_level": random.randint(10, 100),
        "engine_temp": random.randint(60, 120),
        "mileage": random.uniform(10.0, 20.0)
    }
