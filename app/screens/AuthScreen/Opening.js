import React, { Component, PropTypes } from "react"
import { StyleSheet } from "react-native"
import { Text, View } from "react-native-animatable"

import CustomButton from "../../components/auth/CustomButton"
import metrics from "../../config/metrics"

export default class Opening extends Component {
  // static propTypes = {
  //   onCreateAccountPress: PropTypes.func.isRequired,
  //   onSignInPress: PropTypes.func.isRequired
  // }

  render() {
    return (
      <View style={styles.container}>
        {/* <View animation={"zoomIn"} delay={600} duration={400}>
          <CustomButton
            text={"Create Account"}
            onPress={this.props.onCreateAccountPress}
            buttonStyle={styles.createAccountButton}
            textStyle={styles.createAccountButtonText}
          />
        </View>
        <View
          style={styles.separatorContainer}
          animation={"zoomIn"}
          delay={700}
          duration={400}
        >
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>{"Or"}</Text>
          <View style={styles.separatorLine} />
        </View> */}
        <View animation={"zoomIn"} delay={800} duration={400}>
          <CustomButton
            text={"Sign In"}
            onPress={this.props.onSignInPress}
            buttonStyle={styles.createAccountButton}
            textStyle={styles.createAccountButtonText}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: metrics.DEVICE_WIDTH * 0.1,
    justifyContent: "center"
  },
  createAccountButton: {
    backgroundColor: "#1da370"
  },
  createAccountButtonText: {
    color: "white"
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: "#9B9FA4"
  },
  separatorOr: {
    color: "#9B9FA4",
    marginHorizontal: 8
  },
  signInButton: {
    backgroundColor: "#1976D2"
  },
  signInButtonText: {
    color: "white"
  }
})
