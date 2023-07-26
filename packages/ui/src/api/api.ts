import axios, { AxiosHeaders } from 'axios'
import type { AxiosInstance } from 'axios'
import type { AxiosRequestConfig } from 'axios'

export class Api {
  private instance: AxiosInstance
  private authToken?: string

  constructor(private baseUrl?: string) {
    this.instance = axios.create({
      baseURL: baseUrl
    })
  }

  composeRequestOptions(options?: AxiosRequestConfig): AxiosRequestConfig {
    const headers = new AxiosHeaders()
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`)
    }
    return {
      ...options,
      headers: {
        ...options?.headers,
        ...headers.toJSON(),
      },
    }
  }

  get(url: string, options?: AxiosRequestConfig) {

    return this.instance.get(url, this.composeRequestOptions(options))
  }

  post(url: string, body: any, options?: AxiosRequestConfig) {
    return this.instance.post(url, body, this.composeRequestOptions(options))
  }

  put(url: string, body: any, options?: AxiosRequestConfig) {
    return this.instance.put(url, body, this.composeRequestOptions(options))
  }

  delete(url: string, options?: AxiosRequestConfig) {
    return this.instance.delete(url, this.composeRequestOptions(options))
  }

  get token(): string | undefined {
    return this.authToken
  }

  set token(value: string | undefined) {
    this.authToken = value
  }
}
