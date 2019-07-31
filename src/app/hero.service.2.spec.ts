import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

import SpyObj = jasmine.SpyObj;

describe('HeroService', () => {
  let sut: HeroService;
  let httpTestingController: HttpTestingController;
  let messageService: SpyObj<MessageService>;

  beforeEach(() => {
    messageService = jasmine.createSpyObj<MessageService>(['add']);

    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: MessageService, useValue: messageService },
      ],
      imports: [HttpClientTestingModule]
    });

    sut = TestBed.get(HeroService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  //...
  afterEach(() => {
    // assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should return expected heroes', () => {
    const expectedHeroes: Hero[] = [
      { id: 1, name: 'A' }, { id: 2, name: 'B' }
    ];

    sut.getHeroes().subscribe(
      heroes => expect(heroes).toEqual(expectedHeroes),
      fail
    );

    const req = httpTestingController.expectOne('api/heroes');
    expect(req.request.method).toEqual('GET');

    req.flush(expectedHeroes);
  });

  it('should return empty array and log an error when request fails', () => {
    sut.getHeroes().subscribe(
      heroes => {
        expect(heroes).toEqual([]);
        expect(messageService.add).toHaveBeenCalledWith(jasmine.stringMatching('Not Found'));
      },
      fail
    );

    const req = httpTestingController.expectOne('api/heroes');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
