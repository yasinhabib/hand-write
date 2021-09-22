import React, { Component } from 'react'
import { getConfig } from './redux/actions/config';
import PropTypes from 'prop-types';
// import html2canvas from 'html2canvas';
import {getWebFontEmbedCss, toPng, toSvg } from 'html-to-image';
export default class App extends Component {
  constructor(props){
    super(props)

    this.PropTypes = {
      store: PropTypes.object.isRequired
    }

    this.state = {
      paperProp: {
        position: 'absolute',
        top: '80px',
        left: '146px',
        width: '473px',
        height: '645px',
      },
      paperConfig: {
        top: '80',
        left: '146',
        width: '473',
        height: '645',
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      textProp : {
        textAlign: 'justify',
        lineHeight: '4.5mm',
        fontSize: '11.6px',
        transform: 'rotate(0.2deg) perspective(1551px) rotateX(5deg)',
        // transform: 'rotate(0.2deg) rotateX(5deg)',
        
      },
      textPropConfig: {
        textAlign: 'justify',
        lineHeight: 4.5,
        lineHeightUnit: 'mm',
        fontSize: 11.6,
        fontSizeUnit: 'px',
        rotate: 0.2,
        perspective: 1551,
        rotateX: 5,
        rotateY: 0
      },
      font: {
        name: null,
        base64: null
      },
      backgroundImage: {
        base64: 'folio3.jpeg',
        width: '800px',
        height: '800px'
      }
    }

    this.store = this.props.store;

    this.paperImageContainerRef = React.createRef()
  }

  componentDidUpdate = (prevProps,prevState) => {
    if(JSON.stringify(prevState.textPropConfig) !== JSON.stringify(this.state.textPropConfig)){
      this.setTextProp()
    }
  }

  componentDidMount = async () => {
    var savedConfig = this.store.getState().getConfig
    if(savedConfig){
      if(savedConfig.font.name){
        const font = new FontFace(savedConfig.font.name, `url('data:font/opentype; base64, ${savedConfig.font.base64}')`);

        // wait for font to be loaded
        await font.load();
        // add font to document
        document.fonts.add(font);
        // enable font with CSS class
        document.getElementById('text-container').style.fontFamily = `'${savedConfig.font.name}'` 
      }
      this.setState(savedConfig)
    }
  }

  onChange = (e,type) => {
    const fieldName = e.target.name
    const value = e.target.value
    if(type === 'textPropConfig'){
      this.setState({
        textPropConfig: {
          ...this.state.textPropConfig,
          [fieldName] : value
        },
      })

      this.setTextProp()
    }else{
      this.setState({
        paperConfig: {
          ...this.state.paperConfig,
          [fieldName] : value
        },
        paperProp : {
          ...this.state.paperProp,
          [fieldName] : `${value}px`
        }
      })
    }
  }

  setTextProp = () => {
    const unit = [
      {
        fieldName: 'textAlign',
        type: 'static',
        value: null
      },
      {
        fieldName: 'lineHeight',
        type: 'dynamic',
        value: null
      },
      {
        fieldName: 'fontSize',
        type: 'dynamic',
        value: null
      },
      {
        fieldName: 'transform',
        type: 'static',
        value: 'rotate({rotate}deg) perspective({perspective}px) rotateX({rotateX}deg) rotateY({rotateY}deg)'
        // value: 'rotate({rotate}deg) rotateX({rotateX}deg) rotateY({rotateY}deg)'
      },
    ]
    
    var customConfig = {...this.state.textProp}
    for(const u of unit){
      if(u.type === 'dynamic'){
        let unitValue = this.state.textPropConfig[`${u.fieldName}Unit`] 
        let sizeValue = this.state.textPropConfig[`${u.fieldName}`]
        customConfig[u.fieldName] = `${sizeValue}${unitValue}`
      }else if(u.value){
        const transformComp = [
          'rotate',
          'perspective',
          'rotateX',
          'rotateY'
        ]
        let transformText = u.value
        for(const tc of transformComp){
          let sizeValue = this.state.textPropConfig[`${tc}`]
          transformText = transformText.replace('{'+tc+'}',sizeValue)
        }
        customConfig[u.fieldName] = `${transformText}`
      }else{
        var sizeValue = this.state.textPropConfig[`${u.fieldName}`]
        customConfig[u.fieldName] = `${sizeValue}`
      }
    }

    this.setState({
      textProp : customConfig
    })
  }

  onFontUploaded = (e) => {
    // const fieldName = e.target.name
    const value = e.target.value

    const fileName = value.split(/(\\|\/)/g).pop()
    const fileNameWithoutExt = fileName.substring(0,fileName.lastIndexOf('.'))
    var ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();

    if (e.target.files && e.target.files[0]&& (ext === "ttf" || ext === "otf" || ext === "svg" || ext === "eot" || ext === "woff")) {
        var reader = new FileReader();

        reader.onload = async (e) => {
          const base64uploadedData = this.formatUploadFileData(e.target.result)
          
          const font = new FontFace(fileNameWithoutExt, `url('data:font/opentype; base64, ${base64uploadedData.base64data}')`);

          // wait for font to be loaded
          await font.load();
          // add font to document
          document.fonts.add(font);
          // enable font with CSS class
          document.getElementById('text-container').style.fontFamily = `'${fileNameWithoutExt}'`         
          this.setState({
            font: {
              name: fileNameWithoutExt,
              base64: base64uploadedData.base64data
            },
          })
        }
        reader.readAsDataURL(e.target.files[0]);
    }
  }

  onBackgroundUpload = (e) => {
    const value = e.target.value

    // const fileName = value.split(/(\\|\/)/g).pop()
    var ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
    const file = e.target.files[0]

    if (e.target.files && file && (ext === "jpg" || ext === "jpeg" || ext === "png")) {
        var reader = new FileReader();

        reader.onload = async (e) => {   
          let backgroundImage = {...this.state.backgroundImage}    
          backgroundImage.base64 = e.target.result   

          var img = new Image();

          img.onload = () => {
              backgroundImage.width = img.width+'px'
              backgroundImage.height = img.height+'px'

              this.setState({
                backgroundImage: backgroundImage
              })  

              URL.revokeObjectURL(img.src);
          };

          img.src = URL.createObjectURL(file);    
        }
        reader.readAsDataURL(file);
    }
  }

  formatUploadFileData(fileData){
    var mime = fileData.split(':')[1]
    var mimeClean = mime.split(';')[0]
    var base64data = fileData.split(',')[1]

    var result = {
        mime: mimeClean,
        base64data: base64data
    }

    return result
  }

  saveConfig = () => {
    this.store.dispatch(getConfig(this.state))
  }

  saveAsImage = async () => {
    var htmlElem = document.createElement('div')
    // console.log(htmlElem)
    var head = document.createElement('head')
    var style = document.createElement('style')
    style.type = 'text/css';
    var css = `@font-face{name:'${this.state.font.name}';src:url('data:font/opentype; base64, ${this.state.font.base64}')}`
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style)
    htmlElem.appendChild(head)
    var body = document.createElement('body')
    body.style.padding = '0px'
    body.style.margin = '0px'
    body.appendChild(document.getElementById('paper-image-container'))
    htmlElem.appendChild(body)

    var xmlSerialized = (new XMLSerializer()).serializeToString(htmlElem);

    // build SVG string
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${this.state.backgroundImage.width}' height='${this.state.backgroundImage.height}'>
        <foreignObject x='0' y='0' width='${this.state.backgroundImage.width}' height='${this.state.backgroundImage.height}'>
            ${xmlSerialized}
        </foreignObject>
    </svg>`;

    console.log(svg)

    // convert SVG to data-uri
    const dataUri = `data:image/svg+xml;base64,${window.btoa(svg)}`;

    console.log(dataUri)
    
    // toSvg(this.paperImageContainerRef.current, { cacheBust: true  })
    //   .then((dataUrl) => {
    //     const link = document.createElement('a')
    //     link.download = 'my-image-name.svg'
    //     link.href = dataUrl
    //     link.click()
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    // html2canvas(document.getElementById('paper-image-container')).then(function(canvas) {
    //   document.getElementById('canvas-container').appendChild(canvas);
      // canvas.toBlob(blob => {
      //   if (!blob) {
      //     //reject(new Error('Canvas is empty'));
      //     console.error('Canvas is empty');
      //     return;
      //   }

      //   var fileURL = URL.createObjectURL(blob);
      //   window.open(fileURL);
        
        
      // }, 'image/png');
    // });
  }

  resetConfig = () => {
    this.props.store.dispatch(getConfig(null))

    window.location.reload()
  }

  render() {
    var textStyle = {
      whiteSpace: 'pre-line',
      ...this.state.textProp
    }
    return (
      <>
      <div className="d-flex justify-content-between">
        <div ref={this.paperImageContainerRef} id="paper-image-container" style={{backgroundImage: `url(${this.state.backgroundImage.base64})`, width: `${this.state.backgroundImage.width}`, height: `${this.state.backgroundImage.height}`}}>
          <div style={this.state.paperProp}>
            <p id="text-container" style={{margin: '0px',padding: '0px',...textStyle}}>
            {this.state.text}
            </p>
          </div>
        </div>
        <div className="p-2">
          <div className="d-flex flex-row">
            <div className="mr-3">
              <span>Paper Config</span>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column mr-3">
                  <span style={{margin: '3px 0px'}}>Top Position</span>
                  <span style={{margin: '3px 0px'}}>Left Position</span>
                  <span style={{margin: '3px 0px'}}>Text Width</span>
                  <span style={{margin: '3px 0px'}}>Text Height</span>
                </div>
                <div className="d-flex flex-column">
                  <input type="number" value={this.state.paperConfig.top} onChange={(e) => {this.onChange(e,'paperConfig')}} name="top" />
                  <input type="number" value={this.state.paperConfig.left} onChange={(e) => {this.onChange(e,'paperConfig')}} name="left" />
                  <input type="number" value={this.state.paperConfig.width} onChange={(e) => {this.onChange(e,'paperConfig')}} name="width" />
                  <input type="number" value={this.state.paperConfig.height} onChange={(e) => {this.onChange(e,'paperConfig')}} name="height" />
                </div>
              </div>
              <span className="mt-3 d-block">Font Config</span>
              <input type="file" onChange={(e) => {this.onFontUploaded(e)}} accept=".ttf,.otf,.svg,.eot,.woff" />
              <span className="mt-3 d-block">Background</span>
              <input type="file" onChange={(e) => {this.onBackgroundUpload(e)}} accept=".jpg,.jpeg,.png" />
            </div>
            <div>
              <span className="d-block">Text Config</span>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column mr-3">
                  <span style={{margin: '3px 0px'}}>Text Align</span>
                  <span style={{margin: '3px 0px'}}>Line Height</span>
                  <span style={{margin: '3px 0px'}}>Line Height Unit</span>
                  <span style={{margin: '3px 0px'}}>Font Size</span>
                  <span style={{margin: '3px 0px'}}>Font Size Unit</span>
                  <span style={{margin: '3px 0px'}}>Rotate</span>
                  <span style={{margin: '3px 0px'}}>Perspective</span>
                  <span style={{margin: '3px 0px'}}>Rotate X</span>
                  <span style={{margin: '3px 0px'}}>Rotate Y</span>
                </div>
                <div className="d-flex flex-column">
                  <select style={{height:'30px'}} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="textAlign" value={this.state.textPropConfig.textAlign}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                  <input type="number" value={this.state.textPropConfig.lineHeight} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="lineHeight" />
                  <select style={{height:'30px'}} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="lineHeightUnit" value={this.state.textPropConfig.lineHeightUnit}>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                  </select>
                  <input type="number" value={this.state.textPropConfig.fontSize} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="fontSize" />
                  <select style={{height:'30px'}} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="fontSizeUnit" value={this.state.textPropConfig.fontSizeUnit}>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                  </select>
                  <input type="number" value={this.state.textPropConfig.rotate} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="rotate" />
                  <input type="number" value={this.state.textPropConfig.perspective} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="perspective" />
                  <input type="number" value={this.state.textPropConfig.rotateX} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="rotateX" />
                  <input type="number" value={this.state.textPropConfig.rotateY} onChange={(e) => {this.onChange(e,'textPropConfig')}} name="rotateY" />
                </div>
              </div>
            </div>
          </div>
          
          <span className="d-block mt-3">Text</span>
          <textarea name="text" className="w-100" style={{height: 'calc(100vh - 370px)'}} defaultValue={this.state.text}>
          </textarea>
          <button onClick={this.saveConfig.bind(this)}>Save Config</button>
          <button onClick={this.resetConfig.bind(this)}>Reset Config</button>
          <button onClick={this.saveAsImage.bind(this)}>Save as Image</button>
        </div>
      </div>
      <div id="canvas-container">
        
      </div>
      </>
    )
  }
}
