import { baseApi } from 'src/http-common.js'
import store from '@/store'


export default class UploadAdapter {
  constructor( loader, url ) {
      // The file loader instance to use during the upload.
      this.loader = loader;
      this.url = url
  }

  // Starts the upload process.
  upload() {
      return this.loader.file
          .then( file => new Promise( ( resolve, reject ) => {
              this._initRequest();
              this._initListeners( resolve, reject, file );
              this._sendRequest( file );
          } ) );
  }

  // Aborts the upload process.
  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();
      
      xhr.open( 'POST', baseApi(store.getters.selectedStore.url_id, this.url.langId, 'product/upload'), true );
      xhr.setRequestHeader('Authorization', 'Bearer ' + store.state.user.token.access_token)
      xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners( resolve, reject, file ) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${ file.name }.`;

      xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {
          const response = xhr.response;

          if ( !response || response.error ) {
              return reject( response && response.error ? response.error.message : genericErrorText );
          }
          console.log('xhr', response.data[0].photo_md)

          resolve( {
            //   default: response.url
            default: response.data[0].photo_md
          } );
      } );

      if ( xhr.upload ) {
          xhr.upload.addEventListener( 'progress', evt => {
              if ( evt.lengthComputable ) {
                  loader.uploadTotal = evt.total;
                  loader.uploaded = evt.loaded;
              }
          } );
      }
  }

  // Prepares the data and sends the request.
  _sendRequest( file ) {
      // Prepare the form data.
      const data = new FormData();

      data.append( 'file', file );

      // Send the request.
      this.xhr.send( data );
  }
}