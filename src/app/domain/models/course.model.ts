export interface Parallel {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  name: string;
  parallels: Parallel[];
}

export interface Level {
  id: number;
  name: string;
  grades: Grade[];
}
