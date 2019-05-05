//@flow

import Realm from 'realm';
import RealmWrapper from 'app/models/RealmWrapper';

class User extends RealmWrapper {}
User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    auth_key: { type: 'string', optional: true },
    mobile: { type: 'string' },
    first_name: { type: 'string', optional: true },
    last_name: { type: 'string', optional: true },
    server_id: { type: 'string', optional: true },
    upi_address: { type: 'string', optional: true }
  }
};

class Device extends RealmWrapper {}
Device.schema = {
  name: 'Device',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    app_version: { type: 'string', optional: true },
    brand: { type: 'string', optional: true },
    fcm_token: { type: 'string', optional: true },
    model: { type: 'string', optional: true },
    os: { type: 'string', optional: true },
    server_id: { type: 'string', optional: true },
    uid: { type: 'string', optional: true },
    user_id: { type: 'string', optional: true },
    version: { type: 'string', optional: true }
  }
};

class UserSettings extends RealmWrapper {}
UserSettings.schema = {
  name: 'UserSettings',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    show_first_experience: { type: 'bool', optional: true, default: true },
    show_fd_picker_intro: { type: 'int', optional: true, default: 0 }
  }
};

class Contact extends RealmWrapper {}
Contact.schema = {
  name: 'Contact',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    mobile: { type: 'string' },
    name: { type: 'string' }
  }
};

const realm = new Realm({
  schema: [User, Device, UserSettings, Contact],
  schemaVersion: 1
});
export { realm, User, Device, UserSettings, Contact };
