import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


const dimensions = [
    {height: 640, width: 480},
    {height: 800, width: 600},
    {height: 1024, width: 768}
]
export default class FilesUploadComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {apiResponse: "", dimension: null, images: []};
    }
    handleUpload() {
        
    }
    componentWillMount() {
        this.handleUpload();
    }

    onChangeValue(event) {
        console.log(event.target.value);
        this.state.dimension = dimensions[event.target.value];
        console.log(this.state.dimension);
    }

    imgChange(event) {
        this.state.images = event.target.files;
        console.log(this.state.images);
    }

    convertToBase64 (file)  {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

    async onSubmit(event){
        console.log('On submit');
        if (this.state.images.size <1) {
            return;
        }
        const images = this.state.images;
        event.preventDefault();
        
        var arrayImg = [];
        for (const key of Object.keys(images)) {
            console.log(images[key])
            console.log(this.convertToBase64(images[key]))
            var value = await this.convertToBase64(images[key])
            const image = {
                image: value,
                name: images[key].name,
                size: this.state.dimension,
                type: images[key].type
            }
            //only upload jpg, jpeg and image/png pictures
            if (images[key].type === "image/jpeg" || images[key].type === "image/png") {
                arrayImg.push(image);
            }
        }
        console.log(arrayImg)
        const body = {
            "arrayImg": arrayImg
        }
        axios({
            method: 'post',
            url: 'http://localhost:9000/upload',
            data: body
        })
    }


    render() {
        return (
            <div className="container transform-vertical">
                <div className="row">
                    <form>
                        <h1>Image resizing</h1>
                        <div className="row form-group">
                            <div className="col-12 text-center">
                                <input type="file" multiple accept="image/*" className="btn btn-dark left-padding" onChange={this.imgChange.bind(this)}/> 
                            </div >
                            <div className="col-12 text-center transform-vertical">
                                <div onChange={this.onChangeValue.bind(this)}>
                                    <input style={{'marginLeft': '10px'}} type="radio" value="0" name="dim"/> 640x480 
                                    <input style={{'marginLeft': '10px'}} type="radio" value="1" name="dim"/> 800x600 
                                    <input style={{'marginLeft': '10px'}} type="radio" value="2" name="dim"/> 1024x768 
                                </div>
                            </div>
                        </div>
                        <div className="form-group transform-vertical">
                            <button className="btn btn-dark" type="submit" onClick={this.onSubmit.bind(this)}>Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}