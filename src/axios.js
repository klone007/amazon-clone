import axios from "axios";

const instance =  axios.create({
    baseURL: 'https://us-central1-clone-45b68.cloudfunctions.net/api'  // The API (cloud function) URL
});

export default instance;

// 

/* Local server / static server */
//http://localhost:5001/clone-45b68/us-central1/api