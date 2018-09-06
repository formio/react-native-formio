
import {StyleSheet} from  'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.flatten({
  button: {
    width: DeviceInfo.isTablet() ? 150 : 70,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  date: {
    flex: 1,
    flexDirection: 'row'
  },
  dateText: {
    fontSize: 18,
    marginLeft: 20,
    marginRight: 10,
    marginTop: 20,
  }
});

export default styles;
