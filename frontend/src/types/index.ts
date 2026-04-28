/** Shared TypeScript types for PhishGuard */

export interface RedFlag {
    text: string;
    reason: string;
}

export interface Choice {
    label: string;
    is_correct: boolean;
    explanation: string;
}

export interface Scenario {
    id: string;
    type: 'sms' | 'email' | 'website';
    sender: string;
    subject?: string;
    content: string;
    red_flags: RedFlag[];
    choices: Choice[];
}

export interface AttemptCreate {
    nickname: string;
    scenario_id: string;
    choice_label: string;
    is_correct: boolean;
    score: number;
}

export interface Answer {
    scenarioId: string;
    choiceLabel: string;
    isCorrect: boolean;
    explanation: string;
}

export type ImmunityLevel = 'Novice' | 'Guard' | 'Expert';
