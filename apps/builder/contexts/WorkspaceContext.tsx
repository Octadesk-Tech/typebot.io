import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { byId } from 'utils'
import { MemberInWorkspace, Plan, Workspace, WorkspaceRole } from 'model'
import {
  createNewWorkspace,
  useWorkspaces,
  updateWorkspace as patchWorkspace,
  deleteWorkspace,
} from 'services/workspace/workspace'
import { useUser } from './UserContext'
import { useTypebot } from './TypebotContext'
import { useRouter } from 'next/router'
import { CustomFieldTitle } from 'enums/customFieldsTitlesEnum'
import CustomFields from 'services/octadesk/customFields/customFields'
import { DomainType } from 'enums/customFieldsEnum'
import cuid from 'cuid'
import {
  fixedChatProperties,
  fixedOrganizationProperties,
  fixedPersonProperties,
} from 'helpers/presets/variables-presets'
import { Variable } from 'models/dist/types/typebot/variable'

export type WorkspaceWithMembers = Workspace & { members: MemberInWorkspace[] }

const workspaceContext = createContext<{
  workspaces?: WorkspaceWithMembers[]
  isLoading: boolean
  workspace?: WorkspaceWithMembers
  canEdit: boolean
  currentRole?: WorkspaceRole
  switchWorkspace: (workspaceId: string) => void
  createWorkspace: (name?: string) => Promise<void>
  updateWorkspace: (
    workspaceId: string,
    updates: Partial<Workspace>
  ) => Promise<void>
  deleteCurrentWorkspace: () => Promise<void>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
}>({})

