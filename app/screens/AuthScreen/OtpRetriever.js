import SmsListener from 'react-native-android-sms-listener';

module.exports = {
  otpListner: function(name: string, regex: string)  {
    var subscribe = SmsListener.addListener(message => {
      if(message != null ){
        body = message.body.match(regex)[0];
        this.setState ({[name]: body});
      }
    })
    return subscribe
  }
}