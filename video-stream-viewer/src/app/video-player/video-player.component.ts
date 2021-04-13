import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  constructor() {
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

  url: string | null = null;

  ngOnInit(): void {
    this.url = '';
  }

  // ---------------
  private initWebSocketSubject() {
    const subject = webSocket({
      url: 'wss://cloud2.macroscop.com:18080/webapi/ws',
      deserializer: (e) => e,
      serializer: (value) => JSON.stringify(value),
    });

    subject.subscribe(
      msg =>{
        // Called whenever there is a message from the server.
        console.log(msg); 
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
        isSoundOn: false,
        soundFormat: 0,
        videoStreamParameters: {
          streamType: "main",
          streamFormat: "mjpeg"
        },
        streamFormat: "mjpeg",
        streamType: "main",
      },
      requestId: this.uuidv4(),
      commandType: 1,
    });
  }
}
