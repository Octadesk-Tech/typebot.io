import { ItemBase, ItemType, StepBase, TextBubbleContent } from '.';
import { Variable } from '../variable';

export type IntegrationStep = WebhookStep | ExternalEventStep

export type IntegrationStepOptions =
  | WebhookOptions | ExternalEventOptions

export enum IntegrationStepType {
  WEBHOOK = 'Webhook',
  EXTERNAL_EVENT = "external-event"
}

export enum HttpMethodsWebhook {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export type WebhookStep = StepBase & {
  type: IntegrationStepType.WEBHOOK;
  options: WebhookOptions;
  items: Array<WebhookItem>;
}

export declare type ExternalEventStep = StepBase & {
  type: IntegrationStepType.EXTERNAL_EVENT;
  options: ExternalEventOptions;
  items: Array<ExternalEventItem>;
};

export type WebhookItem = ItemBase & {
  type: ItemType.WEBHOOK,
  content: WebhookContent
};

export type ExternalEventItem = ItemBase & {
  type: ItemType.EXTERNAL_EVENT,
  content: ExternalEventContent
};

export type WebhookContent = {
  source: "CURRENT_SESSION",
  matchType: "$eq",
  values: Array<String>,
  referenceProperty: null,
  referenceValue: null,
  subType: null
}

export type ExternalEventContent = {
  source: "CURRENT_SESSION",
  matchType: "$eq",
  values: Array<String>,
  referenceProperty: null,
  referenceValue: null,
  subType: null
}

export type ResponseVariableMapping = {
  id: string
  bodyPath?: string
  variableId?: string
}

export type QueryParameters = {
  id?: string,
  key: string,
  value: string,
  displayValue: string,
  type: string,
  isNew: boolean,
  properties?: Variable
}

export type WebhookOptions = {
  variablesForTest: VariableForTest[]
  responseVariableMapping: ResponseVariableMapping[]
  isAdvancedConfig?: boolean
  isCustomBody?: boolean
  method: HttpMethodsWebhook;
  headers: QueryParameters[];
  parameters: QueryParameters[];
  path: string;
  returnMap: any;
  typebotId: string;
  url: string;
  body: string;
}

export type ExternalEventOptions = {
  useFallback: boolean;
  fallbackMessages?: Array<TextBubbleContent>
  variablesForTest: VariableForTest[]
  responseVariableMapping: ResponseVariableMapping[]
  isAdvancedConfig?: boolean
  isCustomBody?: boolean
  method: HttpMethodsWebhook;
  headers: QueryParameters[];
  parameters: QueryParameters[];
  path: string;
  timeout: string;
  returnMap: any;
  typebotId: string;
  url: string;
  body: string;
}

export type VariableForTest = {
  id: string
  variableId?: string
  value?: string
  token: string
}

export const defaultWebhookOptions: Omit<WebhookOptions, 'webhookId'> = {
  url: "",
  body: "",
  headers: [],
  method: HttpMethodsWebhook.GET,
  parameters: [],
  path: '',
  returnMap: "",
  typebotId: "",
  responseVariableMapping: [],
  variablesForTest: [],
  isAdvancedConfig: false,
  isCustomBody: false,
}

const generateFallback = () => {
  const messages = [
    "Não consegui processar sua mensagem. Por favor, acesse o link que enviamos para continuar.",
    "Parece que ainda não acessou o link correto. Por favor, clique no link enviado para prosseguir.",
    "Ainda estamos aguardando sua ação no link enviado. Por favor, clique nele para avançar.",
  ]

  let obj: Array<any> = [];

  for (let message of messages) {
    obj.push({
      html: `<div style="margin-left: 8px;">${message}</div>`,
      richText: [
        {
          children: [
            {
              text: message,
            },
          ],
          type: 'p',
        },
      ],
      plainText: message,
    });
  }

  return obj;
}

export const defaultExternalEventOptions: Omit<ExternalEventOptions, 'externalEventId'> = {
  url: "",
  body: "",
  headers: [],
  method: HttpMethodsWebhook.GET,
  parameters: [],
  path: '',
  returnMap: "",
  useFallback: true,
  typebotId: "",
  timeout: "5",
  responseVariableMapping: [],
  variablesForTest: [],
  isAdvancedConfig: false,
  isCustomBody: false,
  fallbackMessages: generateFallback(),
}
