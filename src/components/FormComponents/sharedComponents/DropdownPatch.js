import { Dropdown } from 'react-native-material-dropdown';

export default class extends Dropdown {
  constructor(props) {
    super(props);
  }

  /*
  Patch the bug referenced in the following github issue:
    - https://github.com/n4kz/react-native-material-dropdown/issues/27
  Issue is still open and are yet to be resolved on react-native-material-dropdown package
  */
  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }
}
