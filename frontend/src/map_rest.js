const apiKey = "395555c22f7ec2346538385c56f3530d"; // Your REST/Map SDK Key

// Example: Fetching a map tile or data
fetch(`https://maps.example.com/api?apiKey=${apiKey}&param=value`)
  .then(response => response.json())
  .then(data => {
    console.log("Map Data:", data);
    // Use the map data here
  })
  .catch(error => console.error("Error fetching map data:", error));
