import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Tag} from './model';

// Update this if you add a property to the User type!
type TagResponse = {
  _id: string;
  bookmarkId: Types.ObjectId;
  name: string;
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Tag>} tag - A bookmark object
 * @returns {TagResponse} - The tag object
 */
const constructTagResponse = (tag: HydratedDocument<Tag>): TagResponse => {
  const tagCopy: Tag = {
    ...tag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
//   delete tagCopy.userId;
  return {
    ...tagCopy,
    _id: tagCopy._id.toString(),
    // freetId: bookmarkCopy.freetId,
    // tags: bookmarkCopy.tags,
    // dateCreated: formatDate(bookmarkCopy.dateCreated)
  };
};

export {
    constructTagResponse
};
