import axios from 'axios'
import { type HttpClientInterface } from './HttpClientInterface'

export class AxiosAdapter implements HttpClientInterface {
  constructor () {
    axios.defaults.validateStatus = () => true
  }

  async get (url: string): Promise<any> {
    const response = await axios.get(url)
    if (response.status === 422) throw new Error(response?.data?.message as string)
    return {
      data: response.data,
      status: response.status
    }
  }

  async post (url: string, body: any): Promise<any> {
    const response = await axios.post(url, body)
    if (response.status === 422) throw new Error(response?.data?.message as string)
    return {
      data: response.data,
      status: response.status
    }
  }

  async put (url: string, body: any): Promise<any> {
    const response = await axios.put(url, body)
    if (response.status === 422) throw new Error(response?.data?.message as string)
    return {
      data: response.data,
      status: response.status
    }
  }
}
