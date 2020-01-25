const baseUrl = "http://192.168.2.85:8888/FilmThere/v1/api/admin/";

const API = {
   getBaseURL: function (formData) {
      return "http://192.168.2.85:8888/FilmThere";
   },

   adminLogin: function (data) {
      return fetch(baseUrl + "login", {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
      });
   },

   getDashboard: function (auth) {
      return fetch(baseUrl + "dashboard", {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getAllUsers: function (auth, text, page) {
      return fetch(baseUrl + "users?text=" + text + "&page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getUserProfile: function (auth, userId) {
      return fetch(baseUrl + "users/" + userId, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   updateAccountStatus: function (auth, userId) {
      return fetch(baseUrl + "users/" + userId, {
         method: 'POST',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },


   getAllLocations: function (auth, text, page) {
      return fetch(baseUrl + "locations?text=" + text + "&page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getLocationDetails: function (auth, locationId) {
      return fetch(baseUrl + "locations/" + locationId, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getAllBookings: function (auth, text, page) {
      return fetch(baseUrl + "bookings?text=" + text + "&page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getBookingDetails: function (auth, bookingId) {
      return fetch(baseUrl + "bookings/" + bookingId, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   updateProfile: function (auth, formData) {
      return fetch(baseUrl + "updateAdminProfile", {
         method: 'PUT',
         headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + auth
         },
         body: formData
      });
   },

   updateProfilePicture: function (auth, file, id) {
      var data = new FormData();
      data.append('file', file);
      var options = {
         method: 'POST',
         headers: {
            'Authorization': 'Bearer ' + auth,
         },
         body: data
      }
      return fetch(baseUrl + "updateAdminPicture/" + id, options);
   },

   getAllQuaries: function (auth, page) {
      return fetch(baseUrl + "contactUsList?page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getQueryDetails: function (auth, queryId) {
      return fetch(baseUrl + "contactUs/" + queryId, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getAllTransactions: function (auth, text, page) {
      return fetch(baseUrl + "transactions?text=" + text + "&page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   getTransactionDetails: function (auth, transactionId) {
      return fetch(baseUrl + "transaction/" + transactionId, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   findAllCategories: function (auth, text, page) {
      return fetch(baseUrl + "categories?text=" + text + "&page=" + page, {
         method: 'GET',
         headers: { 'Authorization': 'Bearer ' + auth }
      });
   },

   editCategory: function (auth, id, categoryName, file) {
      var data = new FormData();
      data.append('categoryName', categoryName);
      data.append('file', file);
      var options = {
         method: 'PUT',
         headers: { 'Authorization': 'Bearer ' + auth },
         body: data
      }
      return fetch(baseUrl + "category/" + id, options);
   },

   addCategory: function (auth, categoryName, file) {
      var data = new FormData();
      data.append('categoryName', categoryName);
      data.append('file', file);
      var options = {
         method: 'POST',
         headers: { 'Authorization': 'Bearer ' + auth },
         body: data

      }
      return fetch(baseUrl + "category", options);
   },

   findAllRules: function (auth, page) {
      return fetch(baseUrl + "rules?page=" + page, {
         method: 'GET',
         headers: {
            'Authorization': 'Bearer ' + auth

         }
      });
   },

   addRule: function (auth, formData) {
      return fetch(baseUrl + "rules", {
         method: 'POST',
         headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      });
   },

   editRule: function (auth, formData) {
      return fetch(baseUrl + "rules", {
         method: 'PUT',
         headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      });
   },

   findAllAmenities: function (auth, page) {
      return fetch(baseUrl + "amenities?page=" + page, {
         method: 'GET',
         headers: {
            'Authorization': 'Bearer ' + auth

         }
      });
   },

   addAmenity: function (auth, formData) {
      return fetch(baseUrl + "amenities", {
         method: 'POST',
         headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      });
   },

   editAmenity: function (auth, formData) {
      return fetch(baseUrl + "amenities", {
         method: 'PUT',
         headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      });
   },

   changeAdminPassword: function (auth, formData, id) {
      return fetch(baseUrl + "users/" + id + "/changeAdminPassword", {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth
         },
         body: formData
      });
   },

   contactUsReply: function (auth, formData) {
      return fetch(baseUrl + "contactUsReply", {
         method: 'POST',
         headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      });
   },
}

export default API;
