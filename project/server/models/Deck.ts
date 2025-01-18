import mongoose, { Schema, Document, Model } from 'mongoose';
import { IFlashcard } from './Flashcard.js';

// Interface for the Deck document
export interface Deck extends Document {
  title: string;
  cards: mongoose.Types.ObjectId[];  // Changed to use mongoose.Types.ObjectId directly
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Deck methods (instance methods)
export interface DeckMethods {
  addCard(cardId: string): Promise<void>; // Custom method example
}

// Combined Document and Methods interface
export interface DeckDocument extends Deck, DeckMethods {}

// Interface for static methods
export interface DeckModel extends Model<DeckDocument> {
  findByTitle(title: string): Promise<DeckDocument | null>; // Static method example
}

const DeckSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [100, 'Title is too long']
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Flashcard',
    required: true
  }],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.__v; // Clean up __v field from JSON response
      return ret;
    }
  }
});

// Add indexes if needed
DeckSchema.index({ title: 1 });

// Add any static methods
// DeckSchema.statics.findByTitle = function(title: string) {
//   return this.findOne({ title });
// };

// Add any instance methods
// DeckSchema.methods.addCard = async function(cardId: string) {
//   this.cards.push(cardId);
//   await this.save();
// };

export const DeckModel = mongoose.model<DeckDocument, DeckModel>('Deck', DeckSchema);