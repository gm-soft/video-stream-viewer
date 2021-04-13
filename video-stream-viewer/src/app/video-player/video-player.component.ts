import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { webSocket } from "rxjs/webSocket";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {
    this.initWebSocketSubject();
  }

  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  get show(): boolean {
    return this.url != null;
  }

  url: string | null | SafeUrl = null;

  ngOnInit(): void {
    this.url = '';
  }

  private createBase64Url(data: string) {
    var request = new XMLHttpRequest();
    request.responseType = "blob";

    const self = this;

    request.onload = function() {
      console.log(this.response);
      console.log(URL.createObjectURL(this.response));

      // Obtain a blob: URL for the image data.
      var arrayBufferView = new Uint8Array( this.response );
      var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL( blob );
      var img = document.querySelector( "#photo" );
      self.url = self.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    request.open("GET", data);
    request.send();
  }

  private replaceBase64Url(data: string) {
    console.log(data);
    const replaced = data.replace('data:application/octet-stream;', 'data:image/jpeg;');
    this.url = this.sanitizer.bypassSecurityTrustUrl(replaced);
  }

  // ---------------
  private initWebSocketSubject() {
    const subject = webSocket({
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

    subject.subscribe(
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

    subject.next({
      commandType: 0,
      parameters: {
        password: "78302615C8B79CAC8DF6D2607F8A83EE",
        userName: "user3141400",
        userType: 0
      },
      requestId: this.uuidv4()
    });

    subject.next({
      parameters: {
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
      },
      requestId: this.uuidv4(),
      commandType: 1,
    });
  }

  private blobToBase64(blob: any){
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;                
        console.log(base64data);
    }
  }
}
