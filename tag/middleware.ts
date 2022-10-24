import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TagCollection from './collection';

function checkIfTagIsValid(tag: string): boolean {
  if (tag.length == 0 || tag.length > 20) {
    return false;
  }
  return true;
}

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidTag = (req: Request, res: Response, next: NextFunction) => {
  const {tag} = req.body as {tag: string};

  if (!checkIfTagIsValid(tag)) {
    res.status(413).json({
      error: 'Tag cannot be empty or more than 20 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const containsTag = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(req.params);
    const {tag} = req.params as {tag: string};

    if (!checkIfTagIsValid(tag)) {
      res.status(413).json({
        error: 'Tag cannot be empty or more than 20 characters.'
      });
      return;
    }

    const bookmark = await TagCollection.findOne(req.params.bookmarkId, tag);
    if (!bookmark) {
      res.status(403).json({
        error: 'Cannot remove tag that does not exist on this bookmark.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const notContainsTag = async (req: Request, res: Response, next: NextFunction) => {
    const bookmark = await TagCollection.findOne(req.params.bookmarkId, req.body.tag);
    if (bookmark) {
      res.status(403).json({
        error: 'Cannot add tag that already exists on this bookmark.'
      });
      return;
    }
  
    next();
  };

export {
  isValidTag,
  containsTag,
  notContainsTag
};
