export interface IImageUrlReceiver {
    onImageUrlLoad(imageUrl: string): void;
    onError(error: string): void;
}
