import { JoystickEvent } from 'ngx-joystick';
import { JoystickOutputData, JoystickManagerOptions } from '../../../node_modules/ngx-joystick/node_modules/nipplejs/types/index.d';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  styleUrls: ['./circles.component.scss']
})
export class CirclesComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  joystickRadius: number = 50; // pixels

  joystickOptions1: JoystickManagerOptions = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: '#00f',
    size: this.joystickRadius * 2
  };
  joystickOptions2 = {
    ...this.joystickOptions1, color: '#f30'
  };

  private canvasWidth = window.innerWidth * 0.80 - 6;
  private canvasHeight = window.innerHeight * 0.4 - 6;

  private staticOutputDatas: JoystickOutputData[] = new Array(2);

  private spooderLocations: {x: number, y: number}[] = [
    {x: this.canvasWidth / 2 - 60, y: -this.canvasHeight / 2},
    {x: this.canvasWidth / 2 + 60, y: -this.canvasHeight / 2}
  ];

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

  onEndStatic(index: number) {
    this.staticOutputDatas[index].distance = 0;
  }

  onMoveStatic(event: JoystickEvent, index: number) {
    this.staticOutputDatas[index] = event.data;
  }

  moveStrength(index: number): number {
    if (this.staticOutputDatas[index]) {
      return this.staticOutputDatas[index].distance / this.joystickRadius;
    }
    return 0;
  }

  directionVector(index: number): {x: number, y: number} {
    if (this.staticOutputDatas[index]) {
      return {x: this.staticOutputDatas[index].vector.x, y: this.staticOutputDatas[index].vector.y};
    }
    return {x:0, y:0};
  }

  gameTick() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    [0, 1].forEach((index: number) => {
      // detect spooder movement
      let xMovement = this.moveStrength(index) * this.speed * this.directionVector(index).x;
      let yMovement = this.moveStrength(index) * this.speed * this.directionVector(index).y;
  
      // update spooder location
      this.spooderLocations[index] = {
        x: this.spooderLocations[index].x + xMovement,
        y: this.spooderLocations[index].y + yMovement
      }

      // draw spooder
      this.context.beginPath();
      this.context.arc(this.spooderLocations[index].x, -this.spooderLocations[index].y, this.spooderSize, 0, 2 * Math.PI);
      this.context.fillStyle = index===0 ? '#33f' : '#f30';
      this.context.fill();
      this.context.lineWidth = 5;
      this.context.strokeStyle = index===0 ? '#006' : '#310';
      this.context.stroke();
    });

  }
}
