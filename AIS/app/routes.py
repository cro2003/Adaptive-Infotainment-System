from flask import Blueprint, jsonify, request

api_blueprint = Blueprint("api", __name__)

# Profile-based Personalization: Adjust seat & steering based on profile
@api_blueprint.route("/personalization", methods=["POST"])
def personalize():
    profile = request.json.get("profile")
    if profile == "user1":
        response = {
            "message": "Welcome John Doe! Adjusting seat to upright and steering to medium height."
        }
    elif profile == "user2":
        response = {
            "message": "Welcome Jane Smith! Adjusting seat to reclined and steering to low height."
        }
    else:
        response = {"message": "Profile not found. Please try again."}
    return jsonify(response)

# Music Recommendation: Suggest a song based on profile
@api_blueprint.route("/music", methods=["GET"])
def recommend_music():
    # Mock recommendation based on profile; here we return a static suggestion
    music_recommendation = {"song": "Playing: Smooth Jazz - John Coltrane"}
    return jsonify(music_recommendation)

# Temperature & Climate Information: Display current temperature and climate settings
@api_blueprint.route("/temperature", methods=["GET"])
def temperature_info():
    # Mock data for current temperature and climate control setting
    temperature_data = {"temperature": 22, "climate": "cool"}
    return jsonify(temperature_data)

# Navigation and Route Information: Display route, estimated time, and traffic info
@api_blueprint.route("/navigation", methods=["GET"])
def navigation_info():
    # Mock route, estimated time, and traffic data
    navigation_data = {
        "route": "Home to Office",
        "time": "15 mins",
        "traffic": "Moderate traffic ahead"
    }
    return jsonify(navigation_data)
