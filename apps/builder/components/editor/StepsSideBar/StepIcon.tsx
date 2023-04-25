import { IconProps } from '@chakra-ui/react'
import {
  BoxIcon,
  CalendarIcon,
  ChatIcon,
  CheckSquareIcon,
  CodeIcon,
  CreditCardIcon,
  EditIcon,
  EmailIcon,
  ExternalLinkIcon,
  FilmIcon,
  FilterIcon,
  FlagIcon,
  GlobeIcon,
  ImageIcon,
  LayoutIcon,
  NumberIcon,
  PhoneIcon,
  SendEmailIcon,
  WavingHandIcon,
  AlarmIcon,
  AssignToIcon,
  TextIcon,
  WebhookIcon,
  ListIcon,
  RadioIcon,
  ContactCardIcon,
} from 'assets/icons'
import {
  GoogleAnalyticsLogo,
  GoogleSheetsLogo,
  MakeComLogo,
  PabblyConnectLogo,
  ZapierLogo,
} from 'assets/logos'
import {
  BubbleStepType,
  InputStepType,
  OctaStepType,
  OctaBubbleStepType,
  IntegrationStepType,
  LogicStepType,
  StepType,
  WabaStepType
} from 'models'
import React from 'react'

import { BsCalendar2Range } from 'react-icons/bs'
import { MdStore } from 'react-icons/md'

type StepIconProps = { type: StepType } & IconProps

export const StepIcon = ({ type, ...props }: StepIconProps) => {
  
  switch (type) {
    case BubbleStepType.TEXT:
      return <ChatIcon color="#AA561C" {...props} />
    case BubbleStepType.IMAGE:
      return <LayoutIcon color="#AA561C" {...props} />
    case BubbleStepType.VIDEO:
      return <FilmIcon color="#AA561C" {...props} />
    case BubbleStepType.EMBED:
      return <LayoutIcon color="#AA561C" {...props} />
    case InputStepType.TEXT:
      return <TextIcon color="#256F42" {...props} />
    case InputStepType.NUMBER:
      return <NumberIcon color="#256F42" {...props} />
    case InputStepType.EMAIL:
      return <EmailIcon color="#256F42" {...props} />
    case InputStepType.CPF:
      return <ContactCardIcon color="#256F42" {...props} />
    // case InputStepType.URL:
    //   return <GlobeIcon color="#256F42" {...props} />
    case InputStepType.DATE:
      return <CalendarIcon color="#256F42" {...props} />
    case InputStepType.PHONE:
      return <PhoneIcon color="#256F42" {...props} />
    case InputStepType.CHOICE:
      return <CheckSquareIcon color="#256F42" {...props} />
    case InputStepType.PAYMENT:
      return <CreditCardIcon color="orange.500" {...props} />
    case InputStepType.ASK_NAME:
      return <TextIcon color="orange.500" {...props} />
    case LogicStepType.SET_VARIABLE:
      return <EditIcon color="purple.500" {...props} />
    case LogicStepType.CONDITION:
      return <FilterIcon color="#AE285E" {...props} />
    case LogicStepType.REDIRECT:
      return <ExternalLinkIcon color="purple.500" {...props} />
    case LogicStepType.CODE:
      return <CodeIcon color="purple.500" {...props} />
    case LogicStepType.TYPEBOT_LINK:
      return <BoxIcon color="purple.500" {...props} />
      return <GoogleAnalyticsLogo {...props} />
    case IntegrationStepType.WEBHOOK:
      return <WebhookIcon {...props} />
      return <SendEmailIcon {...props} />
    case OctaBubbleStepType.END_CONVERSATION:
      return <WavingHandIcon color="#373A86" {...props} />
    case OctaStepType.ASSIGN_TO_TEAM:
      return <AssignToIcon color="#373A86" {...props} />
    case WabaStepType.BUTTONS:
      return <RadioIcon color="#7B15C1" {...props} />
    case WabaStepType.OPTIONS:
      return <ListIcon color="#7B15C1" {...props} />
    case OctaStepType.OFFICE_HOURS:
      return <BsCalendar2Range color="#7B15C1" size={18}/>
      case WabaStepType.COMMERCE:
        return <MdStore color="#000" size={18} />
    case 'start':
      return <FlagIcon {...props} />
    default:
      return <></>
  }
}
