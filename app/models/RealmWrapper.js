//@flow

import { realm } from 'app/models/schema';
import Realm from 'realm';
var uuid = require('uuid');

export default class RealmWrapper {
  static generatePrimaryKey() {
    return uuid.v1();
  }

  static create(data: Object) {
    var current_object;
    data[this.schema.primaryKey] = this.generatePrimaryKey();
    let writeData = this.removeNestedObjects(data);
    realm.write(() => {
      current_object = realm.create(this.schema.name, writeData);
    });
    if (current_object) {
      current_object.addNestedObjects(data);
      current_object.mapToParentObject(data);
    }
    return current_object;
  }

  mapToParentObject(data: Object) {
    if (this.constructor.schema.references && this.constructor.schema.references.parent) {
      let parent_reference = this.constructor.schema.references.parent;
      let match_criteria = parent_reference.matchCriteria;
      let parent_object = realm
        .objects(parent_reference.objectType)
        .filtered(match_criteria.object_ref + '=$0', data[match_criteria.remote_ref]);
      if (parent_object && parent_object.length > 0) {
        realm.write(() => {
          parent_object[0][parent_reference.collection].push(this);
        });
      }
    }
  }

  static removeNestedObjects(object) {
    let clone = Object.assign({}, object);
    if (this.schema.references) {
      for (let i in this.schema.references.children) {
        if (clone[i]) {
          delete clone[i];
        }
      }
    }
    return clone;
  }

  addNestedObjects(data: Object) {
    if (this.constructor.schema.references) {
      realm.write(() => {
        for (let i in this.constructor.schema.references.children) {
          let child_reference = this.constructor.schema.references.children[i];
          if (child_reference.type === 'list') {
            if (data[i]) {
              this.deletePreviousRecords(child_reference);
            }
            for (let j in data[i]) {
              let child_attribute = data[i][j];
              let newNestedObj = this.createChild(child_attribute, child_reference);
              this[i].push(newNestedObj);
            }
          } else {
            if (data[i]) {
              let child_attribute = data[i];
              realm.delete(this[i]);
              let newNestedObj = this.createChild(child_attribute, child_reference);
              this[i] = newNestedObj;
            }
          }
        }
      });
    }
  }

  deletePreviousRecords(child_reference: Object) {
    let key = this.constructor.schema.primaryKey;
    let filtered_objects = realm
      .objects(child_reference.objectType)
      .filtered('server_id!=$0 AND ' + child_reference.parentReference + '=$1', '', this[key]);
    realm.delete(filtered_objects);
  }

  createChild(child_attribute: Object, child_reference: Object) {
    child_attribute[child_reference.primaryKey] = this.constructor.generatePrimaryKey();
    child_attribute[child_reference.parentReference] = this[this.constructor.schema.primaryKey];
    let newNestedObj = realm.create(child_reference.objectType, child_attribute);
    return newNestedObj;
  }

  update(data: Object, resetNestedObjects: boolean = false) {
    var writeData = this.constructor.removeNestedObjects(data);
    writeData[this.constructor.schema.primaryKey] = this[this.constructor.schema.primaryKey];
    if (this.constructor.schema.references && this.constructor.schema.references.parent) {
      writeData[this.constructor.schema.references.parent] = this[
        this.constructor.schema.references.parent
      ];
    }
    realm.write(() => {
      realm.create(this.constructor.schema.name, writeData, true);
    });
    if (resetNestedObjects && this.constructor.schema.references) {
      for (let i in this.constructor.schema.references.children) {
        if (data[i]) {
          this.constructor.remove(this[i]);
        }
      }
    }
    this.addNestedObjects(data);
  }

  static remove(deleteInstance: Object) {
    realm.write(() => {
      realm.delete(deleteInstance);
    });
  }

  remove() {
    realm.write(() => {
      realm.delete(this);
    });
  }
}
