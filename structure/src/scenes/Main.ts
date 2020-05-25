import {Player} from '../gameObjs/Player';
import {Enemy} from '../gameObjs/Enemy';
import {Shot} from "../gameObjs/Shot";

export class Main extends Phaser.Scene {
    private key: any;

    private player: Player | any;

    private canGoDown: boolean = true;

    private enemiesMarginGrid: number = 50;
    private enemiesReferGrid: Array<number[]> = [];

    private enemies: Phaser.GameObjects.Group | any;
    private enemiesDirection = 1;

    constructor() {
        super("main");
    }

    init(){
        this.key = this.input.keyboard.createCursorKeys();

    }

    create() {
        this.player = new Player(this, 'shipTest', this.key);

        this.enemies = this.add.group({runChildUpdate: true});
        for(let i = 0; i < 5; i++){
            const row = [];
            for(let j = 0; j < 11; j++){
                this.enemies.add(new Enemy(this,
                    (60 + (j * this.enemiesMarginGrid)),
                    (60 + (i * this.enemiesMarginGrid)),
                    '',
                    j + ";" + i
                ));

                row.push(1);
            }
            this.enemiesReferGrid.push(row);
        }

        // @ts-ignore
        this.enemies.getChildren().forEach(enemy => console.log(enemy.id));
    }

    update(time: integer) {
        this.player.move();

        // @ts-ignore
        this.enemies.getChildren().forEach(enemy => enemy.getCoordinates());

        // @ts-ignore
        //this.enemies.getChildren().forEach(enemy => console.log(enemy));

        /*this.enemies.getChildren().forEach((enemy: Enemy) => {
            enemy.updatePosition(time, this.enemiesDirection)
        });*/

        /*this.enemies.getChildren().forEach(enemy => {
            if(this.canGoDown && enemy.x >= this.sys.canvas.width - enemy.width * 4){
                this.goDownEnemy(0);
                this.canGoDown = false;
            }
            if(!this.canGoDown && enemy.x <= enemy.width * 4){
                this.goDownEnemy(50);
                this.canGoDown = true;
            }
        });*/

    }

    checkCollision(shot: any){
        let grid = this.enemiesReferGrid;

        this.enemies.getChildren().forEach((enemy: Enemy) => {
            this.physics.add.collider(shot, enemy, function () {
                grid[Number(enemy.getCoordinates()[1])][Number(enemy.getCoordinates()[0])] = 0;

                enemy.destroy();
                shot.destroy();
            })
        });

        this.getEnemiesAreaRange();

        this.enemiesReferGrid = grid;
    }

    getEnemiesAreaRange(){
        var minXEnemy = 10;
        var maxXEnemy = 0;

        for(let i = 0; i < this.enemiesReferGrid.length; i++){
            for(let j = this.enemiesReferGrid[i].length - 1; j >= 0; j--){
                maxXEnemy = (this.enemiesReferGrid[i][j] && j > maxXEnemy) ? j : maxXEnemy;
                minXEnemy = (this.enemiesReferGrid[i][(10 - j)] && (10 - j) < minXEnemy) ? (10 - j) : minXEnemy;
            }
        }

        return [minXEnemy, maxXEnemy];
    }

    setEnemiesDirection(direction: integer){
        this.enemiesDirection = direction;
    }

    goDownEnemy(c: number){
        // @ts-ignore
        this.enemies.getChildren().forEach(enemy => enemy.y = c);
    }
}