import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Page, RouterLinkDirectiveStub } from '../shared/testing-helpers';
import { HeroesComponent } from './heroes.component';

import SpyObj = jasmine.SpyObj;

class HeroesPage extends Page<HeroesComponent> {
  get heroLinks(): HTMLAnchorElement[] {
    return super.queryAll('a');
  }

  get heroNameInput(): HTMLInputElement {
    return super.query('input');
  }

  get addHeroButton(): HTMLButtonElement {
    return super.query('div button');
  }

  get deleteHeroButtons(): HTMLButtonElement[] {
    return super.queryAll('li button');
  }

  get routeLinks(): DebugElement[] {
    return super.queryAllDeByDirective(RouterLinkDirectiveStub);
  }
}

describe('HeroesComponent 2', () => {
  let sud: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: SpyObj<HeroService>;
  let heroes: Hero[];
  let page: HeroesPage;

  beforeEach(async(() => {
    heroes = [{ id: 1, name: 'Batman' }, { id: 2, name: 'Superman' }] as Hero[];
    heroService = jasmine.createSpyObj<HeroService>(['getHeroes', 'addHero', 'deleteHero']);
    heroService.getHeroes.and.returnValue(of(heroes));

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, RouterLinkDirectiveStub],
      providers: [{ provide: HeroService, useValue: heroService }],
      // imports: [RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    sud = fixture.componentInstance;
    page = new HeroesPage(fixture);

    fixture.detectChanges();
  });

  it('should fetch heroes on init', () => {
    expect(heroService.getHeroes).toHaveBeenCalled();
    expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
    expect(sud.heroes).toEqual(heroes);
  });

  it('should render list of heroes', () => {
    const heroNames = Array.from(page.heroLinks).map(a => a.innerText);

    expect(heroNames).toEqual(['1 Batman', '2 Superman']);
  });

  it('should render links to hero details', () => {
    const routeLinks = page.routeLinks.map(de => de.injector.get(RouterLinkDirectiveStub));

    expect(routeLinks[0].linkParams).toBe('/detail/1');
    expect(routeLinks[1].linkParams).toBe('/detail/2');
  });

  it('should add new hero to the hero list', () => {
    heroService.addHero.and.callFake(hero => of(hero));

    page.heroNameInput.value = 'stepan zelenin';
    page.addHeroButton.click();
    fixture.detectChanges();

    expect(heroService.addHero).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'stepan zelenin' }));
    expect(sud.heroes).toContain(jasmine.objectContaining({ name: 'stepan zelenin' }));
  });

  it('should render new hero', () => {
    heroService.addHero.and.callFake(() => of({ id: 3, name: 'stepan zelenin' }));

    page.heroNameInput.value = 'stepan zelenin';
    page.addHeroButton.click();
    fixture.detectChanges();

    const names = Array.from(page.heroLinks).map(a => a.innerText);
    expect(names).toContain('3 stepan zelenin');
    expect(page.heroNameInput.value).toBe('');
  });

  it('should delete a hero', () => {
    heroService.deleteHero.and.callFake(of);

    page.deleteHeroButtons[1].click();
    fixture.detectChanges();

    expect(heroService.deleteHero).toHaveBeenCalledWith(jasmine.objectContaining({ id: 2 }));
    expect(sud.heroes).not.toContain(jasmine.objectContaining({ id: 2 }));
  });
});
