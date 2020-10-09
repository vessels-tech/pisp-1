import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'


export type PostHubAccountRequest = {
  fspiopSource: string,
  body: {
    type: 'HUB_MULTILATERAL_SETTLEMENT' | 'HUB_RECONCILIATION',
    currency: string
  }
}

export type PostHubEndpointRequest = {
  body: {
    type: 'SETTLEMENT_TRANSFER_POSITION_CHANGE_EMAIL' | 'NET_DEBIT_CAP_ADJUSTMENT_EMAIL' | 'NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL',
    value: string
  }
}

export default class Requests {

  public static async postHubAccount(host: string, request: PostHubAccountRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/Hub/accounts`
    const options: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'FSPIOP-Source': request.fspiopSource,
      },
      data: {
        ...request.body
      }
    }

    const result = await axios(options)
    return result
  }

  public static async postHubEndpoints(host: string, request: PostHubEndpointRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/Hub/accounts`
    const options: AxiosRequestConfig = {
      method: 'post',
      url,
      data: {
        ...request.body
      }
    }

    const result = await axios(options)
    return result
  }

}
