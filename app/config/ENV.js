// @flow

const SERVER = 'http://ec2-18-234-227-66.compute-1.amazonaws.com:5000/';
const FONT_SIZES = {
  H22: 22,
  H20: 20,
  H1: 18,
  H2: 16,
  H3: 14,
  H4: 12,
  H5: 11,
  H6: 10,
  H7: 9
};
const LANGUAGES = [
  {
    name: 'English'
  },
  {
    name: 'Hindi',
    value: 'हिंदी'
  },
  {
    name: 'Kannada',
    value: 'ಕನ್ನಡ'
  },
  {
    name: 'Gujrati',
    value: 'ગુજરતી'
  },
  {
    name: 'Punjabi',
    value: 'ਪੰਜਾਬੀ'
  },
  {
    name: 'Telugu',
    value: 'తెలుగు'
  },
  {
    name: 'Tamil',
    value: 'தமிழ்'
  },
  {
    name: 'Malayalam',
    value: 'മലയാളം'
  },
  {
    name: 'Marathi',
    value: 'मराठी'
  },
  {
    name: 'Bengali',
    value: 'বাঙালি'
  }
];

module.exports = {
  SERVER,
  SERVER_URL: `${SERVER}`,
  FONT_SIZES,
  LANGUAGES
};
