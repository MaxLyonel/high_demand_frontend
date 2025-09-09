
export class User {
  constructor(
  public userId: number,
  public username: string,
  public password: string,
  public isActive: boolean,
  public person: any
  ) {}
}