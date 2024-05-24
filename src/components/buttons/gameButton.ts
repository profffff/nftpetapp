import Phaser from 'phaser'
import Actions from '../../entities/actions'


const WHITE = 0xffffff

export default class Button extends Phaser.GameObjects.Image
{
	private upTexture: string
	private upTint: number
	private downTexture: string
	private downTint: number
	private overTexture: string
	private overTint: number
	private disabledTexture: string
	private disabledTint: number

	private buttonKey: string
	private handleKeyValue: ((key: string) => void) | undefined;

	constructor(scene: Phaser.Scene, buttonKey: string, x: number, y: number, texture: string, tint: number = WHITE)
	{
		super(scene, x, y, texture)

		this.setTint(tint)

		this.upTexture = texture
		this.upTint = tint
		this.downTexture = texture
		this.downTint = tint
		this.overTexture = texture
		this.overTint = tint
		this.disabledTexture = texture
		this.disabledTint = tint
		this.buttonKey = buttonKey
		
		

		this.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleUp, this)
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut, this)
			//.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleDown, this)
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer) => {
				this.handleDown(pointer, this.buttonKey );
			}, this)
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver, this)
	}

	
	 setKeyValueCallback(callback: (key: string) => void) {
        this.handleKeyValue  = callback;
    }

	setUpTexture(texture: string)
	{
		this.upTexture = texture
		return this
	}

	setUpTint(tint: number)
	{
		this.upTint = tint
		return this
	}

	setDownTexture(texture: string)
	{
		this.downTexture = texture
		return this
	}

	setDownTint(tint: number)
	{
		this.downTint = tint
		return this
	}

	setOverTexture(texture: string)
	{
		this.overTexture = texture
		return this
	}

	setOverTint(tint: number)
	{
		this.overTint = tint
		return this
	}

	setDisabledTexture(texture: string)
	{
		this.disabledTexture = texture
		return this
	}

	setDisabledTint(tint: number)
	{
		this.disabledTint = tint
		return this
	}

	setDisabled(disabled: boolean)
	{
		if (disabled)
		{
			this.setTexture(this.disabledTexture)
			this.setTint(this.disabledTint)
			this.disableInteractive()
			return this
		}

		this.setTexture(this.upTexture)
		this.setTint(this.disabledTint)
		this.setInteractive()

		return this
	}

	private handleUp(pointer: Phaser.Input.Pointer)
	{
		this.handleOver(pointer)
	}

	private handleOut(pointer: Phaser.Input.Pointer)
	{
		this.setTexture(this.upTexture)
		this.setTint(this.upTint)
	}

	private handleDown(pointer: Phaser.Input.Pointer, key: string)
	{
		this.setTexture(this.downTexture)
		this.setTint(this.downTint)
		this.buttonKey = key

		if (typeof this.handleKeyValue === 'function') {
			this.handleKeyValue(key);
		}

		//new Actions(key);
	}

	private handleOver(pointer: Phaser.Input.Pointer)
	{
		this.setTexture(this.overTexture)
		this.setTint(this.overTint)
	}
}