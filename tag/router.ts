import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import * as tagValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from '../bookmark/middleware';
import * as util from './util';

const router = express.Router();

// TODO: is this needed, we get this off the bookmark throught the virtual property right?
/**
 * Get all the tags for bookmark with bookmarkId
 *
 * @name GET /api/bookmarks/:bookmarkId/tag
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks sorted in descending order by date created
 * @throws {403} - If user is not logged in
 */
router.get(
  '/:bookmarkId/tags',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const bookmarkTags = await TagCollection.findAllByBookmark(req.params.bookmarkId);
    const response = bookmarkTags.map(util.constructTagResponse);
    res.status(200).json(response);
  } 
);

/**
 * Add a tag to a bookmark
 *
 * @name POST /api/bookmarks/:bookmarkId/tags
 *
 * @param {string} tag - the new tag for the bookmark
 * @return {BookmarkResponse} - the updated bookmark
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the bookmarkId is not valid
 * @throws {400} - If newTag is in the wrong format or missing in the req
 * @throws {403} - If newTag is currently a tag associated with the bookmark
 */
router.post(
  '/:bookmarkId/tags',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
    bookmarkValidator.isBookmarkCreator,
    tagValidator.isValidTag,
    tagValidator.notContainsTag
  ],
  async (req: Request, res: Response) => {
    const tag = await TagCollection.addOne(req.params.bookmarkId, req.body.tag);

    res.status(201).json({
      message: 'Your tag was created successfully.',
      bookmark: util.constructTagResponse(tag)
    });
  }
);

/**
 * Remove a tag off a bookmark
 *
 * @name DELETE /api/bookmarks/:bookmarkId/:tag
 *
 * @param {string} tag - the tag to remove from the bookmark
 * @return {BookmarkResponse} - the updated bookmark
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the bookmarkId or tag is not valid
 * @throws {403} - If tag is not currently a tag associated with the bookmark
 */
 router.delete(
    '/:bookmarkId/tags/:tag',
    [
      userValidator.isUserLoggedIn,
      bookmarkValidator.isBookmarkExists,
      bookmarkValidator.isBookmarkCreator,
      tagValidator.containsTag
    ],
    async (req: Request, res: Response) => {
        await TagCollection.deleteOne(req.params.bookmarkId, req.params.tag);
        res.status(200).json({
        message: 'Your tag was deleted successfully.'
        });
    }
  );

export {router as tagRouter};
