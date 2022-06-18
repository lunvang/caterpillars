import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  sendCircle(index: number): void {

  }

  getCircle(index: number): {x: number, y: number} {
    return {x:0, y:0};
  }

  resetGame() {
    this.httpClient.patch<{wasReset: boolean}>("https://caterpillars-d8a17-default-rtdb.europe-west1.firebasedatabase.app/posts.json", {wasReset: true})
    .subscribe((response) => console.log(response));
    setTimeout(
      () => {
        this.httpClient.patch<{wasReset: boolean}>("https://caterpillars-d8a17-default-rtdb.europe-west1.firebasedatabase.app/posts.json", {wasReset: false})
        .subscribe((response) => console.log(response))
      },
      300
    );
  }

  wasReset(): Observable<boolean> {
    return this.httpClient.get<{wasReset: boolean}>("https://caterpillars-d8a17-default-rtdb.europe-west1.firebasedatabase.app/posts.json")
    .pipe(
      map((response: {wasReset: boolean}) => { return response["wasReset"] })
    );
  }
}
