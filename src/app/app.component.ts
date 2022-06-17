import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JoystickEvent, NgxJoystickComponent } from 'ngx-joystick';
import { JoystickManagerOptions } from 'nipplejs';
import { JoystickOutputData } from '../../node_modules/ngx-joystick/node_modules/nipplejs/types/index.d';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('staticJoystic') staticJoystic: NgxJoystickComponent;
  @ViewChild('canvas') canvasRef: ElementRef;

  joystickRadius: number = 50; // pixels

  staticOptions: JoystickManagerOptions = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'blue',
    size: this.joystickRadius * 2
  };

  private canvasWidth = window.innerWidth * 0.75;
  private canvasHeight = window.innerHeight * 0.4;

  private staticOutputData: JoystickOutputData;
  private directionStatic: string = "";
  private interactingStatic: boolean = false;

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

  onStartStatic(event: JoystickEvent) {
    this.interactingStatic = true;
  }

  onEndStatic(event: JoystickEvent) {
    this.interactingStatic = false;
    this.staticOutputData.distance = 0;
  }

  onMoveStatic(event: JoystickEvent) {
    this.staticOutputData = event.data;
  }

  get moveStrength(): number {
    if (this.staticOutputData) {
      return this.staticOutputData.distance / this.joystickRadius;
    }
    return 0;
  }

  get directionVector(): {x: number, y: number} {
    if (this.staticOutputData) {
      return {x: this.staticOutputData.vector.x, y: this.staticOutputData.vector.y};
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
