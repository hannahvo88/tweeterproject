import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: 'https://tweeterest.ml/api/',
        withCredentials: false,
        headers: {
            'X-Api-Key': process.env.VUE_APP_KEY,
            'Content-Type': 'application/json',
        }
    })
}