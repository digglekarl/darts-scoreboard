
export interface Player {
    id: number;
    name: string,
    remainingScore: number;
    previousScore: number;
    computer: boolean;
    active: boolean;
    scores: Array<number>;
    averages: Array<number>;
    dartsThrown: number;
    avg: {[dartsThrown: number]: number};
}

export interface KillerPlayer {
    position: number;
    name: string;
    chosenNumber: string;
    numHits: number;
    isKiller: boolean;
}