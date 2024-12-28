import axios from 'axios';
import {FlashcardDeck } from '../types/flashcard';

const api = axios.create({
  baseURL: 'quizwhiz-five.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiService = {
  async createDeckFromText(title: string, content: string): Promise<FlashcardDeck> {
    const response = await api.post('/decks/text', { title, content });
    console.log('API Response:', response.data);
    
    if (response.data.success && response.data.data) {
        const deck: FlashcardDeck = {
            ...response.data.data,
            cards: response.data.data.cards.map((card: any) => ({
                id: card.id || crypto.randomUUID(),
                question: card.question,
                answer: card.answer,
            })),
            createdAt: new Date(response.data.data.createdAt),
            updatedAt: new Date(response.data.data.updatedAt),
        };
        return deck;
    }
    
    throw new Error('Invalid response format from server');
  },

  async createDeckFromTopic(title: string, topic: string, complexity: string): Promise<FlashcardDeck> {
    console.log('Sending request with:', { title, topic, complexity });
    const response = await api.post('/decks/topic', { title, topic, complexity });
    
    console.log('API Response:', response.data);
    
    if (response.data.success && response.data.data) {
        const deck: FlashcardDeck = {
            ...response.data.data,
            cards: response.data.data.cards.map((card: any) => ({
                id: card.id || crypto.randomUUID(),
                question: card.question,
                answer: card.answer,
            })),
            createdAt: new Date(response.data.data.createdAt),
            updatedAt: new Date(response.data.data.updatedAt),
        };
        return deck;
    }
    
    throw new Error('Invalid response format from server');
  },

  async createDeckFromFile(file: File): Promise<FlashcardDeck> {
    console.log('Processing file:', file.name);

    const formData = new FormData();
    formData.append('file', file);

    // Debug FormData content
    console.log('FormData content:');
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        console.log('Sending POST request with FormData');
        const response = await api.post('/decks/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Response received:', response.data);
        if (response.data.success && response.data.data) {
          const deck: FlashcardDeck = {
              ...response.data.data,
              cards: response.data.data.cards.map((card: any) => ({
                  id: card.id || crypto.randomUUID(),
                  question: card.question,
                  answer: card.answer,
              })),
              createdAt: new Date(response.data.data.createdAt),
              updatedAt: new Date(response.data.data.updatedAt),
          };
          return deck;
        }
        throw new Error('Invalid response format from server');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to process file';
            console.error('Axios error:', { message, response: error.response });
            throw new Error(message);
        }
        console.error('Unexpected error:', error);
        throw error;
    }
  },

  async getDeck(id: string): Promise<FlashcardDeck> {
    const response = await api.get(`/decks/${id}`);
    return response.data;
  },

  async updateDeck(id: string, title: string): Promise<FlashcardDeck> {
    const response = await api.put(`/decks/${id}`, { title });
    return response.data;
  },

  async deleteDeck(id: string): Promise<void> {
    await api.delete(`/decks/${id}`);
  },
};