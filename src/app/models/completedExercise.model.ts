export class CompletedExercise {
  constructor(
    public exerciseId: string,
    public date: Date,
    public liked: boolean
  ) {}
}
