import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This file contains a class with functionality to interact with likes stored
 * in MongoDB, including adding, finding, updating, and deleting.
 */
 class LikeCollection {
    /**
     * Add a new like
     *
     * @param {string} userId - The userId of the user to find
     * @param {string} freetId - The freetId of the freet to add the like to
     * @return {Promise<HydratedDocument<Like>>} - The newly created like
     */
    static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {  
      const like = new LikeModel({userId: userId, freetId: freetId});
      await like.save(); // Saves like to MongoDB
      return like.populate('userId', 'freetId');
    }
  
    /**
     * Delete a like from the collection
     *
     * @param {string} userId - The userId of user
     * @param {string} freetId - The freetId of the freet to remove the like from for user with userId
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
    static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
      const like = await LikeModel.deleteOne({userId: userId, freetId: freetId});
      return like !== null;
    }

    /**
     * Find a like by freetId.
     *
     * @param {string} freetId - The freetId of the freet to find the like on
     * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given freetId, if any
     */
    static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
        return LikeModel.findOne({userId: userId, freetId: freetId});
    }

    /**
     * Delete all the likes for a given freet
     *
     * @param {string} freetId - The id of the freet to remove all likes for
     */
    static async deleteMany(freetId: Types.ObjectId | string): Promise<void> {
      await LikeModel.deleteMany({freetId: freetId});
    }
  }
  
  export default LikeCollection;