export const WorkspaceContext = ({ children }: { children: ReactNode }) => {
  const { query } = useRouter()
  const { user } = useUser()
  const userId = user?.id
  const { typebot, createVariable, deleteVariable } = useTypebot()
  const { workspaces, isLoading, mutate } = useWorkspaces({ userId })
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceWithMembers>()

  const canEdit =
    workspaces
      ?.find(byId(currentWorkspace?.id))
      ?.members.find((m) => m.userId === userId)?.role === WorkspaceRole.ADMIN

  const currentRole = currentWorkspace?.members.find(
    (m) => m.userId === userId
  )?.role

  useEffect(() => {
    if (!workspaces || workspaces.length === 0 || currentWorkspace) return
    const lastWorspaceId =
      query.workspaceId?.toString() ?? localStorage.getItem('workspaceId')
    const defaultWorkspace = lastWorspaceId
      ? workspaces.find(byId(lastWorspaceId))
      : workspaces.find((w) =>
          w.members.some(
            (m) => m.userId === userId && m.role === WorkspaceRole.ADMIN
          )
        )
    setCurrentWorkspace(defaultWorkspace ?? workspaces[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces?.length])

  useEffect(() => {
    if (!currentWorkspace?.id) return
    localStorage.setItem('workspaceId', currentWorkspace.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.id])

  useEffect(() => {
    if (
      !typebot?.workspaceId ||
      !currentWorkspace ||
      typebot.workspaceId === currentWorkspace.id
    )
      return
    switchWorkspace(typebot.workspaceId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typebot?.workspaceId])

  const [octaCustomFieldsList, setOctaCustomFieldsList] = useState<Array<Variable>>()
  const [octaPersonFields, setOctaPersonFields] = useState<Array<any>>([])
  const [octaChatFields, setOctaChatFields] = useState<Array<any>>([])
  const [octaOrganizationFields, setOctaOrganizationFields] = useState<
    Array<any>
  >([])

  const mountPropertiesOptions = (propertiesType: any, properties: any) => {
    let nameTokenValue = ''
    if (propertiesType === 'PERSON') {
      nameTokenValue = CustomFieldTitle.PERSON
    } else if (propertiesType === 'CHAT') {
      nameTokenValue = CustomFieldTitle.CHAT
    } else if (propertiesType === 'ORGANIZATION') {
      nameTokenValue = CustomFieldTitle.ORGANIZATION
    }

    return { items: properties }
  }

  const resolveExample = (type: any) => {
    switch (type) {
      case 'string':
        return 'Qualquer texto'
      case 'boolean':
        return 'sim ou não'
      case 'number':
        return '10203040'
      case 'float':
        return '1020,40'
      case 'date':
        return '13/01/0001'
    }

    return ''
  }

  const fieldTypes = (fieldType: number): string => {
    switch (fieldType) {
      case 4:
        return 'boolean'
      case 5:
        return 'number'
      case 6:
        return 'float'
      case 7:
        return 'date'
      default:
        return 'string'
    }
  }

  const mountProperties = (properties: any, domainType: string) => {
    const customProperties = properties.map(
      (h: { fieldType: number; fieldId: string }) => {
        const fieldType: string = fieldTypes(h.fieldType)
        let tokenValue = `#${h.fieldId.replace(/_/g, '-')}`
        let domainValue = ''
        if (domainType === 'PERSON') {
          domainValue = CustomFieldTitle.PERSON
          tokenValue = tokenValue.concat('-contato')
        } else if (domainType === 'CHAT') {
          domainValue = CustomFieldTitle.CHAT
          tokenValue = `#${h.fieldId.replace(/_/g, '-')}`
        } else if (domainType === 'ORGANIZATION') {
          domainValue = CustomFieldTitle.ORGANIZATION
        }

        const id = 'v' + cuid()

        return {
          type: fieldType,
          id,
          variableId: id,
          token: tokenValue,
          domain: domainValue,
          name: `customField.${h.fieldId}`,
          example: resolveExample(fieldType),
        }
      }
    )

    return [...customProperties]
  }

  const variables = typebot?.variables ?? []
  const fixedChatPropertiesWithId = fixedChatProperties.map(chatProperty => {
    const variableId = cuid()
    return {
      ...chatProperty,
      id: variableId,
      variableId
    }
  })
  const fixedPersonPropertiesWithId = fixedPersonProperties.map(personProperty => {
    const variableId = cuid()
    return {
      ...personProperty,
      id: variableId,
      variableId
    }
  })
  const fixedOrganizationPropertiesWithId = fixedOrganizationProperties.map(organizationProperty => {
    const variableId = cuid()
    return {
      ...organizationProperty,
      id: variableId,
      variableId
    }
  })
  const items: Array<any> = []
  useEffect(() => {
    const fetchOctaCustomFields = async (): Promise<void> => {
      const customFieldsList: Array<Variable> = []

      const fields = await CustomFields().getCustomFields()
      const personFields = fields.filter(
        (f: { domainType: number }) => f.domainType === DomainType.Person
      )
      setOctaPersonFields(personFields)

      const chatFields = fields.filter(
        (f: { domainType: number }) => f.domainType === DomainType.Chat
      )

      setOctaChatFields(chatFields)

      const organizationFields = fields.filter(
        (f: { domainType: number }) => f.domainType === DomainType.Organization
      )
      setOctaOrganizationFields(organizationFields)
      
      customFieldsList.push(
        ...personFields,
        ...chatFields,
        ...organizationFields
      )

      setOctaCustomFieldsList(customFieldsList)
    }

    const octaChatProperties = mountPropertiesOptions(
      'CHAT',
      mountProperties(octaChatFields, 'CHAT')
    )

    if (octaChatProperties) {
      items.push(
        ...octaChatProperties.items,
        ...fixedChatPropertiesWithId
      )
    }

    const octaPersonProperties = mountPropertiesOptions(
      'PERSON',
      mountProperties(octaPersonFields, 'PERSON').filter(
        (p) => p.type !== 'select'
      )
    )

    if (octaPersonProperties) {
      items.push(
        ...octaPersonProperties.items,
        ...fixedPersonPropertiesWithId
      )
    }

    const octaOrganizationProperties = mountPropertiesOptions(
      'ORGANIZATION',
      mountProperties(octaOrganizationFields, 'ORGANIZATION')
    )

    if (octaOrganizationProperties) {
      items.push(
        ...octaOrganizationProperties.items,
        ...fixedOrganizationPropertiesWithId
      )
    }

    variables.map((variable) => deleteVariable(variable.id))
    if (typebot && createVariable && variables) {
      items.map((item) => createVariable(item))
    }
    if (!octaCustomFieldsList) {
      fetchOctaCustomFields()
    }
  }, [])

  const switchWorkspace = (workspaceId: string) =>
    setCurrentWorkspace(workspaces?.find(byId(workspaceId)))

  const createWorkspace = async (name?: string) => {
    if (!workspaces) return
    const { data, error } = await createNewWorkspace({
      name: name ? `${name}'s workspace` : 'My workspace',
      plan: Plan.FREE,
    })
    if (error || !data) return
    const { workspace } = data
    const newWorkspace = {
      ...workspace,
      members: [
        {
          role: WorkspaceRole.ADMIN,
          userId: userId as string,
          workspaceId: workspace.id as string,
        },
      ],
    }
    mutate({
      workspaces: [...workspaces, newWorkspace],
    })
    setCurrentWorkspace(newWorkspace)
  }

  const updateWorkspace = async (
    workspaceId: string,
    updates: Partial<Workspace>
  ) => {
    const { data } = await patchWorkspace({ id: workspaceId, ...updates })
    if (!data || !currentWorkspace) return
    setCurrentWorkspace({ ...currentWorkspace, ...updates })
    mutate({
      workspaces: (workspaces ?? []).map((w) =>
        w.id === workspaceId ? { ...data.workspace, members: w.members } : w
      ),
    })
  }

  const deleteCurrentWorkspace = async () => {
    if (!currentWorkspace || !workspaces || workspaces.length < 2) return
    const { data } = await deleteWorkspace(currentWorkspace.id)
    if (!data || !currentWorkspace) return
    setCurrentWorkspace(workspaces[0])
    mutate({
      workspaces: (workspaces ?? []).filter((w) =>
        w.id === currentWorkspace.id
          ? { ...data.workspace, members: w.members }
          : w
      ),
    })
  }

  return (
    <workspaceContext.Provider
      value={{
        workspaces,
        workspace: currentWorkspace,
        isLoading,
        canEdit,
        currentRole,
        switchWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteCurrentWorkspace,
      }}
    >
      {children}
    </workspaceContext.Provider>
  )
}

export const useWorkspace = () => useContext(workspaceContext)
