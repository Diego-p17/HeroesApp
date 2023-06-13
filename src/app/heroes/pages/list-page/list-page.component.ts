import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {
  public heroes:Hero[] = [];

  constructor( private heroesService: HeroesService){}
  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes():void{
    this.heroesService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
}
