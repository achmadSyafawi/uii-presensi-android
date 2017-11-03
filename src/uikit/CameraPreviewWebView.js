// @flow

import React, { Component } from 'react';
import { StyleSheet, WebView, View, Image } from 'react-native';

import { mergeStyles } from '../utilities';

const html = (image: String) => `<html>
  <head></head>
  <body><canvas id="c"></canvas><canvas id="cvs"></canvas></body>
  <script>
  var compressImageWithPromise = (file, quality, maxWidth, canvasId) => {
    var result = new Promise((resolve, reject) => {
      var img = new Image();

      // On android 4.0 base64 value is missing the mime type. this line is forcing the invalid value to use image/jpeg.
      img.src = file;

      // Use interval instead of onLoad because somehow in android 4.0 the onLoad event is not triggered.
      var imageInterval = setInterval(function() {
        if (img.complete) {
          clearInterval(imageInterval);

          // resize image while keeping aspect ratio
          if (maxWidth && img.width > maxWidth) {
            var ratio = img.width / maxWidth;
            img.width /= ratio;
            img.height /= ratio;
          }
          // compress
          var cvs = document.getElementById(canvasId);
          if (cvs) {
            cvs.width = img.width;
            cvs.height = img.height;

            cvs.getContext('2d').fillRect(0, 0, img.width, img.height);
            cvs.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

            resolve(cvs.toDataURL('image/jpeg', quality));
          }
        }
      }, 1);
    });
    return result;
  };
  var rotate64 = function (base64data, degrees, enableURI) {
    return new Promise(function (resolve, reject) {
      //assume 90 degrees if not provided
      degrees = degrees ? degrees : 90;

      var canvas = document.getElementById("cvs");

      var ctx = canvas.getContext("2d");

      var image = new Image();
      //assume png if not provided
      image.src = (base64data.indexOf(",") == -1 ? "data:image/png;base64," : "") + base64data;
      var imageInterval = setInterval(function() {
        if (image.complete) {
          clearInterval(imageInterval);
          var w = image.width;
          var h = image.height;
          var rads = degrees * Math.PI / 180;
          var c = Math.cos(rads);
          var s = Math.sin(rads);
          if (s < 0) { s = -s; }
          if (c < 0) { c = -c; }
          //use translated width and height for new canvas
          canvas.width = h * s + w * c;
          canvas.height = h * c + w * s;
          //draw the rect in the center of the newly sized canvas
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(degrees * Math.PI / 180);
          ctx.drawImage(image, -image.width / 2, -image.height / 2);
          //assume plain base64 if not provided
          console.log(canvas.toDataURL());
          resolve(enableURI ? canvas.toDataURL() : canvas.toDataURL().split(",")[1]);
        }
      }, 1);
      image.onerror = function () {
        reject("Unable to rotate data\n" + image.src);
      };
    });
  }
  compressImageWithPromise("${image}", 80, 300, "c")
    .then(function(data) {
      return rotate64(data, 180, false)
    })
    .then(function(rotated) {
      window.postMessage(rotated);
    });
  </script>
</html>
`;

const createStyle = (width: Number, height: Number) =>
  StyleSheet.create({
    preview: {
      width,
      height,
      position: 'relative',
    },
    internalView: {
      width,
      height,
      left: 0,
      top: 0,
      position: 'absolute',
      zIndex: 2,
    },
    webView: {
      zIndex: 2,
    },
    internalPreview: {
      zIndex: 3,
    },
  });

class CameraPreviewWebView extends Component {
  state: {
    rotatedImage: String,
  };

  state = {
    rotatedImage: '',
  };

  props: {
    image: String,
    width: Number,
    height: Number,
    onImageRotated: Function,
    style?: StyleSheet.Style | Array<StyleSheet.Style>,
  };

  convertBase64ToImage(base64: String): String {
    return `data:image/jpg;base64,${base64}`;
  }

  handleRotatedImage(e: any): void {
    const rotatedImage = e.nativeEvent.data;
    this.setState({ rotatedImage }, () => {
      this.props.onImageRotated(rotatedImage);
    });
  }

  render() {
    const { image, width, height, style } = this.props;
    const styles = createStyle(width, height);
    return (
      <View style={mergeStyles(styles.preview, style)}>
        {!this.state.rotatedImage.length
          ? <WebView
            source={{
              html: html(this.convertBase64ToImage(image)),
              javaScriptEnabled: true,
            }}
            onMessage={(e) => {
              this.handleRotatedImage(e);
              console.log(e);
            }}
            style={mergeStyles(styles.internalView, styles.webView)}
          />
          : <Image
            style={mergeStyles(styles.internalView, styles.internalPreview)}
            source={this.convertBase64ToImage(this.state.rotatedImage)}
          />}
      </View>
    );
  }
}

CameraPreviewWebView.defaultProps = {
  style: StyleSheet.create({}),
};

export default CameraPreviewWebView;
