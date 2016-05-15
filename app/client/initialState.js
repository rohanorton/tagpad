module.exports = {
  location: require("./actions/navigation.js").getLocation(),
  "items": [
    { "id": 1, "type": "note", "title": "thoughts on life", "description": "What is the meaning of it all?", "tags": [] },
    { "id": 2, "type": "bookmark", "title": "google", "description": "this is a link to the popular search engine", "tags": [] },
    { "id": 3, "type": "note", "title": "Ideas about space", "description": "How big is space really?", "tags": [] },
    { "id": 4, "type": "location", "title": "Enid's", "description": "At night a bar, during the day a delicious brunch spot.", "tags": ["Fun"] }
  ],
  "newItem": { 
    "id": 5, "title" : "", "description": "", "tags": ""
  }
};
