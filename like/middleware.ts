import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a post is liked by the current user
 */
const isLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.freetId);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
    if (!like) {
      res.status(403).json({
        error: {
          likeNotFound: `Like for freet from user with ID ${req.session.userId} with freet ID ${req.params.freetId} does not exist.`
        }
      });
      return;
    }
  
    next();
};

/**
 * Checks if a post is not liked by the current user
 */
const isNotLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.id);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.body.id) : '';
    if (like) {
      res.status(403).json({
        error: {
          likeAlreadyExists: `Like for freet from user with ID ${req.session.userId} with freet ID ${req.body.id} already exists.`
        }
      });
      return;
    }
  
    next();
};

/**
 * Checks if a freetId in req.body is valid, that is, it matches the username regex
 */
 const isValidFreetId = (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.id);
  if (!validFormat) {
    res.status(400).json({
      error: {
        freetId: 'FreetId must be of type objectId.'
      }
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

export {
  isLiked,
  isNotLiked,
  isValidFreetId,
  isFreetExists
};