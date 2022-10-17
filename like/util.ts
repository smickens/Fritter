import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Like} from './model';
import UserCollection from '../user/collection';

// Update this if you add a property to the User type!
type LikeResponse = {
  _id: string;
  userId: Types.ObjectId;
};

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like object
 * @returns {LikeResponse} - The like object
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: Like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
  };
};

export {
    constructLikeResponse
};