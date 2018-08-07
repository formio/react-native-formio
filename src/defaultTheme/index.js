import colors from './colors';

const Theme = {
  Main: {
    backgroundColor: colors.mainBackground
  },
  Button: {
    backgroundColor: colors.primary1Color,
    color: colors.alternateTextColor,
    fontSize: 12,
    fontWeight: 700,
    height: 45
  },
  ErrorMessage: {
    color: colors.errorColor,
    fontSize: 10,
    marginBottom: 15,
    textAlign: 'right'
  },
  Fieldset: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    labelColor: colors.textColor,
    labelSize: 9,
    labelWeight: 700,
    labelHeight: 25,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 8,
    paddingRight: 8,
  },
  Input: {
    borderColor: colors.borderColor,
    borderColorOnError:  colors.errorColor,
    color: colors.textColor,
    placeholderTextColor: colors.primary3Color,
    fontSize: 14,
    lineHeight: 18
  },
  Label: {
    color: colors.textColor,
    fontSize: 12,
    stackedHeight: 25
  },
  Select: {

  }
};

export default Theme;
