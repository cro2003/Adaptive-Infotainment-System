class PersonalizationService:
    @staticmethod
    def adjust_settings(user_profile):
        # Mock adjusting user settings
        response = {
            "message": f"Settings adjusted for {user_profile['name']}.",
            "preferences": {
                "seat_position": user_profile.get("seat_position", "default"),
                "climate": user_profile.get("climate", "default"),
                "music": user_profile.get("music", "default")
            }
        }
        return response
