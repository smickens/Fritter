import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Persona} from './model';

type PersonaResponse = {
  _id: string;
  userId: Types.ObjectId;
  name: string;
  follows: Types.ObjectId[];
};

/**
 * Transform a raw Persona object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Tag>} persona - A persona object
 * @returns {PersonaResponse} - The persona object
 */
const constructPersonaResponse = (persona: HydratedDocument<Persona>): PersonaResponse => {
  const personaCopy: Persona = {
    ...persona.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  // delete personaCopy.follows;
  return {
    ...personaCopy,
    _id: personaCopy._id.toString(),
    follows: personaCopy.follows.map(follow => { return follow.friendId })
  };
};

export {
    constructPersonaResponse
};
