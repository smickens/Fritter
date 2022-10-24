import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import PersonaCollection from '../persona/collection';
import * as followValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as personaValidator from '../persona/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all follows for user with USER_ID
 *
 * @name GET /api/follows?account=USER_ID
 *
 * @return {FollowResponse[]} - An array of follows created by user with id, USER_ID
 * @throws {400} - If account is not given
 * @throws {403} - if the user is not logged in
 * @throws {404} - If no user has given USER_ID
 *
 */
/**
 * Get all follows for user with USER_ID and persona name NAME
 *
 * @name GET /api/follows?account=USER_ID&name=NAME
 *
 * @return {FollowResponse[]} - An array of follows created by user with id under persona with name, USER_ID
 * @throws {400} - If account or name is not given
 * @throws {403} - if the user is not logged in
 * @throws {404} - If no user has given USER_ID or user does not have persona with NAME
 *
 */
router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
      followValidator.isValidAccount
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if name query parameter was supplied
      if (req.query.name !== undefined) {
        next();
        return;
      }

      const userFollows = await FollowCollection.findAllByUser(req.query.account as string);
      const response = userFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    },
    [
      personaValidator.isPersona
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const persona = await PersonaCollection.findOneByName(req.session.userId, req.query.name as string);
      const userFollows = await FollowCollection.findAllByPersona(persona._id);
      const response = userFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    }
  );

/**
 * Add a follow between a user and friend
 *
 * @name POST /api/follows
 *
 * @param {string} friendId - the id of the user who is being followed by user with userId
 * @return {FollowResponse} - the new follow
 * @throws {403} - if the user is not logged in
 * @throws {400} - If friendId is in the wrong format or missing in the req
 * @throws {409} - If user with userId is already following user with friendId
 */
/**
 * Get all follows for user with USER_ID and persona name NAME
 *
 * @name POST /api/follows
 *
 * @param {string} friendId - the id of the user who is being followed by user with userId
 * @param {string} name - the name of the persona to follow user with friendId under
 * @return {FollowResponse[]} - An array of follows created by user with id under persona with name, USER_ID
 * @throws {403} - if the user is not logged in
 * @throws {400} - If friendId or name is in the wrong format or missing in the req
 * @throws {409} - If user with userId is already following user with friendId
 * @throws {403} - if user has no persona called name
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.canFollow
  ],
  async (req: Request, res: Response) => {
    // Check if name body parameter was supplied
    if (req.body.name == undefined) {
      const follow = await FollowCollection.addOne(req.session.userId, req.body.friendId);

      res.status(201).json({
        message: `Your follow to ${req.body.friendId} was created successfully.`,
        bookmark: util.constructFollowResponse(follow)
      });
    } else if (followValidator.isPersonaExists(req, res, () => {})) {
      const userPersona = await PersonaCollection.findOneByName(req.session.userId, req.body.name as string);
      const follow = await FollowCollection.addOneForPersona(req.session.userId, req.body.friendId, userPersona._id);

      res.status(201).json({
        message: `Your follow to ${req.body.friendId} under persona, ${req.body.name}, was created successfully.`,
        bookmark: util.constructFollowResponse(follow)
      });
    }
  }
);

/**
 * Unfollow a user with friendId
 *
 * @name DELETE /api/follows/:friendId?
 *
 * @param {string} friendId - the user id to unfollow
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the friendId is not valid
 * @throws {403} - if user is not currently following the user with friendId
 */
 router.delete(
    '/:friendId?',
    [
      userValidator.isUserLoggedIn,
      followValidator.canNotFollow
    ],
    async (req: Request, res: Response) => {
        await FollowCollection.deleteOne(req.session.userId, req.params.friendId);
        res.status(200).json({
        message: `Your follow to ${req.params.friendId} was deleted successfully.`
        });
    }
  );

/**
 * Modify a follow's persona
 *
 * @name PATCH /api/follows/:friendId?
 *
 * @param {string} friendId - the friendId follow to update
 * @param {string} name - the name of the persona to update to
 * @return {FollowResponse} - the updated follow
 * @throws {403} - if the user is not logged in
 * @throws {404} - if friendId is invalid
 * @throws {403} - if user with userId is not currently following the user with friendId
 * @throws {403} - if user has no persona called name
 */
 router.patch(
  '/:friendId?',
  [
    userValidator.isUserLoggedIn,
    followValidator.canNotFollow, // already following
    followValidator.isPersonaExists
  ],
  async (req: Request, res: Response) => {
    const follow = await FollowCollection.updateOne(req.session.userId, req.params.friendId, req.body.name);
    res.status(200).json({
      message: `Your follow to ${req.params.friendId} was updated successfully.`,
      follow: util.constructFollowResponse(follow)
    });
  }
);

export {router as followRouter};
