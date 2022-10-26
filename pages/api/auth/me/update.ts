import nc from 'next-connect';
import { dbConnect } from '../../../../utils/db-connect';
import { errorHandler } from '../../../../middlewares/error-handler';
import { updateUser } from '../../../../controllers/auth-controllers';
import { requireAuth } from '../../../../middlewares/require-auth';

const handler = nc({ onError: errorHandler });

// connect the db (if not connected), before getting to any request
handler.use(async (req, res, next) => {
  await dbConnect();
  next();
});

handler.use(requireAuth).get(updateUser);

export default handler;
