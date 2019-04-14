import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  settlementAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settlementAmountTextView: {
    paddingLeft: 20,
    alignItems: 'center'
  },
  settlementText: {
    fontSize: 25
  },
  checkbox: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 60,
    height: 60
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountInputText: {
    width: 80,
    borderColor: 'gray',
    borderBottomWidth: 1
  },
  deleteButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    width: 150
  },
  padding: { paddingTop: 15 },
  fontSize: { fontSize: 18 },
  textWhite: { color: 'white' }
});
