from app.sensors.biometric_sensor import get_biometric_data

class HealthMonitorService:
    @staticmethod
    def analyze_health():
        data = get_biometric_data()
        recommendation = (
            "Play calming music" if data["stress_level"] == "high" else "Normal"
        )
        return {
            "biometric_data": data,
            "recommendation": recommendation
        }
