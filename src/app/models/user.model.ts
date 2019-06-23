import { CompletedExercise } from "./completedExercise.model";
import { DizzyLog } from "./dizzyLog.model";

export class User {
  constructor(
    public name: string,
    public cpr: number,
    public diagnose: string,
    public email: string,
    public phone: number,
    public excercises: string[],
    public condition: string,
    public completed: CompletedExercise[] = [],
    public dizzyLog: DizzyLog[] = [
      new DizzyLog(2, new Date("2019/06/18")),
      new DizzyLog(7, new Date("2019/06/19")),
      new DizzyLog(5, new Date("2019/06/20"))
    ]
  ) {}
}
