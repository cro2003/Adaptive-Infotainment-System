from app.sensors.engine_sensor import get_engine_data

class MaintenanceService:
    @staticmethod
    def analyze_engine():
        data = get_engine_data()
        alerts = []
        if data["fuel_level"] < 20:
            alerts.append("Low fuel level! Refuel soon.")
        if data["engine_temp"] > 100:
            alerts.append("High engine temperature! Take a break.")
        return {
            "engine_data": data,
            "alerts": alerts
        }
