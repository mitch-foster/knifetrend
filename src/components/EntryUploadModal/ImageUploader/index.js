import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios'

import ReactFileReader from './ReactFileReader';
import ReactImageCropper from './ReactImageCropper';

import DefaultAddImageButton from './DefaultAddImageButton';
import DefaultRemoveImageButton from './DefaultRemoveImageButton';
import DefaultImagePreview from './DefaultImagePreview';

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploadedFile: {},
      uploadedFileDataURL: '',
      croppedImageFile: {},
      croppedImageDataURL: '',
      croppedImageURL: '',
      key: '',
      modalIsOpen: false
    }

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleImageCrop = this.handleImageCrop.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.openCropper = this.openCropper.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const { id, onChange } = this.props

    if(nextState.croppedImageURL !== this.state.croppedImageURL) {
      // console.log('something changed')
      // console.log('prevState', prevState)
      // console.log('thisState', this.state)
      onChange({
        id:id,
        previousUrl: this.state.croppedImageURL,
        currentUrl: nextState.croppedImageURL
      })
    }
  }

  openCropper() {
    this.setState({
      modalIsOpen: true
    })
  }

  handleFileUpload(file) {
    this.setState({
      uploadedFile: file.fileList[0],
      uploadedFileDataURL: file.base64,
      modalIsOpen: true
    })
  }

  handleImageCrop(cropped) {
    this.setState({
      croppedImageFile: cropped.imageFile,
      croppedImageDataURL: cropped.imageBase64,
      modalIsOpen: false
    })
    this.saveFile()
  }

  removeFile() {
    this.setState({
      uploadedFile: {},
      uploadedFileDataURL: '',
      croppedImageFile: {},
      croppedImageDataURL: '',
      croppedImageURL: ''
    })
  }

  saveFile() {
    const { croppedImageFile, key } = this.state

    let data = new FormData()

    data.append('image', croppedImageFile)
    data.append('key', key)

    axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, data)
      .then(response => {
        console.log('setting state from axios call')
        this.setState({
          croppedImageURL: response.data.url,
          key: response.data.key
        })
      })
  }

  render() {
    const {uploadedFile, uploadedFileDataURL, croppedImageDataURL, modalIsOpen} = this.state;
    const {
      imagePreview: ImagePreview,
      removeImageButton: RemoveImageButton,
      addImageButton: AddImageButton
    } = this.props

    return (
      <div>
        { croppedImageDataURL ?
          <PreviewContainer>
            <ImagePreview
              src={croppedImageDataURL}
              onClick={this.openCropper}
            />
            <RemoveImageButton onClick={this.removeFile} />
          </PreviewContainer>
          :
          <ReactFileReader base64={true} handleFiles={this.handleFileUpload}>
              <AddImageButton />
          </ReactFileReader>
        }

        <ReactImageCropper
          handleImage={this.handleImageCrop}
          base64={uploadedFileDataURL}
          file={uploadedFile}
          modalOpen={modalIsOpen}
        />
    </div>
    )
  }
}
const PreviewContainer = styled.div`
  position: relative;
  cursor: pointer;
`

ImageUploader.defaultProps = {
  removeImageButton: DefaultRemoveImageButton,
  imagePreview: DefaultImagePreview,
  addImageButton: DefaultAddImageButton
}
