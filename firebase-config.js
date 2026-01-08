// Firebase Configuration for BloodBridge
const firebaseConfig = {
  apiKey: "AIzaSyDnf6AgdyPFt63JC4SsNT9gKaFI8qdePMw",
  authDomain: "bloodbridge-70247.firebaseapp.com",
  databaseURL: "https://bloodbridge-70247-default-rtdb.firebaseio.com",
  projectId: "bloodbridge-70247",
  storageBucket: "bloodbridge-70247.firebasestorage.app",
  messagingSenderId: "911181397592",
  appId: "1:911181397592:web:ec14f065cdb82f694ed42d",
  measurementId: "G-VH7BY3WQXL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Blood Requests Functions
const BloodRequests = {
  // Add a new blood request
  add: function(request) {
    return database.ref('bloodRequests').push(request);
  },

  // Get all blood requests (real-time listener)
  getAll: function(callback) {
    database.ref('bloodRequests').on('value', (snapshot) => {
      const requests = [];
      snapshot.forEach((child) => {
        requests.push({ id: child.key, ...child.val() });
      });
      callback(requests);
    });
  },

  // Delete a blood request
  delete: function(requestId) {
    return database.ref('bloodRequests/' + requestId).remove();
  }
};
