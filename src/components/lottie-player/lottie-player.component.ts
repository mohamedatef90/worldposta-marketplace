import { Component, ChangeDetectionStrategy, input, viewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

declare const lottie: any;

@Component({
  selector: 'app-lottie-player',
  standalone: true,
  template: `<div #lottieContainer class="w-full h-full"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LottiePlayerComponent implements AfterViewInit, OnDestroy {
  animationData = input.required<any>();
  speed = input<number>(1);
  lottieContainer = viewChild.required<ElementRef>('lottieContainer');

  private anim: any;

  ngAfterViewInit() {
    this.anim = lottie.loadAnimation({
      container: this.lottieContainer().nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: this.animationData(),
    });
    this.anim.setSpeed(this.speed());
  }

  ngOnDestroy() {
    if (this.anim) {
      this.anim.destroy();
    }
  }
}
