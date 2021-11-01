import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject, interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PingService implements OnDestroy {
  pingStream: Subject<number> = new Subject<number>();
  ping: number = 0;
  url: string = `${environment.apiUrl}RecordError/Ping`;
  subscription = new Subscription();
  constructor(private _http: HttpClient) {
    localStorage.setItem('ping', '');
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }
  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.subscription.unsubscribe();
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'ping') {
        if (event.newValue === 'true' ) {
          this.subscription = interval(5000)
          .subscribe((data) => {
            let timeStart: number = performance.now();
            this._http.get(this.url)
            .subscribe((data) => {
              let timeEnd: number = performance.now();
              let ping: number = timeEnd - timeStart;
              console.log('ping: ', ping);
              this.ping = ping;
              this.pingStream.next(ping);
              });
          });
        } else {
          this.pingStream.next(0);
          this.subscription.unsubscribe();
          console.log('unsubscribe interval: ', this.subscription.closed);

        }
      }
    }
  }

}
