// @flow

import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { realm, Contact } from 'app/models/schema';
import { setContacts } from 'app/reducers/common/Actions';
import store from 'app/helpers/Store';

function getMobileNumber(mobile) {
  if (mobile && mobile.number) {
    let mobileNumber = mobile.number.split('-');
    mobileNumber = mobileNumber.join('');
    mobileNumber = mobileNumber.split(' ');
    mobileNumber = mobileNumber.join('');
    mobileNumber = mobileNumber.split('+');
    mobileNumber = mobileNumber.join('');
    if (mobileNumber.length === 12 && mobileNumber.startsWith('91')) {
      mobileNumber = mobileNumber.substr(2);
    } else if (mobileNumber.length === 11 && mobileNumber.startsWith('0')) {
      mobileNumber = mobileNumber.substr(1);
    }
    if (mobileNumber.length === 10) {
      return mobileNumber;
    }
    return '';
  }
  return '';
}

function createContact(contact, mobile, mobileNumbers) {
  try {
    const mobileNumber = getMobileNumber(mobile);
    if (mobileNumber && !mobileNumbers.includes(mobileNumber)) {
      mobileNumbers.push(mobileNumber);
      const data = {
        name: `${contact.givenName ? contact.givenName : ''} ${
          contact.familyName ? contact.familyName : ''
        }`,
        mobile: mobileNumber
      };
      const realmContact = realm.objects('Contact').filtered('mobile =$0', mobileNumber)[0];
      if (realmContact) {
        if (realmContact.name !== data.name) Contact.update({ name: data.name });
      } else {
        const x = Contact.create(data);
      }
    }
  } catch (error) {}
}

function getContacts() {
  Contacts.getAll((err, contacts) => {
    if (err === 'denied') {
      // Do nothing
    } else {
      const mobileNumbers = [];
      contacts.map(contact => {
        if (contact.phoneNumbers.length) {
          contact.phoneNumbers.map(mobile => {
            createContact(contact, mobile, mobileNumbers);
            return true;
          });
        }
        return true;
      });
      store.dispatch(setContacts(realm.objects('Contact').sorted('name')));
    }
  });
}

module.exports = {
  askPermissionsAndgetContacts() {
    try {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.'
      }).then(() => {
        getContacts();
        return { success: true };
      });
    } catch (error) {
      return { success: false };
    }
  }
};
