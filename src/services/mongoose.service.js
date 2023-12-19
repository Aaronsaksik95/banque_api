import { connect } from 'mongoose';
import url from '../configs/db.config.js';

export const connectDb = () => {
  connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connect to database');
    })
    .catch((err) => {
      console.log('Could not connect to database', err);
    });
}

