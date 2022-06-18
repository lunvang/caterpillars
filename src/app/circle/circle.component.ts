import { JoystickEvent } from 'ngx-joystick';
import { JoystickOutputData, JoystickManagerOptions } from '../../../node_modules/ngx-joystick/node_modules/nipplejs/types/index.d';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  joystickRadius: number = 50; // pixels

  joystickOptions: JoystickManagerOptions = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'blue',
    size: this.joystickRadius * 2
  };

  private canvasWidth = window.innerWidth * 0.8;
  private canvasHeight = window.innerHeight * 0.4;

  private joystickOutput: JoystickOutputData;

  private spooderLocation: {x: number, y: number} = {x: this.canvasWidth / 2, y: -this.canvasHeight / 2};
  private spooderSize = 20;
  private speed = 2;


  get context() {
    return this.canvasRef.nativeElement.getContext("2d");
  }

  constructor(
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.gameTick(); 
      }, 20);
  }

  ngAfterViewInit(): void {
    if (this.context){
      this.context.canvas.width = this.canvasWidth;
      this.context.canvas.height = this.canvasHeight;
    }
  }

  onMove(event: JoystickEvent) {
    this.joystickOutput = event.data;
  }

  onEndMove() {
    this.joystickOutput.distance = 0;
  }

  get moveStrength(): number {
    if (this.joystickOutput) {
      return this.joystickOutput.distance / this.joystickRadius;
    }
    return 0;
  }

  get directionVector(): {x: number, y: number} {
    if (this.joystickOutput) {
      return {x: this.joystickOutput.vector.x, y: this.joystickOutput.vector.y};
    }
    return {x:0, y:0};
  }

  gameTick() {
    // detect spooder movement
    let xMovement = this.moveStrength * this.speed * this.directionVector.x;
    let yMovement = this.moveStrength * this.speed * this.directionVector.y;

    // update spooder location
    this.spooderLocation = {
      x: this.spooderLocation.x + xMovement,
      y: this.spooderLocation.y + yMovement
    }

    // draw spooder
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.beginPath();
    this.context.arc(this.spooderLocation.x, -this.spooderLocation.y, this.spooderSize, 0, 2 * Math.PI);
    this.context.stroke();
  }
}
