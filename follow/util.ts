import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Follow} from './model';

// Update this if you add a property to the User type!
type FollowResponse = {
  _id: string;
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
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
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A bookmark object
 * @returns {FollowResponse} - The follow object
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
//   delete tagCopy.userId;
  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    dateCreated: formatDate(followCopy.dateCreated)
  };
};

export {
    constructFollowResponse
};
