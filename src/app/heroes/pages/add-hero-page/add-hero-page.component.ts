import { Component, OnInit }      from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService }   from '../../services/heroes.service';

import { filter, pipe, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog }   from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';




@Component({
  selector: 'app-add-hero-page',
  templateUrl: './add-hero-page.component.html',
  styles: [
  ]
})
export class AddHeroPageComponent  implements OnInit {

  public creators = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  public heroForm = new FormGroup(
    {
      id:               new FormControl<string>(''),
      superhero:        new FormControl<string>('', { nonNullable: true }),
      publisher:        new FormControl<Publisher>( Publisher.DCComics),
      alter_ego:        new FormControl<string>(''),
      first_appearance: new FormControl<string>(''),
      characters:       new FormControl<string>(''),
      alt_image:        new FormControl<string>(''),
    }
  );

  constructor(
    private heroesService: HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackBar:  MatSnackBar,
    private dialog:MatDialog
  ){}

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe( switchMap( ({ id }) => this.heroesService.getHeroById(id) ) )
      .subscribe( (hero) => {
        if(!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset( hero );
        return;
      });
  }

  get currentHero():Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onsubmit():void{
    if( this.heroForm.invalid) return;
    if(this.currentHero.id){ this.updateHero(this.currentHero); return;}
    this.addHero( this.currentHero );
  }

  ondelete():void{
    if(!this.currentHero.id)throw Error('Hero Id is required');

    this.openDialog();

  }

  updateHero(hero:Hero):void{
    this.heroesService.updateHero( hero )
        .subscribe( hero => {
          // TODO: mostrar snackbar
          this.showSnackbar(`${hero.superhero} updated successfully !`);
        });
      return;
  }

  addHero(hero:Hero):void{
    this.heroesService.addHero( hero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} created successfully !`);
      });
      return;
  }

  showSnackbar( message: string ):void{
      this.snackBar.open( message, 'done', {duration: 2500 } );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( ( result:boolean ) => result),
        switchMap( () => this.heroesService.deleteHero(this.currentHero.id) ),
        filter( ( wasDeleted:boolean ) => wasDeleted )
      )
      .subscribe( result => {
        this.router.navigate(['/heroes']);
    });
  }




}
