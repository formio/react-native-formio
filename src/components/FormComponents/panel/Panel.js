import React from 'react';
import {FormioComponentsList} from '../../';
import {View} from 'react-native';
import {Card} from 'react-native-elements';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import styles from './styles';

const Panel = (props) => {
  const title = (props.component.title && !props.component.hideLabel ? props.component.title : undefined);
  const titleStyle = {...StyleSheet.flatten(styles.title), color: props.colors.secondaryTextColor};

    return (
      <Card containerStyle={styles.panel} title={title} titleStyle={titleStyle}>
        <View style={styles.componentsWrapper}>
          <FormioComponentsList
            {...props}
            components={props.component.components}
          ></FormioComponentsList>
        </View>
      </Card>
    );
};

Panel.propTypes = {
  component: PropTypes.object,
  theme: PropTypes.object,
  colors: PropTypes.object
};

export default Panel;
