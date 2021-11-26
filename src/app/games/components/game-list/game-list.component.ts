import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';

import { Game } from '../../interfaces/game.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit{
  
  games: Game[] = [];
  titleSearch: string = '';
  added: string = '';

  constructor(private route: ActivatedRoute,
    private gameService: GameService,
    private cartService: CartService,
    private formBuilder: FormBuilder) { }
  
  checkoutForm = this.formBuilder.group({
    title: ''
  });

  ngOnInit(): void {
    this.checkoutForm.value.title = '';

    if (this.route.snapshot.queryParams['text']) {
      this.route.queryParams.subscribe(params => 
      {
        console.log(params);
        this.checkoutForm.value.title = params['text'];
      });
    }

    if(this.checkoutForm.value.title !== '')
    {
      this.searchGames();
    }

    
  }

  searchGames() {
    this.titleSearch = this.checkoutForm.value.title;
    this.gameService.getGames(this.titleSearch).subscribe((data: Game[]) => {
      console.log(data);
      this.games = data;
    });
  }

  onNotify() {
    window.alert('Recibiras un e-mail cuando haya un juego en stock.');
  }

  addToCart(game: Game) {
    this.cartService.addToCart({ title: game.external, price: game.cheapest});
    this.added = "In Cart";
    window.alert(`El producto ${game.external} ha sido añadido a la cesta!`);
  }
}