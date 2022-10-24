import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Tag } from 'tag/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Bookmark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
  dateCreated: Date;
  tags?: Array<Tag>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BookmarkSchema = new Schema<Bookmark>({
  // id of user
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // id of freet bookmarked
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // date it was bookmarked
  dateCreated: {
    type: Date,
    required: true
  }
}, {
  toObject: { virtuals: true }
});

BookmarkSchema.virtual('tags', {
  ref: 'Tag',
  localField: '_id',
  foreignField: 'bookmarkId'
});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;
