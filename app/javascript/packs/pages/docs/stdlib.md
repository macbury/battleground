## General Control

### move
Orders robot to move by given distance in meters forwards. This instruction terminates when robot finishes movement or collides with any obstalce. To move backward pass negative distance.

```
move(1000);
```

### turn
Orders robot to turn by given angle in degrees. Values in range from 0 to 180 mean rotate left, values in range from -180 to 0 mean rotate right. This instruction terminates when robot finishes rotation.

```
turn(90);
```

### message
Displays a message to the player.

```
message("Hello world!");
```