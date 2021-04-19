import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Guid } from "./guid";
import { IImageUrlReceiver } from "./iimage-url-receiver";

export class WebSocketReceiver {

    private readonly _socket: WebSocketSubject<unknown>;

    private readonly _username: string = "user3141400";
    private readonly _password: string = "78302615C8B79CAC8DF6D2607F8A83EE";

    constructor(private readonly _receiver: IImageUrlReceiver) {
        this._socket = webSocket({
            url: 'wss://cloud2.macroscop.com:18080/webapi/ws',
            deserializer: (e) => e,
            serializer: (value) => JSON.stringify(value),
          });

        const blobToBase64 = (blob: Blob): Promise<string> => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise<string>(resolve => {
                reader.onloadend = () => {
                resolve(reader.result as string);
                };
            });
        };

        this._socket.subscribe(
            (msg: any) => {
              // Called whenever there is a message from the server.
              var event = msg as MessageEvent<Blob>;
              blobToBase64(event.data).then(base64 => {
                this.createBase64Url(base64);
              });
            },
            err => {
              // Called if at any point WebSocket API signals some kind of error.
              console.log(err);
            }, 
            () => console.log('complete') // Called when connection is closed (for whatever reason).
          );
    }

    push(message: object, commandType: number): void {
        this._socket.next({
            commandType: commandType,
            parameters: message,
            requestId: new Guid().toString()
          });
    }

    authenticate(): void {
        this.push({
            password: this._password,
            userName: this._username,
            userType: 0
          }, 0);
    }

    requestVideo(): void {
        this.push({
            archiveParameters: null,
            cameraId: "3329c69b-17e4-4d3b-9fcc-542bdfaefbe1",
            displayParameters: {
                fps: 15,
                width: 447,
                height: 648,
                isFullScreen: false
            },
            soundStreamParameters: {
                isSoundOn: false,
                soundFormat: 0
            },
            videoStreamParameters: {
                streamType: "main",
                streamFormat: "mjpeg"
            },
        }, 1);
    }

    private createBase64Url(data: string) {
        var request = new XMLHttpRequest();
        request.responseType = "blob";
    
        const self = this;
    
        request.onload = function() {
          console.log(this.response);
          console.log(URL.createObjectURL(this.response));
    
          // Obtain a blob: URL for the image data.
          const arrayBufferView = new Uint8Array( this.response );
          const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
          const urlCreator = window.URL || window.webkitURL;
          const imageUrl = urlCreator.createObjectURL( blob );

          self._receiver.onImageUrlLoad(imageUrl);
        }
    
        request.open("GET", data);
        request.send();
    }

    private blobToBase64(blob: any){
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            var base64data = reader.result;                
            console.log(base64data);
        }
    }
}