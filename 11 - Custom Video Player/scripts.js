class VideoPlayer {
  constructor({ targetSelector }) {
    this.container = document.querySelector(targetSelector);
    this.video = this.container.querySelector('.player__video');
    this.progressUI = this.container.querySelector('.progress__filled');
    this.progressControl = this.container.querySelector('.progress');
    this.playControl = this.container.querySelector('.toggle');
    this.rangeControls = this.container.querySelectorAll('input[type="range"]');
    this.playbackRateControl = this.container.querySelector('input[name="playbackRate"]');
    this.skipControls = this.container.querySelectorAll('.player__button[data-skip]');

    this.state = {
      mousedown: false,
    };

    this.pauseUI = '&#10073&#10073;';
    this.playUI = '&#9658';
    this.spaceKey = 32;

    this.togglePlay = this.togglePlay.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleProgress = this.handleProgress.bind(this);

    this.listen();
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play()
      .then(() => {
        this.playControl.innerHTML = this.pauseUI;
      })
      .catch(console.error);
    } else {
      this.video.pause();
      this.playControl.innerHTML = this.playUI;
    }
  }

  handleRangeChange({ target: { name, value } }) {
    this.video[name] = value;
  }

  handleSkip({ target: { dataset: { skip } } }) {
    this.video.fastSeek(this.video.currentTime + Number(skip));
  }

  handleSeek({ offsetX }) {
    this.video.fastSeek(
      this.video.duration * (offsetX / this.progressControl.offsetWidth)
    );
  }

  handleProgress() {
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.progressUI.style['flex-basis'] = `${progress}%`;
  }

  listen() {
    this.video.addEventListener('click', this.togglePlay);
    this.playControl.addEventListener('click', this.togglePlay);
    window.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode === this.spaceKey) this.togglePlay();
    });

    this.rangeControls.forEach((control) => {
      this.handleRangeChange({ target: control });
      control.addEventListener('change', this.handleRangeChange);
    });

    this.skipControls.forEach((control) => {
      control.addEventListener('click', this.handleSkip);
    });
    this.video.addEventListener('dblclick', ({ offsetX }) => {
      const skip = offsetX > (this.video.offsetWidth / 2) ? '25' : '-10';
      this.handleSkip({ target: { dataset: { skip } } });
    });

    this.progressControl.addEventListener('click', this.handleSeek);
    this.progressControl.addEventListener('mousemove', ({ offsetX }) => {
      if (!this.state.mousedown) return;
      this.handleSeek({ offsetX });
    });
    this.video.addEventListener('mousemove', ({ offsetX }) => {
      if (!this.state.mousedown) return;
      this.handleSeek({ offsetX });
    });

    this.progressControl.addEventListener('mousedown', () => {
      this.state.mousedown = true;
    });

    this.progressControl.addEventListener('mouseup', () => {
      this.state.mousedown = false;
    });
    window.addEventListener('mouseup', () => {
      this.state.mousedown = false;
    });
    window.addEventListener('mouseout', () => {
      this.state.mousedown = false;
    });

    this.video.addEventListener('timeupdate', this.handleProgress);
  }
}

const player = new VideoPlayer({ targetSelector: '.player' });
