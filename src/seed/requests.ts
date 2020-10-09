import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'


export type PostHubAccountRequest = {
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

export type PostOraclesRequest = {
  body: {
    oracleIdType: string,
    endpoint: {
      value: string,
      endpointType: string,
    },
    currency: string,
    isDefault: true
  }
}

export type PostParticipantsRequest = {
  body: {
    name: string,
    currency: string,
  }
}

export type PostParticipantsPositionAndLimitsRequest = {
  participantId: string,
  body: {
    currency: string,
    limit: {
      type: string,
      value: number,
    },
    initialPosition: number
  }
}

export type PostAccountRequest = {
  participantId: string,
  accountId: string
  body: {
    transferId: string,
    externalReference: string,
    action: string,
    reason: string,
    amount: {
      amount: string,
      currency: string,
    },
  }
}

export type PostEndpointsRequest = {
  participantId: string,
  body: {
    type: string,
    value: string,
  }
}
export default class Requests {
  public static async postHubAccount(host: string, request: PostHubAccountRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/Hub/accounts`
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

  public static async postOracles(host: string, request: PostOraclesRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/oracles`
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


  public static async postParticipants(host: string, request: PostParticipantsRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants`
    const options: AxiosRequestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      url,
      data: {
        ...request.body
      }
    }

    return this.executeRequest(options)
  }

  public static async postParticipantsPositionAndLimits(host: string, request: PostParticipantsPositionAndLimitsRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/${request.participantId}/initialPositionAndLimits`
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

  public static async postAccount(host: string, request: PostAccountRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/${request.participantId}/accounts/${request.accountId}`
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

  public static async postEndpoint(host: string, request: PostEndpointsRequest): Promise<AxiosResponse<any>> {
    const url = `${host}/participants/${request.participantId}/endpoints`
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


}
