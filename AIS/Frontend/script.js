const API_BASE_URL = "http://127.0.0.1:5000/api"; // Base URL of the Flask API
let map, routeLayer;

// Function to speak text using the Web Speech API with error handling
function speak(text, delay = 0) {
  const utterance = new SpeechSynthesisUtterance(text);

  // Find Indian English voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianVoice =
    voices.find((voice) => voice.lang === "en-IN") ||
    voices.find((voice) => voice.lang.startsWith("en"));

  if (indianVoice) {
    utterance.voice = indianVoice;
    console.log("Using Indian English voice:", indianVoice.name);
  } else {
    console.log("Indian English voice not found, using default voice.");
  }

  utterance.onstart = () => console.log("Speech started:", text);
  utterance.onend = () => console.log("Speech ended");
  utterance.onerror = (event) =>
    console.error("SpeechSynthesis error:", event.error);

  // Use setTimeout to add delay
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, delay);
}
// Function to initialize the map only once
function initializeMap() {
  if (!map) {
    // Initialize only if map hasn't been created
    map = L.map("map").setView([0, 0], 13); // Set initial view

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    routeLayer = L.layerGroup().addTo(map);
  }
}

// Function to navigate between steps and adjust map when needed
function nextStep(stepId) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => (step.style.display = "none"));
  document.getElementById(stepId).style.display = "block";

  // If navigating to the map step, ensure map is initialized and resized
  if (stepId === "route-info") {
    initializeMap();
    setTimeout(() => map.invalidateSize(), 100); // Resize map after display
  }
  if (stepId === "navigation-suggestion") {
    speak("Would you like to go to your frequently visited place?");
  }
}

// Function to fetch and display route from current location to a random destination
function getRouteInfo() {
  console.log("getRouteInfo triggered");
  initializeMap();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const randomDestination = generateRandomDestination(
        userLat,
        userLng,
        5000,
      );
      const destinationLat = randomDestination.lat;
      const destinationLng = randomDestination.lng;

      map.setView([userLat, userLng], 13);

      const routingUrl = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${destinationLng},${destinationLat}?overview=full&geometries=geojson`;

      fetch(routingUrl)
        .then((response) => response.json())
        .then((data) => {
          const route = data.routes[0].geometry;
          routeLayer.clearLayers();
          L.geoJSON(route, {
            style: { color: "blue", weight: 4 },
          }).addTo(routeLayer);

          const distance = (data.routes[0].distance / 1000).toFixed(2);
          const duration = (data.routes[0].duration / 60).toFixed(2);

          document.getElementById("route-details").innerHTML = `
                        Destination: Random Point within 5 km<br>
                        Distance: ${distance} km<br>
                        Duration: ${duration} mins
                    `;

          fetchTrafficData(userLat, userLng, destinationLat, destinationLng);
          speak(
            `The destination is set to a random point within 5 kilometers. The distance is ${distance} kilometers and the estimated time to reach is ${duration} minutes.`,
          );
          nextStep("route-info");
        })
        .catch((error) => console.error("Error fetching route:", error));
    },
    (error) => {
      alert("Unable to fetch location. Please enable location services.");
      console.error("Geolocation error:", error);
    },
  );
}

// Function to generate a random destination within a specified radius (in meters)
function generateRandomDestination(lat, lng, radius) {
  const radiusInDegrees = radius / 111300;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const deltaLat = w * Math.cos(t);
  const deltaLng = w * Math.sin(t);

  return {
    lat: lat + deltaLat,
    lng: lng + deltaLng,
  };
}

// Simulated Traffic Data Fetcher
function fetchTrafficData(userLat, userLng, destinationLat, destinationLng) {
  // Simulating real-time traffic data
  const trafficData = {
    congestion: "Moderate", // Example data, replace with real-time traffic API if available
    trafficDelay: 5, // Minutes delay due to traffic
  };

  document.getElementById("route-details").innerHTML += `
        <br>Traffic: ${trafficData.congestion}<br>
        Traffic Delay: ${trafficData.trafficDelay} mins
    `;
  speak(
    `Traffic is ${trafficData.congestion} with an estimated delay of ${trafficData.trafficDelay} minutes.`,
  );
}

// Step 1: Select Profile
function selectProfile() {
  const profile = document.getElementById("profile").value;
  if (profile) {
    fetch(`${API_BASE_URL}/personalization`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("seat-steering-message").textContent =
          data.message;
        speak(data.message);
        nextStep("adjust-settings");
      })
      .catch((error) =>
        console.error("Error calling personalization endpoint:", error),
      );
  }
}

// Step 2: Music Suggestion
function suggestMusic() {
  fetch(`${API_BASE_URL}/music`)
    .then((response) => response.json())
    .then((data) => {
      const message = `Now playing: ${data.song}`;
      document.getElementById("suggested-music").textContent = message;
      speak(message);
    })
    .catch((error) => console.error("Error calling music endpoint:", error));
}

// Step 3: Display Temperature
function displayTemperature() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLng}&current_weather=true`;

      fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
          const temperature = data.current_weather.temperature;
          const windSpeed = data.current_weather.windspeed;

          const message = `Current temperature is ${temperature} degrees Celsius with a wind speed of ${windSpeed} meters per second.`;
          document.getElementById("temperature-info").textContent = message;
          speak(message);
        })
        .catch((error) =>
          console.error("Error fetching temperature data:", error),
        );
    },
    (error) => {
      alert("Unable to fetch location. Please enable location services.");
      console.error("Geolocation error:", error);
    },
  );
}

// Reset the system to the profile selection step
function resetSystem() {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => (step.style.display = "none"));
  document.getElementById("profile-selection").style.display = "block";
  speak("The system has been reset. Please select your profile.");
}

// Initialize the map on page load
initializeMap();
