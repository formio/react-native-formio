
import { Response, Headers, Request } from 'node-fetch';

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

jest.useFakeTimers()

jest.mock('react-native-signature-capture', () => {
  return () => ('SignatureCapture')
})

jest.mock('react-native-modal-datetime-picker', () => {
  return () => ('DateTimePicker')
})

jest.mock('react-native-htmlview', () => {
  return () => ('HTMLView')
})

jest.mock('react-native-device-info', () => {
  return {
    isTablet: () => (true)
  }
})