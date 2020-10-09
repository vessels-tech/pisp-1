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

  private static async executeRequest(options: AxiosRequestConfig): Promise<AxiosResponse<any>> {
    try {
      const result = await axios(options)
      return result;
    } catch (err) {
      if (err.response) {
        console.log(`executeRequest failed with status: ${err.response.status}`)
        console.log(err.response.data)

        // TODO: better error handling
        throw new Error(`Status: ${err.response.status} Message: ${JSON.stringify(err.response.data)}`)
      }
      console.log('Generic Error', err.message);
      throw err
    }
  }


  public static async postHubAccount(host: string, request: PostHubAccountRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/Hub/accounts`
    const options: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/json',
        'FSPIOP-Source': request.fspiopSource,
      },
      data: {
        ...request.body
      }
    }

    return this.executeRequest(options)


  }

  public static async postHubEndpoints(host: string, request: PostHubEndpointRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/Hub/endpoints`
    const options: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ...request.body
      }
    }

    return this.executeRequest(options)
  }

}
