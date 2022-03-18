import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  map = new Map<string, EventSource>();

  constructor(private zone: NgZone) {}

  getServerSentEvent(path: string, type: string): Observable<any> {
    return new Observable<any>((observer) => {
      let eventSource = this.getEventSource(path);
      this.map.set(type, eventSource);

      eventSource.onopen = (ev): void => {
        console.log('Connection to server opened.', ev);
      };

      eventSource.addEventListener(type, (event: any) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      });

      eventSource.onerror = (e): void => {
        console.log(e);
        eventSource?.close();
        observer.complete();
        this.map.delete(type);
      };
    });
  }

  stop(type: string): void {
    const eventSource = this.map.get(type);

    if (eventSource) {
      this.map.delete(type);
      eventSource.close();
    }
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
