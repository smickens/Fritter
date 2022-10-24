import type {HydratedDocument, Types} from 'mongoose';
import PersonaCollection from '../persona/collection';
import type {Follow} from './model';
import FollowModel from './model';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 * Feel free to add additional operations in this file.
 */
class FollowCollection {
  /**
   * Add a follow for userId to follow friendId
   *
   * @param {string} userId - The id of the user following someone else
   * @param {string} friendId - The id of the user to follow
   * @return {Promise<<Bookmark>>} - The newly created follow
   */
  static async addOne(userId: Types.ObjectId | string, friendId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const date = new Date();
    const follow = new FollowModel({
        userId: userId,
        friendId: friendId,
        dateCreated: date
    });
    await follow.save(); // Saves follow to MongoDB
    return follow
  }

  /**
   * Add a follow for userId to follow friendId under persona with personaId
   *
   * @param {string} userId - The id of the user following someone else
   * @param {string} friendId - The id of the user to follow
   * @param {string} personaId - The id of the persona
   * @return {Promise<<Bookmark>>} - The newly created follow
   */
   static async addOneForPersona(userId: Types.ObjectId | string, friendId: Types.ObjectId | string, personaId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const date = new Date();
    const follow = new FollowModel({
        userId: userId,
        friendId: friendId,
        dateCreated: date,
        personaId: personaId
    });
    await follow.save(); // Saves follow to MongoDB
    return follow
  }

  /**
   * Find a follow for userId following friendId
   *
   * @param {string} userId - The id of the user following someone else
   * @param {string} friendId - The id of the user to follow
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow from the given userId to friendId, if any
   */
   static async findOne(userId: Types.ObjectId | string, friendId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({ userId, friendId });
  }

  /**
   * Get all follows for a given user
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows for this user
   */
  static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({ userId });
  }

  /**
   * Get all follows for a given persona
   *
   * @param {string} personaId - The userId of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows for this user
   */
  static async findAllByPersona(personaId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({ personaId: personaId });
  }

  /**
   * Update a follow with a new persona
   *
   * @param {string} userId - The userId of the user
   * @param {string} friendId - The id of the user being followed to update
   * @param {string} name - The name of the persona
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated follow
   */
   static async updateOne(userId: Types.ObjectId | string, friendId: Types.ObjectId | string, name?: string): Promise<HydratedDocument<Follow>> {
    const follow = await this.findOne(userId, friendId);
    if (name !== undefined) {
      const persona = await PersonaCollection.findOneByName(userId, name);
      follow.personaId = persona._id;
    } else {
      follow.personaId = null;
    }
    await follow.save();
    return follow;
  }

  /**
   * Update all follows with a certain persona to have a no persona
   *
   * @param {string} personaId - The name of the persona
   * @return {Promise<Array<HydratedDocument<Follow>>>} - The newly updated follows
   */
  static async updateMany(personaId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    const follows = await this.findAllByPersona(personaId);

    follows.forEach(async follow => { 
      follow.personaId = null; 
      await follow.save();
    });

    return follows;
  }

  /**
   * Delete a follow
   *
   * @param {string} userId - The id of the user following someone else
   * @param {string} friendId - The id of the user to follow
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, friendId: Types.ObjectId | string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({ userId, friendId });
    return follow !== null;
  }

  /**
   * Delete all the follows for the given userId and any follows to the given userId
   *
   * @param {string} userId - The id of user to delete all follows for
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({ userId: userId });
    await FollowModel.deleteMany({ friendId: userId });
  }
}

export default FollowCollection;
