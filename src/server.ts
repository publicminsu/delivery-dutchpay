process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import 'reflect-metadata';
import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { IndexController } from '@controllers/index.controller';
import { UsersController } from '@controllers/users.controller';
import validateEnv from '@utils/validateEnv';
import { RoomController } from './controllers/room.controller';

validateEnv();

const app = new App([AuthController, IndexController, UsersController, RoomController]);
app.listen();
