import {Player} from '../gameObjs/Player';
import {Enemy} from '../gameObjs/Enemy';

export class Main extends Phaser.Scene {
    private key: any;

    private player: Player | any;

    private enemiesPoints = [30, 20, 20, 10, 10];
    private enemiesShootTiming = 0;
    private enemiesShootDelay: integer | any;
    private enemiesMarginGrid: number = 50;
    private enemiesReferGrid: Array<number[]> | any;
    private enemies: Phaser.GameObjects.Group | any;

    constructor() {
        super("main");
    }

    init() {
        this.key = this.input.keyboard.createCursorKeys();
        this.enemies = this.add.group({runChildUpdate: true});
    }

    create() {
        this.player = new Player(this, 'shipTest', this.key);

        this.enemiesReferGrid = [];
        this.enemiesShootDelay = 1666;
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 11; j++) {
                this.enemies.add(new Enemy(this,
                    (60 + (j * this.enemiesMarginGrid)),
                    (60 + (i * this.enemiesMarginGrid)),
                    '',
                    j + ";" + i,
                    this.enemiesPoints[i]
                ));

                row.push(1);
            }
            this.enemiesReferGrid.push(row);
        }

        console.log(this.enemiesReferGrid)
    }

    update(time: integer) {
        this.player.move(time);

        Enemy.updatePosition(time);

        if (this.enemiesShootTiming < time) {
            let enemies = this.getEnemiesShooting();
            let randomIndex = Math.floor(Math.random() * enemies.length);
            let randomEnemy = enemies[randomIndex];

            randomEnemy.shoot();

            this.enemiesShootTiming = time + this.enemiesShootDelay;
        }
    }

    checkCollisionShotPlayer(playerShot: any) {
        let grid = this.enemiesReferGrid;

        this.enemies.getChildren().forEach((enemy: Enemy) => {
            if (enemy.active) {
                this.physics.add.overlap(playerShot, enemy, function () {
                    grid[Number(enemy.getCoordinates()[1])][Number(enemy.getCoordinates()[0])] = 0;

                    enemy.die();
                    playerShot.destroy();
                });
            }
        });

        this.enemiesReferGrid = grid;

        console.log(this.getEnemiesAreaRange())
    }

    checkCollisionShotEnemy(enemyShot: any){
        let player  = this.player;

        this.physics.add.overlap(enemyShot, player, function () {
            player.mainScene.events.emit('decraseHealth');
            enemyShot.destroy();
        });
    }

    getEnemiesAreaRange() {
        let minXEnemy = 10;
        let maxXEnemy = 0;
        let maxYEnemy = 0;

        let firstEnemy;
        let lastEnemy;
        let bottonEnemy;

        for (let i = 0; i < this.enemiesReferGrid.length; i++) {
            for (let j = this.enemiesReferGrid[i].length - 1; j >= 0; j--) {
                if (this.enemiesReferGrid[i][j] && j > maxXEnemy) {
                    maxXEnemy = j;
                    lastEnemy = this.enemies.getChildren()[((i * 11) + j)];
                }

                if (this.enemiesReferGrid[i][(10 - j)] && (10 - j) < minXEnemy) {
                    minXEnemy = (10 - j);
                    firstEnemy = this.enemies.getChildren()[((i * 11) + (10 - j))];
                }

                if (this.enemiesReferGrid[4 - i][(10 - j)] && (4 - i) > maxYEnemy) {
                    maxYEnemy = (4 - i);
                    bottonEnemy = this.enemies.getChildren()[(((4 - i) * 11) + j)];
                }
            }
        }

        return this.correctEnemiesRefer([firstEnemy, lastEnemy, bottonEnemy]);
    }

    correctEnemiesRefer(refers: any) {
        let correction = [];

        if (refers[0] == undefined)
            correction[0] = correction[1] = refers[1];
        else if (refers[1] == undefined)
            correction[0] = correction[1] = refers[0];
        else
            correction = refers

        if (refers[2] == undefined) correction[2] = correction[0];

        return correction;
    }

    getEnemiesShooting() {
        var bottonEnemies = [];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                if (this.enemiesReferGrid[i][j])
                    bottonEnemies[j] = this.enemies.getChildren()[((i * 11) + j)]
            }
        }

        return bottonEnemies
    }

    decraseEnemiesShootDelay() {
        this.enemiesShootDelay -= (this.enemiesShootDelay - 50 < 1500) ? 50 : 0;
    }

    restart(){
        this.scene.restart();
    }
}