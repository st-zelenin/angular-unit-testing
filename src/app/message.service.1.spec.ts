import { MessageService } from './message.service';

describe('MessageService 1', () => {
  let sud: MessageService;

  beforeEach(() => {
    sud = new MessageService();
  });

  it('should add new message', () => {
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
