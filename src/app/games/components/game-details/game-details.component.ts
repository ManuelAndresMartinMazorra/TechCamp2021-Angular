import { Store } from './../../interfaces/store.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { Deal } from '../../interfaces/deal.interface';
import { Game } from '../../interfaces/game.interface';
import { GameService } from '../../services/game.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {

  game: Game | undefined;
  stores: Store[] | undefined;
  deals: Deal[] | undefined;
  storeDeals: any[] = [];
  textSearch: string = '';

  constructor(private route: ActivatedRoute,
    private gameService: GameService,
    private cartService: CartService,
    private storeService: StoreService) { 

      this.storeService.getStores().subscribe((data: any) => {
        console.log(data);
        this.stores = data;
      });
    }

  

  ngOnInit() {

    const gameIdFromRoute = Number(this.route.snapshot.paramMap.get('gameId'));

    this.gameService.getGameById(gameIdFromRoute).subscribe((data: any) => {
      console.log(data);
      this.game = data.game;
      this.deals = data.deals;

      this.deals?.forEach(element => {
        this.storeDeals.push({
          name: this.stores?.find(f => f.storeID === element.storeID)?.storeName,
          price: element.price,
          banner: this.stores?.find(f => f.storeID === element.storeID)?.images.banner,
          isActive: this.stores?.find(f => f.storeID === element.storeID)?.isActive,
        });
      });
    });
  }

  addToCart(game: Game) {
    this.cartService.addToCart({ title: game.external, price: game.cheapest});
    window.alert(`El producto ${game.external} ha sido añadido a la cesta!`);
  }
}
