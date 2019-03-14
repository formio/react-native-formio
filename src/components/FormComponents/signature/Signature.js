import React from 'react';
import {View, Image, Text, Modal} from 'react-native';
import {Button} from 'react-native-elements';
import ValueComponent from '../sharedComponents/Value';
import SignatureCapture from 'react-native-signature-capture';
import DeviceInfo from 'react-native-device-info';
import styles from './styles';

const isTablet = DeviceInfo.isTablet();

export default class Signature extends ValueComponent {
  constructor(props) {
    super(props);
    this.toggleSignaturePad = this.toggleSignaturePad.bind(this);
    this.willReceiveProps = this.willReceiveProps.bind(this);
    this.saveSignature = this.saveSignature.bind(this);
    this.clearSignature = this.clearSignature.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.getElements = this.getElements.bind(this);
    this.signature = null;
  }

  componentDidMount() {
    if (!this.signature) {
      return;
    }
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    }
    else {
      this.signature.resetImage();
    }
  }

  willReceiveProps(nextProps) {
    if (!this.signature) {
      return;
    }
    if (this.props.value !== nextProps.value) {
      this.signature.fromDataURL(nextProps.value);
    }
  }

  onEnd(image) {
    if (!image || !image.encoded) {
      return;
    }
    const signature = `data:image/png;base64,${image.encoded}`;
    this.setValue(signature);
    this.toggleSignaturePad();
  }

  toggleSignaturePad() {
    this.setState({
      showSignaturePad: !this.state.showSignaturePad
    });
  }

  saveSignature() {
    this.signature.saveImage();
  }

  clearSignature() {
    this.signature.resetImage();
    this.setValue(null);
  }

  getElements() {
    const {component, readOnly} = this.props;

    const {value} = this.state;
    const imageUri = typeof value === 'object' ? this.state.value.item : this.state.value;
    if (readOnly) {
      const image =  imageUri;
      return (
        <View style={styles.imageWrapper}>
          <Image
            source={{uri: imageUri}}
            style={styles.signature}
            resizeMode={'stretch'}
          />
        </View>
      );
    }
    return (
      <View style={styles.signatureWrapper}>
          {imageUri && <View style={styles.imageWrapper}>
            <Image
              style={styles.signature}
              source={{uri: imageUri}}
              resizeMode={'stretch'}
            />
          </View>}
         <Button
          title={`Tap to ${imageUri ? 'change' : 'sign'}`}
          buttonStyle={styles.signatureButton}
          onPress={this.toggleSignaturePad}
          backgroundColor={'transparent'}
          color={this.props.colors.primary1Color}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showSignaturePad}
          onRequestClose={this.toggleSignaturePad}
          presentationStyle={'formSheet'}
        >
          <View style={styles.signaturePadWrapper}>
            {isTablet && <View style={styles.buttonWrapper}>
              <Button
                title={'Clear'}
                onPress={this.clearSignature}
                color={this.props.colors.primary1Color}
                backgroundColor={'transparent'}
              />
              <Button
                title={'Save Signature'}
                onPress={this.saveSignature}
                color={this.props.colors.primary1Color}
                backgroundColor={'transparent'}
              />
            </View>}
            <SignatureCapture
              style={[
                styles.signaturePad, {
                  backgroundColor: component.backgroundColor,
                }]}
              ref={(ref) => {
                  this.signature = ref;
              }}
              onSaveEvent={this.onEnd}
              saveImageFileInExtStorage={false}
              showNativeButtons={!isTablet ? true : false}
              rotateClockwise={!isTablet}
              minStrokeWidth={2}
              maxStrokeWidth={8}
              viewMode={isTablet ? 'portrait' : 'landscape'}
            />
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>{component.footer}</Text>
              <Button
                  title={'Cancel'}
                  onPress={this.toggleSignaturePad}
                  color={this.props.colors.primary1Color}
                  backgroundColor={'transparent'}
                />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
