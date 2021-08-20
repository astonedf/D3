# League of Legends Champions Statistics

## Description
This web app helps visualise and compare [LoL](https://euw.leagueoflegends.com/en-gb/) champions' base stats 

## Database


[Data](https://www.kaggle.com/gyejr95/league-of-legendslol-champion-and-item-2020?select=riot_champion.csv)

## Data

Every champion in League of Legends has base stats that change as they level up:

-`Attack Damage`
-`Health`
-`Mana`
-`Armor`
-`Magic Resistance` (often shortened to MR or here Magic Resist)
-`Health Regeneration` (HP Regen)
-`Mana Regeneration`

There are many other base stats as well (movement speed for example) but they do not increase with levels and therefore I decided not to compare them. The raw data (csv) only give the base stat (100 health points for example) and the stat per level (10 health points per level) so the value for each level was calculated with a loop.

## Interface

**Champion selection** : You can choose two champions you want compare and search them by name.

**Percentage barplot** : You can quickly see which champion has higher base stat values. Simply calculated like this: `champion 1 stat % = champion 1 stat / champion 1 stat + champion 2 stat` and vice versa

**Line graph** : Shows the selected base stat value at every level. Sometimes a champion might have a higher base stat at level 1 than another champion but a lower stat per level and the line graph helps to see if a champion will catch up or even end up having a higher base stat at some point