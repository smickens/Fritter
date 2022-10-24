import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Follow } from 'follow/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Persona = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  name: string;
  follows?: Array<Follow>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PersonaSchema = new Schema<Persona>({
  // id of user
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // name of persona
  name: {
    type: String,
    required: true
  }
}, {
  toObject: { virtuals: true }
});

PersonaSchema.virtual('follows', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'personaId'
});

const PersonaModel = model<Persona>('Persona', PersonaSchema);
export default PersonaModel;
