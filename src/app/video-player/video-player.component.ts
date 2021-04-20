import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileReceiver } from '../services/file-receiver';
import { IImageUrlReceiver } from '../services/iimage-url-receiver';
import { ComponentState } from './component-state';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, IImageUrlReceiver {

  get started(): boolean { return this.imageReceiver != null ? this.imageReceiver.started : false; }
  get hasData(): boolean { return this.state === ComponentState.HasData; }
  get noData(): boolean { return this.state === ComponentState.NoData; }

  private imageReceiver: FileReceiver | null = null;
  private state = ComponentState.Initiated;

  constructor(private readonly route: ActivatedRoute) {}

  get show(): boolean {
    return this.url != null;
  }

  url: string | null | SafeUrl = null;
  error: string | null = null;

  ngOnInit(): void {
    this.url = '';

    this.route.queryParams.subscribe(params => {
        const channelId = params['channel'] as string;


        if (channelId == null) {
          this.state = ComponentState.NoData;
          return;
        }

        // 3329c69b-17e4-4d3b-9fcc-542bdfaefbe1
        this.imageReceiver = new FileReceiver(channelId, this);
        this.state = ComponentState.HasData;
        this.imageReceiver.start();
    });
  }

  start(): void {
    this.error = null;
    this.imageReceiver?.start();
  }

  stop(): void {
    this.imageReceiver?.stop();
  }

  onImageUrlLoad(imageUrl: string): void {
    this.url = imageUrl;
  }

  onError(error: string): void {
    this.error = error;
  }
}
