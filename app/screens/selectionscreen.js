import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
//import Entypo from 'react-native-vector-icons/Entypo';

export default class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnSelected: 1
    };
  }

  renderTitlebar() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            backgroundColor: "#1da370",
            borderColor: "2px solid black"
          }}
        >
          <Image
            source={require("../assets/white.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text
            style={{
              fontFamily: "Roboto-Regular",
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
              paddingLeft: 60,
              paddingTop: 7
            }}
          >
            Select Your Language
          </Text>
        </View>
      </View>
    );
  }

  renderButton() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 30
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            flex: 4,
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={
              this.state.btnSelected == 1
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 1 })}
          >
            <Text style={{ paddingTop: 15, paddingLeft: 35 }}>
              <Text
                style={
                  this.state.btnSelected == 1
                    ? styles.txtSelected
                    : styles.txtnotSelected
                }
              >
                English
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 2
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 2 })}
          >
            <Text
              style={
                this.state.btnSelected == 2
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              हिंदी
            </Text>
            <Text
              style={
                this.state.btnSelected == 2
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Hindi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 3
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 3 })}
          >
            <Text
              style={
                this.state.btnSelected == 3
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              ಕನ್ನಡ
            </Text>
            <Text
              style={
                this.state.btnSelected == 3
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Kannada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 4
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 4 })}
          >
            <Text
              style={
                this.state.btnSelected == 4
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              ગુજરતી
            </Text>
            <Text
              style={
                this.state.btnSelected == 4
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Gujrati
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 5
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 5 })}
          >
            <Text
              style={
                this.state.btnSelected == 5
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              ਪੰਜਾਬੀ
            </Text>
            <Text
              style={
                this.state.btnSelected == 5
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Punjabi
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            flex: 4,
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={
              this.state.btnSelected == 6
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 6 })}
          >
            <Text
              style={
                this.state.btnSelected == 6
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              తెలుగు
            </Text>
            <Text
              style={
                this.state.btnSelected == 6
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Telugu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 7
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 7 })}
          >
            <Text
              style={
                this.state.btnSelected == 7
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              தமிழ்
            </Text>
            <Text
              style={
                this.state.btnSelected == 7
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Tamil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 8
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 8 })}
          >
            <Text
              style={
                this.state.btnSelected == 8
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              മലയാളം
            </Text>
            <Text
              style={
                this.state.btnSelected == 8
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Malayalam
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 9
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 9 })}
          >
            <Text
              style={
                this.state.btnSelected == 9
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              मराठी
            </Text>
            <Text
              style={
                this.state.btnSelected == 9
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Marathi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.btnSelected == 10
                ? styles.btnSelected
                : styles.notSelected
            }
            onPress={() => this.setState({ btnSelected: 10 })}
          >
            <Text
              style={
                this.state.btnSelected == 10
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              বাঙালি
            </Text>
            <Text
              style={
                this.state.btnSelected == 10
                  ? styles.txtSelected
                  : styles.txtnotSelected
              }
            >
              Bengali
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        {this.renderTitlebar()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnSelected: {
    backgroundColor: "#1da370",
    width: 140,
    height: 60,
    borderRadius: 40,
    borderColor: "black",
    elevation: 1,
    marginTop: 10
  },
  notSelected: {
    backgroundColor: "white",
    borderRadius: 40,
    width: 140,
    height: 60,
    borderColor: "green",
    borderWidth: 2,
    elevation: 1,
    marginTop: 10
  },
  txtSelected: {
    color: "white",
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    textAlign: "center"
  },
  txtnotSelected: {
    color: "black",
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    textAlign: "center"
  }
});
