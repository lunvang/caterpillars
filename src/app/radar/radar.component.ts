import { JoystickEvent } from 'ngx-joystick';
import { JoystickOutputData, JoystickManagerOptions } from '../../../node_modules/ngx-joystick/node_modules/nipplejs/types/index.d';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent implements OnInit, AfterViewInit {
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

  private canvasWidth = window.innerWidth * 0.8;
  private canvasHeight = window.innerHeight * 0.44;

  private staticOutputDatas: JoystickOutputData[] = new Array(2);

  private spooderLocations: {x: number, y: number}[] = [
    {x: this.canvasWidth / 2 - 60, y: -this.canvasHeight / 2},
    {x: this.canvasWidth / 2 + 60, y: -this.canvasHeight / 2}
  ];

  private spooderSize = 20;
  private speed = 10;

  private currentCircle: number = 1;

  private inactiveTicks = 0;

  private inactiveTickTimeout = 1800;

  constructor(private dataService: DataService) {}

  get context() {
    return this.canvasRef.nativeElement.getContext("2d");
  }

  ngOnInit() {
    setInterval(() => {
      this.gameTick(); 
      }, 100);
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
    this.currentCircle = index;
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

    // detect spooder movement
    let xMovement = this.moveStrength(this.currentCircle) * this.speed * this.directionVector(this.currentCircle).x;
    let yMovement = this.moveStrength(this.currentCircle) * this.speed * this.directionVector(this.currentCircle).y;
  
    if (xMovement === 0 && yMovement === 0) {
      this.inactiveTicks += 1;
    }
    else {
      this.inactiveTicks = 0;
    }


    // update spooder location
    this.spooderLocations[this.currentCircle] = {
      x: this.spooderLocations[this.currentCircle].x + xMovement,
      y: this.spooderLocations[this.currentCircle].y + yMovement
    };

    [0, 1].forEach((index: number) => {
      // draw spooder
      this.context.beginPath();
      this.context.arc(this.spooderLocations[index].x, -this.spooderLocations[index].y, this.spooderSize, 0, 2 * Math.PI);
      this.context.fillStyle = index===0 ? '#33f' : '#f30';
      this.context.fill();
      this.context.lineWidth = 5;
      this.context.strokeStyle = index===0 ? '#006' : '#310';
      this.context.stroke();
    });
    
    if (this.inactiveTicks < this.inactiveTickTimeout) {
      this.dataService.wasReset().subscribe(
        (response: boolean) => {
          if (response === true) {
            this.resetGame();
          }
        },
        (error) => console.log(error)
      );
    }
  }

  onReset() {
    this.dataService.resetGame();
  }

  resetGame() {
    this.spooderLocations = [
      {x: this.canvasWidth / 2 - 60, y: -this.canvasHeight / 2},
      {x: this.canvasWidth / 2 + 60, y: -this.canvasHeight / 2}
    ];
  }
}
