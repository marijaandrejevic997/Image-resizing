import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";


const dimensions = [
    {height: 200, width: 200},
    {height: 400, width: 400},
    {height: 500, width: 500}
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
                                    <input type="radio" value="0" name="dim"/> 200x200
                                    <input type="radio" value="1" name="dim"/> 400x400
                                    <input type="radio" value="2" name="dim"/> 500x500
                                </div>
                            </div>
                        </div>
                        <div className="form-group transform-vertical">
                            <button className="btn btn-dark" type="submit">Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}