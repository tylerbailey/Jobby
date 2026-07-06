export type DailyStat = {
    date: string;
    added: number;
    applied: number;
};

export type ProfileStats = {
    totalAdded: number;
    totalApplied: number;
    dailyStats: DailyStat[];
};

export type UpdateProfileRequest = {
    displayName: string;
};
