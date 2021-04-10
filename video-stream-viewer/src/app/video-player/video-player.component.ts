import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  get show(): boolean {
    return this.url != null;
  }

  url: string | null = null;

  ngOnInit(): void {
    this.url = "https://cloud2.macroscop.com:18080/video?channelid=3329c69b-17e4-4d3b-9fcc-542bdfaefbe1&login=user3141400&password=78302615C8B79CAC8DF6D2607F8A83EE";
  }
}
