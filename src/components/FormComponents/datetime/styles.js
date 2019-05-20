
import {StyleSheet} from  'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.flatten({
  button: {
    width: DeviceInfo.isTablet() ? 150 : 120,
    marginHorizontal: DeviceInfo.isTablet() ? 10 : 0,
    marginVertical: DeviceInfo.isTablet() ? 10 : 0,
  },
  date: {
    flex: 1,
    flexDirection: DeviceInfo.isTablet() ? 'row' : 'column'
  },
  dateText: {
    fontSize: DeviceInfo.isTablet() ? 18 : 12,
    marginLeft: 20,
    marginRight: 10,
    marginTop: 20,
  }
});

export default styles;
