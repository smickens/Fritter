import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
  dateCreated: Date;
  personaId?: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // id of user
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // id of friend being followed
  friendId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // date follow was created
  dateCreated: {
    type: Date,
    required: true
  },
  // id of persona friend is followed under
  personaId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Persona'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
