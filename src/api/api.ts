import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://aapsuj.accevate.co/flutter-api',
  headers: {
    'Content-Type': 'application/json',
  },
});