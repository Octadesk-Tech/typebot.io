import { CollaborationType, Invitation } from 'model'
import { fetcher } from 'services/utils'
import useSWR from 'swr'
import { isNotEmpty, sendRequest } from 'utils'

export const useInvitations = ({
  typebotId,
  onError,
}: {
  typebotId?: string
  onError: (error: Error) => void
}) => {
  const { data, error, mutate } = useSWR<{ invitations: Invitation[] }, Error>(
    typebotId ? `${process.env.BASE_PATH || ''}/api/typebots/${typebotId}/invitations` : null,
    fetcher,
    {
      dedupingInterval: isNotEmpty(process.env.NEXT_PUBLIC_E2E_TEST)
        ? 0
        : undefined,
    }
  )
  if (error) onError(error)
  return {
    invitations: data?.invitations,
    isLoading: !error && !data,
    mutate,
  }
}

export const sendInvitation = (
  typebotId: string,
  { email, type }: { email: string; type: CollaborationType }
) =>
  sendRequest({
    method: 'POST',
    url: `${process.env.BASE_PATH || ''}/api/typebots/${typebotId}/invitations`,
    body: { email, type },
  })

export const updateInvitation = (
  typebotId: string,
  email: string,
  invitation: Omit<Invitation, 'createdAt' | 'id'>
) =>
  sendRequest({
    method: 'PATCH',
    url: `${process.env.BASE_PATH || ''}/api/typebots/${typebotId}/invitations/${email}`,
    body: invitation,
  })

export const deleteInvitation = (typebotId: string, email: string) =>
  sendRequest({
    method: 'DELETE',
    url: `${process.env.BASE_PATH || ''}/api/typebots/${typebotId}/invitations/${email}`,
  })
