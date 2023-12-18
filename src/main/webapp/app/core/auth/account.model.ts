export class Account {
  constructor(
    public login: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public authorities: string[],
  ) { }
}
