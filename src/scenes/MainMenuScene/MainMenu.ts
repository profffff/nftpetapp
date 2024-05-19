import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../../game/EventBus';

import { INFT } from '@/types'

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    text1: GameObjects.Text;



    constructor ()
    {
        super({key: 'MainMenu'});

        
    }

    preload()
    {
    }
    create ()
    {   
       


        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.text1 = this.add.text(0, 0, '.                 dd');

        EventBus.emit('current-scene-ready', this);
   
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    changeSceneToCollection()
    {
        if (this.logoTween)
            {
                this.logoTween.stop();
                this.logoTween = null;
            }
    
            this.scene.start('NFTCollection');
    }


    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }

    loadNFTCollectionScene(nftArray: { tokenId: string | undefined; image: string | undefined; name: string | undefined }[])
    {
        
        console.log(nftArray);
        this.scene.start('NFTCollectionScene', {nftArray: nftArray});

        
    }

}

export {MainMenu as default}