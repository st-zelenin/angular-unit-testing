import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService 2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
  });

  it('should be created', inject([MessageService], (sud: MessageService) => {
    const message = 'new message';

    sud.add(message);

    expect(sud.messages).toContain(message);
  }));

  it('should clear all messages', inject([MessageService], (sud: MessageService) => {
    sud.messages = ['msg 1', 'msg 2'];

    sud.clear();

    expect(sud.messages.length).toBe(0);
  }));
});
