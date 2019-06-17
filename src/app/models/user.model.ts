export class User {
    constructor(
      public name: string,
      public cpr: number,
      public diagnose: string,
      public email: string,
      public phone: number,
      public assigned: string[],
      public condition: string
    ) {}
  }