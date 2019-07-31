import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService 3', () => {
  let sud: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });

    sud = TestBed.get(MessageService);
  });

  it('should be created', () => {
    const message = 'new message';

    sud.add(message);

    expect(sud.messages).toContain(message);
  });

  it('should clear all messages', () => {
    sud.messages = ['msg 1', 'msg 2'];

    sud.clear();

    expect(sud.messages.length).toBe(0);
  });
});
