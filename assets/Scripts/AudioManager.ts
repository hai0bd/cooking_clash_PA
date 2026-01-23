import { _decorator, Component, AudioSource, AudioClip } from 'cc';
import { ESound } from './Core/Enum';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    
    @property(AudioSource)
    audioSource: AudioSource = null!;

    @property([AudioClip])
    clip: AudioClip[] = [];

    public static instance: AudioManager = null!;

    protected onLoad(): void {
        AudioManager.instance = this;
    }

    public playSound(clip: ESound, delay: number = 0, volume: number = 1, loop: boolean = false): void {
        this.scheduleOnce(() => {
            this.audioSource.volume = volume;

            let selectedClip: AudioClip | null = null;
            switch (clip) {
                case ESound.Click:
                    selectedClip = this.clip[0];
                    break;
                case ESound.Pour:
                    selectedClip = this.clip[1];
                    break;
                case ESound.thank:
                        selectedClip = this.clip[2];
                        break;
                case ESound.great:
                        selectedClip = this.clip[3];
                        break;
                case ESound.Capy:
                        selectedClip = this.clip[4];
                        break;
            }

            if (selectedClip) {
                this.audioSource.clip = selectedClip;
                this.audioSource.loop = loop;

                if (loop) {
                    this.audioSource.play(); // Phát lặp
                } else {
                    this.audioSource.playOneShot(selectedClip, volume); // Phát một lần
                }
            }
        }, delay);
    }

    public stopSound(): void {
        if (this.audioSource.playing) {
            this.audioSource.stop();
        }
    }
}
