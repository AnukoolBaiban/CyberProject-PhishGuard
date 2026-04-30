/** Shared TypeScript types for PhishGuard */

export interface UiTrigger {
    label: string;
    type: 'inline_link' | 'back_button' | 'delete_button' | 'report_button' | 'block_button' | 'download_button' | 'close_tab' | 'cta_button';
}

export interface UiTriggers {
    fail_triggers: UiTrigger[];
    pass_triggers: UiTrigger[];
}

export interface RedFlag {
    part: string;
    desc: string;
}

export interface Scenario {
    id: string;
    title?: string;
    category: 'SMS' | 'EMAIL' | 'CHAT' | 'WEBSITE';
    difficulty?: string;
    sender_name: string;
    content_body: string;
    hint_message?: string;
    red_flags: RedFlag[];
    ui_triggers: UiTriggers;
    explanation: string;
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
    triggerLabel: string;
    isCorrect: boolean;
    explanation: string;
}

export type ImmunityLevel = 'Novice' | 'Guard' | 'Expert';
