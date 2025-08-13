import { Permission } from "./permission.model";

export interface Rol {
  id: number,
  name: string,
  placeLevelTypeId: number,
  permissions: Permission[]

}