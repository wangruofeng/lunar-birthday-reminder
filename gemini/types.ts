
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap?: boolean;
}

export interface Birthday {
  id: string;
  name: string;
  relationship: string;
  lunarDate: LunarDate;
}

export interface UpcomingBirthday extends Birthday {
  solarDate: Date;
  daysRemaining: number;
}
