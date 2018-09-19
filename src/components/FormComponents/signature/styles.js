import {StyleSheet} from  'react-native';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const border = '#000033';

const styles = StyleSheet.create({
  signatureWrapper: {
    marginTop: 10,
    flexDirection: 'row',
  },
  imageWrapper: {
    marginTop: 10,
  },
  signatureButton: {
    width: 150,
    marginTop: isTablet ? 0 : 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  signature: {
    marginLeft: 20,
    width: 50,
    height: 50,
  },
  signaturePadWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signaturePad: {
    flex: 1,
    borderColor: border,
    borderWidth: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
  }
});

export default styles;
