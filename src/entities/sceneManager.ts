export const sceneManager = {
    prevTimerTime: 0,
    animationPlayed: false,

    setSeconds(time: number) {
      this.prevTimerTime = time;
    },

    setAnimationPlayed(animationName: boolean) {
      this.animationPlayed = animationName;
    },
  };