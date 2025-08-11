import { RegistrationStatus } from "./enum/registration-status.enum"

export interface History {
  id: number,
  highDemandRegistrationId: number,
  educationalInstitutionId: number,
  educationalInstitutionName: string,
  workflowState: string,
  registrationStatus: RegistrationStatus
  userName: string,
  observation: string,
  createdAt: Date
  updatedAt: Date
}