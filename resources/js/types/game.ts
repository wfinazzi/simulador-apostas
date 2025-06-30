export interface Game {
    id?: number; // Tornando o id opcional
    home_team: string;
    away_team: string;
    home_odds: number;
    draw_odds: number;
    away_odds: number;
    match_date: string;
 }
