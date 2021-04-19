import { IImageUrlReceiver } from "./iimage-url-receiver";

export class FileReceiver {

    // https://cloud2.macroscop.com:18080/video?channelid=3329c69b-17e4-4d3b-9fcc-542bdfaefbe1&login=user3141400&password=78302615C8B79CAC8DF6D2607F8A83EE
	private readonly serverUrl = "https://cloud2.macroscop.com:18080"
	private readonly login = "user3141400"
	private readonly password = "78302615C8B79CAC8DF6D2607F8A83EE";
	// private readonly channelid = "3329c69b-17e4-4d3b-9fcc-542bdfaefbe1";
	private readonly drawHeight = 432;
	private readonly drawWidth = Number(this.drawHeight * 1.337).toFixed(0);
    private readonly delay = 100;

    private image = new Image();
    private intervalId: NodeJS.Timeout | null = null;

    private serverFullUrl: string;

    get started(): boolean { return this.intervalId != null; }

    constructor(private readonly channelid: string, private readonly _receiver: IImageUrlReceiver) {
        this.serverFullUrl = this.serverUrl + "/site?login=" + this.login + "&password=" + this.password +"&channelid=" + channelid + "&resolutionX=" + this.drawWidth + "&resolutionY=" + this.drawHeight;
    }

    start(): void {
        this.intervalId = setInterval(() => {
            this.loading();
        }, this.delay);
		this.image.onload = this.showimage;
		this.image.src = this.serverFullUrl + "&id=" + new Date().getTime();
    }

    private showimage(): void
	{
        this._receiver.onImageUrlLoad(this.image.src);

		setTimeout(() => {
            this.loading();
        }, this.delay); 
    }

    private loading(): void
	{
		this.image.src = this.serverFullUrl + "&id=" + new Date().getTime();
    }

    stop(): void {
        if (this.intervalId == null) {
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = null;
    }
}