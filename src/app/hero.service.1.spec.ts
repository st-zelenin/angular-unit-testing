import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { asyncData, asyncError } from './shared/testing-helpers';

import SpyObj = jasmine.SpyObj;

describe('HeroService 1', () => {
  let sut: HeroService;
  let httpClient: SpyObj<HttpClient>;
  let messageService: SpyObj<MessageService>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj<HttpClient>(['get']);
    messageService = jasmine.createSpyObj<MessageService>(['add']);

    sut = new HeroService(httpClient, messageService);
  });

  it('should return expected heroes', () => {
    const expectedHeroes: Hero[] = [
      { id: 1, name: 'A' }, { id: 2, name: 'B' }
    ];

    httpClient.get.withArgs('api/heroes').and.returnValue(asyncData(expectedHeroes));

    sut.getHeroes().subscribe(
      heroes => expect(heroes).toEqual(expectedHeroes),
      fail
    );

    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should return empty array and log an error when request fails', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404, statusText: 'Not Found'
    });

    httpClient.get.and.returnValue(asyncError(errorResponse));

    sut.getHeroes().subscribe(
      heroes => {
        expect(heroes).toEqual([]);
        expect(messageService.add).toHaveBeenCalledWith(jasmine.stringMatching('Not Found'));
      },
      fail
    );
  });
});
