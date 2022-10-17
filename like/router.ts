import type {Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';
import * as likeValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Add a like
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The id of the freet to be liked
 * @return {LikeResponse} - An object with user's details
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId is not in the correct format or missing in the req
 * @throws {404} - If the freetId is not valid
 * @throws {403} - If the user had already liked this freet
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isValidFreetId,
    likeValidator.isFreetExists,
    likeValidator.isNotLiked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.body.id);

    res.status(200).json({
      message: 'Your like was added successfully',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:freetId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the id is not valid
 * @throws {403} - If the user hadn't already liked this freet
 */
 router.delete(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      likeValidator.isLiked
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

      await LikeCollection.deleteOne(userId, req.params.freetId);
      res.status(200).json({
        message: 'Your like was deleted successfully.'
      });
    }
  );

export {router as likeRouter};
