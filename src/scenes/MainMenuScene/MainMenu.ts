import { GameObjects, Scene, Actions } from 'phaser';

import { EventBus } from '../../game/EventBus';

import { INFT } from '@/types'

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    text1: GameObjects.Text;
    playerImage: string;



    constructor ()
    {
        super({key: 'MainMenu'});

        
    }

    init(choosenPlayerImage: string)   
     {
        this.playerImage = choosenPlayerImage;
     }

    preload()
    {

    }

    

    create ()
    {   
        if (!this.textures.exists(this.playerImage))
            this.playerImage = 'nft_default';
        
        this.background = this.add.image(512, 444, this.playerImage).setScale(0.55); //.setRotation(0.2)

        //this.moveLogo(0, 0);

        // this.logoTween = this.tweens.add({
        //     targets: this.logo,
        //     x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
        //     y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
        //     yoyo: true,
        //     repeat: -1,
        //     onUpdate: () => {
        //         if (vueCallback)
        //         {
        //             vueCallback({
        //                 x: Math.floor(this.logo.x),
        //                 y: Math.floor(this.logo.y)
        //             });
        //         }
        //     }
        // });



        this.title = this.add.text(512, 40, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.text1 = this.add.text(0, 0, 'My game ');

        EventBus.emit('current-scene-ready', this);
   
    }

    update() 
    {
        
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
                targets: this.background,
                x: { value: [290, 710], duration: 1500, ease: 'Sine.easeOut' },
                y: { value: 310, duration: 720, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.background.x),
                            y: Math.floor(this.background.y)
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