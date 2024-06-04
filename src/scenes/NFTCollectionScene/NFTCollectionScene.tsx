import { Scene } from 'phaser';
import { EventBus } from '../../game/EventBus';

//UI plugin
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class NFTCollectionScene extends Scene
{   
    rexUI: RexUIPlugin;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    NFTimage: Phaser.GameObjects.Image;

    pageTitle: Phaser.GameObjects.Text;
    
    nftArray = [];

    constructor()
    {
        super({key: 'NFTCollectionScene'});
    }

    init(data: { nftArray: 
        { tokenId: string | undefined; 
            image: string | undefined; 
            name: string | undefined }[] 
        })   
    {
        this.nftArray = data.nftArray;
    }

    preload ()
    {   
        var items = this.nftArray;
       
        for (var i = 0; i < items.length ; i++) {
           this.load.image(`nft_${i}`, items[i].image);
        }
    }

    create ()
    {   
        this.pageTitle = this.add.text(500, 50, 'Your NFT collection:', {
            fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(10);

        var panel = this.rexUI.add.scrollablePanel({
            x: 500, y: 390,
            width: 600, height: 760,
            scrollMode: 'y',

            panel: {
            child:  CreatePanel(this, this.nftArray),
            },

            slider: {
                track: ({  
                    width: 20, radius: 20,
                    x: 1, y: 1,
                    color: 0x355B69
                }),
                thumb: ({
                    radius: 20,
                    color: 0x66ACC5,
                }),
                
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.2,
            },
            space: {
                top: 80,
                bottom: 20,
                panel: 0
            }
        })
            .layout()

        panel.setChildrenInteractive({     
        })
            .on('child.click', function (child) {
                let choosenPlayerImage = child.name;
                this.scene.scene.start('MainMenu', choosenPlayerImage);         
            })      
    
        EventBus.emit('current-scene-ready', this);
    }

        changeSceneToMainMenu()
        {
            this.scene.start('MainMenu');
        }   
    }
    
    var CreatePanel = function (scene, items) {
        var panel = scene.rexUI.add.fixWidthSizer({
            x: 400, y: 300,
            space: { item: 15, line: 15 },
        })
        
        if (items?.length) {
            for (var i = items.length - 1; i >=0 ; i--) { 
                panel
                    .add(
                        CreateItem(scene, 
                            i, 
                            items[i].name              
                         ),
                        { expand: true, }
                    )
            }   
        }
        else {
            panel
                .add(
                    CreateItem(scene, 
                        "default", 
                        "Default",
                    ),
                    { expand: true, }
                )
        }
        return panel;
    }
    
    var CreateItem = function (scene, curImage, name) {     
        var iconSize =  20;
        var item = scene.rexUI.add.dialog({
            width: 100,
            height: 100,

            background: scene.rexUI.add.roundRectangle({
                radius: 10,
                color: COLOR_MAIN,
                icon: scene.rexUI.add.roundRectangle(0, 0, iconSize, iconSize, 5, COLOR_LIGHT),
            }),

            title: scene.rexUI.add.label({
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                text: scene.add.text(0, 20, name),
                
            }),
            
            content: scene.rexUI.add.label({
                space: { left: 10, right: 10, top: 10, bottom: 10 },  
                text: scene.add.text(0, 0, 'CLICK TO SELECT'),
            }),
    
            actions: [
                scene.rexUI.add.label({
                    space: { left: 3, right: 3, top: 3, bottom: 3 },
                    background: scene.rexUI.add.roundRectangle({
                        color: COLOR_DARK
                    }),
                    icon: scene.add.image(0, 0, `nft_${curImage}`).setScale(0.32)
                }
                ),
            ],
            
            name: `nft_${curImage}`, 

            proportion: {
                content: 2,
            },
    
            align: {
                actions: 'right'
            },      
        })
        return item;
    }

      
export {NFTCollectionScene as default}

