import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesComponent } from './heroes.component';

import SpyObj = jasmine.SpyObj;

describe('HeroesComponent 1', () => {
  let sud: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: SpyObj<HeroService>;
  let heroes: Hero[];

  beforeEach(async(() => {
    heroes = [{ id: 1, name: 'Batman' }, { id: 2, name: 'Superman' }] as Hero[];
    heroService = jasmine.createSpyObj<HeroService>(['getHeroes', 'addHero', 'deleteHero']);
    heroService.getHeroes.and.returnValue(of(heroes));

    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [{ provide: HeroService, useValue: heroService }],
      imports: [RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    sud = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch heroes on init', () => {
    expect(heroService.getHeroes).toHaveBeenCalled();
    expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
    expect(sud.heroes).toEqual(heroes);
  });

  it('should render list of heroes', () => {
    const heroLinks: HTMLElement[] = fixture.nativeElement.querySelectorAll('a');
    const heroNames = Array.from(heroLinks).map(a => a.innerText);

    expect(heroNames).toEqual(['1 Batman', '2 Superman']);
  });

  it('should render links to hero details', () => {
    const heroLinks: HTMLElement[] = fixture.nativeElement.querySelectorAll('a');
    const hrefs = Array.from(heroLinks).map(a => a.getAttribute('href'));

    expect(hrefs).toEqual(['/detail/1', '/detail/2']);
  });

  it('should add new hero to the hero list', () => {
    heroService.addHero.and.callFake(hero => of(hero));

    fixture.nativeElement.querySelector('input').value = 'stepan zelenin';
    fixture.nativeElement.querySelector('div button').click();
    fixture.detectChanges();

    expect(heroService.addHero).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'stepan zelenin' }));
    expect(sud.heroes).toContain(jasmine.objectContaining({ name: 'stepan zelenin' }));
  });

  it('should render new hero', () => {
    heroService.addHero.and.callFake(() => of({ id: 3, name: 'stepan zelenin' }));

    fixture.nativeElement.querySelector('input').value = 'stepan zelenin';
    fixture.nativeElement.querySelector('div button').click();
    fixture.detectChanges();

    const names = Array.from(fixture.nativeElement.querySelectorAll('a') as HTMLElement[]).map(a => a.innerText);
    expect(names).toContain('3 stepan zelenin');
    expect(fixture.nativeElement.querySelector('input').value).toBe('');
  });

  it('should delete a hero', () => {
    heroService.deleteHero.and.callFake(() => of());

    fixture.nativeElement.querySelectorAll('li button')[1].click();
    fixture.detectChanges();

    expect(heroService.deleteHero).toHaveBeenCalledWith(jasmine.objectContaining({ id: 2 }));
    expect(sud.heroes).not.toContain(jasmine.objectContaining({ id: 2 }));
  });
});
