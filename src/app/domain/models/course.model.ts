export interface Parallel {
  parallelId: number;
  parallelName: string;
}

export interface Grade {
  gradeId: number;
  gradeName: string;
  parallels: Parallel[];
}

export interface Level {
  levelId: number;
  levelName: string;
  grades: Grade[];
}
