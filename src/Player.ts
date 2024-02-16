
export interface Player {
    id: number;
    name: string,
    remainingScore: number;
    previousScore: number;
    computer: boolean;
    active: boolean;
}