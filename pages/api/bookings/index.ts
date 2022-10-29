import nc from 'next-connect';
import {
  getBookingsOfUser,
  newBooking,
} from '../../../controllers/booking-controllers';
import { dbConnect } from '../../../utils/db-connect';
import { requireAuth, errorHandler } from '../../../middlewares';

const handler = nc({ onError: errorHandler });

// connect the db (if not connected), before getting to any request
handler.use(async (req, res, next) => {
  await dbConnect();
  next();
});

handler.use(requireAuth);

// routes without id
handler.post(newBooking);
handler.get(getBookingsOfUser);

export default handler;
