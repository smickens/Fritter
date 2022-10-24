import type {HydratedDocument, Types} from 'mongoose';
import type {Tag} from './model';
import TagModel from './model';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 * Feel free to add additional operations in this file.
 */
class TagCollection {
  /**
   * Add a tag to the collection
   *
   * @param {string} bookmarkId - The id of the bookmark
   * @param {string} tagName - The name of the tag to add to the bookmark
   * @return {Promise<<Bookmark>>} - The newly created tag
   */
  static async addOne(bookmarkId: Types.ObjectId | string, tagName: string): Promise<HydratedDocument<Tag>> {
    const tag = new TagModel({
        bookmarkId,
        name: tagName
    });
    await tag.save(); // Saves tag to MongoDB
    return tag
  }

  /**
   * Find a bookmark with bookmarkId with tag name
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @param {string} bookmarkId - The tag name to find
   * @return {Promise<HydratedDocument<Tag>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
   static async findOne(bookmarkId: Types.ObjectId | string, tagName: string): Promise<HydratedDocument<Tag>> {
    return TagModel.findOne({bookmarkId: bookmarkId, name: tagName});
  }

  /**
   * Get all tags for a given bookmark with bookmarkId
   *
   * @param {string} bookmarkId - The userId of the user
   * @return {Promise<HydratedDocument<Tag>[]>} - An array of all of the bookmarks for this user
   */
  static async findAllByBookmark(bookmarkId: Types.ObjectId | string): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({bookmarkId: bookmarkId});
  }

  /**
   * Delete a tag
   *
   * @param {string} bookmarkId - The id of bookmark to delete tag on
   * @param {string} tagName - The name of the tag to remove
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string, tagName: string): Promise<boolean> {
    const bookmark = await TagModel.deleteOne({bookmarkId: bookmarkId, name: tagName});
    return bookmark !== null;
  }

  /**
   * Delete all the tags for the given bookmark with bookmarkId
   *
   * @param {string} bookmarkId - The id of bookmarkId to delete all tags for
   */
  static async deleteMany(bookmarkId: Types.ObjectId | string): Promise<void> {
    await TagModel.deleteMany({bookmarkId: bookmarkId});
  }
}

export default TagCollection;
