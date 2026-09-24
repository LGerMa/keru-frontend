export type GoalType = "saving" | "debt" | "investment";
export type GoalStatus = "active" | "completed" | "abandoned";

export interface Goal {
  id: string;
  name: string;
  goalType: GoalType;
  targetAmount: number;
  initialAmount: number;
  targetDate: string | null;     // "YYYY-MM-DD"
  status: GoalStatus;
  completedDate: string | null;  // "YYYY-MM-DD"
  createdAt: string;             // ISO date-time
}

export interface GoalWithProgress extends Goal {
  currentAmount: number;
  percentage: number;            // NOT capped at 100
}

export interface CreateGoalDto {
  name: string;
  goalType?: GoalType;           // defaults to "saving"
  targetAmount: number;
  initialAmount?: number;
  targetDate?: string;
}

export type UpdateGoalDto = Partial<CreateGoalDto>;
