import type {
  ResponseComposition,
  ResponseResolver,
  RestContext,
  RestHandler,
  RestRequest
} from 'msw';
import type { FakeDb } from '..';

export abstract class Fakepoints {
  constructor(protected fakeDb: FakeDb) {}

  abstract createFakepoints(): RestHandler[];

  protectedRoute(handlerFn: ResponseResolver<RestRequest, RestContext>) {
    return (request: RestRequest, response: ResponseComposition, context: RestContext) => {
      const authorizationHeader = request.headers.get('Authorization');

      const tokenFound = findIfTokenExists(this.fakeDb, authorizationHeader);
      if (!tokenFound) {
        return response(context.status(401), context.json({ message: 'Unauthorized' }));
      }
      return handlerFn(request, response, context);
    };
  }
}

function findIfTokenExists(fakeDb: FakeDb, authorizationHeader?: string | null): boolean {
  if (!authorizationHeader) {
    return false;
  }

  const [_, token] = authorizationHeader.split(' ');

  let userIsLoggedIn = false;
  fakeDb.users?.forEach((user) => {
    if (user.token === token) {
      userIsLoggedIn = true;
    }
  });
  return userIsLoggedIn;
}
