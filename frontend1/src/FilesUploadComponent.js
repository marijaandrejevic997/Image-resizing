import React, { Component, Link } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import fileDownload from 'js-file-download';


const dimensions = [
    {height: 640, width: 480},
    {height: 800, width: 600},
    {height: 1024, width: 768}
]
export default class FilesUploadComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "", 
            dimension: null, 
            images: [], 
            isError: "",
            already_uploaded_urls: JSON.parse(localStorage.getItem("urls"))
        };
        console.log(this.state.already_uploaded_urls)
    }
    
    onChangeValue(event) {
        this.state.dimension = dimensions[event.target.value];
    }
    imgChange(event) {
        this.state.images = event.target.files;
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
        if (this.state.images.length < 1) {
            this.setState({isError: "Please upload at least one file! (Supported extensions are .jpg/.jpeg and .png)"});
            console.log(this.state.isError)
        } else {
            const images = this.state.images;
            event.preventDefault();
        
            var arrayImg = [];
            for (const key of Object.keys(images)) {
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
            const body = {
                "arrayImg": arrayImg
            }
            try {
                axios({
                    method: 'post',
                    url: 'http://localhost:9000/upload',
                    data: body
                })
                .then(res=> {
                    console.log(res);
                    localStorage.setItem('urls', JSON.stringify(res.data["link"]));
                    window.location.reload();
                })
            } catch (err) {
                this.setState({isError: 'Error occurred: ' + err})
            }
        }
    }

    handleDownload = (url, filename) => {
        axios.get(url, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename)
        })
    }


    render() {
        var links = localStorage.getItem("urls") != null ? JSON.parse(localStorage.getItem("urls")) : [];
        console.log(links)
        console.log(links.length)
        
        return (
            <div >
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
                            <button className="btn btn-dark"  onClick={this.onSubmit.bind(this)}>Upload</button>
                        </div>
                        
                        <div className = "row" style={{'paddingTop': '50px'}}>
                            <div className="error">
                                {this.state.isError}
                            </div>
                        </div> 

                        <div className = "row" style={{'paddingTop': '50px'}}>
                            {links.length > 0 && 
                                <div>
                                    <div>The latest uploaded images:</div>
                                    <br/>
                                </div>
                            }
                            <div>
                                {links.map( 
                                    link => {
                                       return <div key={link.index} style={{'paddingBottom': '10px'}}>
                                           <button download onClick={this.handleDownload(link.address, link.name)} className="btn btn-dark">{link.name}</button>
                                        </div>
                                       
                                    }
                                )}
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}