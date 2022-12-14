import React, { FC } from 'react';
import Link from 'next/link';
import { Room } from '../../common-types/room';
import Image from 'next/image';

const RoomItem: FC<{ room: Room }> = ({ room }) => {
  if (!room.images.length) {
    return null;
  }

  return (
    <div key={room._id} className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-2">
        <Image
          className="card-img-top mx-auto"
          src={room.images[0].url}
          height={170}
          width={200}
          alt={room.name}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link href={`/rooms/${room._id}`}>{room.name}</Link>
          </h5>

          <div className="ratings mt-auto mb-3">
            <p className="card-text">
              <b>${room.price}</b> / night
            </p>

            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(room.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id="no_of_reviews">({room.reviews.length} Reviews)</span>
          </div>

          <Link href={`/rooms/${room._id}`}>
            <a style={{ color: 'white' }} className="btn btn-block view-btn">
              View Details
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
