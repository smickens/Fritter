import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as personaValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';
import PersonaCollection from './collection';
import FollowCollection from '../follow/collection';

const router = express.Router();

/**
 * Get all the personas for current user
 *
 * @name GET /api/personas
 *
 * @return {PersonaResponse[]} - A list of all the personas for the current user
 * @throws {403} - If user is not logged in
 */
/**
 * Get the persona with name
 *
 * @name GET /api/personas?name=NAME
 *
 * @return {PersonaResponse} - A persona with name for current user with all the accounts followed by it
 * @throws {403} - If user is not logged in
 * @throws {400} - if the `name` is missing in the req or invalid
 * @throws {404} - if no persona with that name exists for the user
 */
 router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if authorId query parameter was supplied
      if (req.query.name !== undefined) {
        next();
        return;
      }
  
      const userPersonas = await PersonaCollection.findAllByUser(req.session.userId);
      const response = userPersonas.map(util.constructPersonaResponse);
      res.status(200).json(response);
    },
    [
      personaValidator.isPersona
    ],
    async (req: Request, res: Response) => {
      const userPersona = await PersonaCollection.findOneByName(req.session.userId, req.query.name as string);
      const response = util.constructPersonaResponse(userPersona);
      res.status(200).json(response);
    }
  );

/**
 * Add a new persona
 *
 * @name POST /api/personas
 *
 * @param {string} name - the name of the new persona to add
 * @return {PersonaResponse} - the new persona
 * @throws {403} - if the user is not logged in
 * @throws {400} - if the `name` is missing in the req or invalid
 * @throws {404} - if no persona with that name exists for the user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isValidPersonaName
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.addOne(req.session.userId, req.body.name);

    res.status(201).json({
      message: 'Your persona was created successfully.',
      bookmark: util.constructPersonaResponse(persona)
    });
  }
);

/**
 * Delete a persona
 *
 * @name DELETE /api/personas/:name
 *
 * @param {string} name - the name of the persona to remove
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in
 * @throws {400} - if the `name` is missing in the req or invalid
 */
 router.delete(
    '/:name',
    [
      userValidator.isUserLoggedIn,
      personaValidator.isPersonaExists
    ],
    async (req: Request, res: Response) => {
        const userPersona = await PersonaCollection.findOneByName(req.session.userId, req.params.name as string);
        await PersonaCollection.deleteOne(req.session.userId, userPersona._id);
        await FollowCollection.updateMany(userPersona._id);

        res.status(200).json({
        message: 'Your persona was deleted successfully.'
        });
    }
  );

export {router as personaRouter};
