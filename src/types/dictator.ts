export interface Dictator {
  id: number;
  username: string;
  name: string;
  country: string;
  description: string;
  yearsInPower: string;
  createdAt: string;
  updatedAt: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDictatorRequest {
  username: string;
  name: string;
  country: string;
  description: string;
  yearsInPower: string;
}

export interface CreateAchievementRequest {
  title: string;
  description: string;
  year: number;
}
