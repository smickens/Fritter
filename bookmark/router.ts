import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as tagValidator from '../tag/middleware';
import * as bookmarkValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmarks for current user
 *
 * @name GET /api/bookmarks
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks sorted in descending order by date created
 * @throws {403} - If user is not logged in
 */
/**
 * Get bookmarks with tag for current user
 *
 * @name GET /api/bookmarks?tag=TAG
 *
 * @return {BookmarkResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If tag is not given or is not valid
 * @throws {403} - If user is not logged in
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if tag query parameter was supplied
    if (req.query.tag !== undefined) {
      next();
      return;
    }

    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const usersBookmarks = await BookmarkCollection.findAllByUser(userId);
    const response = usersBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  },
  [
    bookmarkValidator.isValidTag
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const usersBookmarksWithTag = await BookmarkCollection.findAllByUserWithTag(userId, req.query.tag as string);
    const response = usersBookmarksWithTag.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmarks
 *
 * @param {string} freetId - The id of the freet
 * @return {BookmarkResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If itemId or tags is in the wrong format or missing in the req
 * @throws {413} - If the itemId is invalid
 * @throws {403} - If the user already has item with id `itemId` bookmarked
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isFreetExists,
    bookmarkValidator.isFreetNotBookmarked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookmarkCollection.addOne(userId, req.body.id);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

/**
 * Delete a bookmark
 *
 * @name DELETE /api/bookmarks/:bookmarkId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the bookmarkId is not valid
 */
router.delete(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
    bookmarkValidator.isBookmarkCreator
  ],
  async (req: Request, res: Response) => {
    await BookmarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);

export {router as bookmarkRouter};
