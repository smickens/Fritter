import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Bookmark} from './model';

// Update this if you add a property to the User type!
type BookmarkResponse = {
  _id: string;
  freetId: Types.ObjectId;
  tags: String[];
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A bookmark object
 * @returns {UserResponse} - The bookmark object without the userId
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: Bookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete bookmarkCopy.userId;
  return {
    ...bookmarkCopy,
    _id: bookmarkCopy._id.toString(),
    freetId: bookmarkCopy.freetId,
    tags: bookmarkCopy.tags.map(tag => { return tag.name }),
    dateCreated: formatDate(bookmarkCopy.dateCreated)
  };
};

export {
    constructBookmarkResponse
};
