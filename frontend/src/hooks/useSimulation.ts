import { useState, useEffect, useCallback } from 'react';
import type { Scenario, Answer } from '../types';
import { getScenarios, postAttempt } from '../api/client';

interface SimulationState {
    scenarios: Scenario[];
    currentIndex: number;
    score: number;
    answers: Answer[];
    loading: boolean;
    error: string | null;
}

interface UseSimulationReturn extends SimulationState {
    currentScenario: Scenario | null;
    totalScenarios: number;
    isFinished: boolean;
    submitChoice: (nickname: string, choiceLabel: string) => Promise<boolean>;
    nextScenario: () => void;
    reset: () => void;
}

export function useSimulation(): UseSimulationReturn {
    const [state, setState] = useState<SimulationState>({
        scenarios: [],
        currentIndex: 0,
        score: 0,
        answers: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;
        getScenarios()
            .then((data) => {
                if (!cancelled) {
                    setState((prev) => ({ ...prev, scenarios: data, loading: false }));
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        error: err?.message ?? 'Failed to load scenarios.',
                    }));
                }
            });
        return () => { cancelled = true; };
    }, []);

    const submitChoice = useCallback(
        async (nickname: string, choiceLabel: string): Promise<boolean> => {
            const scenario = state.scenarios[state.currentIndex];
            if (!scenario) return false;

            const choice = scenario.choices.find((c) => c.label === choiceLabel);
            if (!choice) return false;

            const isCorrect = choice.is_correct;
            const newScore = state.score + (isCorrect ? 1 : 0);

            const answer: Answer = {
                scenarioId: scenario.id,
                choiceLabel,
                isCorrect,
                explanation: choice.explanation,
            };

            setState((prev) => ({
                ...prev,
                score: newScore,
                answers: [...prev.answers, answer],
            }));

            // Fire-and-forget to backend (don't block UI)
            postAttempt({
                nickname,
                scenario_id: scenario.id,
                choice_label: choiceLabel,
                is_correct: isCorrect,
                score: newScore,
            }).catch(console.error);

            return isCorrect;
        },
        [state.scenarios, state.currentIndex, state.score]
    );

    const nextScenario = useCallback(() => {
        setState((prev) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }, []);

    const reset = useCallback(() => {
        setState({
            scenarios: state.scenarios,
            currentIndex: 0,
            score: 0,
            answers: [],
            loading: false,
            error: null,
        });
    }, [state.scenarios]);

    const currentScenario = state.scenarios[state.currentIndex] ?? null;
    const isFinished =
        !state.loading && state.scenarios.length > 0 &&
        state.currentIndex >= state.scenarios.length;

    return {
        ...state,
        currentScenario,
        totalScenarios: state.scenarios.length,
        isFinished,
        submitChoice,
        nextScenario,
        reset,
    };
}
