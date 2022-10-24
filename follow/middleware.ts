import type {Request, Response, NextFunction} from 'express';
import e from 'express';
import {Types} from 'mongoose';
import PersonaCollection from '../persona/collection';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const canNotFollow = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.friendId);
    const follow = validFormat ? await FollowCollection.findOne(req.session.userId, req.params.friendId) : '';

    if (req.session.userId == req.params.friendId) {
        res.status(413).json({
            error: 'Cannot unfollow yourself.'
        });
      return;
    } else if (!follow) {
        res.status(413).json({
            error: `Not following user with id, ${req.params.friendId}.`
        });
        return;
    }
  
    next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const canFollow = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.friendId);
    const follow = validFormat ? await FollowCollection.findOne(req.session.userId, req.body.friendId) : '';

    if (req.session.userId == req.body.friendId) {
        res.status(413).json({
            error: 'Cannot follow yourself.'
        });
      return;
    } else if (follow) {
        res.status(413).json({
            error: `Already following user with id, ${req.body.friendId}.`
        });
        return;
    }
  
    next();
};

/**
 * Checks if a user with userId exists
 */
 const isValidAccount = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.account) {
      res.status(400).json({
        error: 'Provided account id must be nonempty.'
      });
      return;
    }
  
    const user = await UserCollection.findOneByUserId(req.query.account as string);
    if (!user) {
      res.status(404).json({
        error: `A user with userid ${req.query.account as string} does not exist.`
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isPersonaExists = async (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};

  const persona = await PersonaCollection.findOneByName(req.session.userId, name);
  if (!persona) {
    res.status(403).json({
      error: `The persona name, ${name}, does not exist.`
    });
    return;
  }

  next();
};

export {
  canNotFollow,
  canFollow,
  isValidAccount,
  isPersonaExists
};
