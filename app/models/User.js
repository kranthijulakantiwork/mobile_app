import { realm } from 'app/models/schema';

function getCurrentUser() {
  const currentUser = realm.objects('User').filtered('auth_key !=$0', null)[0];
  if (currentUser) {
    return { success: true, currentUser };
  }
  return { success: false };
}

module.exports = { getCurrentUser };
