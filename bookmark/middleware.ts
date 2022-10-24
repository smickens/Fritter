import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.bookmarkId);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.params.bookmarkId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `Bookmark with bookmark ID ${req.params.bookmarkId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isFreetNotBookmarked = async (req: Request, res: Response, next: NextFunction) => {
  const userBookmarkedFreets = await BookmarkCollection.findAllByUser(req.session.userId);
  const userBookmarkedFreetIds = userBookmarkedFreets.map(bookmark => { return bookmark.freetId._id.toString() });
  if (userBookmarkedFreetIds.includes(req.body.id)) {
    res.status(403).json({
      error: 'Cannot bookmark freet that is already bookmarked by you.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.id);
  const freet = validFormat ? await FreetCollection.findOne(req.body.id) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.id} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a bookmark with bookmarkId was created by current user
 */
 const isBookmarkCreator = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOne(req.params.bookmarkId);
  if (req.session.userId !== bookmark.userId.toString()) {
    res.status(403).json({
      error: 'Cannot read/modify another users\' bookmark.'
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidTag = (req: Request, res: Response, next: NextFunction) => {
  const {tag} = req.query as {tag: string};

  if (tag.length == 0 || tag.length > 20) {
    res.status(413).json({
      error: 'Tag cannot be empty or more than 20 characters.'
    });
    return;
  }

  next();
};

export {
  isBookmarkExists,
  isFreetNotBookmarked,
  isFreetExists,
  isBookmarkCreator,
  isValidTag
};
