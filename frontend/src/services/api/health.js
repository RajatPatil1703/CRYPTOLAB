import client from './client.js'

export const getHealth = () => client.get('/health').then((r) => r.data)
