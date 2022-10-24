import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PersonaCollection from './collection';

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidPersonaName = async (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};

  if (name.length == 0 || name.length > 30) {
    res.status(413).json({
      error: 'Persona name cannot be empty or more than 30 characters.'
    });
    return;
  }

  const persona = await PersonaCollection.findOneByName(req.session.userId, name);
  if (persona) {
    res.status(403).json({
      error: `The persona name, ${name}, already exists.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isPersonaExists = async (req: Request, res: Response, next: NextFunction) => {
    const {name} = req.params as {name: string};

    if (name.length == 0 || name.length > 30) {
      res.status(413).json({
        error: 'Persona name cannot be empty or more than 30 characters.'
      });
      return;
    }

    const persona = await PersonaCollection.findOneByName(req.session.userId, name);
    if (!persona) {
      res.status(403).json({
        error: `The persona name, ${name}, does not exist.`
      });
      return;
    }
  
    next();
  };

  /**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isPersona = async (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.query as {name: string};

  if (name.length == 0 || name.length > 30) {
    res.status(413).json({
      error: 'Persona name cannot be empty or more than 30 characters.'
    });
    return;
  }

  const persona = await PersonaCollection.findOneByName(req.session.userId, name);
  if (!persona) {
    res.status(403).json({
      error: `No persona with name, ${name}, exists for current user.`
    });
    return;
  }

  next();
};

export {
    isValidPersonaName,
    isPersonaExists,
    isPersona
};
