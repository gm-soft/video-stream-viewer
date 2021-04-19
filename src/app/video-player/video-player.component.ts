import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileReceiver } from '../services/file-receiver';
import { IImageUrlReceiver } from '../services/iimage-url-receiver';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, IImageUrlReceiver {

  get started(): boolean { return this.imageReceiver.started; }

  private readonly imageReceiver: FileReceiver;

  constructor() {
    this.imageReceiver = new FileReceiver("3329c69b-17e4-4d3b-9fcc-542bdfaefbe1", this);
  }

  get show(): boolean {
    return this.url != null;
  }

  url: string | null | SafeUrl = null;
  error: string | null = null;

  ngOnInit(): void {
    this.url = '';
    this.imageReceiver.start();
  }

  start(): void {
    this.error = null;
    this.imageReceiver.start();
  }

  stop(): void {
    this.imageReceiver.stop();
  }

  onImageUrlLoad(imageUrl: string): void {
    this.url = imageUrl;
  }

  onError(error: string): void {
    this.error = error;
  }
}
