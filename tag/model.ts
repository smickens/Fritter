import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Tag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  bookmarkId: Types.ObjectId;
  name: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TagSchema = new Schema<Tag>({
  // id of bookmark
  bookmarkId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // name of tag
  name: {
    type: String,
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;
