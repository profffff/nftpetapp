

import { Scene } from 'phaser';
import { EventBus } from '../../game/EventBus';
import { useAccount } from 'wagmi'
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';



import React, { useState, useEffect } from 'react';

import {useTestHook } from '@/hooks'

// Types
import { INFT } from '@/types'

import { useQuery } from '@tanstack/react-query'

// Requests
import { getNFTs } from '@/requests'

//plugin
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

    text1: Phaser.GameObjects.Text;
    
    nftArray = [];

    constructor ()
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
        console.log(items);
        console.log(items[1].image)
       
        for (var i = 0; i < items.length; i++) {
           this.load.image(`nft_${i}`, items[i].image);
        }
    }

    create ()
    {   
        console.log('here');
        console.log(this.nftArray);

        var items = this.nftArray;

        
       // this.NFTimage = this.add.image(512, 300, 'logoz').setDepth(100);

        this.text1 = this.add.text(0, 0, 'Only on Nft col');
        
         EventBus.emit('current-scene-ready', this);

        var panel = this.rexUI.add.scrollablePanel({
            x: 500, y: 390,
            width: 600, height: 760,

            scrollMode: 'y',

            panel: {
            child:  CreatePanel(this, items) //{ scene: this, nftArray: this.nftArray }),
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
                panel: 0}
                
         
        })
            .layout()

        var print = this.add.text(0, 0, '');
        panel.setChildrenInteractive({
            
        })
            .on('child.click', function (child) {
                // child : Label from CreateItem()  
                print.text += `Click ${child.name}`;
                console.log(`Click ${child.name}`);
                if (child.isInTouching('actions[0]')) {
                    print.text += `'s action button`;
                }
                print.text += '\n';
            })
    }

    update() {
        
     }
        }
    
       
    

    var CreatePanel = function (scene, items) {//(params: { scene: Phaser.Scene; nftArray: { tokenId: string | undefined; image: string | undefined; name: string | undefined }[] }) { 
        // var panel = scene.rexUI.add.fixWidthSizer({ //how many items the a panel
        //     orientation: 'x',
        //     space: {
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         bottom: 0,
        //         item: 0,
        //         line: 0, //space between lines
        //         draggable: false
        //     },
        // })
        
        var panel = scene.rexUI.add.fixWidthSizer({
            // orientation: 'y',
            // space: { left: 20, right: 20, top: 20, bottom: 20, item: 20 },
            x: 400, y: 300,
          //  width: 0, height: 0,
            space: { left: 12, right: 12, top: 12, bottom: 12, item: 12 },
            // align: 'justify-right'
        })
        // .add( scene.rexUI.add.label({ //createHeader(scene, data), // child
        //         orientation: 'y',
        //         text: scene.add.text(10, 10, 'Your NFT collection:'),
        //     })
        // )

        

        //if (test_items?.length) {
        // panel 
        // .add(
        //     createTable(scene, test_items,  2), // child
        //     { expand: true }
        // )
    //}
        if (items?.length) {
            for (var i = 0; i < items.length; i++) {
                panel
                    .add(
                        CreateItem(scene, 
                            items[i].tokenId, 
                            i, 
                            items[i].name),
                        { expand: true }
                    )
            }   
        }
        else {
            panel
                    .add(
                        CreateItem(scene, 
                            "No token", 
                            "No image", 
                            "No name"),
                        { expand: true }
                    )
        }
        
       // panel.addBackground(scene.add.image(512, 300, 'logoz').setDepth(100))
       // this.NFTimage = scene.add.image(512, 300, 'logoz').setDepth(100);
       // panel.add(this.NFTimage)
       
        return panel;
    }
    
    
    var CreateItem = function (scene, tokenId, curImage, name) {
       
        let tokenIdparse = tokenId.slice(-8); //because of too long
        let tokenIdparsedOutput = `id#..${tokenIdparse}`;
        
        var iconSize = (true === true) ? 15 : 200;
        var item = scene.rexUI.add.dialog({
            width: 100,
            height: 100,
            
           // space: { left: 1, right: 1, top: 1, bottom: 1 },
    
            background: scene.rexUI.add.roundRectangle({
                radius: 10,
                color: COLOR_MAIN,
               // icon: scene.rexUI.setTexture('logoz')
                icon: scene.rexUI.add.roundRectangle(0, 0, iconSize, iconSize, 5, COLOR_LIGHT),
            }),

            //image: scene.rexUI.roundRectangle(scene.add.image(300, 300, 'logoz')),

          
         //   scene.add.image(512, 300, 'logoz').setDepth(100);
           

           // background: createIcon(scene, name, iconSize, iconSize),
    
            title: scene.rexUI.add.label({
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                text: scene.add.text(0, 0, name),
                
            }),

            // text: scene.rexUI.add.textBox({
            //     x: 400, y: 500,
    
            // }),
            
            content: scene.rexUI.add.label({
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                
                text: scene.add.text(0, 0, tokenIdparsedOutput),
            }),
    
            actions: [
                scene.rexUI.add.label({
                    space: { left: 3, right: 3, top: 3, bottom: 3 },
                    background: scene.rexUI.add.roundRectangle({
                        color: COLOR_DARK
                    }),
                    icon: scene.add.image(0, 0, `nft_${curImage}`).setScale(0.25)
                }
                ),
            ],
    
            proportion: {
                content: 2,
            },
    
            align: {
                actions: 'right'
            },
    
            
        })
        return item;
    }


   


















    

    //test (can be used)
    var createTable = function (scene, data,  columns) {

        var items = data;
        var rows = Math.ceil(items.length / columns);
        var table = scene.rexUI.add.gridSizer({
            row: rows,
            column: columns,
    
            rowProportions: 1,
            space: { row: 10, column: 10 },
        });
    
        var item, r, c;
        var iconSize = (columns === 1) ? 500 : 250;
        for (var i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            r = i % columns;
            c = (i - r) / columns;
            table.add(
                createIcon(scene, item, iconSize, iconSize),
               // CreateItem(scene, item.tokenId, item.image, item.name, iconSize, iconSize),
                c,
                r,
                'top',
                0,
                true
            );
        }
    
        return scene.rexUI.add.sizer({
            orientation: 'x',
            space: { left: 1, right: 1, top: 1, bottom: 1, item: 1 }
        })
            .addBackground(
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
            )
            .add(table, // child
                1, // proportion
                'center', // align
                0, // paddingConfig
                true // expand
            );
    }

    var createIcon = function (scene, item_name, iconWidth, iconHeight) {
        var label = scene.rexUI.add.label({
            orientation: 'y',
            icon: scene.rexUI.add.roundRectangle(0, 0, iconWidth, iconHeight, 5, COLOR_LIGHT),
            text: scene.add.text(0, 0, item_name),
    
            space: { icon: 3 }
        });
    
        return label;
    };



    




 





    
      
export {NFTCollectionScene as default}

