import { services } from '@octadesk-tech/services'
import Storage from '@octadesk-tech/storage'
import { ICustomVariable } from './interface'

export const fetchVariables = async (): Promise<ICustomVariable[]> => {
  const authStorage = Storage.getItem('userToken') as any
  const client = await services.main.getClient({
    baseURL: process.env.LOGIN_URL,
    headers: {
      authorization: `Bearer ${authStorage}`,
    },
  })

  const resp = await client.get('api/persons/contact-status')
  return resp.data
}
