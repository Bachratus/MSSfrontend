export class User {
  constructor(
    public id: number | null,
    public login: string,
    public firstName: string,
    public lastName: string,
    public email: string
  ) { }
}

