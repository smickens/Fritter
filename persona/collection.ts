import type {HydratedDocument, Types} from 'mongoose';
import type {Persona} from './model';
import PersonaModel from './model';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 * Feel free to add additional operations in this file.
 */
class PersonaCollection {
  /**
   * Add a persona for user with userId
   *
   * @param {string} userId - The id of the user following someone else
   * @param {string} name - The name of persona to add
   * @return {Promise<<Persona>>} - The newly created persona
   */
  static async addOne(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Persona>> {
    const persona = new PersonaModel({
        userId: userId,
        name: name
    });
    await persona.save(); // Saves persona to MongoDB
    return persona.populate('follows');
  }

  /**
   * Find a persona with personaId
   *
   * @param {string} personaId - The id of the persona to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The persona with personaId, if any
   */
   static async findOne(personaId: Types.ObjectId | string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({ _id: personaId }).populate('follows');
  }

  /**
   * Find a persona with name
   *
   * @param {string} name - The name of the persona to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The persona with personaId, if any
   */
   static async findOneByName(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({ userId: userId, name: name }).populate('follows');
  }

  /**
   * Get all personas for a given user
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Persona>[]>} - An array of all of the personas for this user
   */
  static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Persona>>> {
    return PersonaModel.find({ userId: userId }).populate('follows');
  }

  /**
   * Delete a persona
   *
   * @param {string} userId - The id of the user to delete persona from
   * @param {string} personaId - The id of the persona to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, personaId: Types.ObjectId | string): Promise<boolean> {
    const persona = await PersonaModel.deleteOne({ _id: personaId, userId: userId });
    return persona !== null;
  }

  /**
   * Delete all the personas for the given userId
   *
   * @param {string} userId - The id of user to delete all follows for
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await PersonaModel.deleteMany({ userId: userId });
  }
}

export default PersonaCollection;
