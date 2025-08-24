import { create } from 'zustand';

export const useFlashcardStore = create((set) => ({
  flashcards: [],
  addFlashcard: (term, translation) =>
    set((state) => ({
      flashcards: [
        ...state.flashcards,
        { id: Date.now(), term, translation },
      ],
    })),
}));